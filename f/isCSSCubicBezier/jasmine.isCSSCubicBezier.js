"use strict";
describe("isCSSCubicBezier Test Suite", function(){
    var __imns = function(){ return window; }
    adr = __imns();
    var obj = {}, arr = [];
    it("isCSSCubicBezier is a function", function(){ expect(typeof adr.isCSSCubicBezier === 'function').toBe(true); });
    it("Test: {String} 'cubic-bezier(1,1,1,1)' = true", function(){ expect(adr.isCSSCubicBezier('cubic-bezier(1,1,1,1)')).toBe(true); });
    it("Test: {Number} = false", function(){ expect(adr.isCSSCubicBezier(1234)).toBe(false); });
    it("Test: {Array} = false", function(){ expect(adr.isCSSCubicBezier(arr)).toBe(false); });
    it("Test: {Object} = false", function(){ expect(adr.isCSSCubicBezier(obj)).toBe(false); });
    it("Test: {String} 'cheese(1,1,1,1)' = false", function(){ expect(adr.isCSSCubicBezier('cheese(1,1,1,1)')).toBe(false); });
});
