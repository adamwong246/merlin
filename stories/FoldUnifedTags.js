import React, { Component, PropTypes } from 'react'

export default class FoldUnifedTags extends Component {

  render() {

    const { children } = this.props

    return (
      <ul className="tags">
        {children.map(t =>
          <li key={t.id} className="tag">
            <span>{t.name}</span>
            {t.children && <FoldUnifedTags children={t.children}/>}
          </li>
        )}
      </ul>
    )

  }

}

FoldUnifedTags.propTypes = {
  children: PropTypes.array.isRequired
}
