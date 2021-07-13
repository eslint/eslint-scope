/**
 * @fileoverview Tests for checking that the commonjs entry points are still accessible
 * @author Mike Reinstein
 */

// eslint-disable-next-line strict
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("assert");
const eslintScope = require("../dist/eslint-scope.cjs");


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("commonjs", () => {
    it("is an object", () => {
        assert.strictEqual(typeof eslintScope, "object");
    });

    it("has exports", () => {
        assert.strictEqual(typeof eslintScope.version, "string");

        [
            "analyze",
            "Reference",
            "Scope",
            "ScopeManager",
            "Variable"
        ].forEach(prop => {
            assert.strictEqual(typeof eslintScope[prop], "function");
        });
    });
});
