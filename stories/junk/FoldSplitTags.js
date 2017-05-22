import React, { Component, PropTypes } from 'react'
import FoldUnifiedTags from './FoldUnifiedTags.js'

var FoldSplitTags = React.createClass({
  render() {
   const positiveTags = this.props.tags.filter((t) => t.direction == "out" );
   const negativeTags = this.props.tags.filter((t) => t.direction == "in" );

   return (<table>
     <tr>
      <td> <FoldUnifiedTags key="pos" tags={positiveTags} transactions={this.props.transactions}/> </td>
      <td> <FoldUnifiedTags key="neg" tags={negativeTags} transactions={this.props.transactions}/> </td>
     </tr>
   </table>)
 }
});

export default FoldSplitTags;
