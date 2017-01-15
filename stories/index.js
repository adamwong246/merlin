import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';
import Button from './Button';
import Welcome from './Welcome';

import AccountTransactions from './AccountTransactions.js'
import AccountTransaction from './AccountTransaction.js'
import OfcViewer from './OfcViewer.js'
import Tag from './Tag.js'
import Tags from './Tags.js'

const ofcData = require('./data.json');
const tagsData = require('./tags.json');
console.log(tagsData);

const transactions = ofcData.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN;

storiesOf('Welcome', module)
  .add('to Storybook', () => (
    <Welcome showApp={linkTo('Button')}/>
  ));

storiesOf('Button', module)
  .add('with text', () => (
    <Button onClick={action('clicked')}>Hello Button</Button>
  ))
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>
  ));

storiesOf('AccountTransactions', module)
 .add('AccountTransaction', () => (
   <table>

    <tr>
      <th>tag</th>
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
       ));
