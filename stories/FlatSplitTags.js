import React, { Component, PropTypes } from 'react'
import FlatUnifedTrans from './FlatUnifedTrans.js'

export default class FlatSplitTags extends Component {

  render() {
   const negativeTags = this.props.tags.filter((t) => t.direction == "in" );
   const positiveTags = this.props.tags.filter((t) => t.direction == "out" );
   return (
    <div>
     <div style={{float: "left"}}> <FlatUnifedTrans tags={this.props.tags} transactions={negativeTrans}/> </div>
     <div style={{float: "right"}}> <FlatUnifedTrans tags={this.props.tags} transactions={positiveTrans}/> </div>
    </div>)


  }

}
