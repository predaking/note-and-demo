# 目录

+ javascript
+ React
+ database
+ other

## javascript

### Array

#### 改变原数组

`push`
`pop`
`shift`
`unshift`
`splice`
`reverse`
`sort`
`fill`

#### 不改变原数组

`reduce`
`some`
`every`
`slice`
`concat`
`find`
`entries`
`filter`
`repeat`
`toUpperCase`
`toLowerCase`


#### 可能改变原数组
`forEach`

### String

+ `String.prototype.charAt`与下标方式获取字符有何区别？

区别如下：
1、IE6-8（未经测试）不兼容下标获取，均返回`undefined`，`charAt`则可以正常使用
2、当查询字符超出字符串范围时，`charAt`返回空字符串`''`，而下标获取到的值为`undefined`
3、下标获取会造成误解，让人误以为目标是数组，且可写

### Function

+ 关于箭头函数：

1、箭头函数没有自己的this，arguments，super或new.target。
2、它的this、arguments都是在定义函数时绑定外层的this和arguments，而不是在执行过程中绑定的，所以不会因为调用者不同而发生变化。
3、箭头函数若想得到自身的入参列表arguments，必须使用剩余参数表示法。
4、箭头函数表达式更适用于那些本来需要匿名函数的地方，并且它不能用作构造函数

+ 关于纯函数：

函数式编程中，改变或变更叫做 mutation，这种改变的结果叫做“副作用”（side effect）。 理想情况下，函数应该是不会产生任何副作用的 pure function

### 杂项

## React

### 杂项

+ react为何推荐用jsx代替js？

JSX可以更好地描述UI本来就应该具有的交互形式，React认为渲染逻辑与UI逻辑本身就存在耦合，比如在UI上面绑定事件，组件状态发生变化后通知UI进行相应的变化，以及在UI中展示准备好的数据。

## 数据库基础

+ 事务（transaction）的四大原则（ACID）：

1、原子性（atomicity）：事务往往包含许多操作，事务成功的条件是事务包含的所有操作都完成，只要有任何一步操作失败事务都算失败，需要回滚；
2、一致性（consistency）：数据库要一直处于一致的状态，事务的执行要遵循数据库一致性，例如对于a+b=10约束，如果事务修改了a，那么也必须修改b使结果一致，否则事务失败；
3、独立性（isolation）：数据库的并发事务不会相互影响，如果一个事务正在访问的数据库正在被修改，只要正在做修改的事务并未提交成功那么其他并发的事务访问的数据就不会改变，即不会受到未提交事务的影响；
4、持久性（durability）：事务一旦提交成功，那么对数据库的改变是永久的，即使发生宕机也不影响。

## other

### 性能优化

+ 前端性能优化方式有哪些？？？

1、减少http请求
- 尽量减少外部（第三方）脚本数量
- 尽可能分别合并js与css到一个文件
- 尽可能使用图标代替图片
- 利用CSS sprites代替多张图片
- 图片懒加载
- 缓存请求结果
- 使用内容分发网络CDN

2、压缩字体文件
