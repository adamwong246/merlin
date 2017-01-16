import React, { Component, PropTypes } from 'react'
import FlatUnifiedTrans from './FlatUnifiedTrans.js'

export default class FlatSplitTrans extends Component {

  render() {
   const negativeTrans = this.props.transactions.filter((t) => Number(t.TRNAMT) < 0 );
   const positiveTrans = this.props.transactions.filter((t) => Number(t.TRNAMT) > 0 );

   return (
    <div>
     <h4>FlatSplitTrans</h4>
     <div style={{float: "left"}}> <FlatUnifiedTrans tags={this.props.tags} transactions={negativeTrans}/> </div>
     <div style={{float: "right"}}> <FlatUnifiedTrans tags={this.props.tags} transactions={positiveTrans}/> </div>
    </div>)


  }

}
