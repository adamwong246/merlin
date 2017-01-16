import React, { Component, PropTypes } from 'react'
import FoldUnifiedTags from './FoldUnifiedTags.js'

var FoldSplitTags = React.createClass({
  getInitialState() {
   return { hide: 0 };
  },

  render() {
   const positiveTags = this.props.tags.filter((t) => t.direction == "out" );
   const negativeTags = this.props.tags.filter((t) => t.direction == "in" );

   return (
    <div>
     <div style={{float: "left"}}>
      <FoldUnifiedTags key="pos" tags={positiveTags} transactions={this.props.transactions}/>
     </div>
     <div style={{float: "right"}}>
     <FoldUnifiedTags key="neg" tags={negativeTags} transactions={this.props.transactions}/>
     </div>
   </div>)
 }
});

export default FoldSplitTags;
