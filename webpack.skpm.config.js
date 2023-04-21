module.exports = function (config, entry) {
  config.node = entry.isPluginCommand ? false : {
    setImmediate: false
  };

  config.resolve = {
    extensions: ['.ts', '.tsx', '.js', '.jsx', ".css", ".scss"]
  };

  config.module.rules.push({
    test: /\.(html)$/,
    use: [{
        loader: "@skpm/extract-loader",
      },
      {
        loader: "html-loader",
        options: {
          attrs: [
            'img:src',
            'link:href'
          ],
          interpolate: true,
        },
      },
    ]
  })

  config.module.rules.push({
    test: /\.(css)$/,
    use: ["css-loader"]
  })

  config.module.rules.push({
    test: /\.scss$/,
    use: ["style-loader", { loader: 'css-loader', options: { modules: true } }, "sass-loader"]
  })

  config.module.rules.push({
    test: /\.(tsx?)$/,
    use: 'ts-loader',
    exclude: /node_modules/,
  })
}
