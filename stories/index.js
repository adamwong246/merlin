import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';

import Button from './Button';
import Welcome from './Welcome';

import AccountTransactions from './AccountTransactions.js'
import AccountTransaction from './AccountTransaction.js'
import OfcViewer from './OfcViewer.js'
import Tag from './Tag.js'
import Tags from './Tags.js'
import FlatTags from './FlatTags.js'
import FoldTags from './FoldTags.js'
import FlatTrans from './FlatTrans.js'
import FoldTrans from './FoldTrans.js'

const ofcData = require('./data.json');
const big = require('./big.json');
const tagsData = require('./tags.json');
const foldTagData = require('./foldTagData.json');

const transactions = ofcData.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN;
const bigtransactions = big.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN;

// http://stackoverflow.com/a/6232943/614612
const materializedPathTagsToTree = (paths) => {
 var foldedTags = [];
 for (var i = 0; i < paths.length; i++) {
     var chain = paths[i].path.split(",").slice(1);

     var currentNode = foldedTags;
     for (var j = 0; j < chain.length; j++) {
         var wantedNode = chain[j];
         var lastNode = currentNode;
         for (var k = 0; k < currentNode.length; k++) {
             if (currentNode[k].name == wantedNode) {
                 currentNode[k].pattern = -1;
                 currentNode = currentNode[k].children;
                 break;
             }
         }
         // If we couldn't find an item in this list of children
         // that has the right name, create one:
         if (lastNode == currentNode) {
             var newNode = currentNode[k] = {
              name: wantedNode,
              children: [],
              pattern: paths[i].pattern
             };
             currentNode = newNode.children;
         }
     }

 }
 return foldedTags;
}


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

const treeWithTransactions = (tree, transactions) => {
   return tMap(tree, (b)=>{
    b.transactions = transactions.filter((t)=>{return new RegExp(b.pattern).test(t.NAME)});
    return b
   }).concat({
    name: "???",
    children: [],
    transactions: transactions.filter((t) => {
     return foldTagData.filter((tg) => {
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

storiesOf('AccountTransactions', module)
 .add('AccountTransaction', () => (
   <table>

    <tr>
      <th>TRNTYPE</th>
      <th>DTPOSTED</th>
      <th>TRNAMT</th>
      <th>FITID</th>
      <th>NAME</th>
      <th>MEMO</th>
    </tr>

    <AccountTransaction transaction={transactions[0]}/>
   </table>
  ))
  .add('AccountTransactions', () => (
    <AccountTransactions transactions={transactions}/>
  ))
  .add('ofc', () => (
    <OfcViewer ofcData={ofcData} tagsData={tagsData}/>
  ))
  .add('tag', () => (
    <Tag tag="foo"
         transactions={transactions}/>
       ))
  .add('tags', () => (
    <Tags name="foo"
         ofcData={ofcData} tagsData={tagsData}/>
   ))
  .add('flatTags', () => (
    <FlatTags tagsData={tagsData}/>
  ))
  .add('foldTags', () => {

    // http://stackoverflow.com/a/6232943/614612
    var foldedTags = [];
    for (var i = 0; i < foldTagData.length; i++) {
        var chain = foldTagData[i].path.split(",").slice(1);

        var currentNode = foldedTags;
        for (var j = 0; j < chain.length; j++) {
            var wantedNode = chain[j];
            var lastNode = currentNode;
            for (var k = 0; k < currentNode.length; k++) {
                if (currentNode[k].name == wantedNode) {
                    currentNode = currentNode[k].children;
                    break;
                }
            }
            // If we couldn't find an item in this list of children
            // that has the right name, create one:
            if (lastNode == currentNode) {
                var newNode = currentNode[k] = {name: wantedNode, children: []};
                currentNode = newNode.children;
            }
        }
    }

  return (
    <FoldTags children={foldedTags}/>
  )
 }).add('flatTrans', () => (
  <FlatTrans transactions={transactions} tags={tagsData}/>
 )).add('foldTrans', () => {
  const tree2 = talliedTree(summedTree(treeWithTransactions(materializedPathTagsToTree(foldTagData), bigtransactions)))
  return (<FoldTrans children={tree2}/>)
 }).add('double foldTrans', () => {
  const treeNeg = talliedTree(summedTree(treeWithTransactions(materializedPathTagsToTree(foldTagData), bigtransactions.filter((t) => Number(t.TRNAMT) < 0 ))));
  const treePos = talliedTree(summedTree(treeWithTransactions(materializedPathTagsToTree(foldTagData), bigtransactions.filter((t) => Number(t.TRNAMT) > 0 ))));

  return (
   <div>
    <div style={{float: "left"}}> <FoldTrans children={treeNeg}/> </div>
    <div style={{float: "right"}}> <FoldTrans children={treePos}/> </div>
   </div>)
 });
;
