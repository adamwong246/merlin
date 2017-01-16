import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';

import Button from './Button';
import Welcome from './Welcome';

// import AccountTransactions from './AccountTransactions.js'
// import AccountTransaction from './AccountTransaction.js'
// import OfcViewer from './OfcViewer.js'
// import Tag from './Tag.js'
// import Tags from './Tags.js'

import FlatUnifedTags from './FlatUnifedTags.js'
import FoldUnifedTags from './FoldUnifedTags.js'
import FlatUnifedTrans from './FlatUnifedTrans.js'
import FoldUnifedTrans from './FoldUnifedTrans.js'
import FlatSplitTrans from './FlatSplitTrans.js'
import FlatSplitTags from './FlatSplitTags.js'

import ModalSwitcher from './ModalSwitcher.js'
import ModalArea from './ModalArea.js'

const ofcData = require('./data.json');
const big = require('./big.json');
const tags = require('./tags.json');

const transactions = ofcData.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN;
const bigtransactions = big.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN;

storiesOf('Merlin', module)
.add('modal switcher', () => {
 return (
  <ModalSwitcher noun="tag" flatOrFold="flat" splitOrUnified="unified"/>
)}).add('modal area', () => {
 return (
  <ModalArea noun="tran" flatOrFold="fold" splitOrUnified="unified" tags={tags} transactions={bigtransactions}/>
)})
  .add('FlatUnifedTags', () => (
    <FlatUnifedTags tags={tags}/>
  ))
  .add('FoldUnifedTags', () => {
  return (<FoldUnifedTags tags={tags} />)
 }).add('FlatUnifedTrans', () => (
  <FlatUnifedTrans transactions={transactions} tags={tags}/>
 )).add('FoldUnifedTrans', () => {
  return (<FoldUnifedTrans transactions={bigtransactions} tags={tags} /> )
 }).add('FlatSplitTrans', () => {
  return (<FlatSplitTrans transactions={bigtransactions} tags={tags} /> )
 }).add('FlatSplitTags', () => {
  return (<FlatSplitTags transactions={bigtransactions} tags={tags} /> )
 });

;
