import { isValidContainer } from './ReactDOMRoot'

// TODO 没看懂这块想干啥，对应源码：packages/react-dom/src/client/ReactDOMLegacy.js 113行
// 疯了，这块涉及到 fiber ，很复杂，先 pass 了，最终创建的是一个 FiberRootNode 对象
// 创建根节点容器
// function legacyCreateRootFromDOMContainer (container) {
//   let rootSibling
//   while ((rootSibling = container.lastChild)) {
//     container.removeChild(rootSibling)
//   }
//   return createLegacyRoot(container)
// }

// 这块涉及到 fiber 的节能机制以及服务端渲染的玩意，暂时先不看
// 遇到 fiber 或者 hydrate 就直接忽略了
// function legacyRenderSubtreeIntoContainer (
//   parentComponent,
//   children,
//   container,
//   forceHydrate,
//   callback,
// ) {
//   // 先看是否是根元素
//   let root = container._reactRootContainer
//   if (!root) { // 如果不是根节点
//     root = container._reactRootContainer = legacyCreateRootFromDOMContainer(container)
//   }
// }

/**
 * 自我实现，渲染 children 节点与根节点分开
 * @param {*} parentComponent 
 * @param {*} children 
 * @param {*} container 
 */
function legacyRenderSubtreeIntoContainer(parentComponent, child, container) {
  // ===== 以下为简版实现 =====
  // 如果传过来的是字符串或者数字，直接当做文本节点插入
  if (typeof child === 'string' || typeof child === 'number') {
    return container.appendChild(document.createTextNode(child))
  }
  // 否则，根据 type 生成对应的 element 标签
  // - 如果 type 为函数，则说明是个函数组件或者类组件
  // - 函数组件执行后，会返回一个 React 元素
  child.rootComponent = parentComponent
  const { type, props } = child
  if (typeof type === 'function') { // 说明是类组件或者函数组件
    const componentInstance = new type(props)
    if (componentInstance.isReactComponent) { // 说明是类组件
      if (props.ref) {
        props.ref.current = componentInstance
      }
      child = componentInstance.render()
      child.rootComponent = componentInstance
    } else { // 是函数组件
      child = type(props)
    }
  }
  let dom = createDOM(child)
  container.appendChild(dom)
}
/**
 * ReactDOM 核心渲染 DOM 的方法
 * @param { react element } element 要渲染的 react 元素
 * @param { node } container 被渲染元素的容器
 * @param { Function } callback 渲染执行完毕之后的回调函数
 */
export function render (element, container, callback) {
  // 如果不是有效的 DOM 容器，则抛出异常
  if (!isValidContainer(container)) {
    throw new Error('Target container is not a DOM element.')
  }
  // ===== 以下为简版实现 =====
  // 如果传过来的是字符串或者数字，直接当做文本节点插入
  if (typeof element === 'string' || typeof element === 'number') {
    return container.appendChild(document.createTextNode(element))
  }
  // 否则，根据 type 生成对应的 element 标签
  // - 如果 type 为函数，则说明是个函数组件或者类组件
  // - 函数组件执行后，会返回一个 React 元素
  const { type, props } = element
  let componentInstance = null
  if (typeof type === 'function') { // 说明是类组件或者函数组件
    componentInstance = new type(props)
    if (componentInstance.isReactComponent) { // 说明是类组件
      if (element.ref) {
        element.ref.current = componentInstance
      }
      // 类组件生命周期函数 - componentWillMount
      componentInstance.componentWillMount && componentInstance.componentWillMount()
      element = componentInstance.render()
      element.rootComponent = componentInstance
    } else { // 是函数组件
      element = type(props)
    }
  }
  let dom = createDOM(element)
  // 如果是类组件，让组件的实例的 dom 属性指向这个类组件创建出来的真实 DOM
  if (element.rootComponent) {
    element.rootComponent.dom = dom
  }
  container.appendChild(dom)
  // 类组件生命周期函数 - componentDidMount
  componentInstance?.componentDidMount && componentInstance.componentDidMount()
  if (typeof callback === 'function') {
    callback()
  }
  // 下面的太复杂啦，牵扯出一堆 fiber 的玩意，先直接用最简单的实现了。
  // return legacyRenderSubtreeIntoContainer(
  //   null,
  //   element,
  //   container,
  //   false,
  //   callback,
  // )
}

/**
 * 合成事件，在事件处理函数执行前，要将批量更新模式设置为 true，缓存新状态，实现异步更新
 * 将所有的事件委托到 document 上
 * @param {*} target 要绑定事件的 DOM
 * @param {*} eventType 事件类型
 * @param {*} listener 事件处理函数
 * @param {*} componentInstance 组件实例
 */
function addEvent(target, eventType, listener, componentInstance) {
  let eventStore = target.eventStore || (target.eventStore = {})
  eventStore[eventType] = {
    listener,
    componentInstance
  }
}
document.addEventListener('click', dispatchEvent, false)
function dispatchEvent(event) {
  let {type, target} = event
  while (target) {
    const { eventStore } = target
    if (eventStore) {
      const { listener, componentInstance } = eventStore['on' + type]
      if (listener) {
        if (componentInstance) {
          componentInstance.isBatchingUpdate = true
        }
        listener.call(null, event)
        if (componentInstance) {
          componentInstance.isBatchingUpdate = false
          componentInstance.forceUpdate()
        }
      }
    }
    target = target.parentNode
  }
}

/**
 * 创建真实 DOM 元素
 * @param {react 元素} element 
 */
export function createDOM (element) {
  const { type, props, rootComponent } = element
  let { ref } = element
  const { children } = props
  let dom = document.createElement(type)
  for (let propName in props) {
    // 如果是 children 属性，需要特殊处理
    if (propName === 'children') {
      // 如果 children 是数组，则递归渲染每一项
      // 否则直接将 children 渲染到 DOM 上
      if (Array.isArray(children)) {
        // 此时重复调用 render 会引起后续的副作用，比如导致记录不了一些组件状态 isBatchingUpdate 等
        // 单独提出来另一个方法来实现
        children.forEach(item => legacyRenderSubtreeIntoContainer(rootComponent, item, dom))
      } else {
        render(children, dom)
      }
    } else if (propName === 'className') {
      dom.className = props[propName]
    } else if (propName === 'style') {
      let styles = props[propName]
      for (let style in styles) {
        dom.style[style] = styles[style]
      }
    } else if (propName.startsWith('on')) { // 绑定事件
      addEvent(dom, propName.toLowerCase(), props[propName], element.rootComponent)
    } else {
      // TODO 需判断 class，style，htmlFor 等
      dom.setAttribute(propName, props[propName])
    }
  }
  if (ref) {
    if (typeof ref === 'string') { // ref 是一个字符串，不推荐
      element.rootComponent.refs[ref] = dom
    } else if (typeof ref === 'function') { // ref 是一个函数，不推荐
      ref.call(element.rootComponent, dom)
    } else if (typeof ref === 'object') { // ref 是一个对象，推荐，支持函数组件，上面两种只支持类组件
      ref.current = dom
    }
  }
  return dom
}

/**
 * 只是简版实现，跟源码不同
 * @param {*} componentInstance 组件实例
 */
export function updateComponent(componentInstance) {
  // 把旧 DOM 节点替换成新的 DOM 节点
  const element = componentInstance.render()
  element.rootComponent = componentInstance
  const latestDOM = createDOM(element)
  componentInstance.dom.parentNode.replaceChild(latestDOM, componentInstance.dom)
  componentInstance.dom = latestDOM
}