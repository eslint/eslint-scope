/**
 * @fileoverview Tests for class fields syntax.
 * @author Toru Nagashima
 */

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

            scopes = manager.globalScope.childScopes;
        });

        it("should create a class scope.", () => {
            assert.strictEqual(scopes.length, 1);
            assert.strictEqual(scopes[0].type, "class");
        });

        it("The class scope has no references.", () => {
            const classScope = scopes[0];

            assert.strictEqual(classScope.references.length, 0);
        });

        it("The class scope has only the variable 'C'; it doesn't have the field name 'f'.", () => {
            const classScope = scopes[0];

            assert.strictEqual(classScope.variables.length, 1);
            assert.strictEqual(classScope.variables[0].name, "C");
        });

        it("The class scope has a function scope.", () => {
            const classScope = scopes[0];

            assert.strictEqual(classScope.childScopes.length, 1);
            assert.strictEqual(classScope.childScopes[0].type, "function");
        });

        it("The function scope has only the reference 'g'.", () => {
            const classScope = scopes[0];
            const fieldInitializerScope = classScope.childScopes[0];

            assert.strictEqual(fieldInitializerScope.references.length, 1);
            assert.strictEqual(fieldInitializerScope.references[0].identifier.name, "g");
        });

        it("The function scope has no variables.", () => {
            const classScope = scopes[0];
            const fieldInitializerScope = classScope.childScopes[0];

            assert.strictEqual(fieldInitializerScope.variables.length, 0);
        });
    });

    describe("class C { f }", () => {
        let scopes;

        beforeEach(() => {
            const ast = espree.parse("class C { f }", { ecmaVersion: 13 });
            const manager = analyze(ast, { ecmaVersion: 13, childVisitorKeys: KEYS });

            scopes = manager.globalScope.childScopes;
        });

        it("should create a class scope.", () => {
            assert.strictEqual(scopes.length, 1);
            assert.strictEqual(scopes[0].type, "class");
        });

        it("The class scope has no references.", () => {
            const classScope = scopes[0];

            assert.strictEqual(classScope.references.length, 0);
        });

        it("The class scope has no child scopes; fields that don't have initializers don't create any function scopes.", () => {
            const classScope = scopes[0];

            assert.strictEqual(classScope.childScopes.length, 0);
        });

        it("The class scope has only the variable 'C'; it doesn't have the field name 'f'.", () => {
            const classScope = scopes[0];

            assert.strictEqual(classScope.variables.length, 1);
            assert.strictEqual(classScope.variables[0].name, "C");
        });
    });

    describe("class C { #f = g }", () => {
        let scopes;

        beforeEach(() => {
            const ast = espree.parse("class C { #f = g }", { ecmaVersion: 13 });
            const manager = analyze(ast, { ecmaVersion: 13, childVisitorKeys: KEYS });

            scopes = manager.globalScope.childScopes;
        });

        it("should create a class scope.", () => {
            assert.strictEqual(scopes.length, 1);
            assert.strictEqual(scopes[0].type, "class");
        });

        it("The class scope has no references.", () => {
            const classScope = scopes[0];

            assert.strictEqual(classScope.references.length, 0);
        });

        it("The class scope has only the variable 'C'; it doesn't have the field name '#f'.", () => {
            const classScope = scopes[0];

            assert.strictEqual(classScope.variables.length, 1);
            assert.strictEqual(classScope.variables[0].name, "C");
        });

        it("The class scope has a function scope.", () => {
            const classScope = scopes[0];

            assert.strictEqual(classScope.childScopes.length, 1);
            assert.strictEqual(classScope.childScopes[0].type, "function");
        });

        it("The function scope has only the reference 'g'.", () => {
            const classScope = scopes[0];
            const fieldInitializerScope = classScope.childScopes[0];

            assert.strictEqual(fieldInitializerScope.references.length, 1);
            assert.strictEqual(fieldInitializerScope.references[0].identifier.name, "g");
        });

        it("The function scope has no variables.", () => {
            const classScope = scopes[0];
            const fieldInitializerScope = classScope.childScopes[0];

            assert.strictEqual(fieldInitializerScope.variables.length, 0);
        });
    });

    describe("class C { [fname] }", () => {
        let scopes;

        beforeEach(() => {
            const ast = espree.parse("class C { [fname] }", { ecmaVersion: 13 });
            const manager = analyze(ast, { ecmaVersion: 13, childVisitorKeys: KEYS });

            scopes = manager.globalScope.childScopes;
        });

        it("should create a class scope.", () => {
            assert.strictEqual(scopes.length, 1);
            assert.strictEqual(scopes[0].type, "class");
        });

        it("The class scope has only the reference 'fname'.", () => {
            const classScope = scopes[0];

            assert.strictEqual(classScope.references.length, 1);
            assert.strictEqual(classScope.references[0].identifier.name, "fname");
        });

        it("The class scope has no child scopes; fields that don't have initializers don't create any function scopes.", () => {
            const classScope = scopes[0];

            assert.strictEqual(classScope.childScopes.length, 0);
        });
    });

    describe("class C { [fname] = value }", () => {
        let scopes;

        beforeEach(() => {
            const ast = espree.parse("class C { [fname] = value }", { ecmaVersion: 13 });
            const manager = analyze(ast, { ecmaVersion: 13, childVisitorKeys: KEYS });

            scopes = manager.globalScope.childScopes;
        });

        it("should create a class scope.", () => {
            assert.strictEqual(scopes.length, 1);
            assert.strictEqual(scopes[0].type, "class");
        });

        it("The class scope has only the reference 'fname'; it doesn't have the reference 'value'.", () => {
            const classScope = scopes[0];

            assert.strictEqual(classScope.references.length, 1);
            assert.strictEqual(classScope.references[0].identifier.name, "fname");
        });

        it("The class scope has a function scope.", () => {
            const classScope = scopes[0];

            assert.strictEqual(classScope.childScopes.length, 1);
            assert.strictEqual(classScope.childScopes[0].type, "function");
        });

        it("The function scope has the reference 'value'.", () => {
            const classScope = scopes[0];
            const fieldInitializerScope = classScope.childScopes[0];

            assert.strictEqual(fieldInitializerScope.references.length, 1);
            assert.strictEqual(fieldInitializerScope.references[0].identifier.name, "value");
        });

        it("The function scope has no variables.", () => {
            const classScope = scopes[0];
            const fieldInitializerScope = classScope.childScopes[0];

            assert.strictEqual(fieldInitializerScope.variables.length, 0);
        });
    });
    describe("class C { #f = g; e = this.#f }", () => {
        let scopes;

        beforeEach(() => {
            const ast = espree.parse("class C { #f = g; e = this.#f }", { ecmaVersion: 13 });
            const manager = analyze(ast, { ecmaVersion: 13, childVistorKeys: KEYS });

            scopes = manager.globalScope.childScopes;
        });

        it("should create a class scope.", () => {
            assert.strictEqual(scopes.length, 1);
            assert.strictEqual(scopes[0].type, "class");
        });

        it("The class scope has no references.", () => {
            const classScope = scopes[0];

            assert.strictEqual(classScope.references.length, 0);
        });

        it("The class scope has only the variable 'C'; it doesn't have the field names '#f' or 'e'.", () => {
            const classScope = scopes[0];

            assert.strictEqual(classScope.variables.length, 1);
            assert.strictEqual(classScope.variables[0].name, "C");
        });

        it("The class scope has two function scopes.", () => {
            const classScope = scopes[0];

            assert.strictEqual(classScope.childScopes.length, 2);
            assert.strictEqual(classScope.childScopes[0].type, "function");
            assert.strictEqual(classScope.childScopes[1].type, "function");
        });

        it("The first function scope has only the reference 'g'.", () => {
            const classScope = scopes[0];
            const fieldInitializerScope = classScope.childScopes[0];

            assert.strictEqual(fieldInitializerScope.references.length, 1);
            assert.strictEqual(fieldInitializerScope.references[0].identifier.name, "g");
        });

        it("The first function scope has no variables.", () => {
            const classScope = scopes[0];
            const fieldInitializerScope = classScope.childScopes[0];

            assert.strictEqual(fieldInitializerScope.variables.length, 0);
        });

        it("The second function scope has no references.", () => {
            const classScope = scopes[0];
            const fieldInitializerScope = classScope.childScopes[1];

            assert.strictEqual(fieldInitializerScope.references.length, 0);
        });

        it("The second function scope has no variables.", () => {
            const classScope = scopes[0];
            const fieldInitializerScope = classScope.childScopes[1];

            assert.strictEqual(fieldInitializerScope.variables.length, 0);
        });
    });
});
