# react18 new feature

## 并发模式 concurrent mode

- 在React 18中新加入的可选的并发渲染(concurrent rendering)机制
- Concurrent 模式是一组 React 的新功能，可帮助应用保持响应，并根据用户的设备性能和网速进行适当的调整
- 在 Concurrent 模式中，渲染不是阻塞的。它是可中断的

### 更新优先级

- 以前更新没有优先级的概念,优先级高的更新并不能打断之前的更新,需要等前面的更新完成后才能进行
- 用户对不同的操作对交互的执行速度有不同的预期,所以我们可以根据用户的预期赋予更新不同的优先级
  - 高优先级 用户输入、窗口缩放和拖拽事件等
  - 低优先级 数据请求和下载文件等
- 高优先级的更新会中断正在进行的低优先级的更新
- 等高优先级更新完成后,低优先级基于高优先级更新的结果重新更新
- 对于 `CPU-bound` 的更新 (例如创建新的 DOM 节点和运行组件中的代码)，并发意味着一个更急迫的更新可以“中断”已经开始的渲染

### 双缓冲

- 当数据量很大时，绘图可能需要几秒钟甚至更长的时间，而且有时还会出现闪烁现象，为了解决这些问题，可采用双缓冲技术来绘图
- [双缓冲](https://wiki.osdev.org/Double_Buffering)即在内存中创建一个与屏幕绘图区域一致的对象，先将图形绘制到内存中的这个对象上，再一次性将这个对象上的图形拷贝到屏幕上，这样能大大加快绘图的速度
- 对于 `IO-bound`的更新 (例如从网络加载代码或数据)，并发意味着 React 甚至可以在全部数据到达之前就在内存中开始渲染，然后跳过令人不愉快的空白加载状态

## Suspense

- Suspense 让你的组件在渲染之前进行`等待`，并在等待时显示`fallback`的内容
- Suspense内的组件子树比组件树的其他部分拥有更低的优先级
- 执行流程
  - 在render函数中我们可以使用异步请求数据
  - react会从我们缓存中读取这个缓存
  - 如果有缓存了，直接进行正常的render
  - 如果没有缓存，那么会抛出一个promise异常
  - 当这个promise完成后(比发请求数据完成)，react会继续回到原来的render中，把数据render出来
  - 完全同步写法，没有任何异步`callback`之类的东西
- React提供了一个内置函数`componentDidCatch`,如果 `render()` 函数抛出错误，则会触发该函数
- ErrorBoundary(错误边界)是一个组件，该组件会捕获到渲染期间(render)子组件发生的错误，并有能力阻止错误继续传播

## startTransition

- [startTransition](https://zh-hans.reactjs.org/docs/concurrent-mode-reference.html)
- startTransition 是一个接受回调的函数。我们用它来告诉 React 需要推迟的 state
- 允许组件将速度较慢的数据获取更新推迟到随后渲染，以便能够立即渲染更重要的更新

```tsx
import { ChangeEvent, startTransition, useEffect, useState } from 'react';

// 搜索的联想，要先响应用户输入框，更新输入框，然后更新联想搜索区域的内容
// 输入很快的时候 打断联想的更新，先响应输入框更新

export default function () {
  const [keyword, setKeyword] = useState('')
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value)
    startTransition(() => setKeyword(e.target.value))
  }
  return (
    <div>
      关键字 <input value={keyword} onChange={handleChange} />
      <Suggestions keyword={ keyword } />
    </div>
  )
}

function Suggestions(props: { keyword: string; }) {
  const [words, setWords] = useState<string[]>([])
  useEffect(() => {
    getWords(props.keyword).then(words => {
      // setWords(words)  // 会很卡顿
      // 开启渐变更新 本质就是低优先级更新了
      startTransition(() => setWords(words))
    })
  }, [props.keyword])
  return (
    <ul>
      {
        words.map(val => <li key={val}>{ val }</li>)
      }
    </ul>
  )
}

function getWords(keyword: string) {
  let words = new Array(10000).fill(0).map((item:number, index:number) => keyword+index)
  return new Promise<string[]>((resolve, reject) => {
    resolve(words)
  })
}
```

## useDeferredValue

- 返回一个延迟响应的值
- 在`useDeferredValue`内部会调用useState并触发一次更新,但此更新的优先级很低

算是startTransition的语法糖。

```tsx
import { ChangeEvent, startTransition, useEffect, useState, useDeferredValue } from 'react';

// 搜索的联想，要先响应用户输入框，更新输入框，然后更新联想搜索区域的内容
// 输入很快的时候 打断联想的更新，先响应输入框更新

export default function () {
  const [keyword, setKeyword] = useState('')
  let deferredText = useDeferredValue(keyword)
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value)
  }
  return (
    <div>
      关键字 <input value={keyword} onChange={handleChange} />
      <Suggestions keyword={ deferredText } />
    </div>
  )
}

function Suggestions(props: { keyword: string; }) {
  const [words, setWords] = useState<string[]>([])
  useEffect(() => {
    getWords(props.keyword).then(words => {
      setWords(words)
    })
  }, [props.keyword])
  return (
    <ul>
      {
        words.map(val => <li key={val}>{ val }</li>)
      }
    </ul>
  )
}

function getWords(keyword: string) {
  let words = new Array(5000).fill(0).map((item:number, index:number) => keyword+index)
  return new Promise<string[]>((resolve, reject) => {
    resolve(words)
  })
}
```

## useTransition

- `useTransition`允许组件在切换到下一个界面之前等待内容加载，从而避免不必要的加载状态
- 它还允许组件将速度较慢的数据获取更新推迟到随后渲染，以便能够立即渲染更重要的更新
- useTransition hook 返回两个值的数组
  - startTransition 是一个接受回调的函数。我们用它来告诉 React 需要推迟的 state
  - isPending 是一个布尔值。这是 React 通知我们是否正在等待过渡的完成的方式
- 如果某个 state 更新导致组件挂起，则该 state 更新应包装在 transition 中

```tsx
import { Suspense, useState, useTransition } from "react";

const initialResource = createResource(fetchUser(1))
export default function () {
  const [resource, setResource] = useState(initialResource)
  const handleClick = () => {
    setResource(createResource(fetchUser(2)))
  }
  return (
    <div>
      <button onClick={handleClick}> 下一个用户 </button>
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
```

点击按钮，会出现加载中。这是正常的，但是我们希望不出现加载中，而是请求到数据后再渲染，体验更好。

```tsx
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
```

## ErrorBoundary

错误边界组件的实现：

```tsx
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
```

**一个错误边界的官方的库：** `react-error-boundary`
