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

    describe("Decorators", () => {
        it("should create class decorator reference", () => {
            const ast = parse(`
                @Foo
                class Bar { }
            `);

            const scopeManager = analyze(ast);

            expect(scopeManager.scopes).to.have.length(2);

            const globalScope = scopeManager.scopes[0];

            expect(globalScope.type).to.be.equal("global");
            expect(globalScope.variables).to.have.length(1);
            expect(globalScope.references).to.have.length(0);
            expect(globalScope.isArgumentsMaterialized()).to.be.true;

            // Class scope
            const scope = scopeManager.scopes[1];

            expect(scope.type).to.be.equal("class");
            expect(scope.block.type).to.be.equal("ClassDeclaration");
            expect(scope.variables).to.have.length(1);
            expect(scope.variables[0].name).to.be.equal("Bar");
            expect(scope.references).to.have.length(1);
            expect(scope.references[0].identifier.name).to.be.equal("Foo");
        });

        it("should create class decorator factory reference", () => {
            const ast = parse(`
                @Foo("Hello", world)
                class Bar { }
            `);

            const scopeManager = analyze(ast);

            expect(scopeManager.scopes).to.have.length(2);

            const globalScope = scopeManager.scopes[0];

            expect(globalScope.type).to.be.equal("global");
            expect(globalScope.variables).to.have.length(1);
            expect(globalScope.references).to.have.length(0);
            expect(globalScope.isArgumentsMaterialized()).to.be.true;

            // Class scope
            const scope = scopeManager.scopes[1];

            expect(scope.type).to.be.equal("class");
            expect(scope.block.type).to.be.equal("ClassDeclaration");
            expect(scope.variables).to.have.length(1);
            expect(scope.variables[0].name).to.be.equal("Bar");
            expect(scope.references).to.have.length(2);
            expect(scope.references[0].identifier.name).to.be.equal("Foo");
            expect(scope.references[1].identifier.name).to.be.equal("world");
        });

        it("should create class property decorator reference", () => {
            const ast = parse(`
                class Bar { 
                    @Foo
                    baz 
                }
            `);

            const scopeManager = analyze(ast);

            expect(scopeManager.scopes).to.have.length(2);

            const globalScope = scopeManager.scopes[0];

            expect(globalScope.type).to.be.equal("global");
            expect(globalScope.variables).to.have.length(1);
            expect(globalScope.references).to.have.length(0);
            expect(globalScope.isArgumentsMaterialized()).to.be.true;

            // Class scope
            const scope = scopeManager.scopes[1];

            expect(scope.type).to.be.equal("class");
            expect(scope.block.type).to.be.equal("ClassDeclaration");
            expect(scope.variables).to.have.length(1);
            expect(scope.variables[0].name).to.be.equal("Bar");
            expect(scope.references).to.have.length(2);
            expect(scope.references[0].identifier.name).to.be.equal("baz");
            expect(scope.references[1].identifier.name).to.be.equal("Foo");
        });

        it("should create class property decorator reference", () => {
            const ast = parse(`
                class Bar { 
                    @Foo(zzz)
                    baz 
                }
            `);

            const scopeManager = analyze(ast);

            expect(scopeManager.scopes).to.have.length(2);

            const globalScope = scopeManager.scopes[0];

            expect(globalScope.type).to.be.equal("global");
            expect(globalScope.variables).to.have.length(1);
            expect(globalScope.references).to.have.length(0);
            expect(globalScope.isArgumentsMaterialized()).to.be.true;

            // Class scope
            const scope = scopeManager.scopes[1];

            expect(scope.type).to.be.equal("class");
            expect(scope.block.type).to.be.equal("ClassDeclaration");
            expect(scope.variables).to.have.length(1);
            expect(scope.variables[0].name).to.be.equal("Bar");
            expect(scope.references).to.have.length(3);
            expect(scope.references[0].identifier.name).to.be.equal("baz");
            expect(scope.references[1].identifier.name).to.be.equal("Foo");
            expect(scope.references[2].identifier.name).to.be.equal("zzz");
        });

        it("should create class method decorator reference", () => {
            const ast = parse(`
                class Bar { 
                    @Foo
                    baz() { } 
                }
            `);

            const scopeManager = analyze(ast);

            expect(scopeManager.scopes).to.have.length(3);

            const globalScope = scopeManager.scopes[0];

            expect(globalScope.type).to.be.equal("global");
            expect(globalScope.variables).to.have.length(1);
            expect(globalScope.references).to.have.length(0);
            expect(globalScope.isArgumentsMaterialized()).to.be.true;

            // Class scope
            let scope = scopeManager.scopes[1];

            expect(scope.type).to.be.equal("class");
            expect(scope.block.type).to.be.equal("ClassDeclaration");
            expect(scope.variables).to.have.length(1);
            expect(scope.variables[0].name).to.be.equal("Bar");
            expect(scope.references).to.have.length(1);
            expect(scope.references[0].identifier.name).to.be.equal("Foo");

            // Method scope
            scope = scopeManager.scopes[2];
            expect(scope.type).to.be.equal("function");
            expect(scope.block.type).to.be.equal("FunctionExpression");
            expect(scope.variables).to.have.length(1);
            expect(scope.variables[0].name).to.be.equal("arguments");
            expect(scope.references).to.have.length(0);
        });

        it("should create class method decorator factory reference", () => {
            const ast = parse(`
                class Bar { 
                    @Foo(yyy)
                    baz() { } 
                }
            `);

            const scopeManager = analyze(ast);

            expect(scopeManager.scopes).to.have.length(3);

            const globalScope = scopeManager.scopes[0];

            expect(globalScope.type).to.be.equal("global");
            expect(globalScope.variables).to.have.length(1);
            expect(globalScope.references).to.have.length(0);
            expect(globalScope.isArgumentsMaterialized()).to.be.true;

            // Class scope
            let scope = scopeManager.scopes[1];

            expect(scope.type).to.be.equal("class");
            expect(scope.block.type).to.be.equal("ClassDeclaration");
            expect(scope.variables).to.have.length(1);
            expect(scope.variables[0].name).to.be.equal("Bar");
            expect(scope.references).to.have.length(2);
            expect(scope.references[0].identifier.name).to.be.equal("Foo");
            expect(scope.references[1].identifier.name).to.be.equal("yyy");

            // Method scope
            scope = scopeManager.scopes[2];
            expect(scope.type).to.be.equal("function");
            expect(scope.block.type).to.be.equal("FunctionExpression");
            expect(scope.variables).to.have.length(1);
            expect(scope.variables[0].name).to.be.equal("arguments");
            expect(scope.references).to.have.length(0);
        });

        it("should create class accessor method decorator reference", () => {
            const ast = parse(`
                class Bar { 
                    @Foo
                    get baz() { } 
                }
            `);

            const scopeManager = analyze(ast);

            expect(scopeManager.scopes).to.have.length(3);

            const globalScope = scopeManager.scopes[0];

            expect(globalScope.type).to.be.equal("global");
            expect(globalScope.variables).to.have.length(1);
            expect(globalScope.references).to.have.length(0);
            expect(globalScope.isArgumentsMaterialized()).to.be.true;

            // Class scope
            let scope = scopeManager.scopes[1];

            expect(scope.type).to.be.equal("class");
            expect(scope.block.type).to.be.equal("ClassDeclaration");
            expect(scope.variables).to.have.length(1);
            expect(scope.variables[0].name).to.be.equal("Bar");
            expect(scope.references).to.have.length(1);
            expect(scope.references[0].identifier.name).to.be.equal("Foo");

            // Method scope
            scope = scopeManager.scopes[2];
            expect(scope.type).to.be.equal("function");
            expect(scope.block.type).to.be.equal("FunctionExpression");
            expect(scope.variables).to.have.length(1);
            expect(scope.variables[0].name).to.be.equal("arguments");
            expect(scope.references).to.have.length(0);
        });

        it("should create class method decorator factory reference", () => {
            const ast = parse(`
                class Bar { 
                    @Foo(yyy)
                    get baz() { } 
                }
            `);

            const scopeManager = analyze(ast);

            expect(scopeManager.scopes).to.have.length(3);

            const globalScope = scopeManager.scopes[0];

            expect(globalScope.type).to.be.equal("global");
            expect(globalScope.variables).to.have.length(1);
            expect(globalScope.references).to.have.length(0);
            expect(globalScope.isArgumentsMaterialized()).to.be.true;

            // Class scope
            let scope = scopeManager.scopes[1];

            expect(scope.type).to.be.equal("class");
            expect(scope.block.type).to.be.equal("ClassDeclaration");
            expect(scope.variables).to.have.length(1);
            expect(scope.variables[0].name).to.be.equal("Bar");
            expect(scope.references).to.have.length(2);
            expect(scope.references[0].identifier.name).to.be.equal("Foo");
            expect(scope.references[1].identifier.name).to.be.equal("yyy");

            // Method scope
            scope = scopeManager.scopes[2];
            expect(scope.type).to.be.equal("function");
            expect(scope.block.type).to.be.equal("FunctionExpression");
            expect(scope.variables).to.have.length(1);
            expect(scope.variables[0].name).to.be.equal("arguments");
            expect(scope.references).to.have.length(0);
        });

    });
});
