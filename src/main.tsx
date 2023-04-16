import ReactDOM from 'react-dom/client';
import BatchState from './demo/BatchState';
import Suspence from './demo/Suspence';
import StartTransition from './demo/StartTransition';
import DeferredValue from './demo/useDeferredValue';
import Transition from './demo/useTransition';
// 旧模式 legacy 渲染是同步的
// ReactDOM.render(<App/>, root)

const App = () => {
  return <div>
    {/* <BatchState/> */}
    <Suspence />
    {/* <StartTransition /> */}
    {/* <DeferredValue /> */}
    {/* <Transition /> */}
  </div>
}

// 新模式 默认是并发渲染模式
ReactDOM.createRoot(document.getElementById('root')!)
  .render(<App />);