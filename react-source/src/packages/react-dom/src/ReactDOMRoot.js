import {
  ELEMENT_NODE,
  COMMENT_NODE,
  DOCUMENT_NODE,
  DOCUMENT_FRAGMENT_NODE,
} from './shared/HTMLNodeType'

/**
 * 判断是否是有效的 DOM 容器
 * 如果该节点存在，并且属于 element 节点、document 节点、fragment 节点
 * 或者是 nodeValue 为特定字符串的注释节点
 * 注：文本节点不是有效的容器
 * @param {*} node 
 */
export function isValidContainer (node) {
  return !!(
    node &&
    (node.nodeType === ELEMENT_NODE ||
      node.nodeType === DOCUMENT_NODE ||
      node.nodeType === DOCUMENT_FRAGMENT_NODE ||
      (node.nodeType === COMMENT_NODE &&
        node.nodeValue === ' react-mount-point-unstable '))
  )
}