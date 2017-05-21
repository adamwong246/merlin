const add = function(a, b) {
  return a+b;
}

const transactions = [
  {name: "a", amount: 1}, {name:"b", amount:2}
];

const filters = [
  {pattern: "a", path: "alpha"}, {pattern: "b", path: "alpha.beta"}
];

const collisionMap = {
  "alpha": {
    "a": true, "b": false
  },
  "alpha.beta": {
     "a":false, "b": true
   }
};

const filteredTransactions = [
  {name:"a", amount:1, filters: [{pattern:"a", path:"alpha"]}},
  {name:"b", amount:2, filters: [{pattern:"b", path:"alpha.beta"}]} 
]

const transactedFilters = [
  {pattern:"a", path:"alpha", transactions:[ {name:"a", amount:1}]},
  {pattern:"b", path:"alpha.beta", transactions:[{name:"b", amount:2}]} 
];

const TableAndTreeTree = [
  {
    path:"alpha", 
    value: 3,
    children: [
      {
        path:"alpha.beta",
        value: 2,
	children: [],
        transactions: [{name:"b", amount:2}]
     }
    ],
    transactions:[{name:"a", amount:a}]
  }
];


describe('add', () => {
  it('should add two numbers', () => {
    expect(add(1, 2)).toBe(3);
  });

  it(
});
