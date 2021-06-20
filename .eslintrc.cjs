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
            files: ".eslintrc.js",
            extends: ["eslint", "plugin:node/recommended-script"]
        },
        {
            files: ["tests/**/*"],
            env: {
                mocha: true
            }
        }
    ]
};
