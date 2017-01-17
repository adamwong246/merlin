import React from 'react';

var ModalSwitcher = React.createClass({
 getInitialState() {
   return { };
  },

  render() {
    var nounComp;
    var floatOrFoldComp;
    var splitOrUnifiedComp;

    if (this.props.noun == 'tran'){
      nounComp = (<span> tags <a onClick={this.props.switchToTag} href="#">transactions</a> </span>);
    } else if (this.props.noun == 'tag'){
      nounComp = (<span> <a onClick={this.props.switchToTran} href="#">tags</a> transactions </span>);
    }

    if (this.props.flatOrFold == 'fold'){
      floatOrFoldComp = (<span>flat <a onClick={this.props.switchToFlat} href="#"> fold</a></span>);
    } else if (this.props.flatOrFold == 'flat'){
      floatOrFoldComp = (<span><a onClick={this.props.switchToFold} href="#"> flat</a> fold</span>);
    }

    if (this.props.splitOrUnified == 'unified'){
      splitOrUnifiedComp = (<span> <a onClick={this.props.switchToSplit} href="#"> unified</a> split </span>);
    } else if (this.props.splitOrUnified == 'split'){
      splitOrUnifiedComp = (<span> unified <a onClick={this.props.switchToUnified} href="#"> split</a> </span>);
    }

    return (
      <ul>
      <li>{nounComp}</li>
      <li>{floatOrFoldComp}</li>
      <li>{splitOrUnifiedComp}</li>
      </ul>
    );
  }
});

export default ModalSwitcher;
