import React from 'react';

const FlatUnifiedTags = ({ tags }) => {
 const tagComps = tags.map((tag) => {
   return (
    <li>{JSON.stringify(tag)}</li>
   )
 })

 return (
  <ul>
     {tagComps}
  </ul>
 )
};

export default FlatUnifiedTags;
