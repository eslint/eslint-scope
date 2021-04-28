"use strict";

const assert = require("assert");
const espree = require("espree");
const { KEYS } = require("eslint-visitor-keys");
const { analyze } = require("../lib/index");

describe("Class fields", () => {
    describe("class C { f = g }", () => {
        let scopes;

        beforeEach(() => {
            const ast = espree.parse("class C { f = g }", { ecmaVersion: 13 });
            const manager = analyze(ast, { ecmaVersion: 13, childVisitorKeys: KEYS });

            scopes = [manager.globalScope, ...manager.globalScope.childScopes];
        });

        it("The class scope has only the reference 'g'.", () => {
            const lastScope = scopes[scopes.length - 1];

            assert.strictEqual(lastScope.references.length, 1);
            assert.strictEqual(lastScope.references[0].identifier.name, "g");
        });

        it("The class scope has only the variable 'C' (doesn't have 'f').", () => {
            const lastScope = scopes[scopes.length - 1];

            assert.strictEqual(lastScope.variables.length, 1);
            assert.strictEqual(lastScope.variables[0].name, "C");
        });
    });

    describe("class C { #f = g }", () => {
        let scopes;

        beforeEach(() => {
            const ast = espree.parse("class C { #f = g }", { ecmaVersion: 13 });
            const manager = analyze(ast, { ecmaVersion: 13, childVisitorKeys: KEYS });

            scopes = [manager.globalScope, ...manager.globalScope.childScopes];
        });

        it("The class scope has only the reference 'g'.", () => {
            const lastScope = scopes[scopes.length - 1];

            assert.strictEqual(lastScope.references.length, 1);
            assert.strictEqual(lastScope.references[0].identifier.name, "g");
        });

        it("The class scope has only the variable 'C' (doesn't have '#f').", () => {
            const lastScope = scopes[scopes.length - 1];

            assert.strictEqual(lastScope.variables.length, 1);
            assert.strictEqual(lastScope.variables[0].name, "C");
        });
    });

    describe("class C { [fname] }", () => {
        let scopes;

        beforeEach(() => {
            const ast = espree.parse("class C { [fname] }", { ecmaVersion: 13 });
            const manager = analyze(ast, { ecmaVersion: 13, childVisitorKeys: KEYS });

            scopes = [manager.globalScope, ...manager.globalScope.childScopes];
        });

        it("The class scope has only the reference 'fname'.", () => {
            const lastScope = scopes[scopes.length - 1];

            assert.strictEqual(lastScope.references.length, 1);
            assert.strictEqual(lastScope.references[0].identifier.name, "fname");
        });
    });

    describe("class C { [fname] = value }", () => {
        let scopes;

        beforeEach(() => {
            const ast = espree.parse("class C { [fname] = value }", { ecmaVersion: 13 });
            const manager = analyze(ast, { ecmaVersion: 13, childVisitorKeys: KEYS });

            scopes = [manager.globalScope, ...manager.globalScope.childScopes];
        });

        it("The class scope has only the references 'fname' and 'value'.", () => {
            const lastScope = scopes[scopes.length - 1];

            assert.strictEqual(lastScope.references.length, 2);
            assert.strictEqual(lastScope.references[0].identifier.name, "fname");
            assert.strictEqual(lastScope.references[1].identifier.name, "value");
        });
    });
});
