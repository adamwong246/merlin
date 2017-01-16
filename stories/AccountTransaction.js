import React from 'react';

const AccountTransaction = ({ transaction }) => {
 return (
  <tr>
    <td>{transaction.DTPOSTED}</td>
    <td>{transaction.NAME}</td>
    <td>{transaction.TRNAMT}</td>
  </tr>);
};

export default AccountTransaction;
