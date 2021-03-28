const path = require('path');
function resolve(relatedPath) {
  return path.join(__dirname, relatedPath)
}

module.exports = {
  mode: 'development',
  entry: {
    app: resolve('../src/index.js')
  },
  output: {
    filename: '[name].js',
    path: resolve('../dist')
  }
}