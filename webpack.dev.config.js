const path = require('path');

module.exports = {
  mode: 'development',
  devServer: {
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, './dist'),
    },
    open: true,
    compress: true,
    hot: true,
    port: 8180,
  },
}
