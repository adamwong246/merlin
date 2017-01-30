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
    const colorScale = this.props.color;
    const d = this.props.d
    const direction = this.props.direction;

    const w = d.y1 - d.y0;
    const h = d.x1 - d.x0;

    var color = colorScale(d.id)

    var translation = "";

    if (this.props.d.data.collapsed){
     color = 'black'
    }

    if (direction == "neg") {
      translation = "translate(" + (d.y0) + "," + (d.x0) + ")";
    } else if (direction == "pos") {
      translation = "translate(" + (width - d.y0 - w) + "," + (d.x0) + ")";
    }
    return (
      <g className="node" transform={translation}>
        <rect id={`rect-${d.id}`}
              width={w} height={h} y={1} fill={color}
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
    const tree = this.props.tree

    var color = scaleOrdinal(this.props.colors);
    const x = 0;
    const width = 100;
    const height = 100;

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

export default D3Partition;
