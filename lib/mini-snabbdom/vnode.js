// 函数的功能非常简单，就是把传入的 5 个参数组合成对象返回
export default function vnode(sel, data, children, text, elm) {
  const key = data.key
  return {
    sel, data, children, text, elm, key
  }
}
