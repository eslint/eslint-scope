"use strict";

const Syntax = {
    ObjectExpression: "ObjectExpression",
    ObjectPattern: "ObjectPattern"
};

const BREAK = "BREAK";
const SKIP = "SKIP";

function isNode(node) {
    if (node === null) {
        return false;
    }
    return typeof node === "object" && typeof node.type === "string";
}

function isProperty(nodeType, key) {
    return (nodeType === Syntax.ObjectExpression || nodeType === Syntax.ObjectPattern) && key === "properties";
}

class Element {
    constructor(node, path, wrap, ref) {
        this.node = node;
        this.path = path;
        this.wrap = wrap;
        this.ref = ref;
    }
}

class Traverser {
    constructor() {
        this.__worklist = [];
        this.__leavelist = [];
        this.__current = null;
        this.__state = null;
    }

    parents() {

        // first node is sentinel
        const result = [];

        for (let i = 1; i < this.__leavelist.length; ++i) {
            result.push(this.__leavelist[i].node);
        }

        return result;
    }

    current() {
        return this.__current.node;
    }

    skip() {
        this.__state = SKIP;
    }

    break() {
        this.__state = BREAK;
    }

    traverse(root, visitor) {
        let ret;

        this.visitor = visitor;
        this.root = root;

        const sentinel = {};

        // reference
        const worklist = this.__worklist;
        const leavelist = this.__leavelist;

        // initialize
        worklist.push(new Element(root, null, null, null));
        leavelist.push(new Element(null, null, null, null));

        while (worklist.length) {
            let element = worklist.pop();

            if (element === sentinel) {
                element = leavelist.pop();
                const previous = this.__current;

                this.__current = element;
                this.__state = null;

                if (visitor.leave) {
                    ret = visitor.leave.call(this, element.node, this.__leavelist[this.__leavelist.length - 1].node);
                }

                this.__current = previous;

                if (this.__state === BREAK || ret === BREAK) {
                    return;
                }
                continue;
            }

            if (element.node) {
                const previous = this.__current;

                this.__current = element;
                this.__state = null;

                if (visitor.enter) {
                    ret = visitor.enter.call(this, element.node, this.__leavelist[this.__leavelist.length - 1].node);
                }

                this.__current = previous;

                if (this.__state === BREAK || ret === BREAK) {
                    return;
                }

                worklist.push(sentinel);
                leavelist.push(element);

                if (this.__state === SKIP || ret === SKIP) {
                    continue;
                }

                const node = element.node;
                const nodeType = node.type || element.wrap;

                let candidates;

                if (nodeType === "Program") {
                    candidates = ["body"];
                } else {
                    candidates = Object.keys(node).filter(key => [
                        "parent",
                        "leadingComments",
                        "trailingComments"
                    ].indexOf(key) === -1);
                }

                let current = candidates.length;

                while ((current -= 1) >= 0) {
                    const key = candidates[current];

                    const candidate = node[key];

                    if (!candidate) {
                        continue;
                    }

                    if (Array.isArray(candidate)) {
                        let current2 = candidate.length;

                        while ((current2 -= 1) >= 0) {
                            if (!candidate[current2]) {
                                continue;
                            }
                            if (isProperty(nodeType, candidates[current])) {
                                element = new Element(candidate[current2], [key, current2], "Property", null);
                            } else if (isNode(candidate[current2])) {
                                element = new Element(candidate[current2], [key, current2], null, null);
                            } else {
                                continue;
                            }
                            worklist.push(element);
                        }
                    } else if (isNode(candidate)) {
                        worklist.push(new Element(candidate, key, null, null));
                    }
                }
            }
        }
    }
}

Traverser.VisitorOption = {
    Break: BREAK,
    Skip: SKIP
};

module.exports = Traverser;
