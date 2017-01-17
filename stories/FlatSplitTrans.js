import React, { Component, PropTypes } from 'react'
import FlatUnifiedTrans from './FlatUnifiedTrans.js'

const styles = require('./styles.json')

export default class FlatSplitTrans extends Component {

  render() {
   const negativeTrans = this.props.transactions.filter((t) => Number(t.TRNAMT) < 0 );
   const positiveTrans = this.props.transactions.filter((t) => Number(t.TRNAMT) > 0 );

   return (
    <table>
      <tr>
      <td style={styles.td} ><FlatUnifiedTrans tags={this.props.tags} transactions={negativeTrans}/></td>
      <td style={styles.td} ><FlatUnifiedTrans tags={this.props.tags} transactions={positiveTrans}/></td>
      </tr>
    </table>)


  }

}
