import React, {Component, PropTypes} from 'react';
import {hierarchy, stratify, treemapDice, roundNode} from 'd3-hierarchy';
import {scaleOrdinal, scaleLinear, schemeCategory20b, schemeCategory20c} from 'd3-scale';

import ModalArea from './ModalArea.js'

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

// returns a list of tags with the matching transactions as members
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

const recursivelyBuildTaggedTransactions = (root, key) => {
  if (key){
    var pointer = root;

    key.split('.').forEach( (k, kndx) => {
      if (kndx != 0){
        pointer = pointer.children.filter((pc) => {
          return pc.id.split('.')[kndx] == k
        })[0]

      } else {
        console.log("skip first index!")
      }
    })

    return recursivelyBuildTaggedTransactions(pointer)

  } else {
    return (root.children || []).map((child) => recursivelyBuildTaggedTransactions(child))
    .concat((root.data || false).transactions || [])
    .reduce(function(a, b) {
      return a.concat(b);
    }, [])
  }
}

var TableAndTree = React.createClass({
  getInitialState() {
    return {
      focused: null,
      focusedX0: null,
      focusedX1: null,
      focusedY0: null,
      focusedY1: null,
      focusedHeight: null,
      focusedDepth: null
    }
  },

  setFocus(data){
    const focused = this.state.focused;
    if (focused != null && data.id.split('.')[0] != focused.split('.')[0]){
      this.setState({
        focused: null,
        focusedX0: null,
        focusedX1: null,
        focusedY0: null,
        focusedY1: null,
        focusedHeight: null,
        focusedDepth: null
      })
    } else {
      this.setState({
        focused: data.id,
        focusedX0: data.x0,
        focusedX1: data.x1,
        focusedY0: data.y0,
        focusedY1: data.y1,
        focusedHeight: data.height,
        focusedDepth: data.depth
      })
    }
  },

  goBack(){
    this.setState({
      focused: null,
      focusedX0: null,
      focusedX1: null,
      focusedY0: null,
      focusedY1: null,
      focusedHeight: null,
      focusedDepth: null
    })
  },

  render() {
    const tags = this.props.tags;
    const transactions = this.props.transactions;
    const focused = this.state.focused;

    const transactedTags = makeTransactedTags(transactions, tags)
    .filter((t)=> {
      if (focused == null){
        return true
      } else {
        return t.id.includes(focused)
      }
    })

    const positiveTransactedTags = makePositiveTransactedTags(transactions, tags, focused == null);
    const posRoot = makeTreeOfTransactedTags(positiveTransactedTags);

    const negativeTransactedTags = makeNegativeTransactedTags(transactions, tags, focused == null)
    const negRoot = makeTreeOfTransactedTags(negativeTransactedTags);

    var taggedTransactions;

    if (focused == null){
      taggedTransactions = recursivelyBuildTaggedTransactions(posRoot)
      .concat(recursivelyBuildTaggedTransactions(negRoot));
    } else {
      if (focused.split('.')[0] == "outcome"){
        taggedTransactions = recursivelyBuildTaggedTransactions(negRoot, focused);
      } else if (focused.split('.')[0] == "income"){
        taggedTransactions = recursivelyBuildTaggedTransactions(posRoot, focused);
      }else {
        debugger
      }
    }

    const ttlthrpt = Math.max(posRoot.value, negRoot.value);

    const base = 500;
    const viewWidth = base;
    const viewHeight = base;
    const halfViewHeight = viewHeight / 2;

    var xScale, yScalePos, yScaleNeg;

    if (focused == undefined){
      xScale = scaleLinear().domain([0, 100 ]).range([0, viewWidth]);
      yScalePos = scaleLinear().domain([0, 100 ]).range([halfViewHeight, 0]);
      yScaleNeg = scaleLinear().domain([0, 100 ]).range([halfViewHeight, viewHeight]);
    } else {
      xScale = scaleLinear().domain([this.state.focusedX0, this.state.focusedX1 ]).range([0, viewWidth]);

      if (focused.split('.')[0] == "income"){
        yScalePos = scaleLinear()
        .domain([
          (this.state.focusedDepth) * (this.state.focusedY1 - this.state.focusedY0),
          (this.state.focusedDepth + this.state.focusedHeight + 1) * (this.state.focusedY1 - this.state.focusedY0)
        ])
        .range([viewHeight, 0]);
        yScaleNeg = scaleLinear()
        .domain([
          (this.state.focusedDepth) * (this.state.focusedY1 - this.state.focusedY0),
          (this.state.focusedDepth + this.state.focusedHeight + 1) * (this.state.focusedY1 - this.state.focusedY0)
        ])
        .range([viewHeight*0.9, viewHeight*1.9]);
      } else if (focused.split('.')[0] == "outcome"){
        yScalePos = scaleLinear()
        .domain([
          (this.state.focusedDepth) * (this.state.focusedY1 - this.state.focusedY0),
          (this.state.focusedDepth + this.state.focusedHeight + 1) * (this.state.focusedY1 - this.state.focusedY0)
        ])
        .range([0, 0])
        yScaleNeg = scaleLinear()
        .domain([
          (this.state.focusedDepth) * (this.state.focusedY1 - this.state.focusedY0),
          (this.state.focusedDepth + this.state.focusedHeight + 1) * (this.state.focusedY1 - this.state.focusedY0)
        ])
        .range([0 , viewHeight]);
      }else {
        debugger
      }
    }


    return (
      <div>
        <div className="left" >
          <button onClick={this.goBack} > clear state </button>
          <p>{JSON.stringify(this.state, null, 2)}</p>

          <table>
            <tr>
              <td>
                <table >
                  <caption>tags</caption>
                  <thead>
                    <tr>
                      <th>id</th>
                      <th>pattern</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(transactedTags).map((t, ndx) => {
                      const focuser = () => {
                        this.setFocus({id: t.id})
                      }
                      return (
                        <tr key={`trnscttags-${ndx}`}>
                          <td><a href='#' onClick={focuser}>{t.id}</a></td>
                          <td><code>/{t.pattern}/</code></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </td>
              <td>
                <table >
                  <caption>transactions</caption>
                  <thead>
                    <tr>
                      <th>name</th>
                      <th>date</th>
                      <th>$</th>
                    </tr>
                  </thead>
                  <tbody>
                    {taggedTransactions.map((t, ndx) => {
                      return (
                        <tr key={`tgdtrnsctn-${ndx}`}>
                          <td>{t.NAME}</td>
                          <td>{t.FITID}</td>
                          <td>{t.TRNAMT}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </td>
            </tr>
          </table>



        </div>

        <div className="right" >
          <svg width={`${viewWidth}px`} height={`${viewHeight}px`}>

            <D3Partition
              tree={negRoot}
              totalThroughput={ttlthrpt}
              colors={schemeCategory20b}
              onClick={this.setFocus}
              state={this.state}
              xScale={xScale}
              yScale={yScaleNeg } />

              <D3Partition
               tree={posRoot}
               totalThroughput={ttlthrpt}
               colors={schemeCategory20c}
               onClick={this.setFocus}
               state={this.state}
               xScale={xScale}
               yScale={yScalePos} />

            <line x1="0" y1={0} x2={viewWidth} y2={0} stroke="red" strokeWidth="3" ></line>
            <line x1="0" y1={halfViewHeight} x2={viewWidth} y2={halfViewHeight} stroke="red" strokeWidth="3" ></line>
            <line x1="0" y1={viewHeight} x2={viewWidth} y2={viewHeight} stroke="red" strokeWidth="3" ></line>
            <line x1="0" y1={0} x2={0} y2={viewHeight} stroke="red" strokeWidth="3" ></line>
            <line x1={viewWidth} y1={0} x2={viewWidth} y2={viewHeight} stroke="red" strokeWidth="3" ></line>

          </svg>
        </div>
      </div>);
    }
  });

export default TableAndTree;
