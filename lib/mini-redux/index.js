/*
  redux 库的主模块
    1.redux 库向外暴露下面几个函数
      createStore(): 接收的参数为 reducer 函数, 返回为 store 对象
      combineReducers(): 接收包含 n 个 reducer 方法的对象, 返回一个新的 reducer 函数
      applyMiddleware(): 暂不实现

    2.store 对象的内部结构
      getState(): 返回值为内部保存的 state 数据
      dispatch(): 参数为 action 对象
      subscribe(): 参数为监听内部 state 更新的回调函数
*/

// 创建 store 对象
export function createStore(reducer) {
  // 存储状态数据，初始化调用 reducer 函数返回的结果
  let state = reducer(undefined, { type: '@@redux/init' })

  // 存储监听 state 更新的回调函数
  const listeners = []

  // 返回 state 数据
  function getState() {
    return state
  }

  // 分发 action
  function dispatch(action) {
    // 触发 reducer 调用，得到新的 state 并保存下来
    state = reducer(state, action)
    // 调用所有已存在的监听回调函数
    listeners.forEach(listener => listener())
  }

  // 绑定内部 state 改变的监听回调，可以给一个 store 绑定多个
  function subscribe(listener) {
    // 保存到 listeners 容器中
    listeners.push(listener)
  }

  // 返回 store 对象
  return {
    getState,
    dispatch,
    subscribe
  }
}

/* 
  整合传入参数对象的多个 reducer 函数，返回一个新的 reducer
  新的 reducer 管理的总状态为对象：{ r1: state1, r2: state2 }

  reducers 结构：
    {
      r1: (state = initState, action) => {...},
      r2: (state = initState, action) => {...}
    }

  返回的总状态结构：
    {
      r1: r1(state.r1, action),
      r2: r2(state.r2, action)
    }
*/
export function combineReducers(reducers) {
  // 返回一个新的 reducer 函数
  return (state = {}, action) => {
    // 执行 reducers 中的每个 reducer 函数得到一个新的子状态，并添加到总状态空对象中
    return Object.keys(reducers).reduce((totalState, key) => {
      totalState[key] = reducers[key](state[key], action)
      return totalState
    }, {})
  }
}
