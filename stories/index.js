import React from 'react';
import { storiesOf, linkTo } from '@kadira/storybook';

import ModalSwitcher from './ModalSwitcher.js'
import ModalArea from './ModalArea.js'

import FlatUnifiedTags from './FlatUnifiedTags.js'
import FoldUnifiedTags from './FoldUnifiedTags.js'
import FlatUnifiedTrans from './FlatUnifiedTrans.js'
import FoldUnifiedTrans from './FoldUnifiedTrans.js'
import FlatSplitTrans from './FlatSplitTrans.js'
import FlatSplitTags from './FlatSplitTags.js'
import FoldSplitTags from './FoldSplitTags.js'
import FoldSplitTrans from './FoldSplitTrans.js'
import TableAndTree from './TableAndTree.js'

import './styles.css'

const transactions = require('./transactions.json').BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN;
const tags = require('./tags.json');

storiesOf('Merlin', module)
  .add('TableAndTree', () => (<TableAndTree transactions={transactions} tags={tags} /> ));
  // .add('modal switcher', () => {
  //  return (<ModalSwitcher noun="tag" flatOrFold="flat" splitOrUnified="unified"/>)})
  // .add('modal area', () => {
  //    return (<ModalArea noun="tran" flatOrFold="fold" splitOrUnified="split" tags={tags} transactions={transactions}/> )
  //  })
  // .add('FlatUnifiedTags', () => (<FlatUnifiedTags transactions={transactions} tags={tags} /> ))
  // .add('FlatUnifiedTrans', () => (<FlatUnifiedTrans transactions={transactions} tags={tags}/>))
  // .add('FoldUnifiedTags', () => (<FoldUnifiedTags transactions={transactions} tags={tags} /> ))
  // .add('FoldUnifiedTrans', () => (<FoldUnifiedTrans transactions={transactions} tags={tags} /> ))
  // .add('FlatSplitTrans', () => (<FlatSplitTrans transactions={transactions} tags={tags} /> ))
  // .add('FlatSplitTags', () => (<FlatSplitTags transactions={transactions} tags={tags} /> ))
  // .add('FoldSplitTags', () => (<FoldSplitTags transactions={transactions} tags={tags} /> ))
  // .add('FoldSplitTrans', () => (<FoldSplitTrans transactions={transactions} tags={tags} /> ))
