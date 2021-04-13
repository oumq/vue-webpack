const path = require('path')
const { moduleList } = require('./modules')

function resolve(relatedPath) {
  return path.join(__dirname, relatedPath)
}

function getEntrys() {
  const entry = {}
  for (let i = 0, len = moduleList.length; i < len; i++) {
    entry[moduleList[i]] = resolve(`../src/modules/${moduleList[i]}/index.js`)
  }
  return entry
}

module.exports = {
  entry: getEntrys(),
  output: {
    path: resolve('../dist'),
    publicPath: '/',
    filename: '[name]/js/[name].[contenthash].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'all', // 代码分割时对异步代码生效，all：所有代码有效，inital：同步代码有效
      // minSize: 30000, // 代码分割最小的模块大小，引入的模块大于 30000B 也就是30kb 才做代码分割
      // maxSize: 0, // 代码分割最大的模块大小，大于这个值要进行代码分割，一般使用默认值
      // minChunks: 1, // 引入的次数大于等于1时才进行代码分割
      maxAsyncRequests: 6, // 最大的异步请求数量,也就是同时加载的模块最大模块数量
      maxInitialRequests: 4, // 入口文件做代码分割最多分成 4 个 js 文件
      automaticNameDelimiter: '~', // 文件生成时的连接符
      // automaticNameMaxLength: 64, // 自动生成的文件名的最大长度
      cacheGroups: {
        libs: {
          test: /[\\/]node_modules[\\/]/,
          name: 'chunk-libs',
          chunks: 'initial',
          priority: 10
        },
        components: {
          test: resolve('../src/components'),
          name: 'chunk-components',
          chunks: 'initial',
          minChunks: 1,
          priority: 5
        }
      }
    }
  }
}
