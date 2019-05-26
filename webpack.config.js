const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = (env) => {
  return {
    mode: env,
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: './index.bundle.js'
    },
    module: {
      rules: [{
          test: /\.js$/,
          exclude: /node_modules/,
          loader: "babel-loader",
          options: {
            plugins: env !== 'production' ? ["react-hot-loader/babel"] : []
}

        
        },
        {
          test: /\.css$/,
          use: [{
              loader: 'style-loader'
            },
            {
              loader: 'css-loader',
              options: {
                modules: true
              }
            }
          ]
        },
        {
          test: /test\.js$/,
          use: 'mocha-loader',
          exclude: /node_modules/
        }


        
      ]
    },

    plugins: [new HtmlWebpackPlugin({
      template: 'src/index.html',
      filename: 'index.html',
      inject: 'body'
    })]

  }
};
