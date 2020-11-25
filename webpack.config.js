module.exports = {
  entry: {
    app: "./src/index.tsx",
  },
  output: {
    filename: "build.js",
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  mode: "development",
  optimization: {},
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: "babel-loader",
      },
    ],
  },
  devServer: {
    contentBase: "./public",
    compress: true,
    port: 3000,
  },
};
