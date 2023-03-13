# webpack 基本原理

## 基本概念

+ compiler
  - 概念：`Compiler`模块是 webpack 的核心模块，继承自`Tapable`类，用来注册与调用插件。

+ compilation
  - 概念：`Compilation`模块是通过`Compiler`创建的对象，同样继承自`Tapable`类，`Compilation`的实例能够访问所有的模块及其依赖，它会对应用程序依赖图中所有的模块进行字面上的编译，在编译阶段，模块会被加载（load）、封存（seal）、优化（optimize）、分块（chunk）、哈希（hash）和重新创建（restore）

# 构建webpack项目

## 基本构建

+ 创建并切换到项目根路径下：`mkdir [project-name] && cd [project-name]`

+ 初始化`package.json`配置：`npm init [-y]`

+ 当前项目开发环境下局部安装`webpack`、`webpack-cli`：`npm install webpack webpack-cli --save-dev`

+ 新建dist文件夹，创建一个`index.html`文件，引入即将编译好的`main.js`文件如下：

```html
<body>
    <script src="main.js"></script>
</body>
```
+ 运行`npx webpack`，会将`index.js`脚本作为入口起点，输出为`dist`下的`main.js`

+ 新建`webpack.config.js`配置文件，定义入口文件与出口文件，并将`dist`下的`index.html`中的文件路径改为`bundle.js`(不改不妨碍正常生成`bundle.js`文件)：

```js
const path = require('path');
module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
};
```
+ 之后可以运行`npx webpack --config webpack.config.js`即可在`dist`路径下生成`bundle.js`文件，内容与之前的 `main.js`一致

+ 避免上述命令行打包项目的繁琐过程，可以在`package.json`中配置npm脚本如下：之后即可通过运行`npm run build`构建项目

```json
"scripts": {
  "build": "webpack"
},
```

## 资源管理

### 加载CSS

+ 安装`style-loader`、`css-loader`：`npm install --save-dev style-loader css-loader`

+ `webpack.config.js`中配置loader规则：

```js
module: {
    rules: [{
        test: /\.css$/,
        use: [
            'style-loader',
            'css-loader'
        ]
    }]
}
```
+ 在根路径下新建一个`style.css`文件，之后在`index.js`中通过`import '../style.css'`将其中设置的样式应用到`index.html`中，最终结果是以`<style>`标签的形式嵌入到了`<head>`当中

<font color="red">**注：现有loader支持postcss、sass、less等**</font>

### 加载图片

+ 加载图片主要指的是CSS文件中的背景图、图标链接等，首先安装`file-loader`：`npm install --save-dev file-loader`

+ 同配置样式加载器一样，也将`file-loader`加入到`webpack.config.js`中的`module`->`rules`中

+ 可尝试在`index.js`中通过`import signature from '../name.png'`导入图片，其中`signature`会作为新建图片对象的路径，或在`style.css`中设置`background-image: url('./name.png')`体验导入效果

### 加载字体

+ 加载字体文件过程同图片，也需要用到`file-loader`，先将字体文件放到项目中，之后在样式文件中通过`@font-face`引入，具体用法如下：

```CSS
@font-face {
    font-family: 'empire';
    src: url('./empire.ttf');
    font-weight: 600;
    font-style: normal;
}

body {
    font-family: 'empire';
    font-size: 60px;
}
```
### 加载其他文件

+ 除了加载上述特殊文件类型也可以加载数据文件，比如`JSON`、`XML`、`CSV`、`TSV`等，只不过JSON数据默认就支持，可以导入后直接解析出来，其他类型文件需要下载相应的加载器，比如`csv-loader`、`xml-loader`等

+ 导入过程：`import Data from './[filename].[type]'`，之后就可以通过`Data`拿到要导入的数据了

### 资源模块

`webpack5`添加了四种新的模块类型来代替旧的`loader`:

+ `asset/resource`： 发送一个单独的文件并导出`URL`，代替`file-loader`，`webpack.common.js`配置如下：`npm run build`之后所有引入的资源文件均被输出到输出目录，并将其路径注入到`bundle`中，还可以通过`Rule.generator.filename`或`output.assetModuleFilename`指定具体的输出路径（二者作用相同，但仅适用于`asset`与`asset/resource`模块类型），比如静态资源放到`dist/static`下，`static`内部还可以继续分类

```js
module: {
    rules: [{
        test: /\.jpg|png|jpeg|gif/,
        type: 'asset/resource',
        generator: {
            filename: 'static/images'
        }
    }]
},
output: {
    assetModuleFilename: 'static'
}
```
+ `asset/inline`：将资源导出为`data URI`的形式并注入到`bundle`中，代替`url-loader`，默认以`base64`算法编码，例如`svg`文件，还可以通过`generator`自定义编码算法：需安装`mini-svg-data-uri`插件：`npm install mini-svg-data-uri --save-dev`

```js
const svgToMiniDataURI = require('mini-svg-data-uri');
// ...
module: {
    rules: [{
        test: /\.svg/,
        type: 'asset/inline',
        generator: {
            dataUrl: content => {
                return svgToMiniDataURI(content.toString());
            }
        }
    }]
},
```
+ `asset/source`：导出资源的源代码，代替`raw-loader`，例如导入`txt`文件，可以原样输出文件内容到`bundle`中

+ `asset`：通用资源类型，在`resource`与`inline`之间切换，资源小于8k默认解析为`inline`模块，可以通过配置`parser`修改大小限制:

```js
module: {
    rules: [{
        test: /\.txt/,
        type: 'asset',
        parser: {
            dataUrlCondition: {
                maxSize: 4 * 1024
            }
        }
    }]
}
```

## 管理输出

+ 配置多入口：`entry`中可以添加多个入口文件，输出`filename`也可以统一定义这些文件对应的输出`bundle`名称格式如：`[name].bundle.js`，这样`build`之后的`index.html`文件脚本依赖仍然是旧文件路径

+ 安装`html-webpack-plugin`插件在构建时更新`index.html`引用脚本依赖路径：`npm install html-webpack-plugin --save-dev`，`webpack.config.js`文件配置如下：可以将网页`title`更换掉

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    plugins: [
        new HtmlWebpackPlugin({
            title: 'react-webpack-demo'
        })
    ]
}
```
+ 安装`clean-webpack-plugin`插件在构建时及时清理旧构建文件（如`dist`文件），`npm install clean-webpack-plugin --save-dev`，`webpack.config.js`文件在最新版本配置如下：

```js
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {
    plugins: [
        new CleanWebpackPlugin()
    ]
}
```

## 开发服务

### source map

+ 定位源文件错误位置（多用于多文件共用一入口的情况）： `webpack.config.js`中配置`devtool: 'inline-source-map'`

### webpack-dev-devServer

+ 安装： `npm install webpack-dev-server --save-dev`

+ 配置：以下`webpack.config.js`中的配置告知`webpack-dev-server`在`localhost:8080`下建立服务，将`dist`目录下的文件作为可访问文件

```js
devServer: {
    contentBase: './dist'
}
```

+ 运行：`package.json`中添加一个`script`：`"dev": "webpack-dev-server --open"`，之后运行`npm run dev`即可启动服务，并且随着代码修改保存实时刷新页面状态。

## Tree shaking

+ 依赖`import`、`export`特性，用于移除未引用代码，结合`sideEffects`（表明哪些文件是纯ES2015模块）可以安全地删除文件中的无用代码，若所有文件均无副作用，则`package.json`可配置为：`sideEffects: false`；若个别文件有副作用不能随便剔除无用代码则可以将其记录到数组中提供给`sideEffects`（支持通配）

## 压缩输出

+ `Tree shaking`结合压缩输出可以彻底将`bundle`文件中的冗余代码也清除掉，只需在`webpack.config.js`中配置`mode: 'production'`即可

## 生产环境构建

### 配置

+ 合并配置插件安装：`npm install webpack-merge --save-dev`，用于合并一些通用配置

+ 删除`webpack.config.js`，新增`webpack.common.js`，`webpack.prod.js`，`webpack.dev.js`

+ `webpack.common.js`：

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: {
        app: './src/index.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'react-webpack-demo'
        }),
        new CleanWebpackPlugin(['dist'])
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
}
```
+ `webpack.dev.js`：

```js
const common = require('./webpack.common.js');
const { merge } = require('webpack-merge');

module.exports = merge(common, {
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist'
    }
})
```
+ `webpack.prod.js`：

```js
const common = require('./webpack.common.js');
const { merge } = require('webpack-merge');
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(common, {
    devtool: 'source-map',
    mode: 'production' // 加上此配置可以等效UglifyJSPlugin
    // plugins: [
    //    new UglifyJSPlugin()
    // ]
});
```
<font color="red">**注：某些配置构建时报错可能需要用类似解构的方式导入**</font>

### NPM Scripts

+ `package.json`配置如下（指明在开发环境启动服务，在生产环境构建输出）：

```json
"scripts": {
  "build": "webpack --config webpack.prod.js",
  "dev": "webpack-dev-server --open --config webpack.dev.js",
},
```

### source map

+ 生产环境采用`source-map`，避免`inline-source-map`增加`bundle`大小，并降低整体性能

### 指定环境

+ 利用`webpack`内置的`DefinePlugin`为所有依赖定义`process.env.NODE_ENV`环境变量为`'production'`，可以让某些`library`针对环境进行代码优化，甚至降低`bundle`体积。任何本地开发代码也都能关联到该变量，可以用于在开发前的环境检查工作。`webpack.prod.js`配置如下：

```js
const webpack = require('webpack');

module.exports = merge(common, {
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    ]
})
```

## 代码分离

### 特性

+ 将代码分离到多`bundle`，可以实现按需加载、并行加载、控制加载优先级、影响加载时间

### 分离方式

+ 入口起点：配置多入口

+ 防止重复：利用`CommonsChunkPlugin`去重和分离`chunk`。`webpack.common.js`配置如下：

```js
const webpack = require('webpack');

module.exports = {
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common' // 指定公共bundle名称
        })
    ]
}
```

+ 动态导入：设置单入口，输出中配置`chunkFilename: '[name].bundle.js'`，开发代码中异步调用其中的函数，案例如下（其中导入参数前的注释决定了最终的`chunkFilename`）：

```js
function Component() {
    import(/* webpackChunkName: 'print' */ './print').then(module => {
        const btn = document.createElement('input');
        btn.type = 'button';
        btn.value = '点我';
        module.printName();
        document.body.appendChild(btn);
    });
}

Component();

```

### bundle分析

+ `webpack-bundle-analyzer`安装：`npm install webpack-bundle-analyzer --save-dev`

+ `webpack.common.js`配置：

```js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    plugins: [
        new BundleAnalyzerPlugin()
    ]
}
```
+ 运行：`npm run build`后即可产生一个本地服务，通过可视化页面查看包尺寸大小，从而针对性地进行优化

## 缓存

### 哈希文件名

+ 输出配置：`filename: '[name].[contenthash].js'`，文件内容变化时文件名随之变化，再次请求到的资源就是新资源；反之，不请求资源，只利用缓存

### 第三方库缓存

+ 例如在`index.js`入口文件中引入了`node_modules`中的一个依赖，可以将其提取到一个单独的`vendor` `chunk`文件中缓存起来，之后的入口文件体积也会显著减小。`webpack.prod.js`具体配置如下：

```js
optimization: {
    splitChunks: {
        cacheGroups: {
            vendor: {
                test: /[\/]node_modules[\/]/,
                name: 'vendors',
                chunks: 'all'
            },
        },
    },
}
```

+ 保持Hash值不变：在本地代码文件发生依赖变动（增减）时，`vendor`文件的`module.id`会基于解析顺序的变化而变化，因此`hash`值也会随之变化，然而依赖本身并未发生变化，为了修复这一不合理之处，可以在`webpack.prod.js`中添加`optimization.moduleIds`如下：

```js
optimization: {
    moduleIds: 'hashed',
}
```
## 创建与发布library

### 创建library

+ **新建项目：**项目名为`webpack-numbers`，初始化`package.json`：`npm init`；新建`src`文件夹，创建`ref.json`与`index.js`示例文件；在根路径增加`webpack.config.js`配置文件；配置如下：

```json
[
  {
    "num": 1,
    "word": "One"
  },
  {
    "num": 2,
    "word": "Two"
  },
]
```

```js
// index.js
import _ from 'lodash'; // 在上层项目安装好即可，library会自动逐级查找
import numRef from './ref.json';

export function numToWord(num) {
    return _.reduce(numRef, function(result, ref) {
        return ref.num === num ? ref.word : result;
    }, '');
}

export function wordToNum(word) {
    return _.reduce(numRef, function(result, ref) {
        return ref.word === word ? ref.num : result;
    }, -1);
}
```

```js
// webpack.config.js
const path = require('path');

module.exports = {
    entry: {
        app: './src/index.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'webpackNumbers.js',
        library: 'testWebpackNumbers', // 该变量主要应用在html页面中
        /*
         *  添加libraryTarget是为了兼容代码运行环境
         *  变量： 作为全局变量，通过script标签访问（默认值为'var'）
         *  this： 通过this对象访问
         *  window： 通过window对象访问
         *  umd： 在ES2015 import或AMD或CommonJS require后访问
         */
        libraryTarget: 'umd',
    },
    // 添加不打包进library的依赖，项目中需要的时候再进行安装，支持正则
    externals: {
        'lodash': {
            commonjs: 'lodash',
            commonjs2: 'lodash',
            amd: 'lodash',
            root: '_'
        }
    },
};
```

### 发布library

+ **发布过程：**登录：`npm login`，切换到`library`根路径运行`npm publish`即可将`library`发布到`npm`服务器

+ **引入过程：**安装`library`：`npm install webpack-numbers --save-dev`，之后通过`import`或`require`引入（未发布时可抽离dist通过相对路径引入）

## 预置依赖

### Shimming

+ **原理与意义：**旧环境中引入新的不合规范的Api模块全局变量，为防止打包过程中出现错误，需要通过配置`webpack.ProvidePlugin()`来解决，在解析到这些变量时再自动引入相应的`chunk`

+ **预置全局变量：**例如`lodash`：通过配置`ProvidePlugin`，之后用到'_'变量的时候`webpack`就会将`lodash`自动引入，`webpack.common.js`配置如下：

```js
plugins: [
    new webpack.ProvidePlugin({
        _: 'lodash',
    }),
]
```
+ **预置单个导出：**例如`lodash`中的`chunk`方法：可以通过配置一个数组路径实现，配置如下：

```js
plugins: [
    new webpack.ProvidePlugin({
        chunk: ['lodash', 'chunk'],
    }),
]
```
### <font color="red">细粒度Shimming（存疑）</font>

### 加载Polyfills

+ **存在的意义：**`polyfill`使低版本浏览器支持es6与部分新的Api

+ **安装与配置：**生产环境安装：`npm install babel-polyfill --save`，最佳实践为先判断浏览器的api支持程度，之后再决定是否引入。`src`下新建`polyfills.js`，在其中引入`babel-polyfill`及其它用途的`polyfill`，`webpack.common.js`中增加`polyfill`入口，之后在`dist/index.html`中进行判断与引入

```js
// polyfill.js
import 'babel-polyfill';
import 'whatwg-fetch';
//...
```
## 渐进式网络应用程序（PWA）

+ **原理与意义：**PWA是一种旨在提供接近原生应用体验web App，最常见的一种应用是离线缓存，使得应用在断网时也能照常运行程序及功能。通过Service Workers技术实现。

+ **http-server安装与配置：**`npm install http-server --save-dev`，`package.json`中配置`script`：`"server: http-server dist"`，之后通过`npm run server`启动`http-server`

+ **Workbox安装与配置：**`npm install workbox-webpack-plugin --save-dev`，`webpack.common.js`中配置如下：之后`npm run build`会在`dist`下生成`service-worker.js`

```js
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
plugins: [
    new WorkboxWebpackPlugin.GenerateSW({
        // 保证及时更新与快速应用新的ServiceWorkers
        clientsClaim: true,
        skipWaiting: true,
    })
]
```
+ **注册Service Worker：**

```js
// index.js
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js').then((registration => {
            console.log('SW registered: ', registration);
        })).catch(registrationErr => {
            console.log('SW Registered failed: ', registrationErr);
        })
    })
}
```
+ **验证与问题：**再次`npm run build`并重启`http-server`服务，观察控制台输出，关闭`http-server`并刷新页面，没什么意外仍可正常输出内容。由于`webpack5`版本升级，导致`workbox-webpack-plugin`插件配置方式不再兼容，必要时候暂时可以回退`webpack`版本，[插件在未来也会更新并修复此问题](https://github.com/GoogleChrome/workbox/issues/2649)

## 提升构建性能

### 通用环境

+ 缩小各类型`loader`的解析范围，例如`rules`内增加：`include: path.resolve(__dirname, 'src')`

+ 每个额外的`loader/plugin`都有其启动时间。尽量少地使用工具

+ 在多页面程序中使用`SplitChunksPlugin`，并开启`async`模式

+ 使用`Tree shaking`，去除未引用代码

+ 使用`cache-loader`启用持久化缓存，使用`package.json`中的`postinstall`清除缓存目录

### 开发环境

+ 最小化入口chunk：

```js
// 为运行时代码创建了一个额外的 chunk，所以它的生成代价较低
optimization: {
    runtimeChunk: true
}
```
+ 避免额外的优化步骤：

```js
// 优化输出结果的体积和加载性能要执行额外的算法任务，在大型项目中会非常耗费性能
optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
}
```
+ 输出结果不携带路径信息：

```js
// 打包输出的bundle中是携带路径信息的，如果模块上千，会增加垃圾回收性能压力，在output中设置关闭
output: {
    pathinfo: false,
}
```
### 生产环境

<font style="color: red">注：webpack性能优化要权衡收益与代价，优化代码质量比优化构建性能更重要</font>

+ `source map`非常耗费资源，用不到的话就不要配置了

## 内容安全策略（Content Secure Policy）

+ CSP通过有条件地限制网页注入外部脚本来防止XSS攻击，启用CSP有两种方法：

    设置http的`Content-Secure-Policy`头部字段
    设置`<meta http-equiv="Content-Security-Policy">`标签

##
