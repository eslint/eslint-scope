/*
  Copyright (C) 2014 Yusuke Suzuki <utatane.tea@gmail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
"use strict";

const Syntax = {
    ObjectExpression: "ObjectExpression",
    ObjectPattern: "ObjectPattern"
};

function isNode(node) {
    if (node === null) {
        return false;
    }
    return typeof node === "object" && typeof node.type === "string";
}

function isProperty(nodeType, key) {
    return (nodeType === Syntax.ObjectExpression || nodeType === Syntax.ObjectPattern) && key === "properties";
}

class Visitor {

    constructor(visitor) {
        this.__visitor = visitor || this;
    }

    visitChildren(node) {
        if (node === null) {
            return;
        }

        const type = node.type || Syntax.Property;

        let children;

        if (type === "Program") {
            children = ["body"];
        } else {
            children = Object.keys(node).filter(key => [
                "parent",
                "leadingComments",
                "trailingComments"
            ].indexOf(key) === -1);
        }

        for (let i = 0; i < children.length; ++i) {
            const child = node[children[i]];

            if (child) {
                if (Array.isArray(child)) {
                    for (let j = 0; j < child.length; ++j) {
                        if (child[j]) {
                            if (isNode(child[j]) || isProperty(type, children[i])) {
                                this.visit(child[j]);
                            }
                        }
                    }
                } else if (isNode(child)) {
                    this.visit(child);
                }
            }
        }
    }

    visit(node) {
        if (node === null) {
            return;
        }

        const type = node.type || Syntax.Property;

        if (this.__visitor[type]) {
            this.__visitor[type].call(this, node);
            return;
        }
        this.visitChildren(node);
    }
}

module.exports = Visitor;

/* vim: set sw=4 ts=4 et tw=80 : */
