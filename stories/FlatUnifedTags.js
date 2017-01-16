import React from 'react';
import Tag from './Tag.js'

const FlatUnifedTags = ({ tagsData }) => {
 const tagComps = tagsData.map((tag) => {
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
