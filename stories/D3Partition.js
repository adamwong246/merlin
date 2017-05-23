import React, {Component, PropTypes} from 'react';
import {scaleOrdinal, schemeCategory20b, schemeCategory20c, scaleLinear} from 'd3-scale';

import partitionWithCeiling from './partitionWithCeiling.js';

const D3Partition = React.createClass({
  render() {
    const tree = this.props.tree
    const transform = this.props.transform;
    const focused = this.props.state;

    var color = scaleOrdinal(this.props.colors);

    partitionWithCeiling().size([100, 100])(tree, this.props.totalThroughput);

    return (
      <g className="node">
        {tree.descendants().map((d) => <D3Partitionlet
          d={d}
          color={color}
          onClick={this.props.onClick}
          xScale={this.props.xScale} yScale={this.props.yScale}/> )}</g>
    );
  }
});

const D3Partitionlet = React.createClass({
  onClick () {
      this.props.onClick(this.props.d)
  },

  render() {
    const colorScale = this.props.color;
    const d = this.props.d
    const xScale = this.props.xScale;
    const yScale = this.props.yScale;

    const range = yScale.range()

    const y0Scaled = yScale(d.y0);
    const y1Scaled = yScale(d.y1);
    const x0Scaled = xScale(d.x0);
    const x1Scaled = xScale(d.x1);

    const w = x1Scaled - x0Scaled;
    const h = Math.abs(y1Scaled - y0Scaled);
    const x = x0Scaled;

    var y;
    if (range[0] < range[1]){
      y = y0Scaled;
    } else {
      y = y0Scaled - h;
    }

    var fillColor, textColor;
    if (range[0] < range[1]){
      fillColor = shadeColor(colorScale(d.id), -30);
      textColor = shadeColor(colorScale(d.id), 30);
    } else {
      fillColor = shadeColor(colorScale(d.id), 30);
      textColor = shadeColor(colorScale(d.id), -30);
    }

    const translation = `translate(${ x }, ${ y })`;

    return (
      <g className="node" transform={translation}>
        <rect id={`rect-${d.id}`}
              width={w} height={h} fill={fillColor}
              onClick={this.onClick}
              strokeWidth="1"
              stroke={textColor}/>
              <text clipPath={`url(#clip-${d.id})`} x="2" fill={textColor}>
                <tspan y="16">{d.data.NAME || d.id.substring(d.id.lastIndexOf(".") + 1)}
                </tspan>
              </text>
              <text clipPath={`url(#clip-${d.id})`} x="2" fill={textColor} >
                <tspan y="36">{`${Math.round(d.value)}`}</tspan>
              </text>
        <clipPath id={"clip-" + d.id}>
          <use xlinkHref={`#rect-${d.id}`}/>
        </clipPath>
      </g>
    );
  }
});

const shadeColor = (color, percent) => {
    var R = parseInt(color.substring(1,3),16);
    var G = parseInt(color.substring(3,5),16);
    var B = parseInt(color.substring(5,7),16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R<255)?R:255;
    G = (G<255)?G:255;
    B = (B<255)?B:255;

    var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
    var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
    var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

    return "#"+RR+GG+BB;
}

export default D3Partition;
