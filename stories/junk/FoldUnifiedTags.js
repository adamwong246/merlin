import React, { Component, PropTypes } from 'react'

import materializedPathTagsToTree from './materializedPathTagsToTree'

var FoldUnifiedTag = React.createClass({

  render () {
   const { tags } = this.props

   return (
    <ul className="tags">
      {tags.map(t =>
        <li key={t.id} className="tag">
          <span>
           {t.name} <code>{t.patterns}</code>
          </span>
          {t.children && <FoldUnifiedTag tags={t.children}/>}
        </li>
      )}
    </ul>
  )
 }
});


export default class FoldUnifiedTags extends Component {
  render() {
    const { tags } = this.props
    const matPath = materializedPathTagsToTree(tags);

    return (<FoldUnifiedTag tags={matPath}/>)
  }
}

FoldUnifiedTags.propTypes = {
  tags: PropTypes.array.isRequired
}
