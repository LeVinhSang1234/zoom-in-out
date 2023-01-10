import typescript from "rollup-plugin-typescript2";

import pkg from "./package.json"

const config = {
  input: "src/index.tsx",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      exports: "named",
      sourcemap: true,
      strict: false,
    },
  ],
  plugins: [typescript({ target: "es5" })],
  external: ["react", "react-dom"],
};

export default config;
