import React, { Component, PropTypes } from 'react'

import materializedPathTagsToTree from './materializedPathTagsToTree'
import treeWithTransactions from './treeWithTransactions'
import tMap from './tMap'


const tReduce = (tree, reducer) => {
 return tree.children.reduce( (memo, b) => {
  if (b.children.length) {
   return memo + tReduce(b, reducer)
  } else {
   return reducer(memo, b);
  }
 }, 0)

}

const summedTree = (tree) => {
 return tMap(tree, (b)=>{
  b.summation = b.transactions.reduce((memo, transaction) => memo + Number(transaction.TRNAMT), 0);
  return b;
 });
}

const talliedTree = (tree) => {
 return tMap(tree, (b)=>{
  b.tally = tReduce(b, (memo, e) => {
   return memo + e.summation || 0;
  }, 0)
  return b;
 });
}

var FoldUnifiedTransTag = React.createClass({
 getInitialState() {
   return { hideTransactions: 0, hideChildren: 0 };
  },
  toggleTransactions () {
   if (this.state.hideTransactions){
    this.setState({ hideTransactions: 0 });
   } else {
    this.setState({ hideTransactions: 1 });
   }
  },
  toggleChildren () {
   if (this.state.hideChildren){
    this.setState({ hideChildren: 0 });
   } else {
    this.setState({ hideChildren: 1 });
   }
  },
  render() {

    const { tag } = this.props

    return (<li key={tag.id} className="tag">

      <span>
        <b>{tag.name} </b>
        { tag.tally != 0 ? tag.tally : null }
        { tag.children.length ? <button onClick={this.toggleChildren}> { !this.state.hideChildren ? 'hide children' : 'show children' } </button> : null }
      </span>

      { tag.transactions.length ?
       <table >
            <tr >
              <th>sum </th>
              <th>{tag.summation}</th>
              <th>
               <button onClick={this.toggleTransactions}> { !this.state.hideTransactions ? 'hide transactions' : 'show transactions' } </button>
              </th>
            </tr>

            { this.state.hideTransactions == 0 ? tag.transactions.map(t => {
               return (
                 <tr key={t.id} className="transaction">
                  <td>{t.NAME}</td><td>{t.TRNAMT}$</td>
                  <td></td>
                  </tr>
               )
            }) : null }

       </table>

 : null }

       { this.state.hideChildren == 0 ? <ul className="tags"> {tag.children.map(c => <FoldUnifiedTransTag tag={c} /> )} </ul>  : null }

    </li>)
  }
}
);

export default class FoldUnifiedTrans extends Component {
  render() {
    const children = talliedTree(
     summedTree(
      treeWithTransactions(
       materializedPathTagsToTree(this.props.tags),
       this.props.transactions,
       this.props.tags
      )
     )
    )

    return (
      <ul className="tags">
        {children.map(c => <FoldUnifiedTransTag key={c.id} tag={c} /> )}
      </ul>
    )
  }
}
