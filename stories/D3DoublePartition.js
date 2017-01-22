import React, { Component, PropTypes } from 'react';
import {hierarchy, partition, stratify} from 'd3-hierarchy';
import {scaleOrdinal, schemeCategory10} from 'd3-scale';

// import materializedPathTagsToTree from './materializedPathTagsToTree'
// import treeWithTransactions from './treeWithTransactions'

var D3Partition = React.createClass({
  render() {
    const width = 550;
    const height = 300;

    var color = scaleOrdinal(schemeCategory10);

    console.log("tags: " + this.props.tags)

    var partioner = partition()
    .size([width, height])
    .padding(1)
    .round(true);

    var stratifier = stratify()
    .parentId(function(d) {
      var toReturn = "";

      if (d.id.lastIndexOf(".") == -1){
        toReturn = "";
      } else {
        toReturn = d.id.substring(0, d.id.lastIndexOf("."));
      }
      return toReturn;
    });

    var root = stratifier(this.props.tags)
      .sum(function(d) { return d.value; })
      .sort(function(a, b) { return b.height - a.height || b.value - a.value; });

    partioner(root);

    return (<svg width={width} height={height}> {
      root.descendants().map((d, ndx) => {
        console.log(d);

        var translation = "";

        const w = d.y1 - d.y0;
        const h = d.x1 - d.x0;

        if (this.props.direction == "neg"){
          translation = "translate("+ (d.y0) + "," + (d.x0) + ")";
        } else if (this.props.direction == "pos"){
          // translation = "translate("+ (d.y0) + "," + (d.x0) + ")";
          // translation = "translate("+ (100-(d.y1 - d.y0)) + "," + (d.x0) + ")";
          translation = "translate("+ ((width - d.y0) - (w)) + "," + (d.x0) + ")";
        }

        console.log(this.props.direction);

        return (<g classname="node" transform={translation} >
          <rect width={w}
                height={h}
                fill={color(d.id)} />

          <clipPath id={"clip-" + d.id} >
            <use xlinkHref={"#rect-" + d.id + ""}/>
          </clipPath>

          <text x="4">
            <tspan y="13">{d.id.substring(d.id.lastIndexOf(".") + 1)}</tspan>
          </text>

        </g>);
      })
    }</svg>);

  }
});

var D3DoublePartition = React.createClass({
  render() {
   const positiveTags = this.props.tags.filter((t) => t.direction == "in" );
   const positiveTrans = this.props.transactions.filter((t) => Number(t.TRNAMT) > 0 );

   const negativeTags = this.props.tags.filter((t) => t.direction == "out" );
   const negativeTrans = this.props.transactions.filter((t) => Number(t.TRNAMT) < 0 );


   return (
    <table>
     <tr>
        <td>
          <h3> incomes </h3>
          <D3Partition direction="pos" tags={positiveTags} transactions={positiveTrans}/>
          <D3Partition direction="neg" tags={negativeTags} transactions={negativeTrans}/>
        </td>

     </tr>
    </table>)
 }
});

export default D3DoublePartition;
