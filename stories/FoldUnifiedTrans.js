import React, { Component, PropTypes } from 'react'

import materializedPathTagsToTree from './materializedPathTagsToTree'

const tMap = (tree, callback) =>{
  return tree.map((b)=>{
   b = callback(b);
   b.children = tMap(b.children, callback);
   return b;
  })
}

const tReduce = (tree, reducer) => {
 return tree.children.reduce( (memo, b) => {
  if (b.children.length) {
   return memo + tReduce(b, reducer)
  } else {
   return reducer(memo, b);
  }
 }, 0)

}

const treeWithTransactions = (tree, transactions, tagData) => {
   return tMap(tree, (b)=>{
    b.transactions = transactions.filter((t)=>{
     return b.patterns.filter((p)=>{return new RegExp(p).test(t.NAME)}).length > 0
    });
    return b
   })
   .concat({
    name: "???",
    children: [],
    transactions: transactions.filter((t) => {
     return tagData.filter((tg) => {
      return new RegExp(tg.pattern).test(t.NAME)
     }).length == 0;
    }),
    summation: "?"
   })
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
   return { hide: 0 };
  },
  onClick () {
   if (this.state.hide){
    this.setState({ hide: 0 });
   } else {
    this.setState({ hide: 1 });
   }
  },
  render() {

    const { tag } = this.props

    return (<li key={tag.id} className="tag">
      <a href="#"onClick={this.onClick}> { this.state.hide == 0 ? <span>hide</span> :  <span>show</span> } </a>

      <span><b>{tag.name},</b> {tag.summation} </span>

      { this.state.hide == 0 ?
       <table >
            {tag.summation < 0 ? <tr >
              <td>sum</td>
              <td>{tag.summation}</td>
            </tr> : null}

             {tag.transactions.map(t =>
               <tr key={t.id} className="transaction">
                 <td>{t.NAME}</td><td>{t.TRNAMT}$</td>
               </tr>
             )}
      </table> : null }


      { this.state.hide == 0 ? <ul className="tags">
        {tag.children.map(c => <FoldUnifiedTransTag tag={c} /> )}
      </ul>

      : null }

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

    console.log(children);

    return (
      <ul className="tags">
        {children.map(c => <FoldUnifiedTransTag tag={c} /> )}
      </ul>
    )

  }

}
