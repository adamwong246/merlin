import React from 'react';
import AccountTransaction from './AccountTransaction.js'

const AccountTransactions = ({ transList }) => {
 return (
   <table>
    <tr>
     <th>tag</th>
      <th>TRNTYPE</th>
      <th>DTPOSTED</th>
      <th>TRNAMT</th>
      <th>FITID</th>
      <th>NAME</th>
      <th>MEMO</th>
    </tr>
    { transList.map((e) => <AccountTransaction transaction={e} ></AccountTransaction>)}
   </table>
 )
};

// AccountTransactions.propTypes = {
//   children: React.PropTypes.string.isRequired,
//   onClick: React.PropTypes.func,
// };

export default AccountTransactions;
