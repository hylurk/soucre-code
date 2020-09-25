// import React from 'react';
// import ReactDOM from 'react-dom'

import React, { createElement }from './packages/react/index'
import ReactDOM from './packages/react-dom/index'

import './index.css'

// console.group('react', React)
// console.groupEnd()
// console.group('react-dom', ReactDOM)
// console.groupEnd()

// let ele = <div className="App" style="{{ background-color: blue; font-size: 20px;}}">5555555</div>
// console.log(ele)

let ele = React.createElement('h1', { className: 'hhhh', style: {color: 'blue'}}, 'heiheihei', createElement('span', { id:"sss" }, '啦啦啦'))
console.log(ele)
ReactDOM.render(
  ele,
  document.getElementById('root')
);
