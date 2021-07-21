/**
 * @fileoverview Build file
 * @author nzakas
 * @copyright jQuery Foundation and other contributors, https://jquery.org/
 * MIT License
 */
/* global echo, exec, exit, set, target */

/* eslint no-console: 0*/
//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import path from "path";
import { fileURLToPath } from "url";

import "shelljs/make.js";
import checker from "npm-license";

const dirname = path.dirname(fileURLToPath(import.meta.url));

// `shelljs/make.js` global command to unset any `set('-e')` (to exit upon
//    first error)
set("+e");

//------------------------------------------------------------------------------
// Settings
//------------------------------------------------------------------------------

const OPEN_SOURCE_LICENSES = [
    /MIT/u, /BSD/u, /Apache/u, /ISC/u, /WTF/u, /Public Domain/u
];

//------------------------------------------------------------------------------
// Data
//------------------------------------------------------------------------------

const NODE = "node",
    NODE_MODULES = "./node_modules",

    // Utilities - intentional extra space at the end of each string
    MOCHA = `${NODE_MODULES}/mocha/bin/_mocha `,
    ESLINT = `${NODE} ${NODE_MODULES}/eslint/bin/eslint `,

    // If switching back to Istanbul when may be working with ESM
    // ISTANBUL = `${NODE} ${NODE_MODULES}/istanbul/lib/cli.js `,
    C8 = `${NODE} ${NODE_MODULES}/c8/bin/c8.js`,

    // Files
    MAKEFILE = "./Makefile.js",
    JS_FILES = "lib/**/*.js",
    TEST_FILES = "tests/*.js",
    CJS_TEST_FILES = "tests/*.cjs";

//------------------------------------------------------------------------------
// Tasks
//------------------------------------------------------------------------------

target.all = function() {
    target.test();
};

target.lint = function() {
    let errors = 0,
        lastReturn;

    echo("Validating Makefile.js");
    lastReturn = exec(ESLINT + MAKEFILE);
    if (lastReturn.code !== 0) {
        errors++;
    }

    echo("Validating JavaScript files");
    lastReturn = exec(ESLINT + JS_FILES);
    if (lastReturn.code !== 0) {
        errors++;
    }

    echo("Validating JavaScript test files");
    lastReturn = exec(ESLINT + TEST_FILES);
    if (lastReturn.code !== 0) {
        errors++;
    }

    echo("Validating CJS JavaScript test files");
    lastReturn = exec(ESLINT + CJS_TEST_FILES);
    if (lastReturn.code !== 0) {
        errors++;
    }

    if (errors) {
        exit(1);
    }
};

target.test = function() {
    let errors = 0;
    let lastReturn = exec(`${NODE} ${MOCHA} -- -R progress -c ${CJS_TEST_FILES}`);

    if (lastReturn.code !== 0) {
        errors++;
    }

    lastReturn = exec(`${C8} ${MOCHA} -- -R progress -c ${TEST_FILES}`);

    if (lastReturn.code !== 0) {
        errors++;
    }

    if (errors) {
        exit(1);
    }

    target.checkLicenses();
};

target.checkLicenses = function() {

    /**
     * Returns true if the given dependency's licenses are all permissable for use in OSS
     * @param  {Object}  dependency object containing the name and licenses of the given dependency
     * @returns {boolean} is permissable dependency
     */
    function isPermissible(dependency) {
        const licenses = dependency.licenses;

        if (Array.isArray(licenses)) {
            return licenses.some(license => isPermissible({
                name: dependency.name,
                licenses: license
            }));
        }

        return OPEN_SOURCE_LICENSES.some(license => license.test(licenses));
    }

    echo("Validating licenses");

    checker.init({
        start: dirname
    }, deps => {
        const impermissible = Object.keys(deps).map(dependency => ({
            name: dependency,
            licenses: deps[dependency].licenses
        })).filter(dependency => !isPermissible(dependency));

        if (impermissible.length) {
            impermissible.forEach(dependency => {
                console.error("%s license for %s is impermissible.",
                    dependency.licenses,
                    dependency.name);
            });
            exit(1);
        }
    });
};
