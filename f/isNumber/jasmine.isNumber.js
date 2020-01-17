"use strict";
var __imns = function(){ return window; }
describe("isNumber Test Suite", function(){
    adr = __imns();
    var obj = {}, arr = [];
    it("isNumber is a function", function(){ expect(typeof adr.isNumber === 'function').toBe(true); });
    it("isNumber: {Number} (float) = true", function(){ expect(adr.isNumber(1.2345)).toBe(true); });
    it("isNumber: {Number} (int) = true", function(){ expect(adr.isNumber(1)).toBe(true); });
    it("isNumber: {Number} -(float) = true", function(){ expect(adr.isNumber(-1.2345)).toBe(true); });
    it("isNumber: {Number} -(int) = true", function(){ expect(adr.isNumber(-1)).toBe(true); });
    it("isNumber: null = false", function(){ expect(adr.isNumber(null)).toBe(false); });
    it("isNumber: {Number} 0 = true", function(){ expect(adr.isNumber(0)).toBe(true); });
    it("isNumber: {String} = false", function(){ expect(adr.isNumber('zero')).toBe(false); });
    it("isNumber: {Object} = false", function(){ expect(adr.isNumber(obj)).toBe(false); });
    it("isNumber: {Array} = false", function(){ expect(adr.isNumber(arr)).toBe(false); });
    it("isNumber: undefined = false", function(){ expect(adr.isNumber(undefined)).toBe(false); });
});

