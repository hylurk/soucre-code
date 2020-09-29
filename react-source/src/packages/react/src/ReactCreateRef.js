/**
 * 生成 ref 对象
 */
export function createRef () {
  const refObject = {
    current: null,
  }
  return refObject
}