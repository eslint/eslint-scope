import eslintConfigESLint from "eslint-config-eslint";
import globals from "globals";
import eslintPluginChaiFriendly from "eslint-plugin-chai-friendly";

export default [
    {
        ignores: [
            "dist/",
            "coverage/"
        ]
    },
    ...eslintConfigESLint,
    {
        files: ["lib/**"],
        rules: {
            "no-underscore-dangle": "off"
        }
    },
    {
        files: ["tests/**"],
        ignores: ["tests/util/**"],
        languageOptions: {
            globals: {
                ...globals.mocha
            }
        },
        plugins: {
            "chai-friendly": eslintPluginChaiFriendly
        },
        rules: {
            "no-unused-expressions": "off",
            "chai-friendly/no-unused-expressions": "error"
        }
    },
    {
        files: ["Makefile.js"],
        languageOptions: {
            globals: {
                ...globals.shelljs
            }
        },
        rules: {
            "no-console": "off"
        }
    }
];
