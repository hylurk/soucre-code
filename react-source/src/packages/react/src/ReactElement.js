/**
 * 判断是否具有有效的 ref 属性
 * @param {*} config 
 */
function hasValidRef (config) {
  return config.ref !== undefined
}
/**
 * 判断是否具有有效的 key 属性
 * @param {*} config 
 */
function hasValidKey (config) {
  return config.key !== undefined
}

const hasOwnProperty = Object.prototype.hasOwnProperty
// 保留的属性，防止重复添加
const RESERVED_PROPS = {
  key: true,
  ref: true, 
  __self: true,
  __source: true,
}
/**
 * 这个才是真正的创建 React 元素的方法
 * @param {*} type 
 * @param {*} key 
 * @param {*} ref 
 * @param {*} self 
 * @param {*} source 
 * @param {*} owner 
 * @param {*} props 
 */
const ReactElement = function (type, key, ref, self, source, owner, props) {
  const element = {
    // 用来确定是 React 元素的唯一标识
    $$typeof: Symbol.for('react.element'),
    type: type,
    key: key,
    ref: ref,
    props: props,
    // 记录负责创建该元素的组件
    _owner: owner,
  }
  // self 和 source 是 dev 环境才用到的属性
  return element
}

/**
 * 创建并返回一个 React 元素
 * @param {} type 元素类型
 * @param { null | object} config 元素属性，从源码可以看出，这个 config 是不能不传的，如果没有，就传 null
 * @param {} children 可以有很多个 ,该参数是一个一个传的，并不是放了个数组，因为儿子可以为字符串、数字等类型
 */
export function createElement (type, config, children) {
  let propName
  // 整合属性
  const props = {}
  let key = null
  let ref = null
  let self = null
  let source = null

  // 处理 config 参数
  if (config != null) {
    // 判断如果 config.ref 不为 undefined
    if (hasValidRef(config)) {
      ref = config.ref
    }
    // 判断如果 config.key 不为 undefined
    if (hasValidKey(config)) {
      key = '' + config.key
    }

    self = config.__self === undefined ? null : config.__self
    source = config.__source === undefined ? null : config.__source

    // 将其余属性添加到新的 props 对象上
    for (propName in config) {
      // 如果是自身具有的属性，并且不属于保留的属性，则全部添加到 props 对象上
      if (
        hasOwnProperty.call(config, propName) &&
        !RESERVED_PROPS.hasOwnProperty(propName)
      ) {
        props[propName] = config[propName]
      }
    }
  }

  // 处理 children 参数
  // 源码处理的有点怪，此处如果接受参数的时候，直接解构 ...children 为数组，那么可以直接用数组来处理
  const childrenLength = arguments.length - 2 // 获取所有的 children 长度
  if (childrenLength === 1) {
    // 如果只有一个 children ，则直接将其赋值给 props 的 children 属性
    props.children = children
  } else if (childrenLength > 1) {
    // 创建一个与 children 参数个数相同的空数组
    // 然后将每一个 children 放到数组每一项中
    // 最后将整个数组挂载到 props.children 属性上
    const childArray = Array(childrenLength)
    for (let i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2]
    }
    props.children = childArray
  }
  // 返回一个 React 元素
  return ReactElement(
    type,
    key,
    ref,
    self,
    source,
    null, // owner 涉及到了 fiber ，先不考虑，传个 null
    props,
  )
}