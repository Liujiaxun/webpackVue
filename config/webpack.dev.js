const path = require('path');
const uglify = require('uglifyjs-webpack-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');
const extractTextWebpackPlugin = require('extract-text-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const publicPath = 'assets/'
const glob = require("glob");
function getEntry(){
    var entry={};
    glob.sync('./src/page/**/*.js').forEach(function (name) {
        var start = name.indexOf('src/') + 4,
            end = name.length - 3;
        var eArr = [];
        var n = name.slice(start, end);
        n = n.slice(0, n.lastIndexOf('/')); //保存各个组件的入口 
        n = n.split('/')[1];
        eArr.push(name);
        entry[n] = eArr;
    });
    return entry
}
function setHtmlWebpackPluginConfig(name,chunks){
    return {
        template:'./src/page/'+name+'/'+name+'.html',
        filename: './'+ name + '/'+name + '.html',
        title:'',
        inject:true,
        hash:true,
        chunks:chunks,
        minify: process.env.NODE_ENV === "development" ? false : {
            removeComments: true, //移除HTML中的注释
            collapseWhitespace: true, //折叠空白区域 也就是压缩代码
            removeAttributeQuotes: true, //去除属性引用
        },
    }
}
const entrys = getEntry();
var htmlTemplate = Object.keys(entrys).map(i => ({
    _html: i,
    title: '',
    chunks: ['vendor', i]
}))

var options = {
    //开发模式
    //可以有 development,production
    mode:'development', 
    //入口文件
    entry:{
        main:'./src/main.js',
        ...entrys
    },
    // entry:{
    //     main:'./src/main.js',
    //     index:'./src/index.js'
    // },
    //出口文件配置
    output:{
        //打包到路径
        path:path.resolve(__dirname,'../dist'),
        //打包后的文件名
        // * 看入口文件为几个入口，当为多个的时候可以改为 [name].js
        filename:'[name]/[name].js',
        publicPath:'/'
    },
    //模块
    module:{
        rules:[
            {
                test:/\.vue$/,
                loader:'vue-loader',
                options:{
                    loaders:{
                        css:extractTextWebpackPlugin.extract({use:'css-loader'})
                    }
                }
            },
            {
                test:/\.js|jsx$/,
                use:{
                    loader:'babel-loader',
                },
                exclude:/node_modules/
            },
            {
                test:/\.css$/,
                use:extractTextWebpackPlugin.extract({
                    fallback:"style-loader",
                    use:[
                        {
                            loader:"css-loader"
                        },
                        {
                            loader:"postcss-loader"
                        }
                    ],
                })
                // use:[
                //     {loader:"style-loader"},
                //     {loader:"css-loader"}
                // ]
            },{
                test:/\.png|gif|jpg|jpeg$/,
                use:[
                    {
                        loader:'url-loader',
                        options:{
                            limit:500,
                            outputPath:publicPath + 'img/'
                        }
                    }
                ]
            },{
                test:/\.html$/,
                loader:'html-loader'
            }
        ]
    },
    //插件
    plugins:[
        new VueLoaderPlugin(),
        new uglify(),
        new htmlWebpackPlugin({
            minify:{ //是对html文件进行压缩
                removeAttributeQuotes:true  //removeAttrubuteQuotes是却掉属性的双引号。
            },
            chunks:['vendor', 'main'],
            hash:true, //为了开发中js有缓存效果，所以加入hash，这样可以有效避免缓存JS。
            template:'./src/index.html' //是要打包的html模版路径和文件名称。
        }),
        new extractTextWebpackPlugin("[name]/[name].css")
    ],

    watchOptions: {
        ignored: /node_modules/,
        aggregateTimeout: 300,//防止重复保存频繁重新编译,300ms内重复保存不打包
        poll: 1000  //每秒询问的文件变更的次数
    },
    //配置webpack开发服务功能
    devServer:{
        inline: true,
        // contentBase:path.resolve(__dirname,'../dist'),
        host:'localhost',
        compress:true,
        port:8888,
        historyApiFallback: true,
    }
}
htmlTemplate.forEach(function(i){
    options.plugins.push( new htmlWebpackPlugin(setHtmlWebpackPluginConfig(i._html,i.chunks)))
})

module.exports =  options;