# React 源码学习

## jsx是什么？react为何推荐用jsx代替js？

JSX为`React.createElement()`的语法糖

JSX可以更好地描述UI本来就应该具有的交互形式，React认为渲染逻辑与UI逻辑本身就存在耦合，比如在
UI上面绑定事件，组件状态发生变化后通知UI进行相应的变化，以及在UI中展示准备好的数据。

## React setState是同步还是异步？过程是什么样的？

1、在React合成事件中已经生命周期中的操作是异步的，计时器及js原生事件中是同步的。实际更新需要根据`isBatchUpdate`判断该同步更新还是异步更新

2、setState过程：更新state，创建virtual Dom，并利用diff算法比对差异，决定渲染哪一部分以及如何渲染，最后形成最新的UI。

## 从createRoot到render一个div发生了什么

createRoot阶段：createRoot => createFiberRoot => listenToAllSupportedEvents（合成事件逻辑）=> createElement

render阶段：

## 疑问

```javascript
function createRoot$1(container, options) {
  {
    if (!Internals.usingClientEntryPoint && !false) { // 为何要多余!false
      error('You are importing createRoot from "react-dom" which is not supported. ' + 'You should instead import it from "react-dom/client".');
    }
  }

  return createRoot(container, options);
}
```