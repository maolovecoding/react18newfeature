import { Component, Suspense } from "react";
import ErrorBoundary from "./components/ErroyBoundary";
// import Suspense from './components/Suspence'
export default class extends Component {
  render() {
    return (
      <div>
        <div>header</div>
      <Suspense fallback={<div>加载中......</div>}>
        <ErrorBoundary>
        <User></User>
      </ErrorBoundary>
      </Suspense>
      </div>
    )
  }
}

// 希望同步调用
// function User() {
//   const res = await fetchUser()
//   if(res.success)
//     return <div>{ res.data.name}</div>
//   return null
// }

// React.lazy原理
function createResource(promise: Promise<{ success: boolean;  data: {id: number, name: string}}>) {
  let status = 'pending'; // 等待
  let res: any
  return {
    read() {
      if (status === 'success') { 
        // 抛出的promise会被Suspense组件拿到 等promise状态改变后会再次尝试渲染组件 此时就可以拿到真正的结果了
        return res
      } else if (status === 'error') {
        throw res
      }
      else {
        // 第一次是等待 所以来到这里抛出一个promise 会被Suspence组件拦截到
        throw promise.then(data => {
          status = 'success'
          res = data
        }, err => {
          status = 'error'
          res = err
        })
      }
    }
  }
}
const userResource = createResource(fetchUser())

function User() {
  const res = userResource.read()
  if(res.success)
    return <div>{ res.data.name}</div>
  return null
}

function fetchUser() {
  return new Promise<{ success: boolean;  data: {id: number, name: string}}>((resolve, reject) => {
    setTimeout(() => {
      // resolve({
      //   success: true,
      //   data: {id:1,name: '张三'}
      // })
      reject({errMsg: '出现错误......'})
    }, 1000)
  })
}