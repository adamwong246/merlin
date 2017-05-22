import React from 'react';

const Tags = ({tags}) =>{
  return (<ul>{tags.map((t) => {
    return (<li>
      {`${t.direction}, ${t.pattern} -> ${t.path}`}
    </li>);

  })}</ul>);
}
export default Tags;
