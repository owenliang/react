var WebpackStripLoader = require('strip-loader');
var devConfig = require('./webpack.config.js');
var webpack = require("webpack");

// 去除console.log代码
var stripLoader = {
 test: [/\.js$/, /\.es6$/],
 exclude: /node_modules/,
 loader: WebpackStripLoader.loader('console.log')
}
devConfig.module.loaders.push(stripLoader);

// 代码压缩
var uglifyJs = new webpack.optimize.UglifyJsPlugin({
    compress: {
     warnings: false
    }
});
devConfig.plugins.push(uglifyJs);

// 为react指示编译生产环境代码
var definePlugin = new webpack.DefinePlugin({
    'process.env':{
        'NODE_ENV': JSON.stringify('production')
    }
});
devConfig.plugins.push(definePlugin);

// 静态资源js/css/img可以CDN加速
// 如果需要，那么可以赋值非空，例如：http://cdn.yuerblog.cc
devConfig.output.publicPath = "";

module.exports = devConfig;
