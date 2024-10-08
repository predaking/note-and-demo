const {
    merge
} = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.common');
const path = require('path');

module.exports = merge(common, {
    devtool: 'inline-source-map',
    devServer: {
        static: './',
        // 自动调起浏览器
        open: true,
        https: true,
        // 支持h5 history api及react-router路由，防止跳到404页面
        historyApiFallback: true,
        // host: '192.168.0.101',
        // 浏览器展示编译进度条
        client: {
            progress: true
        },
        // proxy: {
        //     '/api': {
        //         target: 'https://localhost:3000',
        //         // 利用target指定的主域名替换默认本地域名
        //         secure: false,
        //         changeOrigin: true,
        //         pathRewrite: { '^/api': '' }
        //     },
        // },
    },
    mode: 'development',
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
        }),
    ],
});
