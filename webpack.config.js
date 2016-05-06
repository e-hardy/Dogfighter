module.exports = {
    context: __dirname + "/public_html",
    entry: "./src/index.es6",
    output: {
        path: __dirname + "/public_html",
        filename: "main.js"
    },
    module: {
      loaders: [
        {
          test: /\.es6?$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel', // 'babel-loader' is also a legal name to reference
          query: {
            presets: ['es2015']
          }
        }
      ]
    }
};
