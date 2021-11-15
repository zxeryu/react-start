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
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.less$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
    ],
  },
  devServer: {
    historyApiFallback: true,
    contentBase: "./public",
    compress: true,
    port: 3100,
    proxy: {
      "/search": {
        target: "https://www.npmjs.com",
        changeOrigin: true,
      },
    },
  },
};
