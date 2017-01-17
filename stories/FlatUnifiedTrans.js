import React from 'react';
import FlatUnifiedTags from './FlatUnifiedTags.js';

const FlatUnifiedTrans = ({ tags, transactions }) => {

 return (
  <table>
     {transactions.map((transaction) => {
       return (
        <tr>
         <td>
          <td>{transaction.NAME}</td>
         </td>
         <td>
          <FlatUnifiedTags tags={tags.filter((t) => new RegExp(t.pattern).test(transaction.NAME)) } />
         </td>
        </tr>
       )
     })}
  </table>
 )
};

export default FlatUnifiedTrans;
