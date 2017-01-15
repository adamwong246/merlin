import React from 'react';

const AccountTransaction = ({ transaction }) => {
 return (
  <tr>
    <td>{transaction.TRNTYPE}</td>
    <td>{transaction.DTPOSTED}</td>
    <td>{transaction.FITID}</td>
    <td>{transaction.NAME}</td>
    <td>{transaction.MEMO}</td>
    <td>{transaction.TRNAMT}</td>
  </tr>);
};

export default AccountTransaction;
