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
    external: ["lodash", "react", "@reactorx/core", "rxjs", "rxjs/operators", "@emotion/react", "@react-start/request"],
  },
  {
    input: "../../.tmp/@react-start/cheng-high/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [dts()],
  },
];
