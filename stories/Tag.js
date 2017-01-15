import React from 'react';
import AccountTransactions from './AccountTransactions.js'

// const Tag = ({ name, tags }) => {
//  return (<div>
//   <span>{name}</span>
//   <Transactions transactions={transactions} />
//  </div>);
// };

const Tag = ({ tag, transactions }) => {
 return (<div>
  <span>{JSON.stringify(tag)}</span>
  <AccountTransactions transactions={transactions} />
 </div>);
};

export default Tag;
