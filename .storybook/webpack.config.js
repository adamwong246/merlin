const path = require('path');

module.exports = {
  module: {
    loaders: [
      {
      test: /\.css$/,
      loader: 'style!css!sass',
      exclude: /node_modules/,
      include: path.resolve(__dirname, '../../')
    }
    ]
  }
}
