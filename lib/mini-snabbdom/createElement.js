// 真正创建节点，将 vnode 创建为 DOM
export default function createElement(vnode) {
  // 创建一个 DOM 节点
  let domNode = document.createElement(vnode.sel)
  // 有子节点还是有文本？
  if(vnode.text && (vnode.children === undefined || vnode.children.length === 0)) {
    // 内部是文字
    domNode.innerText = vnode.text
  } else if(Array.isArray(vnode.children) && vnode.children.length > 0) {
    // 它内部是子节点，就要递归创建节点
    for(let i = 0; i < vnode.children.length; i++) {
      // 得到当前 child
      const ch = vnode.children[i]
      // 创建出它的 DOM，一旦调用 createElement 意味着：创建出 DOM 了，并且它的 elm 属性指向了创建出的 DOM，但是还没上树，是一个孤儿节点
      const chDom = createElement(ch)
      // 上树
      domNode.appendChild(chDom)
    }
  }
  // 补充 elm 属性并返回，elm 属性是一个纯 DOM 对象
  return vnode.elm = domNode
}
