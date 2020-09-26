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
  // - 如果 type 为函数，则说明是个函数组件
  // - 函数组件执行后，会返回一个 React 元素
  console.log(element)
  const { type, props } = element
  if (typeof type === 'function') { // 说明是类组件或者函数组件
    const componentInstance = new type(props)
    if (componentInstance.isReactComponent) { // 说明是类组件
      element = componentInstance.render()
    } else { // 是函数组件
      element = type(props)
    }
  }

  let dom = createDOM(element)
  container.appendChild(dom)
  // 下面的太复杂啦，牵扯出一堆 fiber 的玩意，先直接用最简单的实现了。
  // return legacyRenderSubtreeIntoContainer(
  //   null,
  //   element,
  //   container,
  //   false,
  //   callback,
  // )
}

export function createDOM (element) {
  const { type, props } = element
  const { children } = props
  let dom = document.createElement(type)
  for (let propName in props) {
    // 如果是 children 属性，需要特殊处理
    if (propName === 'children') {
      // 如果 children 是数组，则递归渲染每一项
      // 否则直接将 children 渲染到 DOM 上
      if (Array.isArray(children)) {
        children.forEach(item => render(item, dom))
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
    } else {
      // TODO 需判断 class，style，htmlFor 等
      dom.setAttribute(propName, props[propName])
    }
  }
  return dom
}