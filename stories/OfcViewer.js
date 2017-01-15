import React from 'react';
import AccountTransactions from './AccountTransactions.js'

const OfcViewer = ({ ofcData, tagsData }) => {
 const transList = ofcData.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN;

 const transactions = transList.map((transaction) => {

   transaction.tags = tagsData
   .filter((tag) => new RegExp(tag.pattern).test(transaction.NAME))
   // .map((tag) => tag);

   return transaction
 })

 return (
  <div>
   <AccountTransactions transactions={transactions}/>
    </div>
 )
};

// AccountTransactions.propTypes = {
//   children: React.PropTypes.string.isRequired,
//   onClick: React.PropTypes.func,
// };

export default OfcViewer;
