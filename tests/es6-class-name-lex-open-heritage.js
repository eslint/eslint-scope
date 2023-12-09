// -*- coding: utf-8 -*-
//  Copyright (C) 2014 Yusuke Suzuki <utatane.tea@gmail.com>
//
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//    * Redistributions of source code must retain the above copyright
//      notice, this list of conditions and the following disclaimer.
//    * Redistributions in binary form must reproduce the above copyright
//      notice, this list of conditions and the following disclaimer in the
//      documentation and/or other materials provided with the distribution.
//
//  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
//  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
//  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
//  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
//  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
//  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
//  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
//  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
//  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
//  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

/* eslint-disable no-unused-expressions */

import { expect } from "chai";
import espree from "./util/espree.js";
import { analyze } from "../lib/index.js";

describe("ES6 class", () => {
    it("declaration name creates class scope", () => {
        const ast = espree(`var C = 'outside';
            let cls = class C extends (
				probeHeritage = function() { return C; }, // this C should be class C, not var C
				setHeritage = function() { C = null; }
			  ) {
			  method() {
				return C;
			  }
			};`);

        const scopeManager = analyze(ast, { ecmaVersion: 6 });
		
		let probeHeritageFuncScope = scopeManager.scopes[2]
		expect(probeHeritageFuncScope.references[0].resolved?.identifiers?.length>0).to.be.true;
		
		let resovledOfC = probeHeritageFuncScope.references[0].resolved.identifiers[0]
		
		let classScope = scopeManager.scopes[1]
		expect(classScope.type).to.be.equal('class');
		
		let classId = classScope.block.id
		expect(classId).to.be.equal(resovledOfC);
    });
});

// vim: set sw=4 ts=4 et tw=80 :
