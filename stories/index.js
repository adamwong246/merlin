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

storiesOf('Merlin', module)
  .add('FlatUnifedTags', () => (
    <FlatUnifedTags tagsData={tagsData}/>
  ))
  .add('FoldUnifedTags', () => {
  return (<FoldUnifedTags tags={foldTagData} />)
 }).add('FlatUnifedTrans', () => (
  <FlatUnifedTrans transactions={transactions} tags={tagsData}/>
 )).add('FoldUnifedTrans', () => {
  return (<FoldUnifedTrans transactions={bigtransactions}
                            tags={foldTagData} /> )
 }).add('split FoldUnifedTrans', () => {
  // const treeNeg = talliedTree(summedTree(treeWithTransactions(materializedPathTagsToTree(foldTagData), bigtransactions.filter((t) => Number(t.TRNAMT) < 0 ))));
  // const treePos = talliedTree(summedTree(treeWithTransactions(materializedPathTagsToTree(foldTagData), bigtransactions.filter((t) => Number(t.TRNAMT) > 0 ))));
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
