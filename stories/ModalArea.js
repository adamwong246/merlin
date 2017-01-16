import React from 'react';
import ModalSwitcher from './ModalSwitcher.js'
import FlatUnifedTags from './FlatUnifedTags.js'
import FoldUnifedTags from './FoldUnifedTags.js'
import FlatUnifedTrans from './FlatUnifedTrans.js'
import FoldUnifedTrans from './FoldUnifedTrans.js'
import FlatSplitTrans from './FlatSplitTrans.js'

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
     compon = <FlatUnifedTags tags={this.props.tags}/>
    } else if (nounMode == "tag" && flatOrFoldMode == "fold" && splitOrUnifiedMode == "unified"){
     compon = <FoldUnifedTags tags={this.props.tags}/>
    } else if (nounMode == "tran" && flatOrFoldMode == "flat" && splitOrUnifiedMode == "unified"){
     compon = <FlatUnifedTrans transactions={this.props. transactions} tags={this.props.tags}/>
    }else if (nounMode == "tran" && flatOrFoldMode == "fold" && splitOrUnifiedMode == "unified"){
     compon = <FoldUnifedTrans transactions={this.props.transactions} tags={this.props.tags} />
    }else if (nounMode == "tran" && flatOrFoldMode == "flat" && splitOrUnifiedMode == "split"){
     compon = <FlatSplitTrans transactions={this.props.transactions} tags={this.props.tags} />
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
