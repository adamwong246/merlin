import React from 'react';
import FlatUnifiedTags from './FlatUnifiedTags.js';

const FlatUnifiedTrans = ({ tags, transactions }) => {

 return (
  <table>
     {transactions.map((transaction) => {
       return (
        <tr>
         <td>{transaction.NAME}</td>
         <td>{transaction.TRNAMT}</td>
        </tr>
       )
     })}
  </table>
 )
};

export default FlatUnifiedTrans;
