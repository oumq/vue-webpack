const path = require('path')
const webpackConfigBase = require('./webpack.base.config')
const { merge } = require('webpack-merge')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = [
  'js',
  'css',
  'json',
  'txt',
  'html',
  'ico',
  'svg'
]

function resolve(relatedPath) {
  return path.join(__dirname, relatedPath)
}

const webpackConfigDev = {
  mode: 'production',
  devtool: false,
  plugins: [
    new CleanWebpackPlugin(),
    new CompressionWebpackPlugin({
      filename: '[path][base].gz',
      algorithm: 'gzip',
      test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
      threshold: 10240,
      minRatio: 0.8
    })
  ]
}

module.exports = merge(webpackConfigBase, webpackConfigDev)
