/*
  Vue3 中的组合 API
    shallowReactive：浅响应
    reactive：深响应
    shallowReadonly：浅只读
    readonly：深只读
    shallowRef：浅响应
    ref：深响应
    isRef: 判断当前对象是否是 ref 对象
    isReactive：判断当前对象是否是 reactive 对象
    isReadonly：判断当前是否是 readonly 对象
    isProxy：判断当前对象是否是 reactive 对象或者 readonly 对象
*/

// 定义一个 reactiveHandler 处理对象
const reactiveHandler = {
  // 获取属性值
  get(target, prop) {
    if(prop === '_is_reactive') return true
    const result = Reflect.get(target, prop)
    console.log('拦截了读取数据', prop, result)
    return result
  },
  // 修改属性或者添加属性
  set(target, prop, value) {
    const result = Reflect.set(target, prop, value)
    console.log('拦截了修改数据或者添加属性', prop, value)
    return result
  },
  // 删除某个属性
  deleteProperty(target, prop) {
    const result = Reflect.deleteProperty(target, prop)
    console.log('拦截了删除属性', prop)
    return result
  }
}

// 定义一个 shallowReactive 函数，传入一个目标对象
export function shallowReactive(target) {
  // 判断传入的是否是对象类型，如果是，则进行 proxy 代理
  if(target && typeof target === 'object') return new Proxy(target, reactiveHandler)
  // 如果是基本类型，则直接返回
  return target
}

// 定义一个 reactive 函数，传入一个目标对象
export function reactive(target) {
  // 判断传入的是否是对象类型，如果是，则进行 proxy 代理
  if(target && typeof target === 'object') {
    // 对数组或者对象中的数据进行 reactive 递归处理
    if(Array.isArray(target)) {
      // 数组进行遍历操作
      target.forEach((item, index) => target[index] = reactive(item))
    } else {
      // 对象进行遍历操作
      Object.keys(target).forEach(key => target[key] = reactive(target[key]))
    }
    return new Proxy(target, reactiveHandler)
  }
  // 如果是基本类型，则直接返回
  return target
}

// 定义一个 readonlyHandler 处理器
const readonlyHandler = {
  get(target, prop) {
    if(prop === '_is_readonly') return true
    const result = Reflect.get(target, prop)
    console.log('拦截到了读取数据', prop, result)
    return result
  },
  set() {
    console.warn('只能读取数据，不能修改或者添加数据')
    return true
  },
  deleteProperty() {
    console.warn('只能读取数据，不能删除数据')
    return true
  }
}

// 定义一个 shallowReadonly 函数
export function shallowReadonly(target) {
  // 需要判断当前的数据是不是对象类型
  if(target && typeof target === 'object') return new Proxy(target, readonlyHandler)
  // 如果是基本类型，则直接返回
  return target
}

// 定义一个 readonly 函数
export function readonly(target) {
  // 需要判断当前的数据是不是对象类型
  if(target && typeof target === 'object') {
    // 对数组或者对象中的数据进行 readonly 递归处理
    if(Array.isArray(target)) {
      // 数组进行遍历操作
      target.forEach((item, index) => target[index] = readonly(item))
    } else {
      // 对象进行遍历操作
      Object.keys(target).forEach(key => target[key] = readonly(target[key]))
    }
    return new Proxy(target, readonlyHandler)
  }
  // 如果是基本类型，则直接返回
  return target
}

// 定义一个 shallowRef 函数
export function shallowRef(target) {
  return {
    // 标识当前的对象是 ref 对象
    _is_ref: true,
    // 保存传入的数据
    _value: target,
    get value() {
      console.log('劫持到了读取数据')
      return this._value
    },
    set value(val) {
      console.log('劫持到了修改数据，准备更新界面', val)
      this._value = val
    }
  }
}

// 定义一个 ref 函数
export function ref(target) {
  // 如果是对象，则进行 proxy 代理
  target = reactive(target)
  return {
    // 标识当前的对象是 ref 对象
    _is_ref: true,
    // 保存传入的数据
    _value: target,
    get value() {
      console.log('劫持到了读取数据')
      return this._value
    },
    set value(val) {
      console.log('劫持到了修改数据，准备更新界面', val)
      this._value = val
    }
  }
}

// 定义一个函数 isRef，判断当前对象是否是 ref 对象
export function isRef(o) {
  return !!(o && o._is_ref)
}

// 定义一个函数 isReactive，判断当前对象是否是 reactive 对象
export function isReactive(o) {
  return !!(o && o._is_reactive)
}

// 调定义一个函数 isReadonly，判断当前对象是否是 readonly 对象
export function isReadonly(o) {
  return !!(o && o._is_readonly)
}

// 定义一个函数 isProxy，判断当前对象是否是 reactive 对象或者 readonly 对象
export function isProxy(o) {
  return isReactive(o) || isReadonly(o)
}
