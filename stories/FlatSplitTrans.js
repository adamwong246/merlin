import React, { Component, PropTypes } from 'react'
import FlatUnifiedTrans from './FlatUnifiedTrans.js'

export default class FlatSplitTrans extends Component {

  render() {
   const negativeTrans = this.props.transactions.filter((t) => Number(t.TRNAMT) < 0 );
   const positiveTrans = this.props.transactions.filter((t) => Number(t.TRNAMT) > 0 );

   return (
    <table>
      <tr>
      <td><FlatUnifiedTrans tags={this.props.tags} transactions={negativeTrans}/></td>
      <td><FlatUnifiedTrans tags={this.props.tags} transactions={positiveTrans}/></td>
      </tr>
    </table>)


  }

}
