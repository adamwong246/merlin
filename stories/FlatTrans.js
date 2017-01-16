import React from 'react';
import Tag from './Tag.js'

const FlatTransTagMatcher = ({tags, transaction}) => {
 const dump = tags.filter((t) => new RegExp(t.pattern).test(transaction.NAME));
 return(<span>{JSON.stringify(dump)}</span>)
}

const FlatTrans = ({ tags, transactions }) => {
 const tagComps = transactions.map((transaction) => {
   return (
    <tr>
     <td>
      <td>{transaction.NAME}</td>
     </td>
     <td>
      <FlatTransTagMatcher tags={tags} transaction={transaction} />
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

export default FlatTrans;
