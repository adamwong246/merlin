import tMap from './tMap'

export default function treeWithTransactions (tree, transactions, tagData) {
   return tMap(tree, (b)=>{
    b.transactions = transactions.filter((t)=>{
     return b.patterns.filter((p)=>{return new RegExp(p).test(t.NAME)}).length > 0
    });
    return b
   })
   .concat({
    name: "???",
    children: [],
    transactions: transactions.filter((t) => {
     return tagData.filter((tg) => {
      return new RegExp(tg.pattern).test(t.NAME)
     }).length == 0;
    }),
    summation: "?"
   })
}
