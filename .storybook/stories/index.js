import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
// import AccountTransactions from './components/AccountTransactions.js'
// // var ofx = require('ofx');
// //
// // // const file = fs.readFileSync('./data/Checking1.qfx', 'utf8');
// // // const parsed = ofx.parse(file);
//
// console.log(parsed);

storiesOf('Button', module)
  .add('with text?!', () => (
    <button onClick={action('clicked')}>Hello Button</button>
  ))
