import { Suspense, useState, useTransition } from "react";

const initialResource = createResource(fetchUser(1))
export default function () {
  const [resource, setResource] = useState(initialResource)
  const [isPending, startTranstion] = useTransition()
  const handleClick = () => {
    startTranstion(() => setResource(createResource(fetchUser(2))))
  }
  return (
    <div>
      <button onClick={handleClick}> 下一个用户 </button>
      {
        isPending ? '正在后台加载数据' : ''
      }
      <Suspense fallback={<div>加载中......</div>}>
        <User resource={resource} />
      </Suspense>
    </div>
  )
}

// React.lazy原理
function createResource(promise: Promise<{ success: boolean;  data: {id: number, name: string}}>) {
  let status = 'pending'; // 等待
  let res: any
  return {
    read() {
      if (status === 'success' || status === 'error') { 
        // 抛出的promise会被Suspense组件拿到 等promise状态改变后会再次尝试渲染组件 此时就可以拿到真正的结果了
        return res
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

function User(props: {resource:any}) {
  const res = props.resource.read()
  if(res.success)
    return <div>{ res.data.name}</div>
  return null
}

function fetchUser(id: number) {
  return new Promise<{ success: boolean;  data: {id: number, name: string}}>((resolve, reject) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {id , name: '张三' + id }
      })
    }, 3000)
  })
}