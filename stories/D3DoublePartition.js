import React, { Component, PropTypes } from 'react';
import {hierarchy, partition, stratify} from 'd3-hierarchy';
import {scaleOrdinal, schemeCategory10} from 'd3-scale';

var D3Partition = React.createClass({
  render() {
    var color = scaleOrdinal(schemeCategory10);

    const x = this.props.x;
    const width = this.props.width;
    const height = this.props.height;

    const theTree = this.props.tree
    theTree.value = this.props.totalThroughput

    partition()
      .size([width/2, height/2])(this.props.tree);

    const rootWidth = (theTree.y1 - theTree.y0)

    return (<g className="node" transform={`translate(${x}, 0)`}> {
      // skip over the ROOT need we made. We don't actually want to render it.
      theTree.children[0].descendants().map((d, ndx) => {
        var translation = "";

        const w = d.y1 - d.y0;
        const h = d.x1 - d.x0;

        if (this.props.direction == "neg"){
          translation = "translate("+ (d.y0 - rootWidth ) + "," + (d.x0) + ")";
        } else if (this.props.direction == "pos"){
          translation = "translate("+ (width - d.y0 - w + rootWidth) + "," + (d.x0) + ")";
        }

        debugger
        return (<g classname="node" transform={translation} >
          <rect id={`rect-${d.id}`}
                width={w}
                height={h}
                fill={color(d.id)} />

          <clipPath id={"clip-" + d.id} >
            <use xlinkHref={`#rect-${d.id}`}/>
          </clipPath>

          <text clipPath={`url(#clip-${d.id})`}
                 x="4">
            <tspan y="13">{`${d.id.substring(d.id.lastIndexOf(".") + 1)}, ${d.value}`}</tspan>
          </text>

        </g>);
      })
    }</g>);

  }
});

// makes a tree suitable for d3-hierarchy
const maketree = (tags, direction) => {
  return stratify()
    // parentId returns the id of the node's parent
    .parentId((d) => d.id.substring(0, d.id.lastIndexOf(".")))
    // filter the tags first.
    (tags.filter((t) => t.direction == direction)

      // prepare the addresses for a second operation: Adjusting all addresses to allow for a ROOT node
      // which we will use for layout purposes
      .map((t) => {
        const nt = t;
        if (t.id.lastIndexOf("ROOT") == -1) {
          nt.id = `ROOT.${t.id}`
        }
        return nt;
      // add aformentioned ROOT
      }).concat({
        id: "ROOT"
      }))
    // D3 needs you to call sum and sort before layout rendering
    .sum((d) => d.value)
    .sort((a, b) => b.height - a.height || b.value - a.value);
}

var D3DoublePartition = React.createClass({
  render() {
    const vWidth = 500;
    const vHeight = 500;
    const thirdWidth = vWidth/2;

    const posRoot = maketree(this.props.tags, "in");
    const negRoot = maketree(this.props.tags, "out");

    const ttlthrpt = Math.max(posRoot.value, negRoot.value)

   return (
     <div id="svg-container">
      <svg viewBox={`0 0 ${vWidth} ${vHeight}`} preserveAspectRatio="xMinYMin meet" className="svg-content">

        <D3Partition y="0" x="0" width={thirdWidth} height={vHeight} direction="pos" tree={posRoot} totalThroughput={ttlthrpt}/>
        <D3Partition y="0" x={thirdWidth} width={thirdWidth} height={vHeight} direction="neg" tree={negRoot} totalThroughput={ttlthrpt}/>

        <circle cx="1" cy="1" r="5" fill="red"/>
        <circle cx="250" cy="250" r="5" fill="red"/>
        <circle cx="500" cy="500" r="5" fill="red"/>
      </svg>
    </div>)
 }
});

export default D3DoublePartition;
