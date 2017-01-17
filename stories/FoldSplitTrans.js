import React, { Component, PropTypes } from 'react'
import FoldUnifiedTrans from './FoldUnifiedTrans.js'

const styles = require('./styles.json');

var FoldSplitTags = React.createClass({
  render() {
   const positiveTags = this.props.tags.filter((t) => t.direction == "out" );
   const negativeTags = this.props.tags.filter((t) => t.direction == "in" );
   const positiveTrans = this.props.transactions.filter((t) => Number(t.TRNAMT) < 0 );
   const negativeTrans = this.props.transactions.filter((t) => Number(t.TRNAMT) > 0 );

   return (
    <table>
     <tr>
       <td style={styles.td} > <FoldUnifiedTrans key="pos" tags={positiveTags} transactions={positiveTrans}/> </td>
       <td style={styles.td} > <FoldUnifiedTrans key="neg" tags={negativeTags} transactions={negativeTrans}/> </td>
     </tr>
    </table>)
 }
});

export default FoldSplitTags;
