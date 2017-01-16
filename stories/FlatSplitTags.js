import React, { Component, PropTypes } from 'react'
import FlatUnifiedTags from './FlatUnifiedTags.js'

export default class FlatSplitTags extends Component {

  render() {
   const positiveTags = this.props.tags.filter((t) => t.direction == "out" );
   const negativeTags = this.props.tags.filter((t) => t.direction == "in" );

   return (
    <table>
     <tr><td>
      <FlatUnifiedTags key="pos" tags={positiveTags} transactions={this.props.transactions}/>
     </td><td>
     <FlatUnifiedTags key="neg" tags={negativeTags} transactions={this.props.transactions}/>
     </td></tr>
    </table>)


  }

}
