import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';

import Button from './Button';
import Welcome from './Welcome';

import AccountTransactions from './AccountTransactions.js'
import AccountTransaction from './AccountTransaction.js'
import OfcViewer from './OfcViewer.js'
import Tag from './Tag.js'
import Tags from './Tags.js'
import FlatUnifedTags from './FlatUnifedTags.js'
import FoldUnifedTags from './FoldUnifedTags.js'
import FlatUnifedTrans from './FlatUnifedTrans.js'
import FoldUnifedTrans from './FoldUnifedTrans.js'
import ModalSwitcher from './ModalSwitcher.js'
import ModalArea from './ModalArea.js'

const ofcData = require('./data.json');
const big = require('./big.json');
const tagsData = require('./tags.json');
const foldTagData = require('./foldTagData.json');

const transactions = ofcData.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN;
const bigtransactions = big.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN;

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
  .add('FlatUnifedTags', () => (
    <FlatUnifedTags tagsData={tagsData}/>
  ))
  .add('FoldUnifedTags', () => {

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
    <FoldUnifedTags children={foldedTags}/>
  )
 }).add('FlatUnifedTrans', () => (
  <FlatUnifedTrans transactions={transactions} tags={tagsData}/>
 )).add('FoldUnifedTrans', () => {
  const tree2 = talliedTree(summedTree(treeWithTransactions(materializedPathTagsToTree(foldTagData), bigtransactions)))
  return (<FoldUnifedTrans children={tree2}/>)
 }).add('double FoldUnifedTrans', () => {
  const treeNeg = talliedTree(summedTree(treeWithTransactions(materializedPathTagsToTree(foldTagData), bigtransactions.filter((t) => Number(t.TRNAMT) < 0 ))));
  const treePos = talliedTree(summedTree(treeWithTransactions(materializedPathTagsToTree(foldTagData), bigtransactions.filter((t) => Number(t.TRNAMT) > 0 ))));
  return (
   <div>
    <div style={{float: "left"}}> <FoldUnifedTrans children={treeNeg}/> </div>
    <div style={{float: "right"}}> <FoldUnifedTrans children={treePos}/> </div>
   </div>)
 }).add('modal switcher', () => {
  return (
   <ModalSwitcher noun="tag" flatOrFold="flat" splitOrUnified="unified"/>
 )}).add('modal area', () => {
  return (
   <ModalArea noun="tran" flatOrFold="fold" splitOrUnified="unified" tagsData={foldTagData} transactions={bigtransactions}/>
 )});

;
