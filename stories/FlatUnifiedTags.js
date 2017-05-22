import React from 'react';

const FlatUnifiedTags = ({ tags }) => {
 const tagComps = tags.filter((t)=>t.pattern).map((tag) => {
   return (
    <li>{`${tag.direction}, ${tag.pattern} -> ${tag.id}`}</li>
   )
 })

 return (
  <ul>
     {tagComps}
  </ul>
 )
};

export default FlatUnifiedTags;
