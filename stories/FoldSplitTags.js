import React, { Component, PropTypes } from 'react'
import FoldUnifiedTags from './FoldUnifiedTags.js'

const styles = require('./styles.json');

var FoldSplitTags = React.createClass({
  render() {
   const positiveTags = this.props.tags.filter((t) => t.direction == "out" );
   const negativeTags = this.props.tags.filter((t) => t.direction == "in" );

   return (<table>
     <tr>
      <td style={styles.td} > <FoldUnifiedTags key="pos" tags={positiveTags} transactions={this.props.transactions}/> </td>
      <td style={styles.td} > <FoldUnifiedTags key="neg" tags={negativeTags} transactions={this.props.transactions}/> </td>
     </tr>
   </table>)
 }
});

export default FoldSplitTags;
