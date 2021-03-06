const path = require('path')
const webpack = require('webpack')
const webpackConfigBase = require('./webpack.base.config')
const { merge } = require('webpack-merge')

let selfIp
try {
  selfIp = getIpAddress()
} catch (e) {
  selfIp = 'localhost'
}

const PORT = 9527

// 精确的获取本机ip地址
function getIpAddress() {
  const interfaces = require('os').networkInterfaces
  for (let devName in interfaces) {
    const iface = interfaces[devName]
    for (let i = 0; i < iface.length; i += 1) {
      let alias = iface[i]
      if (
        alias.family === 'IPv4' &&
        alias.address !== '127.0.0.1' &&
        !alias.internal
      ) {
        return alias.address
      }
    }
  }
}

function resolve(relatedPath) {
  return path.join(__dirname, relatedPath)
}

const webpackConfigDev = {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  devServer: {
    host: selfIp,
    compress: true,
    // hot: true,
    hotOnly: true,
    port: PORT,
    inline: true,
    quiet: true,
    overlay: {
      errors: true
    },
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: '/dotplot' },
        { from: /^\/article\/.*$/, to: '/index.html' },
        { from: /^\/user\/.*$/, to: '/index.html' },
        { from: /^\/apple\/.*$/, to: '/index.html' },
        { from: /^\/dotplot\/.*$/, to: '/index.html' }
      ]
    }
  }
}

module.exports = merge(webpackConfigBase, webpackConfigDev)
