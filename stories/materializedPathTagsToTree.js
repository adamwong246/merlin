import React, { Component, PropTypes } from 'react'

// http://stackoverflow.com/a/6232943/614612
export default function materializedPathTagsToTree (tags) {
 var foldedTags = [];
 for (var i = 0; i < tags.length; i++) {
     var chain = tags[i].path.split(",").slice(1);

     var currentNode = foldedTags;
     for (var j = 0; j < chain.length; j++) {
         var wantedNode = chain[j];
         var lastNode = currentNode;
         for (var k = 0; k < currentNode.length; k++) {
             if (currentNode[k].name == wantedNode) {
                //  currentNode[k].patterns = currentNode[k].patterns.concat(tags[i].pattern);
                 currentNode = currentNode[k].children;
                 break;
             }
         }
         // If we couldn't find an item in this list of children
         // that has the right name, create one:
         if (lastNode == currentNode) {
             var newNode = currentNode[k] = {
              name: wantedNode,
              children: [],
              patterns: [tags[i].pattern]
             };
             currentNode = newNode.children;
         }
     }
 }
 return foldedTags;
}
