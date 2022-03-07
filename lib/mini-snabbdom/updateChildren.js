import patchVnode from './patchVnode'
import createElement from './createElement'

// 判断是否是同一个虚拟节点
function checkSameVnode(a, b) {
  return a.sel === b.sel && a.key === b.key
}

export default function updateChildren(parentElm, oldCh, newCh) {
  // 旧前
  let oldStartIdx = 0
  // 新前
  let newStartIdx = 0
  // 旧后
  let oldEndIdx = oldCh.length - 1
  // 新后
  let newEndIdx = newCh.length - 1
  // 旧前节点
  let oldStartVnode = oldCh[oldStartIdx]
  // 旧后节点
  let oldEndVnode = oldCh[oldEndIdx]
  // 新前节点
  let newStartVnode = newCh[newStartIdx]
  // 新后节点
  let newEndVnode = newCh[newEndIdx]

  let keyMap = null

  // 循环判断
  while(oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    // 首先不是判断①②③④命中，而是要略过已经加 undefined 标记的东西
    if(oldStartVnode == null || oldCh[oldStartIdx] == undefined) {
      oldStartVnode = oldCh[++oldStartIdx]
    } else if(oldEndVnode == null || oldCh[oldEndIdx] == undefined) {
      oldEndVnode = oldCh[--oldEndIdx]
    } else if(newStartVnode == null || newCh[newStartIdx] == undefined) {
      newStartVnode = newCh[++newStartIdx]
    } else if(newEndVnode == null || newCh[newEndIdx] == undefined) {
      newEndVnode = newCh[--newEndIdx]
    } else if(checkSameVnode(newStartVnode, oldStartVnode)) {
      // ①新前和旧前
      patchVnode(oldStartVnode, newStartVnode)
      newStartVnode = newCh[++newStartIdx]
      oldStartVnode = oldCh[++oldStartIdx]
    } else if(checkSameVnode(newEndVnode, oldEndVnode)) {
      // ②新后和旧后
      patchVnode(oldEndVnode, newEndVnode)
      newEndVnode = newCh[--newEndIdx]
      oldEndVnode = oldCh[--oldEndIdx]
    } else if(checkSameVnode(newEndVnode, oldStartVnode)) {
      // ③新后和旧前
      patchVnode(oldStartVnode, newEndVnode)
      // 当③新后和旧前命中的时候，此时要移动节点。移动新后指向的这个节点到老节点的旧后的后面
      parentElm.insertBefore(oldStartVnode.elm, oldEndVnode.elm.nextSibling)
      newEndVnode = newCh[--newEndIdx]
      oldStartVnode = oldCh[++oldStartIdx]
    } else if(checkSameVnode(newStartVnode, oldEndVnode)) {
      // ④新前和旧后
      patchVnode(oldEndVnode, newStartVnode)
      // 当④新前和旧后命中的时候，此时要移动节点。移动新前指向的这个节点到老节点的旧前的前面
      parentElm.insertBefore(oldEndVnode.elm, oldStartVnode.elm)
      newStartVnode = newCh[++newStartIdx]
      oldEndVnode = oldCh[--oldEndIdx]
    } else {
      // 四种情况都没命中
      // 制作 keyMap 一个映射对象，这样就不用每次都遍历老对象了
      if(!keyMap) {
        keyMap = {}
        // 从 oldStartIdx 开始，到 oldEndIdx 结束，创建 keyMap 映射对象
        for(let i = oldStartIdx; i <= oldEndIdx; i++) {
          const key = oldCh[i].key
          if(key != undefined) keyMap[key] = i
        }
      }
      // 寻找当前这项 newStartIdx 在 keyMap 中的映射的位置序号
      const idxInOld = keyMap[newStartVnode.key]
      if(idxInOld == undefined) {
        // newStartVnode 是全新的项，现在还不是真正的 DOM 节点
        parentElm.insertBefore(createElement(newStartVnode), oldStartVnode.elm)
      } else {
        // newStartVnode 不是全新的项，而是要移动
        const elmToMove = oldCh[idxInOld]
        patchVnode(elmToMove, newStartVnode)
        // 把这项设置为 undefined，表示我已经处理完这项了
        oldCh[idxInOld] = undefined
        // 移动，调用 insertBefore 进行移动
        parentElm.insertBefore(elmToMove.elm, oldStartVnode.elm)
      }
      // 指针下移，只移动新前的指针
      newStartVnode = newCh[++newStartIdx]
    }
  }
  // 继续看看有没有剩余的，循环结束了 start 还比 end 小
  if(newStartIdx <= newEndIdx) {
    // new 还有剩余节点没有处理，要加项，要把所有剩余的节点，都要插入到 oldStartIdx 之前
    // 遍历新的 newCh，添加到老的没有处理的之前
    for(let i = newStartIdx; i <= newEndIdx; i++) {
      // insertBefore 方法可以自动识别 null，如果是 null 就会自动排到队尾去，和 appendChild 是一致的
      // newCh[i] 现在还不是真正的 DOM，所以要调用 createElement() 函数变成 DOM
      parentElm.insertBefore(createElement(newCh[i]), oldCh[oldStartIdx].elm)
    }
  } else if(oldStartIdx <= oldEndIdx) {
    // old 还有剩余节点没有处理，要删除这些项
    // 批量删除 oldStartIdx 和 oldEndIdx 之间的项
    for(let i = oldStartIdx; i <= oldEndIdx; i++) {
      if(oldCh[i]) parentElm.removeChild(oldCh[i].elm)
    }
  }
}
