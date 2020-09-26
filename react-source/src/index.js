// import React from 'react';
// import ReactDOM from 'react-dom'

import React from './packages/react/index'
import ReactDOM from './packages/react-dom/index'

import './index.css'

// console.group('react', React)
// console.groupEnd()
// console.group('react-dom', ReactDOM)
// console.groupEnd()

// 1. 实现 createElement() 方法，渲染出 react 元素
// let ele = React.createElement('h1', { className: 'first', style: {color: 'blue'}}, 'Hello, ', createElement('span', { id:"mySpan" }, 'World'))
// console.log(ele)

// 2. 实现 render() 方法，将 react 元素挂载到真实 DOM 上
// ReactDOM.render(
//   ele,
//   document.getElementById('root')
// )

// 3. 支持渲染函数组件，并实现 state 传入
// function Welcome (props) {
//   return React.createElement('h1', {
//     className: 'frist',
//     style: { color: 'blue' }
//   }, 'Hello, ', React.createElement('span', null, props.name))
// }
// console.log(<Welcome />)
// ReactDOM.render(
//   <Welcome name="陛下" />,
//   document.getElementById('root')
// )

// 4. 支持渲染类组件，并实现 state 传入
class Welcome extends React.Component {
  render () {
    return React.createElement('h1', {
      className: 'frist',
      style: { color: 'blue' }
    }, 'Hello, ', React.createElement('span', null, this.props.name))
  }
}
console.log(<Welcome />)
ReactDOM.render(
  <Welcome name="陛下" />,
  document.getElementById('root')
)
