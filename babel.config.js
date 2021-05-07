module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "12",
        },
      },
    ],
    {
      plugins: [["@babel/plugin-transform-typescript", { isTSX: true }], ["@babel/plugin-transform-react-jsx"]],
    },
    "@emotion/babel-preset-css-prop",
  ],
};
