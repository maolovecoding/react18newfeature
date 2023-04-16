/** 
 * react18批量更新 有优先级 优先级一样的合并
 * */


let isBatchingUpdate = false;
let state = 0

let updateQueue = []
function setState(newState) {
  let update = {payload: newState, priority: 0} // 多了优先级的说法
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