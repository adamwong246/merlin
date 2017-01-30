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

var D3Partitionlet = React.createClass({
  onClick () {
      this.props.onClick(this.props.d)
  },

  render() {
    const width = this.props.width;
    const height = this.props.height;

    var translation = "";

    const d = this.props.d

    const w = d.y1 - d.y0;
    const h = d.x1 - d.x0;

    const color = this.props.color;

    const direction = this.props.direction;

    if (direction == "neg") {
      translation = "translate(" + (d.y0) + "," + (d.x0) + ")";
    } else if (direction == "pos") {
      translation = "translate(" + (width - d.y0 - w) + "," + (d.x0) + ")";
    }
    return (
      <g className="node" transform={translation}>
        <rect id={`rect-${d.id}`}
              width={w} height={h - 1} y={1} fill={color(d.id)}
              onClick={this.onClick}/>

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
  }
});

var D3Partition = React.createClass({
  render() {
    var color = scaleOrdinal(this.props.colors);
    const x = 0;
    const width = 100;
    const height = 100;

    const tree = this.props.tree

    partition().size([height, width])(tree, this.props.totalThroughput);

    return (
      <g className="node" transform={`translate(${x}, 0)`}>
        {tree.descendants().map((d) => <D3Partitionlet d={d} direction={this.props.direction}
                                                       color={color} width={width} height={height}
                                                       onClick={this.props.onClick}/> )}
      </g>
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

const makePositiveOrNegativeTransactedTags = (transactions, tags, inOrOut) => {
  const filteredTransactions = transactions.filter((transaction) => {
    return (Number(transaction.TRNAMT) > 0 && inOrOut == "in") || (Number(transaction.TRNAMT) < 0 && inOrOut == "out")
  });
  const filteredTags = tags.filter((tag) => tag.direction == inOrOut);
  var transactedTags = makeTransactedTags(filteredTransactions, filteredTags);
  transactedTags.push({
    "direction": inOrOut,
    "id": `${inOrOut}come.uncategorized`,
    "transactions": filteredTransactions.filter((transaction) => {
      return tags.filter((tag) => {
        if (tag.pattern && tag.direction == inOrOut) {
          return RegExp(tag.pattern).test(transaction.NAME);
        }
        return false
      }).length == 0
    })
  });
  return transactedTags;
};

const makePositiveTransactedTags = (transactions, tags) => makePositiveOrNegativeTransactedTags(transactions, tags, "in")

const makeNegativeTransactedTags = (transactions, tags) => makePositiveOrNegativeTransactedTags(transactions, tags, "out")

const makeTaggedTransactionsOfPositiveAndNegativeTransactedTags = (positiveTT, negativeTT) => {
  return positiveTT.concat(negativeTT)
  .map( (tag) => {
    return tag.transactions.map((transaction) => {
      return {...transaction, tags: [tag]}
    })
  })
  .filter(Boolean)
  .reduce((memo, e) => memo.concat(e), [])
}

var D3DoublePartition = React.createClass({
  getInitialState() {
    return { focus: null};
  },

  setFocus(data){
    this.setState({focus: data.id})
  },

  render() {
    const tags = this.props.tags;
    const transactions = this.props.transactions;

    const positiveTransactedTags = makePositiveTransactedTags(transactions, tags);
    const negativeTransactedTags = makeNegativeTransactedTags(transactions, tags)

    const posRoot = makeTreeOfTransactedTags(positiveTransactedTags);
    const negRoot = makeTreeOfTransactedTags(negativeTransactedTags);

    const taggedTransactions = makeTaggedTransactionsOfPositiveAndNegativeTransactedTags(positiveTransactedTags, negativeTransactedTags)

    const ttlthrpt = Math.max(posRoot.value, negRoot.value)

    return (
      <div className="container">

        <div className="column-center" style={{
            height: '450px',
            overflowY: 'scroll'
          }}>
          <span>{JSON.stringify(this.state)}</span>
          <table >
            <tbody>
              {taggedTransactions.map((t, ndx) => {
                return (
                  <tr key={`tgdtrnsctn-${ndx}`}>
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
            <D3Partition direction="pos" tree={posRoot} totalThroughput={ttlthrpt}
                         colors={schemeCategory20c}
                         onClick={this.setFocus} />
          </svg>

        </div>

        <div className="column-right">
          <svg viewBox={`0 0 100 100`} preserveAspectRatio="xMinYMin meet">
            <D3Partition direction="neg" tree={negRoot} totalThroughput={ttlthrpt}
                         colors={schemeCategory20b}
                         onClick={this.setFocus} />
          </svg>
        </div>
      </div>
    );
  }
});

export default D3DoublePartition;
