import { ReactNode } from "react";
import { Component } from "react";


// 错误边界 捕获组件内和组件子组件的错误
export default class ErrorBoundary extends Component<{children: ReactNode }> {
  state = {
    hasError: false,
    error: null as any
  }
  // 捕获到错误 可以替换到组件内的state
  static getDerivedStateFromError(error: any) {
    return {
      hasError: true,
      error
    }
  }
  render() {
    // console.log(this.state)
    if (this.state.hasError) {
      return this.state.error!.errMsg
    }
    return this.props.children
  }
}