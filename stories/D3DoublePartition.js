import React, {Component, PropTypes} from 'react';
import {hierarchy, stratify, treemapDice, roundNode} from 'd3-hierarchy';
import {scaleOrdinal, schemeCategory20b, schemeCategory20c} from 'd3-scale';

const partition = function() {
  var dx = 1,
  dy = 1,
  padding = 0,
  round = false;

  function partition(root, ttlthrpt) {
    var n = root.height + 1;
    root.x0 = root.y0 = padding;

    if (root.depth == 0) {
      root.x1 = (root.value / ttlthrpt) * 100;
    } else {
      root.x1 = dx;
    }

    root.y1 = dy / n;
    root.eachBefore(positionNode(dy, n));
    if (round)
    root.eachBefore(roundNode);
    return root;
  }

  function positionNode(dy, n) {
    return function(node) {
      if (node.children) {
        treemapDice(node, node.x0, dy * (node.depth + 1) / n, node.x1, dy * (node.depth + 2) / n);
      }
      var x0 = node.x0,
      y0 = node.y0,
      x1 = node.x1 - padding,
      y1 = node.y1 - padding;
      if (x1 < x0)
      x0 = x1 = (x0 + x1) / 2;
      if (y1 < y0)
      y0 = y1 = (y0 + y1) / 2;
      node.x0 = x0;
      node.y0 = y0;
      node.x1 = x1;
      node.y1 = y1;
    };
  }

  partition.round = function(x) {
    return arguments.length
    ? (round = !!x, partition)
    : round;
  };

  partition.size = function(x) {
    return arguments.length
    ? (dx = +x[0], dy = +x[1], partition)
    : [dx, dy];
  };

  partition.padding = function(x) {
    return arguments.length
    ? (padding = +x, partition)
    : padding;
  };

  return partition;
}

var D3Partition = React.createClass({
  render() {
    var color = scaleOrdinal(this.props.colors);

    const x = 0; //this.props.x;
    const width = 100; //this.props.width;
    const height = 100; //this.props.height;

    const theTree = this.props.tree

    partition().size([height, width])(this.props.tree, this.props.totalThroughput);

    return (
      <g className="node" transform={`translate(${x}, 0)`}>
        {theTree.descendants().map((d, ndx) => {
          var translation = "";

          const w = d.y1 - d.y0;
          const h = d.x1 - d.x0;

          if (this.props.direction == "neg") {
            translation = "translate(" + (d.y0) + "," + (d.x0) + ")";
          } else if (this.props.direction == "pos") {
            translation = "translate(" + (width - d.y0 - w) + "," + (d.x0) + ")";
          }
          return (
            <g className="node" transform={translation}>
              <rect id={`rect-${d.id}`} width={w} height={h - 1} y={1} fill={color(d.id)}/>

              <clipPath id={"clip-" + d.id}>
                <use xlinkHref={`#rect-${d.id}`}/>
              </clipPath>

              <text clipPath={`url(#clip-${d.id})`} x="2">
                <tspan y="4">{d.data.NAME || d.id.substring(d.id.lastIndexOf(".") + 1)}
                </tspan>
              </text>

              <text clipPath={`url(#clip-${d.id})`} x="2">
                <tspan y="8">{d.value}</tspan>
              </text>

            </g>
          );
        })
      }</g>
    );
  }
});

// flatten the transactions into the tree proper
const makeFlattenedSelectionOfTransactedTags = (tags) => {

  var toReturn = [];
  toReturn = tags.map((t) => {
    const tid = t.id;
    if (t.transactions.length) {
      return t.transactions.map((tt) => {
        return {
          ...tt,
          id: `${tid}.${tt.FITID}`,
          value: Math.abs(Number(tt.TRNAMT))
        }
      });
    }
    return false
  }).filter(Boolean)
  .reduce((memo, e) => memo.concat(e), [])
  .concat(tags);

  return toReturn;
};

// makes a tree suitable for d3-hierarchy
const makeTreeOfTransactedTags = (tags, direction) => {
  const flattenedSelectionOfTransactedTags = makeFlattenedSelectionOfTransactedTags(tags);

  return stratify()
  .parentId((d) => d.id.substring(0, d.id.lastIndexOf(".")) )

  // pass the stratify function the selected tags
  (flattenedSelectionOfTransactedTags)

  // D3 needs you to call sum and sort before layout rendering
  .sum((d) => d.value).sort((a, b) => b.height - a.height || b.value - a.value);
}

const makeTransactedTags = (transactions, tags) => {
  return tags.map((t) => {
    return {
      ...t,
      transactions: transactions.filter((tt) => {
        if (t.pattern) {
          return RegExp(t.pattern).test(tt.NAME);
        }
        return false
      })
    };
  });
}

var D3DoublePartition = React.createClass({
  render() {
    const tags = this.props.tags;
    const transactions = this.props.transactions;

    // Make trees
    // first, make the positive tree for incomes
    const positiveTransactions = transactions.filter((transaction) => Number(transaction.TRNAMT) > 0);
    const positiveTags = tags.filter((tag) => tag.direction == "in");
    var positiveTransactedTags = makeTransactedTags(positiveTransactions, positiveTags);
    positiveTransactedTags.push({
      "direction": "in",
      "id": "income.uncategorized",
      "transactions": positiveTransactions.filter((transaction) => {
        return tags.filter((tag) => {
          if (tag.pattern && tag.direction == "in") {
            return RegExp(tag.pattern).test(transaction.NAME);
          }
          return false
        }).length == 0
      })
    });
    const posRoot = makeTreeOfTransactedTags(positiveTransactedTags);

    // second, make the negative tree for outcomes
    const negativeTransactions = transactions.filter((transaction) => Number(transaction.TRNAMT) < 0);
    const negativeTags = tags.filter((tag) => tag.direction == "out");
    var negativeTransactedTags = makeTransactedTags(negativeTransactions, negativeTags);
    negativeTransactedTags.push({
      "direction": "out",
      "id": "outcome.uncategorized",
      "transactions": negativeTransactions.filter((transaction) => {
        return tags.filter((tag) => {
          if (tag.pattern && tag.direction == "out") {
            return RegExp(tag.pattern).test(transaction.NAME);
          }
          return false
        }).length == 0
      })
    });
    const negRoot = makeTreeOfTransactedTags(negativeTransactedTags);

    // Making the tagged transactions is easier
    const taggedTransactions = positiveTransactedTags.concat(negativeTransactedTags)
    .map( (tag) => {
      return tag.transactions.map((transaction) => {
        return {...transaction, tags: [tag]}
      })
    })
    .filter(Boolean)
    .reduce((memo, e) => memo.concat(e), [])

    const ttlthrpt = Math.max(posRoot.value, negRoot.value)

    return (
      <div className="container">
        <div className="column-center" style={{
            height: '450px',
            overflowY: 'scroll'
          }}>
          <table >
            <tbody>
              {taggedTransactions.map((t) => {
                return (
                  <tr>
                    <td>{t.FITID}</td>
                    <td>{t.TRNAMT}</td>
                    <td>{t.NAME}</td>
                    <td>{t.tags.map((t) => t.id)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="column-left">
          <svg viewBox={`0 0 100 100`} preserveAspectRatio="xMinYMin meet">
            <D3Partition direction="pos" tree={posRoot} totalThroughput={ttlthrpt} colors={schemeCategory20c}/>
          </svg>

        </div>

        <div className="column-right">
          <svg viewBox={`0 0 100 100`} preserveAspectRatio="xMinYMin meet">
            <D3Partition direction="neg" tree={negRoot} totalThroughput={ttlthrpt} colors={schemeCategory20b}/>
          </svg>
        </div>
      </div>
    );
  }
});

export default D3DoublePartition;
