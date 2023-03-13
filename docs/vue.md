# VUE

## nextTick原理

vue中可以使用`nextTick`方法实现在 DOM 更新完毕后执行一个回调，其中可以获取到更新后的 DOM。适用于在视图更新之后基于新的视图执行操作。

**实现原理** 首先定义好回调函数`flushCallbacks`，之后优先判断是否支持`Promise`，是则在`Promise`的`then`方法后执行回调，否则继续判断是否支持`MutationObserver`，是则在`MutationObserver`实例回调中执行`flushCallbacks`，否则继续判断是否支持`setImmediate`，最后利用`setTimeout`作最后的降级兜底方案。

整个实现过程涉及到事件循环机制，优先考虑通过微任务实现，用宏任务实现降级兜底，这是为了考虑浏览器与移动端的兼容性。