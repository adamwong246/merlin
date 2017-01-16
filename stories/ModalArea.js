import React from 'react';
import ModalSwitcher from './ModalSwitcher.js'
import FlatUnifedTags from './FlatUnifedTags.js'
import FoldUnifedTags from './FoldUnifedTags.js'
import FlatUnifedTrans from './FlatUnifedTrans.js'
import FoldUnifedTrans from './FoldUnifedTrans.js'

// http://stackoverflow.com/a/6232943/614612
const materializedPathTagsToTree = (paths) => {
 var foldedTags = [];
 for (var i = 0; i < paths.length; i++) {
     var chain = paths[i].path.split(",").slice(1);

     var currentNode = foldedTags;
     for (var j = 0; j < chain.length; j++) {
         var wantedNode = chain[j];
         var lastNode = currentNode;
         for (var k = 0; k < currentNode.length; k++) {
             if (currentNode[k].name == wantedNode) {
                 currentNode[k].pattern = -1;
                 currentNode = currentNode[k].children;
                 break;
             }
         }
         // If we couldn't find an item in this list of children
         // that has the right name, create one:
         if (lastNode == currentNode) {
             var newNode = currentNode[k] = {
              name: wantedNode,
              children: [],
              pattern: paths[i].pattern
             };
             currentNode = newNode.children;
         }
     }

 }
 return foldedTags;
}

const tMap = (tree, callback) =>{
  return tree.map((b)=>{
   b = callback(b);
   b.children = tMap(b.children, callback);
   return b;
  })
}

const tReduce = (tree, reducer) => {
 return tree.children.reduce( (memo, b) => {
  if (b.children.length) {
   return memo + tReduce(b, reducer)
  } else {
   return reducer(memo, b);
  }
 }, 0)

}

const treeWithTransactions = (tree, transactions, tagData) => {
   return tMap(tree, (b)=>{
    b.transactions = transactions.filter((t)=>{return new RegExp(b.pattern).test(t.NAME)});
    return b
   }).concat({
    name: "???",
    children: [],
    transactions: transactions.filter((t) => {
     return tagData.filter((tg) => {
      return new RegExp(tg.pattern).test(t.NAME)
     }).length == 0;
    }),
    summation: "?"
   })
}

const summedTree = (tree) => {
 return tMap(tree, (b)=>{
  b.summation = b.transactions.reduce((memo, transaction) => memo + Number(transaction.TRNAMT), 0);
  return b;
 });
}

const talliedTree = (tree) => {
 return tMap(tree, (b)=>{
  b.tally = tReduce(b, (memo, e) => {
   return memo + e.summation || 0;
  }, 0)
  return b;
 });
}

var ModalArea = React.createClass({
 getInitialState() {
   return { };
  },
  switchToTran(e) {
   this.setState({ noun: 'tran'});
  },
  switchToTag(e) {
   this.setState({ noun: 'tag'});
  },
  switchToFlat(e) {
   this.setState({ flatOrFold: 'flat'});
  },
  switchToFold(e) {
   this.setState({ flatOrFold: 'fold'});
  },
  switchToSplit(e) {
   this.setState({ splitOrUnified: 'split'});
  },
  switchToUnifed(e) {
   this.setState({ splitOrUnified: 'unified'});
  },

  render() {
    let compon = <span>hi</span>

    const nounMode = this.state.noun || this.props.noun;
    const flatOrFoldMode = this.state.flatOrFold || this.props.flatOrFold;
    const splitOrUnifiedMode = this.state.splitOrUnified || this.props.splitOrUnified;

    if (nounMode == "tag" && flatOrFoldMode == "flat" && splitOrUnifiedMode == "unified"){
     compon = <FlatUnifedTags tagsData={this.props.tagsData}/>
    } else if (nounMode == "tag" && flatOrFoldMode == "fold" && splitOrUnifiedMode == "unified"){

     var foldedTags = [];
     for (var i = 0; i < this.props.tagsData.length; i++) {
         var chain = this.props.tagsData[i].path.split(",").slice(1);

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

     compon = <FoldUnifedTags children={foldedTags}/>
    } else if (nounMode == "tran" && flatOrFoldMode == "flat" && splitOrUnifiedMode == "unified"){
     compon = <FlatUnifedTrans transactions={this.props. transactions} tags={this.props.tagsData}/>
    }else if (nounMode == "tran" && flatOrFoldMode == "fold" && splitOrUnifiedMode == "unified"){
     const tree = talliedTree(summedTree(treeWithTransactions(materializedPathTagsToTree(this.props.tagsData), this.props.transactions, this.props.tagsData)))
     compon = <FoldUnifedTrans children={tree}/>
    }

    return (
      <div>
       <ModalSwitcher noun={nounMode}
                      switchToTran={this.switchToTran}
                      switchToTag={this.switchToTag}

                      flatOrFold={flatOrFoldMode}
                      switchToFlat={this.switchToFlat}
                      switchToFold={this.switchToFold}

                      splitOrUnified={splitOrUnifiedMode}
                      switchToSplit={this.switchToSplit}
                      switchToUnifed={this.switchToUnifed}/>
       {compon}
      </div>
    );
  }
});

export default ModalArea;
