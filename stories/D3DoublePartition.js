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
  return tags.map((t) => {
    return {
      ...t,
      transactions: transactions.filter((tt) => {
        if (t.pattern) {
          return RegExp(t.pattern).test(tt.NAME);
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

  if (appendUncategorized){
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

const CenteredView = React.createClass({
  render() {
   const tags = this.props.tags;
   const transactions = this.props.transactions;

   const positiveTransactedTags = makePositiveTransactedTags(transactions, tags, true);
   const negativeTransactedTags = makeNegativeTransactedTags(transactions, tags, true)

   const posRoot = makeTreeOfTransactedTags(positiveTransactedTags);
   const negRoot = makeTreeOfTransactedTags(negativeTransactedTags);

   const taggedTransactions = makeTaggedTransactionsOfPositiveAndNegativeTransactedTags(positiveTransactedTags, negativeTransactedTags)

   const ttlthrpt = Math.max(posRoot.value, negRoot.value)

   return (
    <div>
      <div className="centered-third-center" style={{
         height: '450px',
         overflowY: 'scroll'
       }}>
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

     <div className="centered-third-left">
       <svg viewBox={`0 0 100 100`} preserveAspectRatio="xMinYMin meet">
         <D3Partition direction="pos" tree={posRoot} totalThroughput={ttlthrpt}
                      colors={schemeCategory20c}
                      onClick={this.props.setFocus} />
       </svg>
     </div>

     <div className="centered-third-right">
       <svg viewBox={`0 0 100 100`} preserveAspectRatio="xMinYMin meet">
         <D3Partition direction="neg" tree={negRoot} totalThroughput={ttlthrpt}
                      colors={schemeCategory20b}
                      onClick={this.props.setFocus} />
       </svg>
     </div>
  </div>);
  }
})

const LeftView = React.createClass({
 render() {
  const tags = this.props.tags;
  const transactions = this.props.transactions;

  const positiveTransactedTags = makePositiveTransactedTags(transactions, tags);
  const posRoot = makeTreeOfTransactedTags(positiveTransactedTags);
  const taggedTransactions = makeTaggedTransactionsOfPositiveAndNegativeTransactedTags(positiveTransactedTags, [])
  const ttlthrpt = posRoot.value;

  return (
   <div>
     <div className="left-third-center" style={{
        height: '450px',
        overflowY: 'scroll'
      }}>
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

    <div className="left-third-left">
      <svg viewBox={`0 0 100 100`} preserveAspectRatio="xMinYMin meet">
        <D3Partition direction="pos" tree={posRoot} totalThroughput={ttlthrpt}
                     colors={schemeCategory20c}
                     onClick={this.props.setFocus} />
      </svg>

    </div>

    <div className="left-third-right">
      <button onClick={this.props.goBack}>back to all</button>
    </div>

 </div>);
 }
})

const RightView = React.createClass({
 render() {
  var focused = this.props.focused;

  var splitFocused = this.props.focused.split('.');
  var fillerTags = splitFocused.reduce( (memo, lm, ndx) => {
    return memo.concat(splitFocused.slice(0, ndx+1).join('.'))
  }, [])

  fillerTags = fillerTags.slice(0, fillerTags.length-1)

  var tags = this.props.tags.filter( (tag) => {
   return tag.id.includes(focused)
  }).concat(
   fillerTags.map( (ft) => {
    return {id: ft, direction: "out"}
   })
  )


  const transactions = this.props.transactions;

  const negativeTransactedTags = makeNegativeTransactedTags(transactions, tags, focused == null)
  const negRoot = makeTreeOfTransactedTags(negativeTransactedTags);
  const taggedTransactions = makeTaggedTransactionsOfPositiveAndNegativeTransactedTags([], negativeTransactedTags)
  const ttlthrpt = negRoot.value;

  return (
   <div>
     <div className="right-third-center" style={{
        height: '450px',
        overflowY: 'scroll'
      }}>
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

    <div className="right-third-left">
      <button onClick={this.props.goBack}>back to all</button>
    </div>

    <div className="right-third-right">
      <svg viewBox={`0 0 100 100`} preserveAspectRatio="xMinYMin meet">
        <D3Partition direction="neg" tree={negRoot} totalThroughput={ttlthrpt}
                     colors={schemeCategory20b}
                     onClick={this.props.setFocus} />
      </svg>
    </div>
 </div>);
 }
})

var D3DoublePartition = React.createClass({
  getInitialState() {
    return { focused: null};
  },

  setFocus(data){
    this.setState({focused: data.id})
  },

  goBack(){
   this.setState({focused: null})
  },

  render() {
    const tags = this.props.tags;
    const transactions = this.props.transactions;

    var leftRightOrCentered;

    if (this.state.focused == null){
      leftRightOrCentered = <CenteredView transactions={transactions} tags={tags}
                                          focused={this.state.focused}
                                          setFocus={this.setFocus} />
    } else {
     if (this.state.focused.split('.')[0] == "outcome"){
       leftRightOrCentered = <RightView transactions={transactions} tags={tags}
                                        focused={this.state.focused}
                                        setFocus={this.setFocus}
                                        goBack={this.goBack}/>
                                      } else if (this.state.focused.split('.')[0] == "income"){
       leftRightOrCentered = <LeftView transactions={transactions} tags={tags}
                                        focused={this.state.focused}
                                        setFocus={this.setFocus}
                                        goBack={this.goBack}/>
      } else {
       debugger
      }
    }

    return (
      <div>
        <span>{JSON.stringify(this.state)}</span>
        {leftRightOrCentered}
      </div>
    );
  }
});

export default D3DoublePartition;
