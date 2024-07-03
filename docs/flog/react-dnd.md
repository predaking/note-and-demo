# React-Dnd

`React-Dnd`，一个适用于 React 的拖拽库。介绍它之前先回顾下 H5 中的拖拽 api ，因为本质上`React-Dnd`也是基于此实现的。

## drag & drop

关于被拖拽元素，需要设置属性`draggable`为 true。与之相关的事件有：

+ `dragstart`: 开始拖拽时触发
+ `drag`: 拖拽过程中触发
+ `dragend`: 拖拽结束触发，在`drop`事件之后触发

***

关于拖拽目标元素，与之相关的事件有：

+ `dragenter`: 拖拽元素进入拖拽目标元素时触发
+ `dragover`: 拖拽元素在拖拽目标元素上移动时触发，间隔在几百毫秒
+ `dragleave`: 拖拽元素从拖拽目标元素上离开后触发
+ `drop`: 拖拽元素被放置到拖拽目标元素上时触发

***

> 因浏览器默认行为不允许放置元素，因此保证`drop`事件生效的条件是阻止`dragover`事件的默认行为

## 原理解析

`React-Dnd`整个工具库总体包含三大块核心：

![核心组成](../../assets/img/flog/react-dnd.excalidraw.png)

其中`React-Dnd`负责向下层提供api，内部通过`Dnd-core`处理拖拽逻辑，并通过`Backend`适配不同环境下的交互方式。

+ `React-Dnd`: 封装了`DragDropContext`、`Draggable`、`Droppable`等组件，提供了`useDrag`、`useDrop`等 hooks api。
+ `Dnd-core`: 提供了拖拽功能的核心逻辑与 api，并且不依赖于任何 UI 框架。主要负责处理拖放操作的的注册，拖动源和放置目标的管理，事件的分发等功能。
+ `Backend`: 处理具体的拖拽交互细节，不同的 backend 可支持不同的运行环境，例如 pc 端的拖拽事件、移动端的触摸事件等。

`React-Dnd`起始于一个通过`React.createContext`创建的高阶组件`DndProvider`。主要作用是包裹拖拽组件，控制拖拽行为，向下传递数据等。

```html
<DndProvider backend={HTML5Backend}>
    <Components {...props} />
</DndProvider>
```

使用过程中为`DndProvider`传递了一个`backend`属性，其值为`HTML5Backend`，它来自于`react-dnd-html5-backend`模块，意味着处理的是拖拽事件。