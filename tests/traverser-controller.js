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

const Traverser = require("../lib/traverser");
const Tracer = require("./util/traverser-tracer");
const checkTrace = require("./util/traverser-check-trace");

describe("traverser", () => {
    it("traverse", () => {
        const traverser = new Traverser();
        const tracer = new Tracer();
        const tree = {
            type: "ObjectExpression",
            properties: [{
                key: {
                    type: "Identifier",
                    name: "a"
                },
                value: {
                    type: "Identifier",
                    name: "a"
                }
            }]
        };

        traverser.traverse(tree, {
            enter(node) {
                tracer.log(`enter - ${node.type}`);
            },

            leave(node) {
                tracer.log(`leave - ${node.type}`);
            }
        });

        checkTrace(tracer.result(), `
            enter - ObjectExpression
            enter - undefined
            enter - Identifier
            leave - Identifier
            enter - Identifier
            leave - Identifier
            leave - undefined
            leave - ObjectExpression
        `);
    });

    it("traverses all keys except 'parent', 'leadingComments', and 'trailingComments'", () => {
        const fakeAst = {
            type: "Program",
            body: [
                {
                    type: "ExpressionStatement",
                    leadingComments: {
                        type: "Line"
                    },
                    trailingComments: {
                        type: "Block"
                    }
                },
                {
                    type: "FooStatement",
                    foo: {
                        type: "BarStatement"
                    }
                }
            ]
        };

        fakeAst.body[0].parent = fakeAst;

        const enteredNodes = [];
        const exitedNodes = [];

        const traverser = new Traverser();

        traverser.traverse(fakeAst, {
            enter: node => enteredNodes.push(node),
            leave: node => exitedNodes.push(node)
        });

        expect(enteredNodes).to.deep.equal([fakeAst, fakeAst.body[0], fakeAst.body[1], fakeAst.body[1].foo]);
        expect(exitedNodes).to.deep.equal([fakeAst.body[0], fakeAst.body[1].foo, fakeAst.body[1], fakeAst]);
    });
});
