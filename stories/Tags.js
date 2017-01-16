import React from 'react';
import Tag from './Tag.js'

const Tags = ({ ofcData, tags }) => {
 const transList = ofcData.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN;

 const groupedTransactions = tags.map((tag) => {
   const transactions = transList.filter((transaction) => new RegExp(tag.pattern).test(transaction.NAME));
   return (<Tag tag={tag} transactions={transactions} />)
 });

 const untaggedTransactions = transList.filter((transaction) => {
   return tags.filter((tag) => new RegExp(tag.pattern).test(transaction.NAME)).length == 0;
 });

 return (
  <table>
    {groupedTransactions}
    <h2> untaggedTransactions </h2>
    <Tag tag={{"name":"?"}} transactions={untaggedTransactions} />
  </table>
 )
};

export default Tags;
