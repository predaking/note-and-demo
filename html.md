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

  在 SVG 中，允许三种图像对象存在，分别是矢量图像、点阵图像和文本