const {
    merge
} = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.common');

module.exports = merge(common, {
    devtool: 'inline-source-map',
    devServer: {
        // contentBase: './dist',
        // 自动调起浏览器
        open: true,
        // 支持h5 history api及react-router路由，防止跳到404页面
        historyApiFallback: true,
        // host: '192.168.0.101',
        // 浏览器展示编译进度条
        client: {
            progress: true
        },
        proxy: {
            '*': {
                target: 'http://localhost:3000',
                // 利用target指定的主域名替换默认本地域名
                changeOrigin: true
            },
        },
    },
    mode: 'development',
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
        }),
    ],
});
