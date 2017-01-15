import React from 'react';
import AccountTransactions from './AccountTransactions.js'

const OfcViewer = ({ ofcData }) => {
 return (
  <div>
   <span> {JSON.stringify(ofcData, null, 2)}</span>
   <AccountTransactions transList={ofcData.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN}/>
    </div>
 )
};

// AccountTransactions.propTypes = {
//   children: React.PropTypes.string.isRequired,
//   onClick: React.PropTypes.func,
// };

export default OfcViewer;
