  import React, {Component, PropTypes} from 'react';
  import {hierarchy, stratify, treemapDice, roundNode} from 'd3-hierarchy';
  import {scaleOrdinal, schemeCategory20b, schemeCategory20c, scaleLinear} from 'd3-scale';

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
      const colorScale = this.props.color;
      const d = this.props.d
      const xScale = this.props.xScale;
      const yScale = this.props.yScale;

      const y0Scaled = yScale(d.y0);
      const y1Scaled = yScale(d.y1);
      const x0Scaled = xScale(d.x0);
      const x1Scaled = xScale(d.x1);

      const x = x0Scaled;
      const y = y0Scaled;
      const w = Math.abs(x1Scaled - x0Scaled);
      const h = Math.abs(y1Scaled - y0Scaled);

      const translation = `translate(${ x }, ${ y })`;

      const color = colorScale(d.id)

      return (
        <g className="node" transform={translation}>
          <rect id={`rect-${d.id}`}
                width={w} height={h} fill={color}
                onClick={this.onClick}/>

          <clipPath id={"clip-" + d.id}>
            <use xlinkHref={`#rect-${d.id}`}/>
          </clipPath>

          <text clipPath={`url(#clip-${d.id})`} x="2">
            <tspan y="4">{d.data.NAME || d.id.substring(d.id.lastIndexOf(".") + 1)}
            </tspan>
          </text>

          <text clipPath={`url(#clip-${d.id})`} x="2">
            <tspan y="8">{Math.round(d.value)}</tspan>
          </text>

        </g>
      );
    }
  });

  var D3Partition = React.createClass({
    render() {
      const tree = this.props.tree
      const transform = this.props.transform;

      var color = scaleOrdinal(this.props.colors);

      var xScale, yScale;

      if (this.props.direction == "neg") {
        xScale = scaleLinear().domain([0, 100]).range([0, 100]);
        yScale = scaleLinear().domain([0, 100]).range([0, 100]);
      } else if (this.props.direction == "pos") {
        xScale = scaleLinear().domain([0, 100]).range([0, 100]);
        yScale = scaleLinear().domain([0, 100]).range([0, 100])
      }

      partition().size([100, 100])(tree, this.props.totalThroughput);

      return (
        <g className="node" transform={transform}>
          {tree.descendants().map((d) => <D3Partitionlet d={d}
                                                         color={color}
                                                         onClick={this.props.onClick}
                                                         xScale={xScale} yScale={yScale}/> )}
        </g>
      );
    }
  });

  export default D3Partition;
