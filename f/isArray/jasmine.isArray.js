"use strict";
var __imns = function(){ return window; }
describe("isArray Test Suite", function(){
    var adr = __imns();
    var obj = {}, arr = [];
    it("isArray is a function", function(){ expect(typeof adr.isArray === 'function').toBe(true); });
    it("isArray: {Array} = true", function(){ expect(adr.isArray(arr)).toBe(true); });
    it("isArray: {String} = false", function(){ expect(adr.isArray('1234')).toBe(false); });
    it("isArray: {Object} = false", function(){ expect(adr.isArray(obj)).toBe(false); });
    it("isArray: {Number} = false", function(){ expect(adr.isArray(1234)).toBe(false); });
});
