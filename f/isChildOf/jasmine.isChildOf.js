"use strict";
var __imns = function(){ return window; }
describe("isChildOf Test Suite", function(){
    beforeEach(function(done){
        var requireArr = [
            'dist/f/isHTMLElement/isHTMLElement.js',
            'dist/f/findParent/findParent.js'
        ];
        for(var i=0, imax=requireArr.length; i<imax; i+=1){
            var a = document.createElement('script');
            a.src = requireArr[i];
            a.type = 'text/javascript';
            document.body.appendChild(a); 
        }
        var divElem = document.createElement('div');
        divElem.setAttribute('id', 'myparent');
        divElem.innerHTML = '<div id="mychild"></div>';
        document.body.appendChild(divElem);


        setTimeout(function(){ done(); }, 1000);
    });

        var adr = __imns();
        var obj = {}, arr = [];

    it("isChildOf is a function", function(){ expect(typeof adr.isChildOf === 'function').toBe(true); });
    it("isChildOf: child = true", function(){ expect(adr.isChildOf(document.getElementById('mychild'), document.getElementById('myparent'))).toBe(true); });
    it("isChildOf: child = false", function(){ expect(adr.isChildOf(document.getElementById('myparent'), document.getElementById('mychild'))).toBe(false); });
});
