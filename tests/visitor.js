// Copyright (C) 2013 Yusuke Suzuki <utatane.tea@gmail.com>
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright
//     notice, this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright
//     notice, this list of conditions and the following disclaimer in the
//     documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
// DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
// (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
// LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
// ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
// THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
"use strict";

const expect = require("chai").expect;
const Visitor = require("../lib/visitor");

describe("object expression", () =>
    it("properties", () => {
        const tree = {
            type: "ObjectExpression",
            properties: [{
                type: "Property",
                key: {
                    type: "Identifier",
                    name: "a"
                },
                value: {
                    type: "Identifier",
                    name: "b"
                }
            }]
        };

        const log = [];

        const visitor = new Visitor({
            Identifier(node) {
                return log.push(node.name);
            }
        });

        visitor.visit(tree);

        return expect(log).to.deep.equal(["a", "b"]);
    })
);

describe("inherit Visitor", () => {
    it("log names", () => {
        const tree = {
            type: "TestStatement",
            id: {
                type: "Identifier",
                name: "decl"
            },
            params: [{
                type: "Identifier",
                name: "a"
            }],
            defaults: [{
                type: "Literal",
                value: 20
            }],
            rest: {
                type: "Identifier",
                name: "rest"
            },
            body: {
                type: "BlockStatement",
                body: []
            }
        };

        class Derived extends Visitor {
            constructor() {
                super();
                this.log = [];
            }

            Identifier(node) {
                return this.log.push(node.name);
            }
        }

        const visitor = new Derived();

        visitor.visit(tree);

        return expect(visitor.log).to.deep.equal(["decl", "a", "rest"]);
    });

    return it("customize behavior", () => {
        const tree = {
            type: "TestStatement",
            id: {
                type: "Identifier",
                name: "decl"
            },
            params: [{
                type: "Identifier",
                name: "a"
            }],
            defaults: [{
                type: "Literal",
                value: 20
            }],
            rest: {
                type: "Identifier",
                name: "rest"
            },
            body: {
                type: "BlockStatement",
                body: [{
                    type: "Identifier",
                    value: "XXX"
                }]
            }
        };

        class Derived extends Visitor {
            constructor() {
                super();
                this.log = [];
            }

            /* eslint-disable class-methods-use-this */
            BlockStatement() {}
            /* eslint-enable class-methods-use-this */

            Identifier(node) {
                return this.log.push(node.name);
            }
        }

        const visitor = new Derived();

        visitor.visit(tree);

        return expect(visitor.log).to.deep.equal(["decl", "a", "rest"]);
    });
});

describe("bidirectional relationship at non visitor keys.", () => {
    it("ExpressionStatement <-> Identifier", () => {
        const tree = {
            type: "ExpressionStatement",
            expression: {
                type: "Identifier",
                name: "foo"
            }
        };

        tree.expression.parent = tree;

        const log = [];

        const visitor = new Visitor({
            Identifier(node) {
                return log.push(node.name);
            }
        });

        visitor.visit(tree);

        return expect(log).to.deep.equal(["foo"]);
    });
});
