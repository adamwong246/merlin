import React, { Component, PropTypes } from 'react';
import {hierarchy, stratify, treemapDice, roundNode} from 'd3-hierarchy';
import {scaleOrdinal, schemeCategory20b, schemeCategory20c} from 'd3-scale';

const partition = function() {
  var dx = 1,
      dy = 1,
      padding = 0,
      round = false;

  function partition(root, ttlthrpt) {
    var n = root.height + 1;
    root.x0 =
    root.y0 = padding;

    if (root.depth == 0){
     root.x1 = (root.value / ttlthrpt) * 100;
    } else {
     root.x1 = dx;
    }

    root.y1 = dy / n;
    root.eachBefore(positionNode(dy, n));
    if (round) root.eachBefore(roundNode);
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
      if (x1 < x0) x0 = x1 = (x0 + x1) / 2;
      if (y1 < y0) y0 = y1 = (y0 + y1) / 2;
      node.x0 = x0;
      node.y0 = y0;
      node.x1 = x1;
      node.y1 = y1;
    };
  }

  partition.round = function(x) {
    return arguments.length ? (round = !!x, partition) : round;
  };

  partition.size = function(x) {
    return arguments.length ? (dx = +x[0], dy = +x[1], partition) : [dx, dy];
  };

  partition.padding = function(x) {
    return arguments.length ? (padding = +x, partition) : padding;
  };

  return partition;
}

var D3Partition = React.createClass({
  render() {
    var color = scaleOrdinal(this.props.colors);

    const x = 0;//this.props.x;
    const width = 100;//this.props.width;
    const height = 100;//this.props.height;

    const theTree = this.props.tree

    partition()
      .size([height, width])(this.props.tree, this.props.totalThroughput);

    return (<g className="node" transform={`translate(${x}, 0)`}> {
      theTree.descendants().map((d, ndx) => {
        var translation = "";

        const w = d.y1 - d.y0;
        const h = d.x1 - d.x0;

        if (this.props.direction == "neg"){
          translation = "translate("+ (d.y0 ) + "," + (d.x0) + ")";
        } else if (this.props.direction == "pos"){
          translation = "translate("+ (width - d.y0 - w) + "," + (d.x0) + ")";
        }

        return (<g className="node" transform={translation} >
          <rect id={`rect-${d.id}`}
                width={w}
                height={h-1}
                y={1}
                fill={color(d.id)} />

          <clipPath id={"clip-" + d.id} >
            <use xlinkHref={`#rect-${d.id}`}/>
          </clipPath>

          <text clipPath={`url(#clip-${d.id})`}
                 x="2">
            <tspan y="4" >{`${d.id.substring(d.id.lastIndexOf(".") + 1)}, ${d.value}`}</tspan>
          </text>

        </g>);
      })
    }</g>);

  }
});

// makes a tree suitable for d3-hierarchy
const maketree = (tags, direction) => {
  // filter the tags first.
  const selectionOfTags = tags.filter((t) => t.direction == direction);

  return stratify()
    // parentId returns the id of the node's parent
    .parentId((d) => d.id.substring(0, d.id.lastIndexOf(".")))
    // pass the stratify function the selected tags
    (selectionOfTags)

    // D3 needs you to call sum and sort before layout rendering
    .sum((d) => d.value)
    .sort((a, b) => b.height - a.height || b.value - a.value);
}

var D3DoublePartition = React.createClass({
  render() {
    const tags = this.props.tags;
    const transactions = this.props.transactions;

    const posRoot = maketree(tags, "in");
    const negRoot = maketree(tags, "out");

    const ttlthrpt = Math.max(posRoot.value, negRoot.value)

    const taggedTransactions = transactions.map((t) => {
     return {
      ...t,
      tags:tags.filter((tt)=>{
       if (tt.pattern){
        return RegExp(tt.pattern).test(t.NAME);
       }

       return false
       //
      })
     };
    });

   return (
    <div className="container">
      <div className="column-center" style={ {height:'450px', overflowY: 'scroll'} }>
       <table >
        <tbody>
         {
           taggedTransactions.map((t) => {
            return(<tr>
             <td>{t.DTPOSTED}</td>
              <td>{t.TRNAMT}</td>
              <td>{t.NAME}</td>
              <td>{JSON.stringify(t.tags)}</td>
            </tr>);
           })
         }
        </tbody>
       </table>
      </div>

      <div className="column-left">
       <svg viewBox={`0 0 100 100`} preserveAspectRatio="xMinYMin meet" >
         <D3Partition
           direction="pos" tree={posRoot} totalThroughput={ttlthrpt}
           colors={schemeCategory20b}/>
       </svg>
      </div>

      <div className="column-right">
       <svg viewBox={`0 0 100 100`} preserveAspectRatio="xMinYMin meet">
          <D3Partition
           direction="neg" tree={negRoot} totalThroughput={ttlthrpt}
           colors={schemeCategory20c}/>
       </svg>
      </div>
    </div>
    );
 }
});

export default D3DoublePartition;
