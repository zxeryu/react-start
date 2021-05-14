import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import dts from "rollup-plugin-dts";

export default [
  {
    input: "index.ts",
    output: [
      {
        file: "dist/index.js",
        format: "cjs",
      },
      {
        file: "dist/index.es.js",
        format: "es",
        entryFileNames: "[name].es.js",
        chunkFileNames: "[name]-[hash].es.js",
      },
    ],
    plugins: [
      resolve({
        extensions: [".ts", ".tsx", ".mjs", ".js", ".jsx"],
      }),
      babel({
        configFile: "../../babel.config.js",
        babelHelpers: "bundled",
        extensions: [".ts", ".tsx", ".mjs", ".js", ".jsx"],
      }),
    ],
    external: [
      "lodash",
      "react",
      "formik",
      "@material-ui/core",
      "@material-ui/icons",
      "@emotion/react",
      "@emotion/styled",
      "@react-start/hooks",
    ],
  },
  {
    input: "../../.tmp/@react-start/components/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [dts()],
  },
];
