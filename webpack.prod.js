const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
module.exports = merge(common, {
    // devtool: 'source-map',
    mode: 'production',
    plugins: [
        // new webpack.DefinePlugin({
        //     'process.env.NODE_ENV': JSON.stringify('production'),
        //     'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH)
        // }),
        new CleanWebpackPlugin(),
    ],
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all'
            // cacheGroups: {
            //     vendor: {
            //         test: /[\/]node_modules[\/]/,
            //         name: 'vendors',
            //         chunks: 'all'
            //     },
            // },
        },
        // minimize: true,
        // minimizer: [
        //     new CssMinimizerPlugin();
        // ]
    },
})
