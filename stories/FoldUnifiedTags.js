import React, { Component, PropTypes } from 'react'

var FoldUnifiedTag = React.createClass({
  getInitialState() { return { hide: 0 }; },

  onClick () {
   if (this.state.hide){
    this.setState({ hide: 0 });
   } else {
    this.setState({ hide: 1 });
   }
  },

  render () {
   const { tags } = this.props

   return (
    <ul className="tags">
      {tags.map(t =>
        <li key={t.id} className="tag">
          <span>{t.name}</span>
          {t.tags && <FoldUnifiedTag tags={t.tags}/>}
        </li>
      )}
    </ul>
  )
 }
});


export default class FoldUnifiedTags extends Component {
  render() {
    const { tags } = this.props

    var foldedTags = [];
    for (var i = 0; i < tags.length; i++) {
        var chain = tags[i].path.split(",").slice(1);

        var currentNode = foldedTags;
        for (var j = 0; j < chain.length; j++) {
            var wantedNode = chain[j];
            var lastNode = currentNode;
            for (var k = 0; k < currentNode.length; k++) {
                if (currentNode[k].name == wantedNode) {
                    currentNode = currentNode[k].tags;
                    break;
                }
            }
            // If we couldn't find an item in this list of tags
            // that has the right name, create one:
            if (lastNode == currentNode) {
                var newNode = currentNode[k] = {name: wantedNode, tags: []};
                currentNode = newNode.tags;
            }
        }
    }
    return (<FoldUnifiedTag tags={foldedTags}/>)
  }
}

FoldUnifiedTags.propTypes = {
  tags: PropTypes.array.isRequired
}
