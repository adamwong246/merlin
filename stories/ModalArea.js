import React from 'react';
import ModalSwitcher from './ModalSwitcher.js'
import FlatUnifiedTags from './FlatUnifiedTags.js'
import FoldUnifiedTags from './FoldUnifiedTags.js'
import FlatUnifiedTrans from './FlatUnifiedTrans.js'
import FoldUnifiedTrans from './FoldUnifiedTrans.js'
import FlatSplitTrans from './FlatSplitTrans.js'
import FlatSplitTags from './FlatSplitTags.js'
import FoldSplitTrans from './FoldSplitTrans.js'
import FoldSplitTags from './FoldSplitTags.js'

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
  switchToUnified(e) {
   this.setState({ splitOrUnified: 'unified'});
  },

  render() {
    let compon = <span>hi</span>

    const nounMode = this.state.noun || this.props.noun;
    const flatOrFoldMode = this.state.flatOrFold || this.props.flatOrFold;
    const splitOrUnifiedMode = this.state.splitOrUnified || this.props.splitOrUnified;

    if (nounMode == "tag" && flatOrFoldMode == "flat" && splitOrUnifiedMode == "unified"){
     compon = <FlatUnifiedTags tags={this.props.tags}/>
    } else if (nounMode == "tag" && flatOrFoldMode == "fold" && splitOrUnifiedMode == "unified"){
     compon = <FoldUnifiedTags tags={this.props.tags}/>
    } else if (nounMode == "tran" && flatOrFoldMode == "flat" && splitOrUnifiedMode == "unified"){
     compon = <FlatUnifiedTrans transactions={this.props. transactions} tags={this.props.tags}/>
    }else if (nounMode == "tran" && flatOrFoldMode == "fold" && splitOrUnifiedMode == "unified"){
     compon = <FoldUnifiedTrans transactions={this.props.transactions} tags={this.props.tags} />
    }else if (nounMode == "tran" && flatOrFoldMode == "flat" && splitOrUnifiedMode == "split"){
     compon = <FlatSplitTrans transactions={this.props.transactions} tags={this.props.tags} />
    }else if (nounMode == "tag" && flatOrFoldMode == "flat" && splitOrUnifiedMode == "split"){
     compon = <FlatSplitTags transactions={this.props.transactions} tags={this.props.tags} />
    }else if (nounMode == "tran" && flatOrFoldMode == "fold" && splitOrUnifiedMode == "split"){
     compon = <FoldSplitTrans transactions={this.props.transactions} tags={this.props.tags} />
    }else if (nounMode == "tag" && flatOrFoldMode == "fold" && splitOrUnifiedMode == "split"){
     compon = <FoldSplitTags transactions={this.props.transactions} tags={this.props.tags} />
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
                      switchToUnified={this.switchToUnified}/>
       {compon}
      </div>
    );
  }
});

export default ModalArea;
