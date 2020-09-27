import {
  updateComponent,
} from '../../react-dom'
/**
 * React 里面用来继承的基础组件类
 * 其实完全可以用 class 来实现，但是源码依然采用了 function
 * @param {*} props 
 * @param {*} context 
 * @param {*} updater 
 */
function Component (props, context, updater) {
  this.props = props
  this.context = context
  this.refs = {}
  // TODO updater 暂不处理，过于复杂
  // 对应源码 packages/react/src/ReactBaseClasses.js 27行
  this.updater = updater
  // 发布订阅方式实现 setState 方法
  this.updateQueue = [] // 缓存临时的更新队列
  this.isBatchingUpdate = false // 当前是否处于批量更新：true 是，false 不是
}
// 一些静态属性绑在了 Component 的原型上，避免每个实例都要生成一份
// 是否是 react 类组件，为了区分是类组件还是函数组件
// 源码是个对象，我们简版改成 boolean
Component.prototype.isReactComponent = true

// 我们也可以使用一下 class 的方式来实现
// class Component {
//   constructor (props, context, updater) {
//     this.props = props
//     this.context = context
//     this.refs = {}
//     // TODO updater 暂不处理，过于复杂
//     // 对应源码 packages/react/src/ReactBaseClasses.js 27行
//     this.updater = updater
//   }
//   static isReactComponent = true
// }

/**
 * 定义 setState 方法
 * @param {*} partialState 
 * @param {*} callback 
 */
Component.prototype.setState = function(partialState, callback = () => {}) {
  // 判断传进来的 state 必须是 function 或者 object 或者 null
  if (typeof partialState !== 'function' && typeof partialState !== 'object' && partialState !== null) {
    throw new Error('setState(...): takes an object of state variables to update or a function which returns an object of state variables.')
  }
  // TODO
  // 这块源码没看懂，先用发布订阅方式简单实现了
  this.updateQueue.push(partialState)
  if (!this.isBatchingUpdate) { // 如果不是处于批量更新模式，则直接更新
    this.forceUpdate()
  }
}

/**
 * 强制更新 DOM
 * @param {*} callback 更新完毕之后执行回调
 */
Component.prototype.forceUpdate = function(callback = () => {}) {
  const latestState = this.updateQueue.reduce((accumulator, currentValue) => {
    const nextState = typeof currentValue === 'function' ? currentValue(this.state) : currentValue
    return {...accumulator, ...nextState}
  }, this.state)
  this.state = latestState
  this.updateQueue = []
  updateComponent(this)
  callback()
}

export {
  Component,
}
