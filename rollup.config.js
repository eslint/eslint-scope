export default {
    input: "./lib/index.js",
    external: ["fs", "assert", "estraverse", "esrecurse"],
    output: {
        exports: "named",
        format: "cjs",
        file: "dist/eslint-scope.cjs"
    }
};
