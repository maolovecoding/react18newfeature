/** 
 * react Suspence原理 大概就是这样的
*/
import { Component } from 'react'

export interface ISuspenceProps{
  fallback: React.ReactNode
  children: React.ReactNode
}
// 类组件实现
export default class extends Component<ISuspenceProps> {
  state = {
    loading: false
  }
  componentDidCatch(err: any) {
    console.log('---', err)
    if (typeof err.then === 'function') {
      // 类promise对象
      this.setState({ loading: true }) // 加载中 组件渲染
      err.then(() => {
        this.setState({ loading: false }) // 二次渲染
      })
    }
  }

  render() {
    // console.log('Suspence') 
    const { children, fallback } = this.props
    const { loading } = this.state
    return loading ? fallback : children
  }
}