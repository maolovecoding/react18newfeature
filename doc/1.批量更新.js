
/**
react 更新是异步的 是批量的
实现原理：
1. 同步模式
2. 异步模式
*/

// 1.同步模式
let isBatchingUpdate = false;
let state = 0

let updateQueue = []
function setState(newState) {
  if (isBatchingUpdate) {
    updateQueue.push(newState)
  } else {
    state = newState
  }
}
function click() {
  isBatchingUpdate = true
  setState(state + 1) // 操作
  setState(state + 1) // 操作
  setTimeout(() => {
    setState(state + 1) // 操作
    setState(state + 1) // 操作
  }, 0)
  isBatchingUpdate = false
}
click();
state = updateQueue.pop();

console.log(state)
setTimeout(() => {
  console.log(state)
}, 0)