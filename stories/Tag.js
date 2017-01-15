import React from 'react';
import AccountTransactions from './AccountTransactions.js'

const Tag = ({ tag, transactions }) => {
 return (<tr>
  <td>{tag.name}, ({tag.pattern}), #{tag.id} </td>
  <td><AccountTransactions transactions={transactions} /> </td>
  <td> {transactions.reduce((memo, transaction) => Number(transaction.TRNAMT) + memo, 0)} </td>
 </tr>);
};

export default Tag;
