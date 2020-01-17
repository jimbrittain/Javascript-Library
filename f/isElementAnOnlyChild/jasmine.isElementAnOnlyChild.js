"use strict";
var __imns = function(){ return window; }
describe("isElementAnOnlyChild Test Suite", function(){
    beforeEach(function(done){
        var requireArr = [
            'dist/f/isHTMLElement/isHTMLElement.js',
            'dist/c/Namespace/Namespace.js'
        ];
        for(var i=0, imax=requireArr.length; i<imax; i+=1){
            var a = document.createElement('script');
            a.src = requireArr[i];
            a.type = 'text/javascript';
            document.body.appendChild(a); 
        }


        setTimeout(function(){ done(); }, 1000);
    });

        var adr = __imns();
        var obj = {}, arr = [];
        var parentElem = document.createElement('div'),
            firstChild = document.createElement('div'),
            secondChild = document.createElement('div');
        parentElem.appendChild(firstChild);

    it("isElementAnOnlyChild is a function", function(){ expect(typeof adr.isElementAnOnlyChild === 'function').toBe(true); });
    it("isElementAnOnlyChild: {only-child} = true", function(){ expect(adr.isElementAnOnlyChild(firstChild)).toBe(true); });
    it("isElementAnOnlyChild: {second-child} = false", function(){ 
        parentElem.appendChild(secondChild);
        expect(adr.isElementAnOnlyChild(secondChild)).toBe(false); });
    it("isElementAnOnlyChild: {first-child} = false", function(){ expect(adr.isElementAnOnlyChild(firstChild)).toBe(false); });
});
