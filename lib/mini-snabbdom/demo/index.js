import h from '../h'
import patch from '../patch'

const vnodeOne = h('ul', {}, [
  h('li', { key: 'A' }, 'A'),
  h('li', { key: 'B' }, 'B'),
  h('li', { key: 'C' }, 'C'),
  h('li', { key: 'D' }, 'D'),
  h('li', { key: 'E' }, 'E')
])

// 得到盒子和按钮
const container = document.getElementById('container')
const btn = document.getElementById('btn')

// 第一次上树
patch(container, vnodeOne)

// 新节点
const vnodeTwo = h('ul', {}, [
  h('li', { key: 'Q' }, 'Q'),
  h('li', { key: 'T' }, 'T'),
  h('li', { key: 'A' }, 'A'),
  h('li', { key: 'B' }, 'B'),
  h('li', { key: 'Z' }, 'Z'),
  h('li', { key: 'C' }, 'C'),
  h('li', { key: 'D' }, 'D'),
  h('li', { key: 'E' }, 'E')
])

btn.onclick = function() {
  patch(vnodeOne, vnodeTwo)
}
