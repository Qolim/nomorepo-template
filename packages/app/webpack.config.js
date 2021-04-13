const CLEAN_WEBPACK_PLUGIN = require("clean-webpack-plugin");
const HTML_WEBPACK_PLUGIN = require("html-webpack-plugin");
const MINI_CSS_EXTRACT_PLUGIN = require("mini-css-extract-plugin");
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
    contentBase: PATH.resolve(__dirname, "dist"),
  },
  plugins: [
    new CLEAN_WEBPACK_PLUGIN.CleanWebpackPlugin(),
    new MINI_CSS_EXTRACT_PLUGIN({ filename: "index.css" }),
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
        use: [{ loader: "style-loader" }, { loader: "css-loader" }],
      },
      {
        test: /\.tsx?$/,
        use: [{ loader: "ts-loader" }],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx"],
  },
};
