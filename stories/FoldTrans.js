import React, { Component, PropTypes } from 'react'

export default class FoldTrans extends Component {

  render() {

    const { children } = this.props

    return (
      <ul className="tags">
        {children.map(c =>
          <li key={c.id} className="tag">
            <span>{c.name}</span>

            <ul>
             {c.transactions.map(t =>
               <li key={t.id} className="transaction">
                 <span>{t.NAME}, {t.TRNAMT}$</span>
               </li>
             )}
            </ul>

            {c.children && <FoldTrans children={c.children}/>}
          </li>
        )}
      </ul>
    )

  }

}

FoldTrans.propTypes = {
  children: PropTypes.array.isRequired
}
