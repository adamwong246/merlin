import React from 'react';

const FlatUnifiedTransTagMatcher = ({tags, transaction}) => {
 const dump = tags.filter((t) => new RegExp(t.pattern).test(transaction.NAME));
 return(<span>{JSON.stringify(dump)}</span>)
}

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
          <FlatUnifiedTransTagMatcher tags={tags} transaction={transaction} />
         </td>
        </tr>
       )
     })}
  </table>
 )
};

export default FlatUnifiedTrans;
