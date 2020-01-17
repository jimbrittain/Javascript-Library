"use strict";
var __imns = function(){ return window; }
describe("findForm Test Suite", function(){
    beforeEach(function(done){
        var requireArr = [
            'dist/f/isHTMLElement/isHTMLElement.js',
            'dist/f/isFormElement/isFormElement.js'
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
        var formElem = document.createElement('form'),
            inputElem = document.createElement('input'),
            divElem = document.createElement('div'),
            textAreaElem = document.createElement('textarea'),
            input2Elem = document.createElement('input');
        formElem.appendChild(inputElem);
        formElem.appendChild(divElem);
        divElem.appendChild(textAreaElem);
        document.body.appendChild(formElem);
        document.body.appendChild(input2Elem);

    it("findForm is a function", function(){ expect(typeof adr.findForm === 'function').toBe(true); });
    it("findForm: findForm(child) = parent", function(){ expect(adr.findForm(inputElem) === formElem).toBe(true); });
    it("findForm: findForm(grandchild) = grandparent", function(){ expect(adr.findForm(textAreaElem) === formElem).toBe(true); });
    it("findForm: findForm(orphan) = null", function(){ expect(adr.findForm(input2Elem) === null).toBe(true); });
});
