# Hooks

Hooks:

常用:  `useState`, `useEffect`, `useReducer`,`useCallback`, `useMemo`, `useRef`

其他:  `useContext`, `useInperativeHandle`, `useLayoutEffect`, `useDebugValue`

## useState:

* 适用于单个state

* 通过`Object.is`比较算法比较state，相同则不渲染，不同则替换state（类组件合并新旧state）并重新渲染

* 如果state的修改依赖于前值，则可以为setState传递一个函数，参数为前值

## useEffect:

* 接收一个副作用函数，作用相当于componentDidMount 与 componentDidUpdate,且异步进行，不会阻塞浏览器更新页面

* 可接受一个可选的包含相关依赖值的数组参数，之后只有在该数组中的依赖值发生改变才会调用副作用函数，作用相当于componentDidUpdate中的新旧值对比审查

* 副作用函数可以返回一个函数，这样返回函数就相当于放到了componentWillUnmount中执行，用来做一些清除工作

## useReducer:

* useState的替代方案，适用于复杂的state或多个state

* 设计理念来源于redux，接收三个参数：reducer，初始值，初始化函数（可选），其中reducer接收state与action，action接收来自dispatch分发的对象（根据type执行相应的更新）

## useCallback:

* 用于性能优化

* 父组件向子组件传递函数时可以用useCallback包裹，第二个参数可选，为父组件相关依赖值数组，仅在依赖值发生改变时子组件执行该函数，减少不必要渲染

* 子组件将传递的函数用作useEffect的依赖值，通过该值的引用比较决定是否执行副作用函数

* useCallback函数本身无法看出来是否进行了优化，可以通过在父组件`new Set()`设置栈记录函数的更新情况，或将传递的函数作为子组件的依赖值，二者的比较都是引用比较

## useMemo:

* 用于性能优化

* 用于缓存复杂的计算结果，原理与Vue中的Compute属性相似

* 用法同useCallback，只不过传递的是值，而非函数

## useRef:

* 用于绑定Dom节点

* useRef的current属性可以设置为任何可变值，且不会触发组件重新渲染（可以用来存储旧的 state 或 props，可以用来标定计时器，之后清除计时器等等）

* useRef绑定返回的ref对象在组件的生个生命周期保持不变
