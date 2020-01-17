"use strict";
describe('findAttribute test suite', function(){
    beforeEach(function(done){
        var requireArr = [
            'dist/c/Namespace/Namespace.js',
            'dist/f/isHTMLElement/isHTMLElementNS.js',
            'dist/f/findAttribute/findAttributeNS.js'
        ]; //reforced attribute load as before isn't loading it properly
        for(var i=0, imax=requireArr.length; i<imax; i+=1){
            var a = document.createElement('script');
            a.src = requireArr[i];
            a.type = 'text/javascript';
            document.head.appendChild(a); }
        setTimeout(function(){ 
            uc = __imns('util.classes');
            ud = __imns('util.dom');
            done(); 
        }, 2000);
    });

    //var __imns = function(){ return window; }
    var ud = window,
        uc = window,
        obj = {}, 
        arr = [];
    //requires
    it('Attributer is a class function', function(){ 
        expect(typeof uc.Attributer === 'function').toBe(true); });
    it('Attributer is a singleton class', function(){
        var a = new uc.Attributer(),
            b = new uc.Attributer();
        expect(a === b).toBe(true); });
    it('ud.getAttribute is a function', function(){ 
        expect(typeof ud.getAttribute === 'function').toBe(true); });
    it('ud.removeAttribute is a function', function(){ expect(typeof ud.removeAttribute === 'function').toBe(true); });
    it('ud.setAttribute is a function', function(){ expect(typeof ud.setAttribute === 'function').toBe(true); });
    it('ud.hasAttribute is a function', function(){ expect(typeof ud.hasAttribute === 'function').toBe(true); });
    it('ud.getAttribute returns attribute', function(){
        var a = document.createElement('div');
        ud.setAttribute(a, 'style', 'color:red');
        expect(ud.getAttribute(a, 'style') === 'color:red').toBe(true); });
    it('ud.removeAttribute removes contents', function(){
        var a = document.createElement('div');
        ud.setAttribute(a, 'morris', 'red');
        ud.removeAttribute(a, 'morris');
        expect(ud.getAttribute(a, 'morris') === null).toBe(true); 
    });
    it('ud.setAttribute sets contents', function(){
        var a = document.createElement('div');
        ud.setAttribute(a, 'style', 'color:red');
        ud.setAttribute(a, 'style', 'color:green');
        expect(ud.getAttribute(a, 'style') === 'color:green').toBe(true);
    });
    it('ud.hasAttribute returns false on undefined attribute', function(){
        var b = document.createElement('div');
        expect(ud.hasAttribute(b, 'morris')).toBe(false);
    });
    it('ud.hasAttribute returns true on defined attribute', function(){
        var a = document.createElement('div');
        ud.setAttribute(a, 'morris', 'red');
        expect(ud.hasAttribute(a, 'morris')).toBe(true);
    });
    it('ud.hasAttribute returns false on defined then removed attribute', function(){
        var a = document.createElement('div');
        ud.setAttribute(a, 'morris', 'red');
        ud.removeAttribute(a, 'morris');
        expect(ud.hasAttribute(a, 'morris')).toBe(false);
    });
    it('ud.getAttributer is a function; legacy protection', function(){ expect(typeof ud.getAttributer == 'function' && ud.getAttribute === ud.getAttributer).toBe(true); });
    it('ud.removeAttributer is a function; legacy protection', function(){ expect(typeof ud.removeAttributer === 'function' && ud.removeAttribute === ud.removeAttributer).toBe(true); });
    it('ud.setAttributer is a function; legacy protection', function(){ expect(typeof ud.setAttributer === 'function' && ud.setAttribute === ud.setAttributer).toBe(true); });
});
