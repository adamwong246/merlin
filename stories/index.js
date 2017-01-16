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
const tagsData = require('./tags.json');
const foldTagData = require('./foldTagData.json');

const transactions = ofcData.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN;

// storiesOf('Welcome', module)
//   .add('to Storybook', () => (
//     <Welcome showApp={linkTo('Button')}/>
//   ));
//
// storiesOf('Button', module)
//   .add('with text', () => (
//     <Button onClick={action('clicked')}>Hello Button</Button>
//   ))
//   .add('with some emoji', () => (
//     <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>
//   ));

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

  // http://stackoverflow.com/a/6232943/614612
  var foldedTags = [];
  for (var i = 0; i < foldTagData.length; i++) {
      console.log(foldTagData[i]);

      var chain = foldTagData[i].path.split(",").slice(1);

      var currentNode = foldedTags;
      for (var j = 0; j < chain.length; j++) {
          var wantedNode = chain[j];
          var lastNode = currentNode;
          for (var k = 0; k < currentNode.length; k++) {
              if (currentNode[k].name == wantedNode) {
                  // currentNode[k].transactions = foldTagData[i].pattern ? [] : transactions.filter((t)=>{return new RegExp(foldTagData[i].pattern).test(t.NAME)})
                  currentNode[k].transactions = [];
                  currentNode = currentNode[k].children;
                  break;
              }
          }
          // If we couldn't find an item in this list of children
          // that has the right name, create one:
          if (lastNode == currentNode) {
              console.log("creating: ", wantedNode);

              // if (wantedNode == "utilities"){debugger}

              var newNode = currentNode[k] = {
               name: wantedNode,
               children: [],

               transactions: transactions.filter((t)=>{return new RegExp(foldTagData[i].pattern).test(t.NAME)})
              };
              console.log("... ", newNode);
              currentNode = newNode.children;
          }
          // debugger
          // currentNode.transactions = foldTagData[i].pattern ? [] : transactions.filter((t)=>{return new RegExp(foldTagData[i].pattern).test(t.NAME)})
      }

  }

  console.log(foldedTags);

return (
  <FoldTrans children={foldedTags}/>
)});
