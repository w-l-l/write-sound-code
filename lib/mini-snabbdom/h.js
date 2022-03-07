import vnode from './vnode'

/*
  编写一个低配版本的 h 函数，这个函数必须接受 3 个参数，缺一不可
  相当于它的重载功能较弱
  也就是说，调用的时候形态必须是下面三种之一：
  形态① h('div', {}, '文字')
  形态② h('div', {}, [])
  形态③ h('div', {}, h())
*/
export default function h(sel, data, c) {
  // 检查参数个数
  if(arguments.length !== 3) throw new Error('对不起，h函数必须传入3个参数，我们是低配版h函数')
  // 检查参数 c 的类型
  if(typeof c === 'string' || typeof c === 'number') {
    // 说明现在 h 函数是形态①
    return vnode(sel, data, undefined, c, undefined)
  } else if(Array.isArray(c)) {
    // 说明现在 h 函数是形态②
    let children = []
    // 遍历 c，收集 children
    for(let i = 0; i < c.length; i++) {
      // 检查 c[i] 必须是一个对象，如果不满足
      if(!(typeof c[i] === 'object' && c[i].hasOwnProperty('sel'))) throw new Error('传入的数组参数中有项不是h函数的返回值')
      children.push(c[i])
    }
    return vnode(sel, data, children, undefined, undefined)
  } else if(typeof c === 'object' && c.hasOwnProperty('sel')) {
    // 说明现在 h 函数是形态③
    // 即，传入的 c 是唯一的 children。不用执行 c，因为 c 就是 h 函数返回的结果
    let children = [c]
    return vnode(sel, data, children, undefined, undefined)
  } else {
    throw new Error('传入的第三个参数类型不对')
  }
}
