import React, { Component, PropTypes } from 'react'

var FoldUnifedTransTag = React.createClass({
 getInitialState() {
   return { hide: 0 };
  },
  onClick () {
   if (this.state.hide){
    this.setState({ hide: 0 });
   } else {
    this.setState({ hide: 1 });
   }
  },
  render() {

    const { tag } = this.props

    return (<li key={tag.id} className="tag">
      <a href="#"onClick={this.onClick}> { this.state.hide == 0 ? <span>hide</span> :  <span>show</span> } </a>

      <span><b>{tag.name},</b> {tag.summation} </span>

      { this.state.hide == 0 ?
       <table >
            {tag.summation < 0 ? <tr >
              <td>sum</td>
              <td>{tag.summation}</td>
            </tr> : null}

             {tag.transactions.map(t =>
               <tr key={t.id} className="transaction">
                 <td>{t.NAME}</td><td>{t.TRNAMT}$</td>
               </tr>
             )}
      </table> : null }


      { this.state.hide == 0 ? <FoldUnifedTrans children={tag.children}/> : null }

    </li>)

  }
}
);

export default class FoldUnifedTrans extends Component {

  onClick () {
   alert("foo")
  }
  render() {

    const { children } = this.props

    return (
      <ul className="tags">
        {children.map(c => <FoldUnifedTransTag tag={c} /> )}
      </ul>
    )

  }

}

FoldUnifedTrans.propTypes = {
  children: PropTypes.array.isRequired
}
