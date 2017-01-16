import React, { Component, PropTypes } from 'react'

export default class FoldTags extends Component {

  render() {

    const { children } = this.props

    return (
      <ul className="tags">
        {children.map(t =>
          <li key={t.id} className="tag">
            <span>{t.name}</span>
            {t.children && <FoldTags children={t.children}/>}
          </li>
        )}
      </ul>
    )

  }

}

FoldTags.propTypes = {
  children: PropTypes.array.isRequired
}
