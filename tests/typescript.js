/**
 * @fileoverview Typescript scope tests
 * @author Reyad Attiyat
 */
"use strict";

/* eslint-disable no-unused-expressions */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const expect = require("chai").expect,
    parse = require("typescript-eslint-parser").parse,
    analyze = require("..").analyze;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("typescript", () => {
    describe("multiple call signatures", () => {
        it("should create a function scope", () => {
            const ast = parse(`
                function foo(bar: number): number;
                function foo(bar: string): string;
                function foo(bar: string | number): string | number {
                    return bar;
                }
            `);

            const scopeManager = analyze(ast);

            expect(scopeManager.scopes).to.have.length(4);

            const globalScope = scopeManager.scopes[0];

            expect(globalScope.type).to.be.equal("global");
            expect(globalScope.variables).to.have.length(1);
            expect(globalScope.references).to.have.length(0);
            expect(globalScope.isArgumentsMaterialized()).to.be.true;

            // Function scopes
            let scope = scopeManager.scopes[1];

            expect(scope.type).to.be.equal("function");
            expect(scope.variables).to.have.length(2);
            expect(scope.variables[0].name).to.be.equal("arguments");
            expect(scope.isArgumentsMaterialized()).to.be.false;
            expect(scope.references).to.have.length(0);

            scope = scopeManager.scopes[2];
            expect(scope.type).to.be.equal("function");
            expect(scope.variables).to.have.length(2);
            expect(scope.variables[0].name).to.be.equal("arguments");
            expect(scope.isArgumentsMaterialized()).to.be.false;
            expect(scope.references).to.have.length(0);

            scope = scopeManager.scopes[3];
            expect(scope.type).to.be.equal("function");
            expect(scope.variables).to.have.length(2);
            expect(scope.variables[0].name).to.be.equal("arguments");
            expect(scope.isArgumentsMaterialized()).to.be.false;
            expect(scope.references).to.have.length(1);


        });
    });
    describe("Type Annotations", () => {
        it("should scope varaible declartion type annotations", () => {
            const ast = parse(`
                var foo: TypeFoo;
            `);

            const scopeManager = analyze(ast);

            expect(scopeManager.scopes).to.have.length(1);

            const globalScope = scopeManager.scopes[0];

            expect(globalScope.type).to.be.equal("global");
            expect(globalScope.variables).to.have.length(1);
            expect(globalScope.variables[0].name).to.equal("foo");
            expect(globalScope.references).to.have.length(1);
            expect(globalScope.references[0].identifier.name).to.equal("TypeFoo");
        });
        it("should scope function declaration type annotations", () => {
            const ast = parse(`
                function bar(): TypeBar {};
            `);

            const scopeManager = analyze(ast);

            expect(scopeManager.scopes).to.have.length(2);

            const globalScope = scopeManager.scopes[0];

            expect(globalScope.type).to.be.equal("global");
            expect(globalScope.variables).to.have.length(1);
            expect(globalScope.variables[0].name).to.equal("bar");

            // Function scopes
            const scope = scopeManager.scopes[1];

            expect(scope.references).to.have.length(1);
            expect(scope.references[0].identifier.name).to.equal("TypeBar");
        });
        it("should scope function expression type annotations", () => {
            const ast = parse(`
                const bar = function (): TypeBar {};
            `);

            const scopeManager = analyze(ast);

            expect(scopeManager.scopes).to.have.length(2);

            const globalScope = scopeManager.scopes[0];

            expect(globalScope.type).to.be.equal("global");
            expect(globalScope.variables).to.have.length(1);
            expect(globalScope.variables[0].name).to.equal("bar");

            // Function scopes
            const scope = scopeManager.scopes[1];

            expect(scope.references).to.have.length(1);
            expect(scope.references[0].identifier.name).to.equal("TypeBar");
        });
        it("should scope arrow function expression type annotations", () => {
            const ast = parse(`
                var baz = (): TypeBaz => {};
            `);

            const scopeManager = analyze(ast);

            expect(scopeManager.scopes).to.have.length(2);

            const globalScope = scopeManager.scopes[0];

            expect(globalScope.type).to.be.equal("global");
            expect(globalScope.variables).to.have.length(1);
            expect(globalScope.variables[0].name).to.equal("baz");

            // Function scopes
            const scope = scopeManager.scopes[1];

            expect(scope.references).to.have.length(1);
            expect(scope.references[0].identifier.name).to.equal("TypeBaz");
        });
        it("should scope class method declaration type annotations", () => {
            const ast = parse(`
                class A { foobar(): TypeFooBar {} }
            `);

            const scopeManager = analyze(ast);

            expect(scopeManager.scopes).to.have.length(3);

            const globalScope = scopeManager.scopes[0];

            expect(globalScope.type).to.be.equal("global");
            expect(globalScope.variables).to.have.length(1);
            expect(globalScope.variables[0].name).to.equal("A");

            // Method scope
            const scope = scopeManager.scopes[2];

            expect(scope.references).to.have.length(1);
            expect(scope.references[0].identifier.name).to.equal("TypeFooBar");
        });
    });
});
