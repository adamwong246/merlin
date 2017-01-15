import React from 'react';
import Tag from './Tag.js'

const Tags = ({ ofcData, tagsData }) => {
 const transList = ofcData.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN;

 const groupedTransactions = tagsData.map((tag) => {
   const transactions = transList.filter((transaction) => new RegExp(tag.pattern).test(transaction.NAME));
   return (<Tag tag={tag} transactions={transactions} />)
 });

 return (
  <div>
  <ul>
    {groupedTransactions}
  </ul>
  </div>
 )
};

// AccountTransactions.propTypes = {
//   children: React.PropTypes.string.isRequired,
//   onClick: React.PropTypes.func,
// };

export default Tags;
