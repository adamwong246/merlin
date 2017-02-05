import React, {Component, PropTypes} from 'react';
import {hierarchy, stratify, treemapDice, roundNode} from 'd3-hierarchy';
import {scaleOrdinal, schemeCategory20b, schemeCategory20c} from 'd3-scale';

import D3Partition from './D3Partition'

// flatten the transactions into the tree proper
const makeFlattenedSelectionOfTransactedTags = (tags) => {

  var toReturn = [];
  toReturn = tags.map((t) => {
    const tid = t.id;
    if (t.transactions.length) {
      return t.transactions.map((tt) => {
        return {
          ...tt,
          id: `${tid}.${tt.FITID}`,
          value: Math.abs(Number(tt.TRNAMT))
        }
      });
    }
    return false
  }).filter(Boolean)
  .reduce((memo, e) => memo.concat(e), [])
  .concat(tags);

  return toReturn;
};

// makes a tree suitable for d3-hierarchy
const makeTreeOfTransactedTags = (tags, direction) => {

  const flattenedSelectionOfTransactedTags = makeFlattenedSelectionOfTransactedTags(tags);

  return stratify()
  .parentId((d) => d.id.substring(0, d.id.lastIndexOf(".")) )

  // pass the stratify function the selected tags
  (flattenedSelectionOfTransactedTags)

  // D3 needs you to call sum and sort before layout rendering
  .sum((d) => d.value).sort((a, b) => b.height - a.height || b.value - a.value);
}

const makeTransactedTags = (transactions, tags) => {
  return tags.map((tag) => {
    return {
      ...tag,
      transactions: transactions.filter((transaction) => {
        if (tag.pattern) {
          return RegExp(tag.pattern).test(transaction.NAME);
        }
        return false
      })
    };
  });
}

const makePositiveOrNegativeTransactedTags = (transactions, tags, inOrOut, appendUncategorized) => {
  const filteredTransactions = transactions.filter((transaction) => {
    return (Number(transaction.TRNAMT) > 0 && inOrOut == "in") || (Number(transaction.TRNAMT) < 0 && inOrOut == "out")
  });
  const filteredTags = tags.filter((tag) => tag.direction == inOrOut);
  var transactedTags = makeTransactedTags(filteredTransactions, filteredTags);

  if (true){
   transactedTags.push({
     "direction": inOrOut,
     "id": `${inOrOut}come.uncategorized`,
     "transactions": filteredTransactions.filter((transaction) => {
       return tags.filter((tag) => {
         if (tag.pattern && tag.direction == inOrOut) {
           return RegExp(tag.pattern).test(transaction.NAME);
         }
         return false
       }).length == 0
     })
   });
  }

  return transactedTags;
};

const makePositiveTransactedTags = (transactions, tags, appendUncategorized) => makePositiveOrNegativeTransactedTags(transactions, tags, "in", appendUncategorized)

const makeNegativeTransactedTags = (transactions, tags, appendUncategorized) => makePositiveOrNegativeTransactedTags(transactions, tags, "out", appendUncategorized)

const makeTaggedTransactionsOfPositiveAndNegativeTransactedTags = (positiveTT, negativeTT) => {
  return positiveTT.concat(negativeTT)
  .map( (tag) => {
    return tag.transactions.map((transaction) => {
      return {...transaction, tags: [tag]}
    })
  })
  .filter(Boolean)
  .reduce((memo, e) => memo.concat(e), [])
}

var D3DoublePartition = React.createClass({
  getInitialState() {
    return {
     focused: null,
     focusedX0: null,
     focusedX1: null,
     focusedY0: null,
     focusedY1: null
   }
  },

  setFocus(data){
    console.log(data)
    this.setState({
      focused: data.id,
      focusedX0: data.x0,
      focusedX1: data.x1,
      focusedY0: data.y0,
      focusedY1: data.y1
    })
  },

  goBack(){
   this.setState({
    focused: null,
    focusedX0: null,
    focusedX1: null,
    focusedY0: null,
    focusedY1: null
  })
  },

  render() {
    const tags = this.props.tags;
    const transactions = this.props.transactions;
    const focused = this.props.focused;

    const positiveTransactedTags = makePositiveTransactedTags(transactions, tags, focused == null);
    const posRoot = makeTreeOfTransactedTags(positiveTransactedTags);

    const negativeTransactedTags = makeNegativeTransactedTags(transactions, tags, focused == null)
    const negRoot = makeTreeOfTransactedTags(negativeTransactedTags);

    const taggedTransactions = makeTaggedTransactionsOfPositiveAndNegativeTransactedTags(positiveTransactedTags, negativeTransactedTags);
    const ttlthrpt = Math.max(posRoot.value, negRoot.value);

    const base = 100;

    return (
     <div>
       <div className="left" >
        <table >
          <tbody>
            {taggedTransactions.map((t, ndx) => {
              return (
                <tr key={`tgdtrnsctn-${ndx}`}>
                  <td>{t.FITID}</td>
                  <td>{t.TRNAMT}</td>
                  <td>{t.NAME}</td>
                  <td>{t.tags.map((t) => t.id)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="right" >
        <svg viewBox={`0 0 ${base} ${2 * base}`} preserveAspectRatio="xMinYMin meet" >

          <D3Partition direction="pos"
                       tree={posRoot}
                       totalThroughput={ttlthrpt}
                       colors={schemeCategory20c}
                       onClick={this.props.setFocus}
                       focused={focused}
                       transform={`translate(0, 0)`}
                       base={base}/>

          <D3Partition direction="neg"
                       tree={negRoot}
                       totalThroughput={ttlthrpt}
                       colors={schemeCategory20b}
                       onClick={this.props.setFocus}
                       focused={focused}
                       transform={`translate(0, ${base})`}
                       base={base}/>

        </svg>

      </div>

    </div>);

  }
});

export default D3DoublePartition;
