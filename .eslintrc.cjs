"use strict";

module.exports = {
    root: true,
    extends: [
        "eslint",
        "plugin:node/recommended-module"
    ],
    parserOptions: {
        sourceType: "module",
        ecmaVersion: "2020"
    },
    overrides: [
        {
            files: ["tests/**/*"],
            env: {
                mocha: true
            }
        },
        {
            files: ["*.cjs"],
            extends: ["eslint", "plugin:node/recommended-script"],
            parserOptions: {
                sourceType: "script",
                ecmaVersion: "2020"
            }
        }
    ],
    ignorePatterns: ["/dist", "/coverage"]
};
