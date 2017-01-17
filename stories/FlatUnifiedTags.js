import React from 'react';

const FlatUnifiedTags = ({ tags }) => {
 const tagComps = tags.map((tag) => {
   return (
    <li>{`${tag.direction}, ${tag.pattern} -> ${tag.path}`}</li>
   )
 })

 return (
  <ul>
     {tagComps}
  </ul>
 )
};

export default FlatUnifiedTags;
