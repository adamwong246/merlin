import React from 'react';
import Tag from './Tag.js'

const FlatUnifedTransTagMatcher = ({tags, transaction}) => {
 const dump = tags.filter((t) => new RegExp(t.pattern).test(transaction.NAME));
 return(<span>{JSON.stringify(dump)}</span>)
}

const FlatUnifedTrans = ({ tags, transactions }) => {
 const tagComps = transactions.map((transaction) => {
   return (
    <tr>
     <td>
      <td>{transaction.NAME}</td>
     </td>
     <td>
      <FlatUnifedTransTagMatcher tags={tags} transaction={transaction} />
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

export default FlatUnifedTrans;
