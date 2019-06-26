"use strict";

module.exports = {
    root: true,
    extends: [
        "eslint"
    ],
    overrides: [
        {
            files: ["tests/**/*"],
            env: {
                mocha: true
            }
        }
    ]
};
