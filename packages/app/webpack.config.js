const CLEAN_WEBPACK_PLUGIN = require("clean-webpack-plugin");
const HTML_WEBPACK_PLUGIN = require("html-webpack-plugin");
const PATH = require("path");

module.exports = {
  entry: "./src/index.tsx",
  output: {
    path: PATH.resolve(__dirname, "dist"),
    filename: "index.[hash:8].js",
  },
  devServer: {
    port: 3008,
    hot: true,
    open: true,
  },
  plugins: [
    new CLEAN_WEBPACK_PLUGIN.CleanWebpackPlugin(),
    new HTML_WEBPACK_PLUGIN({
      template: PATH.resolve(__dirname, "src/index.html"),
      filename: "index.html",
      hash: true,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: "style-loader",
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx"],
  },
};
