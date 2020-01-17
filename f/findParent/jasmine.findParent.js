"use strict";
describe("findParent Test Suite", function(){
    beforeEach(function(done){
        var requireArr = [
            'dist/c/Namespace/Namespace.js',
            'dist/f/isHTMLElement/isHTMLElement.js'
        ];
        for(var i=0, imax=requireArr.length; i<imax; i+=1){
            var a = document.createElement('script');
            a.src = requireArr[i];
            a.type = 'text/javascript';
            document.body.appendChild(a); 
        }

        setTimeout(function(){ done(); }, 1000);
    });

        var __imns = function(){ return window; }
        var adr = __imns();
        var obj = {}, arr = [];
        var parentElement = document.createElement('div');
        var childElement = document.createElement('div');
        parentElement.appendChild(childElement);
        document.body.appendChild(parentElement);

    it("findParent is a function", function(){ expect(typeof adr.findParent === 'function').toBe(true); });
    it("findParent: findParent(childElement) = parentElement", function(){ expect(adr.findParent(childElement)).toBe(parentElement); });
});
