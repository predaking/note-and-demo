# node 核心模块

## 全局方法

### setImmediate

`setImmediate`方法接收一个回调函数，用于在完成其他任务后执行一些繁重的任务，属于宏任务，目前大部分浏览器不支持，适用于 node 环境。通常使用`setTimeout`作为降级方案。

node环境下`setImmediate`与`setTimeout`的执行顺序是不确定的，取决于事件循环任务队列的启动快慢，如果在1ms左右内启动，则`setImmediate`先执行，否则`setTimeout`先执行。

## process

### process.nextTick

该方法属于微任务，执行时机为当前所有微任务队列任务的前面，但并非事件循环中的一部分。

## 其它

### event loop

与浏览器事件循环不同，node环境下事件循环分几个阶段：

| 名称 | 概念 |
| - | - |
| timer | 该阶段执行`setTimeout`与`setInterval`到时的回调任务 |
| pending callbacks | 在此阶段执行一些错误回调（例，TCP连接错误）|
| idle, prepare | node内部使用 |
| poll | 执行该阶段队列中的任务或执行到时得timer从而进入下一轮loop |
| check | 执行`setImmediate`中的回调任务 |
| close callbacks | 执行某些句柄的`close`回调 |

在执行过程中，会把每个阶段的队列任务一次性执行完，再进入下个阶段，微任务队列在每个阶段变化时穿插执行。
