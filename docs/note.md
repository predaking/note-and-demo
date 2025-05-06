# 目录

+ [javascript](#javascript)
+ [typescript](#typescript)
+ [database](#数据库)
+ [other](#other)

## javascript

### Number

#### 为什么0.1 + 0.2 不等于 0.3

在js中浮点数使用IEEE754双精度标准表示的，十进制小数相加是要转化为二进制进行存储与计算的，此时某些小数就无法完整的用二进制表示，类似整数1/3除不尽一样，就会出现精度问题。

#### isNaN 与 Number.isNaN 有何区别

`isNaN`在判断是否为`NaN`时，会先转化为`number`型再去判断，容易曲解其本来的作用。而`Number.isNaN`更严谨的进行直接判断，参数是`NaN`就是`true`，否则为`false`。

### Array

#### 数组api列表

+ 数组创建&类型：
  + `Array.from`：用于将类数组或者可迭代对象（Iterator）转化为一个 Array 型实例。
  + `Array.of`：用于创建一个数组实例而不需要考虑参数个数及类型。
  + `Array.isArray`：判断所传参数是否为数组类型。
+ 数组添加&删除
  + `push`：数组尾部添加元素，返回添加后的数组长度。
  + `pop`：数组尾部移除元素，返回移除的元素。
  + `shift`：数组头部移除元素，返回移除的元素。
  + `unshift`：数组头部添加元素，返回添加后的数组长度。

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

(es2023)
`toReversed`
`toSpliced`
`toSorted`

#### 可能改变原数组

`forEach`

### String

+ `String.prototype.charAt`与下标方式获取字符有何区别？

  + IE6-8（未经测试）不兼容下标获取，均返回`undefined`，`charAt`则可以正常使用
  + 当查询字符超出字符串范围时，`charAt`返回空字符串`''`，而下标获取到的值为`undefined`
  + 下标获取会造成误解，让人误以为目标是数组，且可写

### Function

+ 关于箭头函数：

  + 箭头函数没有自己的this，arguments，super或new.target。
  + 它的this、arguments都是在定义函数时绑定外层的this和arguments，而不是在执行过程中绑定的，所以不会因为调用者不同而发生变化。
  + 箭头函数若想得到自身的入参列表arguments，必须使用剩余参数表示法。
  + 箭头函数表达式更适用于那些本来需要匿名函数的地方，并且它不能用作构造函数
  + apply等方法也无法改变箭头函数this指向

+ 关于纯函数：

函数式编程中，改变或变更叫做 mutation，这种改变的结果叫做“副作用”（side effect）。 理想情况下，函数应该是不会产生任何副作用的 pure function

### 位运算

巧用位运算可提高代码性能

1. 用与操作代替取模运算判断奇偶

```js
var num = 27;
// 与1进行按位与运算，结果不为0则为奇数
if (num & 1) {
  console.log('奇数');
}
```

2. 位掩码：用于判断列表里面是否有某一项

```js
// 每一位掩码都是2的幂
var OPTION_A = 1; // 00001
var OPTION_B = 2; // 00010
var OPTION_C = 4; // 00100
var OPTION_D = 8; // 01000
var OPTION_E = 16; // 10000

var options = OPTION_A | OPTION_C | OPTION_D;

// 判断 OPTION_B 是否在options列表中
if (options & OPTION_B) {
  console.log('OPTION_B in options');
}
```

### DOM

#### appendChild 与 append 区别

相同点：

+ 都是向父节点中添加子节点，如果子节点已经存在则会替换掉原有的子节点

不同点：
+ `appendChild`只能添加一个节点，`append`可以添加多个可以是混合类型的节点
+ `appendChild`返回添加的节点，`append`返回undefined

#### clientWidth、offsetWidth、scrollWidth 区别

| 属性 | 描述 | 包括的部分 | 不包括的部分 |
| --- | --- | --- | --- |
| offsetWidth |	元素的布局宽度，包括边框、内边距和滚动条（如果存在）| 边框、内边距、滚动条（如果存在）| 外边距、溢出内容（不占用额外空间）
| clientWidth |	元素内部可视区域的宽度，包括内边距，但不包括边框、外边距和滚动条 | 内边距 |	边框、外边距、滚动条、溢出内容
| scrollWidth |	元素内容的实际宽度，包括溢出的部分| 内容宽度（包括溢出部分）| 边框、外边距、滚动条（不占用额外空间）

### 杂项

#### script标签的defer与async属性的用法与区别

两者同为异步加载脚本，只有defer属性是等文档所有元素渲染完成之后，DOMContentLoaded事件执行之前才
开始执行

async加载完就执行，defer渲染完才执行

#### script标签的crossOrigin属性的作用

为了能捕获到脚本内部具体的错误信息，可选值有：anonymous、use-credentials。设置该属性后脚本
所在的服务器也要设置Access-Control-Allow-Origin属性才可以达到目的

#### async与await

```javascript
console.log('script start')

async function async1() {
    await async2()
    await async3()
    await async4()
    console.log('async1 end')
}
async function async2() {
    new Promise(resolve => {
        console.log('async2 promise');
        resolve()
    }).then(() => {
        console.log('async2 promise then')
    })
    console.log('async2 end')
}

async function async3() {
    console.log('async3 end')
}

async function async4() {
    console.log('async4 end')
}

async1()

setTimeout(function() {
    console.log('setTimeout')
}, 0)

new Promise(resolve => {
    console.log('Promise')
    resolve()
})
.then(function() {
    console.log('promise1')
})

console.log('script end')

// 'script start' console.log('async1 end') 'async2 promise' 'async2 end' 'script end'
```

#### es6 module 与 commonjs 区别

+ esm 编译时输出接口；cjs 运行时加载
+ esm 输出的是值的引用，输入输出指向同一个地址，内部变化会影响外部；cjs 输出的是值得拷贝，内部变化不会影响外部，只有重新导入才会更新
+ esm 异步加载；cjs 同步加载

#### 尾调用与尾递归

函数返回非单纯的函数调用（类似return b() + 1;）会使得执行栈存储每次调用的记录，太占用内存。
所以需要进行尾调用优化，使得每次调用都用内层调用替换外层调用，这样始终只需存储一条调用记录，但是
只是在严格模式下生效，因为非严格模式下会有arguments与func.caller记录调用信息。
尾递归可以通过添加参数默认值、函数柯里化等方式实现

#### delete

`delete`关键字返回值为`boolearn`类型，表示是否删除成功。无法删除通过`var`、`let`、`const`声明的变量。

例：

```js
const name = 'Lydia';
age = 21;

console.log(delete name); // false
console.log(delete age); // true
```

#### IntersectionObserver

提供了一种异步检测目标元素与其祖先元素交叉状态的方法。因此可以用来更好的处理图片懒加载、滚动加载等场景。需要注意的是兼容性问题，移动端ios12以下暂不支持，需要合适的polyfill或者降级写法

示例：图片懒加载：

```js
const config = {
    rootMargin: '0px',
    threshold: 0
};

const observer = new IntersectionObserver((entries, self) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.dataset.src;
            if (src) {
                img.src = src;
                img.removeAttribute('data-src');
            }
            self.unobserve(entry.target);
        }
    });
}, config);

images.forEach((img) => observer.observe(img));
```

上面定义了一个`IntersectionObserver`监测器，之后为每一张图片节点订阅该监测器，其内部通过遍历依次判断目标节点与祖先元素`root`（默认为视口）是否相交，若相交，则展示图片。并且监测器还可以接收一个`config`参数用于精细化处理监测行为。例如其中`rootMargin`默认参照`root`元素，可设置其他值从而扩展与收缩其边界，从而改变相交位置与时机。另外一个属性`threshold`则表示在目标元素的可见比例判定相交触发监听回调，值介乎0~1之间。也可设置为一个数组，分别在不同的可见比例处触发回调。

### MutationObserver

`MutationObserver`可以监听 DOM 树的变化，前身是`Mutation Events`，该功能是 DOM3 Events 规范的一部分。

**用法**： 可通过该构造函数创建一个实例，并且构造函数接收一个在 DOM 发生改变时候触发的回调函数，回调函数可接收两个参数：`mutations`收集 DOM 发生改变的集合，`observer`指向该实例。

`MutationObserver`实例有三个实例方法：

+ `observe`: 开始监听，并且接受两个参数：
  + `targetNode`: 要监听变化的目标节点
  + `options`: 监听配置项，可以在此设置监听规则，常见比如`childList: true`，表示监听子节点变化

+ `takeRecords`: 返回已监听但并未被实例的回调函数处理的所有匹配的 DOM 改变的列表，使变更队列保持为空。常见适用场景是在断开监听前获取到所有未处理的变更，以便在停止监听后作相应的处理。

+ `disconnect`: 断开监听

```javascript
const node = document.querySelector("#test");

// 修改DOM节点
const handleClick = function () {
    const div = document.createElement("div");
    const text = document.createTextNode("div");
    node.appendChild(div);
    div.appendChild(text);
}

const observerOptions = {
    childList: true,
    attributes: true
};

const callback = function (mutations) {
    console.log(mutations);
}

const observer = new MutationObserver(callback);
observer.observe(node, observerOptions);

const mutations = observer.takeRecords();

if (mutations) {
    callback(mutations);
}           

observer.disconnect(); 
```
  
## typescript

### 语法

#### declare关键字

一般用于声明全局变量类型，通常写到专门的声明文件中，声明文件以`*.d.ts`的形式存在于根目录。例：

```typescript
declare var __DEV__: boolean;
```

### 类型强制转换

1. 因为某些内置对象自带一些属性和方法，因此为了能正确使用他们需要做相应的类型强制转换

```js
const canvas = <HTMLCanvasElement>document.getElementById('gl_canvas-dot');
```

## 数据库

+ 事务（transaction）的四大原则（ACID）：

  + 原子性（atomicity）：事务往往包含许多操作，事务成功的条件是事务包含的所有操作都完成，只要有
任何一步操作失败事务都算失败，需要回滚；

  + 一致性（consistency）：数据库要一直处于一致的状态，事务的执行要遵循数据库一致性，例如对于a+b=10约束，如果事务修改了a，那么也必须修改b使结果一致，否则事务失败；

  + 独立（隔离）性（isolation）：数据库的并发事务不会相互影响，如果一个事务正在访问的数据库正在被修改，
只要正在做修改的事务并未提交成功那么其他并发的事务访问的数据就不会改变，即不会受到未提交事务的影
响；

  + 持久性（durability）：事务一旦提交成功，那么对数据库的改变是永久的，即使发生宕机也不影响。

## other

### 浏览器垃圾回收机制与内存泄漏

#### 垃圾回收

+ 标记清除法（各大主流浏览器使用）：以 V8 引擎为例，通过可达性算法判断堆中的对象是否应该被回收。从根节点（如window 对象，DOM 树等等）出发遍历所有对象，可以遍历到的对象为可达对象，打上标记；无法遍历到的对象不标记，最后在所有标记完成后，统一清理内存中不可达的对象。过程中如出现大量不连续空间的内存碎片，则还要进行内存碎片整理

    如何进行高效回收？

  + 分代回收：对于局部变量等临时对象存放到新生代区域；对于 window、DOM 等生命周期长，占用内存大的持久性对象则存放到老生代区域。主垃圾回收器负责回收老生代区域；副垃圾回收器负责回收新生代区域，容量为 1 ~ 8 M,分为对象区域与空闲区域，开始先给对象区域垃圾打上标记，之后将存活的对象复制到空闲区并排序，复制完成后将两区域对调，从而完成清理

  + 增量回收：为了避免一次性遍历对象所带来的长时间停顿问题，可分多次少量清理的分块清理机制

  + 闲时回收：回收器在 CPU 空闲时运行
  
+ 引用计数法（IE旧版本使用）：引用次数为0的对象被回收，缺点在于无法对循环引用的对象进行回收

#### 内存泄漏

+ 全局变量
+ 定时器
+ DOM 引用
+ 闭包
+ 事件监听

### 性能优化

+ 前端性能优化方式有哪些？？？

  + 减少http请求
    + 尽量减少外部（第三方）脚本数量
    + 尽可能分别合并js与css到一个文件
    + 尽可能使用图标代替图片
    + 利用CSS sprites代替多张图片
    + 图片懒加载
    + 缓存请求结果
    + 使用内容分发网络CDN
    + 用http2代替http1

  + DNS预解析（link标签rel属性配置`preconnect`或者`dns-prefetch`）

  + 压缩字体文件

### http各版本区别

+ http0.9特性：
  + 只支持GET请求
  + 只支持服务端返回HTML的字符串（只支持文本传输）
  + 默认端口为80
  + 服务端发送完毕即关闭连接

+ http1.0特性：
  + 支持传输图像、视频、二进制文件等多种类型资源
  + 引入POST与HEAD命令
  + 请求携带了header信息（包含了一系列字段信息：Content-Type、Content-Encoding等）

+ http1.1特性：
  + 持久连接（TCP连接默认保持keep-alive，最多同时允许存在同个域名下4-6个持久请求连接，需要主动关闭）
  + pipelining（客户端可以在一个TCP连接同时发送多个请求，服务端还是按序相应）
  + 分块传输编码（通过设置Transfer-Encoding: chunked，逐块返回结果，以“流”（stream）取代
“缓存”（buffer））
  + 增加了PUT、DELETE、OPTIONS等类型请求

+ http2特性：
  + 多路复用（多个请求共用同一个TCP连接，而且不需要保持顺序，可以防止队头阻塞，充分利用带宽资源）
  + 头部压缩（采用HPACK算法对报文头部进行压缩，缩减体积，节省带宽，提高效率，相同的字段以后只需要
发送一个建立好的索引号）
  + 采用二进制数据帧（将消息组织成并行数据流，每个流又拆成二进制帧进行传输，到达之后再组装成消息，更容易解析）
  + 服务端推送（服务端在建立好TCP连接后可主动向客户端推送消息）

+ http3特性：
  + 利用UDP协议的高效性在其上推行QUIC协议，并利用重传机制解决UDP不可靠传输问题
  + 0 RTT建立连接

+ 相关协议：
  + SPDY协议：http2的前身，属于TCP协议之上，HTTP协议之下的会话层协议
  + QUIC协议：http3的核心，属于UDP协议之上，HTTP协议之下的会话层协议
  + HTTPS协议：基于SSL的http协议，具备防泄密（非明文传输）、防篡改（保证数据完整性）、防假冒
（身份验证）的特性
  + SSL协议：安全套接层
  + TLS协议：安全传输协议，SSL3.0的别名

### DNS解析过程

浏览器缓存 -> 系统缓存 -> 路由器缓存 -> ISP运营商DNS缓存 -> 根域名服务器 -> 顶级域名服务器 -> 主（权限）域名服务器

+ 浏览器要将域名解析为IP地址，首先向本地DNS发起请求，本地DNS查询缓存，若没有找到，则下一步
+ 本地DNS依次向根DNS服务器、顶级DNS服务器、权限DNS服务器发起请求，获取网站服务器的IP地址
+ 本地DNS服务器将获取到的IP地址返回给浏览器，之后浏览器向该IP地址发起请求并得到资源

### 内容分发网络（CDN）与DNS解析

CDN的目的是在不同位置部署服务器的情况下让用户能够访问最近的服务器从而缩短请求时间

1. 如果部署了GSLB（全局负载均衡系统），那么DNS解析过程中最后权限服务器返回的是该GSLB的IP地址，
2. 随后GSLB根据本地DNS服务器的IP地址确定用户所处的位置，指定离其最近的SLB（本地负载均衡系统）
集群进一步进行DNS解析，并将其IP地址返回给本地DNS服务器
3. 本地DNS收到IP地址后将其返回给浏览器，之后浏览器根据该IP向SLB发起请求
4. SLB根据请求资源与路径选出最优的缓存服务器返回给浏览器
5. 浏览器将请求地址再重定向到该缓存服务器
6. 如果该缓存服务器有浏览器请求的资源则直接返回，如没有则缓存服务器会向源服务器拉取最新资源并返
回浏览器并缓存在本地

### 浏览器缓存（强缓存&协商缓存）

首次请求根据`expires`与`cache-control`判断是否过期，若不过期则直接使用缓存（强缓存）；若过期则根
据`last-modified/last-modified-since`或`Etag`和`if-None-Match`确认资源是否被修改过（协商缓存）
若修改过则重新拉取资源，返回200，否则使用缓存，返回304

+ expires(http1.0): 资源过期的绝对时间
  
+ cache-control(http1.1):
  + max-age: 缓存持续时间（单位：秒）
  + public: 资源可被客户端与代理服务器缓存
  + private: 资源只允许客户端缓存
  + no-store: 不缓存任何资源
  + no-cache: 跳过强缓存，但是可以设置协商缓存
  + immutable: 配合`max-age`在有效期内用户刷新页面时也不向服务器发起请求

+ last-modified/last-modified-since(http1.0): 客户端再次请求同一资源时，会将检测到的`last-modified`的值添加到`last-modified-since`中并加到 http header，服务端收到请求时，会将`last-modified-since`的值与服务器上存放的该资源的最后修改时间对比，如果没有变化，则返回304与空的响应体，若小于最后修改时间则返回200与新的资源（弊端：最小精确到秒，因此秒级内的修改无法得到正确的更新）
  
+ Etag/if-None-Match(http1.1): 两者均为字符串，当服务器资源更新时，会生成新的`Etag`标识，客户端收到响应时会将该值记下来，下次请求时将该值带到`if-None-Match`中并添加到 http header，服务端检测二者是否相同，相同则返回304与空的响应体，不相同则返回新的资源与200

### 信息安全

#### XSS与CRSF攻击区别

+ XSS：跨站脚本攻击
攻击者通过url或评论区等地方注入攻击内容（html或js代码块），从而达到盗用cookie的目的

  防范：
对url及用户输入内容进行encode，保证编码后的内容为纯字符串
过滤用户输入的内容：比如script标签等

+ CRSF：跨站请求伪造
首先需要用户成功登录到目标网站，在用户处产生cookie，然后用户访问恶意网站，恶意网站需要向目标网
站发起请求，所以用户在不知情的情况下向目标网站发起了请求，从而攻击者利用用户cookie达到了访问目
标服务器的目的

  防范：
添加token机制，登录时服务端下发token，之后客户端每次请求都带上该token，服务器收到请求后对比
token，不相同则拒绝请求
cookie设置httpOnly，所有来自客户端脚本的访问都会被禁止
验证referer，服务器只处理指定网站发起的请求

<https://blog.csdn.net/hugo233/article/details/114272109>

### 进程与线程

+ 进程：程序执行的最小单位，是系统进行资源分配和调度的一个独立单位
+ 线程：进程执行的最小单位

+ 进程与进程之间相互独立，有各自的内存空间
+ 进程由一个或多个线程组成，多个线程之间共享该进程内存

+ 浏览器进程：
  + 主进程（负责菜单栏、标题栏、前进后退等）
  + 插件进程
  + GPU进程
  + 渲染进程（浏览器内核）
  + 网络进程

+ 浏览器线程：
  + GUI渲染线程
  + JS引擎线程
  + 定时器线程
  + 事件触发线程
  + 异步网络请求线程

### 前端工程化

+ 前后端分离
+ 自动化构建（资源打包、代码分割、babel转译、资源压缩、资源合并）
+ 自动化测试（单元测试、UI测试、性能测试）
+ 自动化部署（自动化脚本）
+ 模块化（业务与架构层面：ES6 Module、commonjs、css Module）
+ 组件化（设计层面：组件拆分、组件复用）
+ 规范化（编码规范、代码审查工具lint、代码提交规范、版本管理、环境管理、code review）
+ 性能优化（缓存策略、合并&减少http请求、按需加载、预加载、分包加载、首屏渲染、CDN）
+ 工具链（脚手架、组件库、部署平台、监控报警平台）

### 微前端方案

+ iframe
+ Web Components
+ ESM
+ qiankun
