import React from 'react';
import AccountTransaction from './AccountTransaction.js'

const AccountTransactions = ({ transactions }) => {
 return (
   <table>
    <tr>
      <th>TRNTYPE</th>
      <th>DTPOSTED</th>
      <th>FITID</th>
      <th>NAME</th>
      <th>MEMO</th>
      <th>TRNAMT</th>
    </tr>
    { transactions.map((e) => <AccountTransaction transaction={e} ></AccountTransaction>)}

    {}
   </table>
 )
};

// AccountTransactions.propTypes = {
//   children: React.PropTypes.string.isRequired,
//   onClick: React.PropTypes.func,
// };

export default AccountTransactions;
