import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import terser from "@rollup/plugin-terser";
import livereload from "rollup-plugin-livereload";
import postcss from "rollup-plugin-postcss";
import serve from "rollup-plugin-serve";

const isDev = process.env.ROLLUP_WATCH === "true" || process.env.BUILD_MODE === "dev";

export default {
    input: "src/main.js",
    output: {
        file: "dist/bundle.js",
        format: "esm",
        sourcemap: true,
    },
    plugins: [
        replace({
            preventAssignment: true,
            values: {
                __DEFAULT_MENDIX_REMOTE_URL__: JSON.stringify(
                    process.env.MENDIX_REMOTE_URL || "https://tb100100.mendixcloud.com"
                ),
            },
        }),
        resolve({
            browser: true,
        }),
        commonjs(),
        postcss(),
        isDev &&
            serve({
                open: true,
                contentBase: ["dist", "public"],
                port: 3000,
            }),
        isDev && livereload("dist"),
        !isDev && terser(),
    ],
};
