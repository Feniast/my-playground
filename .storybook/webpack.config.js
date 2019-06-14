const path = require('path');
const fs = require('fs');

module.exports = async ({ config, mode }) => {
  config.module.rules.push({
    loader: 'babel-loader',
    exclude: /node_modules/,
    test: /\.(js|jsx)$/,
    options: {
      presets: ['@babel/react', '@babel/preset-env'],
      plugins: [
        '@babel/plugin-proposal-class-properties'
      ]
    }
  });

  config.module.rules.push({
    test: /\.less$/,
    loaders: [
      'style-loader',
      'css-loader',
      'less-loader'
    ]
  });
  return config;
};
