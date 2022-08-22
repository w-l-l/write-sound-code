import { Component, createContext } from 'react'
import PropTypes from 'prop-types'
/*
  react-redux 库的主模块
    1.react-redux 向外暴露了 2 个 API
      Provider 组件类
      connect 函数
    2.Provider 组件
      接收 store 属性
      让所有容器组件都可以看到 store，从而通过 store 读取/更新状态
    3.connect 函数
      接收 2 个参数：mapStateToProps 和 mapDispatchToProps
      mapStateToProps：为一个函数，用来指定向 UI 组件传递哪些一般属性
      mapDispatchToProps：为一个函数或者对象，用来指定向 UI 组件传递哪些函数属性
      connect() 执行的返回值为一个高阶组件：包装 UI 组件，返回一个新的容器组件
      容器组件会向 UI 组件传入前面指定的一般/函数类型属性
*/

// 创建 context 容器对象
const storeContext = createContext()

/*
  用来向所有容器组件提供 store 的组件类
  通过 context 向所有的容器组件提供 store
*/
export class Provider extends Component {
  // 声明接收 store
  static propTypes = {
    store: PropTypes.object.isRequired
  }

  // // 声明提供的 context 的数据名称和类型
  // static childContextTypes = {
  //   store: PropTypes.object
  // }

  // // 向所有声明子组件提供包含要传递数据的 context 对象
  // getChildContext(){
  //   return {
  //     store: this.props.store
  //   }
  // }

  // render() {
  //   // 返回渲染 <Provider /> 的所有子节点
  //   return this.props.children
  // }

  render() {
    const { store, children } = this.props
    // 通过 value 属性给后代传递 store 数据，返回渲染 <Provider /> 的所有子节点
    return <storeContext.Provider value={{store}}>{children}</storeContext.Provider>
  }
}

/*
  connect 高阶函数：接收 mapStateToProps 和 mapDispatchToProps 两个参数，返回一个高阶组件函数
  高阶组件：接收 UI 组件，返回一个容器组件
*/
export function connect(mapStateToProps, mapDispatchToProps) {
  // 返回高阶组件函数
  return UIComponent => {
    // 返回容器组件
    return class ContainerComponent extends Component {
      // // 声明接收的 context 数据的名称和类型
      // static contextTypes = {
      //   store: PropTypes.object
      // }

      // 容器组件向 UI 组件传递的一般属性
      state = {}
      // 容器组件向 UI 组件传递的函数属性
      dispatchProps = {}
      
      // 声明接收 context
      static contextType = storeContext

      constructor(props, context) {
        super(props)

        // 得到 store
        const { store } = context

        // 得到包含所有一般属性的对象
        const stateProps = mapStateToProps(store.getState())
        // 将所有一般属性作为容器的状态数据
        this.state = { ...stateProps }

        // 得到包含所有函数属性的对象
        let dispatchProps = {}
        if(typeof mapDispatchToProps === 'function') {
          // mapDispatchToProps 为函数的处理方式
          dispatchProps = mapDispatchToProps(store.dispatch)
        } else {
          // mapDispatchToProps 为对象的处理方式
          dispatchProps = Object.keys(mapDispatchToProps).reduce((pre, key) => {
            pre[key] = (...args) => store.dispatch(mapDispatchToProps[key](...args))
            return pre
          }, {})
        }
        // 保存到组件上
        this.dispatchProps = dispatchProps

        // 绑定 store 的 state 变化的监听
        store.subscribe(_ => { // store 内部的状态数据发生改变触发
          // 更新容器组件 ==> UI 组件更新
          this.setState({ ...mapStateToProps(store.getState()) })
        })
      }

      render() {
        const { state, dispatchProps } = this
        // 返回 UI 组件的标签并传递相应的数据
        return <UIComponent {...state} {...dispatchProps} />
      }
    }
  }
}
