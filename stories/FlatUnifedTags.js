import React from 'react';
import Tag from './Tag.js'

const FlatUnifedTags = ({ tags }) => {
 const tagComps = tags.map((tag) => {
   return (
    <tr>
     <td>
      {JSON.stringify(tag)}
     </td>
    </tr>
   )
 })

 return (
  <table>
     {tagComps}
  </table>
 )
};

export default FlatUnifedTags;
