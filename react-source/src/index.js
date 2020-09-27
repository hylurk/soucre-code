// import React from 'react'
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
// class Welcome extends React.Component {
//   render () {
//     return React.createElement('h1', {
//       className: 'frist',
//       style: { color: 'blue' }
//     }, 'Hello, ', React.createElement('span', null, this.props.name))
//   }
// }
// console.log(<Welcome />)
// ReactDOM.render(
//   <Welcome name="陛下" />,
//   document.getElementById('root')
// )

// 5. 支持类组件设置状态并且使用 setState() 改变状态
class Welcome extends React.Component {
  constructor (props) {
    super(props)
    // 类组件的状态必须声明在构造函数中
    this.state = {
      date: new Date(),
      count: 0
    }
  }
  componentDidMount () {
    this.timer = setInterval(() => {
      // 改变状态会使视图更新
      this.setState({
        date: new Date()
      })
    }, 1000)
  }
  handleClick = () => {
    // setState 具有合并属性，以及异步的效果
    this.setState({
      count: this.state.count + 1
    }, () => {
      console.log(this.state.count)
    }) 
    console.log(this.state.count)
    this.setState({
      count: this.state.count + 1
    }, () => {
      console.log(this.state.count)
    })
    console.log(this.state.count)
  }
  render () {
    return (
      <div className="title">
        <h2>你好，{this.props.name}</h2>
        <h3>我是标题</h3>
        <h4>当前时间：{this.state.date.toLocaleTimeString()}</h4>
        <p>你已经点了我 <span>{this.state.count}</span> 次</p>
        <button onClick={this.handleClick}>点我将加 1</button>
      </div>
    )
  }
}

ReactDOM.render(
  <Welcome name="陛下" />,
  document.getElementById('root'),
  () => {
    console.log(22)
  }
)
