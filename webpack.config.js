const path = require('path') //path是webpack中的基本包，处理路径
const HtMLPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
// // 启动脚本时的变量存在于process.env变量中
const isDev = process.env.NODE_ENV === 'development'
const webpack = require('webpack')
const ExtractPlugin = require('extract-text-webpack-plugin')

const config = {
    // webpack的编译目标是web平台
    target: 'web',
    //入口文件
    entry: path.join(__dirname, 'src/index.js'),   //__dirname表示当前文件所在的目录地址，利用join()拼接成绝对路径
    // 输出文件
    output: {
        filename: 'bundle.[hash:8].js',//输出文件名,开发环境不能使用chunkhash，正式环境中需要进行一个修改
        path: path.join(__dirname, 'dist')
    },
    module: {
        rules: [
        {
            // 以vue-load 处理以vue结尾的文件，确保正确输出js代码
            test: /\.vue$/,
            loader: 'vue-loader'
        },
        {
            test: /\.jsx$/,
            loader: 'babel-loader'
        },
        {
            test:/\.css$/,
            // style-loader是将外部css文件注入html文件中，最后将html文件中的css 用css-loader进行解析
            use: [
                'style-loader',
                'css-loader'
            ]
        },
        {
            test: /\.(gif|jpg|jpeg|png|svg)$/,
            use:[
            {
                loader: 'url-loader',
            //将图片转化成base64的代码，直接写在js内容里而不用生成新的文件，减少http请求
            //还可以指定输出的文件名字，
                options: {
                    limit:1024,
                    name:'[name]-aaa.[ext]'
                }
            }
            ]
        }
        ]
    },
    plugins: [
    //能够在js代码中引用到，并且vue也能够根据此进行分类打包
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: isDev ? '"development"' : '"production"'
            }
        }),
        new HtMLPlugin(),
        new VueLoaderPlugin()
    ]
}

// // 配置是根据不同的环境判断，通过设置一个环境变量来判断
if (isDev) {
    //如果是开发环境
    config.module.rules.push({
            test: /\.styl/,
            use: [
                'style-loader',
                'css-loader',
                // {
                     'postcss-loader',
                //     options: {
                //         sourceMap: true, //指定这个值，后面stylus编译的时候就不用重新定值，编译效率变快
                //     }
                // },
                'stylus-loader'
            ]
    });
    config.devtool = '#cheap-module-eval-source-map'
    config.devServer = {
        port: 8088,
        //host 可以通过localhost进行访问，同时也可以通过本机的内网id进行访问，就能够在别的网页或者手机上访问
        host:'0.0.0.0',
        //overlay 编译过程有任何错误都直接显示到网页上
        overlay: {
            errors: true
        },
        // 当修改组件代码时，只重新渲染当前组件，不会让整个页面重新加载
        hot: true

        // 能够在运行后直接打开浏览器
        // open: true
    }
    // 启动webpack.hot功能的插件
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
        )
} else {
    config.entry = {
        app: path.join(__dirname, 'src/index.js'),   //__dirname表示当前文件所在的目录地址，利用join()拼接成绝对路径
        vendor: ['vue']
    }
    config.output.filename = '[name].[chunkhash:8].js'
    config.module.rules.push({
            test: /\.styl/,
            use: ExtractPlugin.extract({
                fallback: 'style-loader',
                use: [
                    'css-loader',
                    'postcss-loader',
                    'stylus-loader'
                ]
            })
    });
    config.plugins.push(
        // 指定输出的静态文件的名字
        new ExtractPlugin('styles.[chunkhash:8].css')
        // 类库文件单独打包
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: "vendor"
        // })
        // webpack相关的代码单独打包到一个文件里
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'runtime'
        // })
        )
        config.optimization = {
        splitChunks: {
            cacheGroups: {                  // 这里开始设置缓存的 chunks
                commons: {
                    chunks: 'initial',      // 必须三选一： "initial" | "all" | "async"(默认就是异步)
                    minSize: 0,             // 最小尺寸，默认0,
                    minChunks: 2,           // 最小 chunk ，默认1
                    maxInitialRequests: 5   // 最大初始化请求书，默认1
                },
                vendor: {
                    test: /node_modules/,   // 正则规则验证，如果符合就提取 chunk
                    chunks: 'initial',      // 必须三选一： "initial" | "all" | "async"(默认就是异步)
                    name: 'vendor',         // 要缓存的 分隔出来的 chunk 名称
                    priority: 10,           // 缓存组优先级
                    enforce: true
                }
            }
        },
        runtimeChunk: true
    }

}
module.exports = config
