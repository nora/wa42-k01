let webpack = require('webpack');
require('dotenv').config();

let defineEnv = new webpack.DefinePlugin({
  'process.env': {
    'GOOGLEMAP_API_KEY': JSON.stringify(process.env.GOOGLEMAP_API_KEY)
  }
});

module.exports = {
  mode   : 'production',
  entry  : {
    app  : ['babel-polyfill', './js/app.js']
  },
  output : {
    path    : `${__dirname}/js`,
    filename: '[name].bundle.js'
  },
  resolve: {
    extensions: ['.js']
  },
  module : {
    rules: [
      {
        test: /\.js$/,
        use : [
          {
            loader : 'babel-loader',
            options: {
              presets: [
                ['env', {'modules': false}]
              ]
            }
          }
        ]
      }
    ]
  },
  plugins: [defineEnv]
};