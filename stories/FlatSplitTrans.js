import React, { Component, PropTypes } from 'react'
import FlatUnifedTrans from './FlatUnifedTrans.js'

export default class FlatSplitTrans extends Component {

  render() {
   const negativeTrans = this.props.transactions.filter((t) => Number(t.TRNAMT) < 0 );
   const positiveTrans = this.props.transactions.filter((t) => Number(t.TRNAMT) > 0 );
   return (
    <div>
     <div style={{float: "left"}}> <FlatUnifedTrans tags={this.props.tags} transactions={negativeTrans}/> </div>
     <div style={{float: "right"}}> <FlatUnifedTrans tags={this.props.tags} transactions={positiveTrans}/> </div>
    </div>)


  }

}
