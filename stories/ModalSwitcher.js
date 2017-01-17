import React from 'react';

const styles = {
  main: {
    margin: 15,
    maxWidth: 600,
    lineHeight: 1.4,
    fontFamily: '"Helvetica Neue", Helvetica, "Segoe UI", Arial, freesans, sans-serif',
  },

  logo: {
    width: 200,
  },

  link: {
    color: '#1474f3',
    textDecoration: 'none',
    borderBottom: '1px solid #1474f3',
    paddingBottom: 2,
  },

  code: {
    fontSize: 15,
    fontWeight: 600,
    padding: "2px 5px",
    border: "1px solid #eae9e9",
    borderRadius: 4,
    backgroundColor: '#f3f2f2',
    color: '#3a3a3a',
  },
};

var ModalSwitcher = React.createClass({
 getInitialState() {
   return { };
  },

  render() {
    var nounComp;
    var floatOrFoldComp;
    var splitOrUnifiedComp;

    if (this.props.noun == 'tag'){
      nounComp = (<span> <a onClick={this.props.switchToTran} href="#">tags</a> transactions </span>);
    } else if (this.props.noun == 'tran'){
      nounComp = (<span> tags <a onClick={this.props.switchToTag} href="#">transactions</a> </span>);
    }

    if (this.props.flatOrFold == 'flat'){
      floatOrFoldComp = (<span><a onClick={this.props.switchToFold} href="#"> flat</a> fold</span>)
    } else if (this.props.flatOrFold == 'fold'){
      floatOrFoldComp = (<span>flat <a onClick={this.props.switchToFlat} href="#"> fold</a></span>)
    }

    if (this.props.splitOrUnified == 'split'){
      splitOrUnifiedComp = (<span> unified <a onClick={this.props.switchToUnified} href="#"> split</a> </span>)
    } else if (this.props.splitOrUnified == 'unified'){
      splitOrUnifiedComp = (<span> <a onClick={this.props.switchToSplit} href="#"> unified</a> split </span>)
    }


    return (
      <ul>
      <li>{floatOrFoldComp}</li>
      <li>{splitOrUnifiedComp}</li>
      <li>{nounComp}</li>
      </ul>
    );
  }
});

export default ModalSwitcher;
