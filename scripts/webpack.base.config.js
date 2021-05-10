const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

const path = require('path')
const { moduleList } = require('./modules')

function resolve(relatedPath) {
  return path.join(__dirname, relatedPath)
}

const htmlWebpackPlugins = []
for (let i = 0, len = moduleList.length; i < len; i++) {
  htmlWebpackPlugins.push(
    new HtmlWebpackPlugin({
      filename: `${moduleList[i]}/index.html`,
      template: `./src/modules/${moduleList[i]}/index.html`,
      inject: true,
      chunks: [moduleList[i]]
    })
  )
}

function getEntrys() {
  const entry = {}
  for (let i = 0, len = moduleList.length; i < len; i++) {
    entry[moduleList[i]] = [
      'webpack-dev-server/client',
      // 'webpack/hot/only-dev-server',
      resolve(`../src/modules/${moduleList[i]}/index.js`)
    ]
  }
  return entry
}

module.exports = {
  entry: getEntrys(),
  output: {
    path: resolve('../dist'),
    publicPath: process.env.NODE_ENV === 'production' ? '/vue-webpack' : '/',
    filename: '[name]/js/[name].[contenthash].js'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': resolve('../src')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          process.env.NODE_ENV === 'production'
            ? MiniCssExtractPlugin.loader
            : 'style-loader',
          'css-loader',
          // 'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/img/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/fonts/[name].[hash:7].[ext]'
        }
      }
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'all', // 代码分割时对异步代码生效，all：所有代码有效，inital：同步代码有效
      minSize: 30000, // 代码分割最小的模块大小，引入的模块大于 30000B 也就是30kb 才做代码分割
      minChunks: 1, // 引入的次数大于等于1时才进行代码分割
      maxAsyncRequests: 6, // 最大的异步请求数量,也就是同时加载的模块最大模块数量
      maxInitialRequests: 4, // 入口文件做代码分割最多分成 4 个 js 文件
      automaticNameDelimiter: '~', // 文件生成时的连接符
      // automaticNameMaxLength: 64, // 自动生成的文件名的最大长度
      cacheGroups: {
        libs: {
          test: /[\\/]node_modules[\\/]/,
          name: 'chunk-libs',
          filename: 'static/js/[name].[contenthash].js',
          chunks: 'initial',
          priority: 10
        },
        components: {
          test: resolve('../src/components'),
          name: 'chunk-components',
          filename: 'static/js/[name].[contenthash].js',
          chunks: 'initial',
          minChunks: 1,
          priority: 5
        }
      }
    },
    runtimeChunk: {
      name: 'manifest'
    }
  },
  plugins: [
    new VueLoaderPlugin(),
    new CopyWebpackPlugin({
      patterns: [{ from: resolve('../public'), to: 'static' }]
    }),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash].css',
      chunkFilename: 'static/css/[id].[contenthash].css'
    }),
    new FriendlyErrorsWebpackPlugin()
  ].concat(htmlWebpackPlugins)
}
