export default function tMap (tree, callback) {
  return tree.map((b)=>{
   b = callback(b);
   b.children = tMap(b.children, callback);
   return b;
  })
}
