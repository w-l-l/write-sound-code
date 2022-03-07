import createElement from './createElement'
import updateChildren from './updateChildren'

// 对不同一个虚拟节点
export default function patchVnode(oldVnode, newVnode) {
  // 判断新旧 vnode 是否是同一个对象
  if(oldVnode === newVnode) return
  // 判断新 vnode 也没有 text 属性
  if(newVnode.text !== undefined && (newVnode.children === undefined || newVnode.children.length === 0)) {
    // 新 vnode 有 text 属性
    if(newVnode.text !== oldVnode.text) oldVnode.elm.innerText = newVnode.text
  } else {
    // 新 vnode 没有 text 属性，有 children
    // 判断老的有没有 children
    if(oldVnode.children !== undefined && oldVnode.children.length > 0) {
      // 老的有 children，新的也有 children，此时就是最复杂的情况
      updateChildren(oldVnode.elm, oldVnode.children, newVnode.children)
    } else {
      // 老的没有 children，新的有 children
      // 清空老的节点的内容
      oldVnode.elm.innerHTML = ''
      // 遍历新的 vnode 的子节点，创建 DOM，上树
      for(let i = 0; i < newVnode.children.length; i++) {
        const dom = createElement(newVnode.children[i])
        oldVnode.elm.appendChild(dom)
      }
    }
  }
}
