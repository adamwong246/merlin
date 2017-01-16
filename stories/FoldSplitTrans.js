import React, { Component, PropTypes } from 'react'
import FoldUnifiedTrans from './FoldUnifiedTrans.js'

var FoldSplitTags = React.createClass({
  render() {
   const positiveTags = this.props.tags.filter((t) => t.direction == "out" );
   const negativeTags = this.props.tags.filter((t) => t.direction == "in" );
   const positiveTrans = this.props.transactions.filter((t) => Number(t.TRNAMT) < 0 );
   const negativeTrans = this.props.transactions.filter((t) => Number(t.TRNAMT) > 0 );

   return (
    <div>
     <div style={{float: "left"}}>
      <FoldUnifiedTrans key="pos" tags={positiveTags} transactions={positiveTrans}/>
     </div>
     <div style={{float: "right"}}>
     <FoldUnifiedTrans key="neg" tags={negativeTags} transactions={negativeTrans}/>
     </div>
    </div>)
 }
});

export default FoldSplitTags;
