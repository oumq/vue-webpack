const path = require('path')
function resolve(relatedPath) {
  return path.join(__dirname, relatedPath)
}

module.exports = {
  entry: {
    app: resolve('../src/index.js')
  },
  output: {
    path: resolve('../dist'),
    publicPath: '/',
    filename: '[name].[contenthash].js'
  }
}
