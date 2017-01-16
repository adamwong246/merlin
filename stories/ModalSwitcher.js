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
      nounComp = (<a onClick={this.props.switchToTran} href="#"> tag</a>)
    } else if (this.props.noun == 'tran'){
      nounComp = (<a onClick={this.props.switchToTag} href="#"> tran</a>)
    }

    if (this.props.flatOrFold == 'flat'){
      floatOrFoldComp = (<a onClick={this.props.switchToFold} href="#"> flat</a>)
    } else if (this.props.flatOrFold == 'fold'){
      floatOrFoldComp = (<a onClick={this.props.switchToFlat} href="#"> fold</a>)
    }

    if (this.props.splitOrUnified == 'split'){
      splitOrUnifiedComp = (<a onClick={this.props.switchToUnifed} href="#"> split</a>)
    } else if (this.props.splitOrUnified == 'unified'){
      splitOrUnifiedComp = (<a onClick={this.props.switchToSplit} href="#"> unified</a>)
    }

    return (
      <div style={styles.main}> {nounComp} {floatOrFoldComp} {splitOrUnifiedComp}
      </div>
    );
  }
});

export default ModalSwitcher;
