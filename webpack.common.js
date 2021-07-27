const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {
    BundleAnalyzerPlugin
} = require('webpack-bundle-analyzer');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: {
        app: './src/index.js',
    },
    module: {
        rules: [
            {
                test: /\.jpg|png|jpeg|gif/,
                type: 'asset/resource',
                generator: {
                    filename: 'static/images/[hash]',
                }
            },
            // {
            //     test: /\.svg/,
            //     type: 'asset/inline',
            // },
            // {
            //     test: /\.txt/,
            //     type: 'asset/source'
            // },
            {
                test: /\.js/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            // title: 'react-webpack-demo',
            template: './index.html'
        }),
        new webpack.ProvidePlugin({
            React: 'react',
            ReactDOM: 'react-dom'
        }),
        // new WorkboxWebpackPlugin.GenerateSW({
        //     // 保证及时更新与快速应用新的ServiceWorkers
        //     clientsClaim: true,
        //     skipWaiting: true,
        // }),

        // new BundleAnalyzerPlugin({
        //     analyzerPort: 8887,
        // }),
    ],
    output: {
        publicPath: '/',
        filename: '[name].[contenthash].js',
        // chunkFilename: '[name].[chunkhash].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
};
