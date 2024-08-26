# 目录

+ html

## html

### meta标签

#### meta标签的属性

`meta`可设置的属性可以是以下属性中的一种：

| 名称 | 含义 |
| - | - |
| name | 文档级别的元数据，作用于整个页面 |
| http-equiv | 相当于一个命名类似的http头携带的信息 |
| charset | 给出文档的字符编码（服务端返回若不加字符编码便会乱码） |
| item-prop | 用户自定义元数据 |
| content | 为http-equiv或name属性提供相应的值 |

#### http-equiv常见参数

`Content-Security-Policy`：内容安全策略，简称CSP，允许网站管理员控制给定页面所要加载的资源
（图片、媒体资源等），策略主要涉及服务器源与其他脚本源，这有助于防范跨站脚本攻击（XSS）。

例：默认加载文档来源处的资源及其它站点的脚本资源：

```html
<meta
    http-equiv="Content-Security-Policy"
    content="default-src 'self';script-src https://example.com"
/>
```
等价于

![CSP](/assets/html1-1.png "CSP")

当然还有`child-src`等其他属性。

`content-type`：声明文档的MIME类型和字符编码。如果指定，内容属性必须具有值
“text/html;charset=utf-8”。这相当于指定了charset属性的`meta`元素。

例：将文档解析为html文档：

```html
<meta
    http-equiv="content-type"
    content="text/html;charset=utf-8"
/>
```

`X-UA-Compatible`：声明文档在IE浏览器中的渲染方式。

例：以当前客户端支持的IE最高版本渲染引擎渲染文档：

```html
<meta
    http-equiv="X-UA-Compatible"
    content="IE=edge"
/>
```

`refresh`：设置当前页面隔多久刷新一次或多久之后重定向到其他页面。

例：3s后重定向到指定页面：

```html
<meta http-equiv="refresh" content="3;url=http://www.baidu.com" />
```

`default-style`：设置页面默认样式（值为当前页面style元素的title值）。

例：页面链接默认绿色：

```html
<meta http-equiv="default-style" content="green">
<style title="red">
    a {
        color: red;
    }
</style>
<style title="green">
    a {
        color: green;
    }
</style>
```

#### name常见参数

`referrer`: 控制从一个文档发出请求时的http头referrer信息（该文档的完整url，不包含参数），
有以下值：

| 值 | 含义 |
| - | - |
| strict-origin-when-cross-origin | （谷歌浏览器默认值）跨域或降级时严格只允许发送源信息（协议+域名）|
| no-referrer | 任何情形下都不发送referrer信息 |
| same-origin | 同源时才发送referrer信息 |
| origin | 只发送源信息 |
| strict-origin | 降级时（一般指从https -> http访问）只发送源信息，其他情况发生referrer |
| origin-when-cross-origin | 跨域时只发送源信息 |
| no-referrer-when-downgrade | 降级时不发送referrer信息 |
| unsafe-url | 任何情况都发生referrer信息 |

动态插入referrer元数据信息会使结果不可预测；多条referrer规则最终表现为`no-referrer`。

`theme-color`: 控制移动端部分浏览器的主题颜色（顶部状态栏、滚窗口边框等），存在兼容性问题

`color-scheme`: 设置文档主题，可选`dark`或`light`深浅两种主题，也可以合起来写，结合`prefers-color-scheme`
媒体查询做主题定制化设置（浏览器主题优先级大于文档主题）（其余值`normal`与`only light`效果有待验证）

`viewport`: 定义视口，主要解决pc端网页如何在移动端很好的展示。不添加该meta则移动端会缩小展示内容（直到滚动条消失），
参考百度网页。有以下值：

| 值 | 含义 |
| - | - |
| width=device-width | 设置视口宽度等于设备宽度（实际效果有待验证）|
| initial-scale | 网页初始缩放比例，设为1则移动端有可能会出现滚动条 |
| user-scalable | 是否允许用户对网页进行缩放（微信内置浏览器生效，其他浏览器不一定）|
| maximum-scale | 网页最大缩放比例，取值范围0-10 |
| minimum-scale | 网页最小缩放比例，取值范围0-10 |
| viewport-fit | 主要用于解决iphoneX刘海问题。可选值：`auto`（默认值）、`contain`: 视口完全包含网页内容（可能会有空白出现）、`cover`: 内容完全覆盖视口 |

例：一般将几个值组合使用：

```html
<meta name="viewport" content="width=device-width,initial-scale=1.0,user-scalable=no,viewport-fit=cover">
```

其他参数：`creator`：文档创建者、`publisher`：文档发布者、`robots`： 爬虫相关设置等


## svg&canvas

### svg

在 SVG 中，允许三种图像对象存在，分别是矢量图像、点阵图像和文本

#### path

概念：path可以用来绘制曲线、弧线，通过d属性定义关键点的类型与坐标值，大写表示绝对坐标，小写表示相对坐标

| 命令 | 含义 | 格式 |
| - | - | - |
| M | 移动到某点 | M x y |
| L | 连接到某点 | L x y |
| C | 三次贝塞尔曲线，其中p1，p2为控制点 | C x1 y1, x2 y2, x3 y3 |
| S | 作用同上，若S之前为C或S，则p2为上一个曲线命令第二个控制点的中心对称点 | S x2 y2, x3 y3 |
| Q | 二次贝塞尔曲线，其中p1为控制点 | Q x1 y1, x2 y2 |
| T | 作用同上，若T之前为Q或T，则自动推算该命令控制点 | T x1 y1 |
| A | 椭圆的一部分，<br />x-axis-rotation: 旋转角度<br />large-arc-flag: 1为要大圆，0为要小圆<br />sweep-flag: 1为顺时针，0为逆时针<br />d为结束点位置 | A rx ry x-axis-rotation large-arc-flag sweep-flag dx dy |

```html
<!-- 例：风车车 -->
<svg>
    <g>
        <path d="M 0 75 Q 37.5 150, 75 75 T 150 75" stroke="yellow" fill="transparent" />
        <path d="M 0 75 L 150 75" stroke="yellow" fill="transparent" />
        <path d="M 75 0 Q 0 37.5, 75 75 T 75 150" stroke="yellow" fill="transparent" />
        <path d="M 75 0, L 75 150" stroke="yellow" fill="transparent" />
        <animateTransform 
            attributeName="transform" 
            attributeType="xml"
            type="rotate"
            from="0 75 75" 
            to="360 75 75"
            dur="5s" 
            repeatCount="indefinite" 
        />
    </g>
</svg>
```

## DOM

### append 与 appendChild 异同

相同点，都可以在父级插入节点

不同点：

+ `append`方法较新，可接收字符串参数。`appendChild`不允许
+ `append`无任何返回，`appendChild`可返回添加的节点
+ `append`可以同时接收多个节点，`appendChild`只可以接收一个

### IntersectionObserver

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
