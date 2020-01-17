"use strict";
var __imns = function(){ return window; }
describe("isLoaded Test Suite", function(){
    beforeEach(function(done){
        var requireArr = [
            'dist/f/isNumber/isNumber.js'
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

        var a = '10px',
            b = '10rem',
            c = '10em',
            d = '10ex',
            e = '10ch',
            f = '10mm',
            g = '10vh',
            h = '10vw',
            i = '10vmin',
            j = '10vmax',
            k = '10%',
            l = '10cm',
            m = '10pt',
            n = '10pc',
            o = '10mozmm',
            p = '10deg',
            q = '10',
            r = 10.10,
            s = 'morris';

    it("whatmeasure is a function", function(){ expect(typeof adr.whatmeasure === 'function').toBe(true); });
    it("whatmeasure: 10px = px", function(){ expect(adr.whatmeasure(a)).toBe('px'); });
    it("whatmeasure: 10rem = rem", function(){ expect(adr.whatmeasure(b)).toBe('rem'); });
    it("whatmeasure: 10em = em", function(){ expect(adr.whatmeasure(c)).toBe('em'); });
    it("whatmeasure: 10ex = ex", function(){ expect(adr.whatmeasure(d)).toBe('ex'); });
    it("whatmeasure: 10ch = ch", function(){ expect(adr.whatmeasure(e)).toBe('ch'); });
    it("whatmeasure: 10mm = mm", function(){ expect(adr.whatmeasure(f)).toBe('mm'); });
    it("whatmeasure: 10vh = vh", function(){ expect(adr.whatmeasure(g)).toBe('vh'); });
    it("whatmeasure: 10vw = vw", function(){ expect(adr.whatmeasure(h)).toBe('vw'); });
    it("whatmeasure: 10vmin = vmin", function(){ expect(adr.whatmeasure(i)).toBe('vmin'); });
    it("whatmeasure: 10vmax = vmax", function(){ expect(adr.whatmeasure(j)).toBe('vmax'); });
    it("whatmeasure: 10% = %", function(){ expect(adr.whatmeasure(k)).toBe('%'); });
    it("whatmeasure: 10cm = cm", function(){ expect(adr.whatmeasure(l)).toBe('cm'); });
    it("whatmeasure: 10pt = pt", function(){ expect(adr.whatmeasure(m)).toBe('pt'); });
    it("whatmeasure: 10pc = pc", function(){ expect(adr.whatmeasure(n)).toBe('pc'); });
    it("whatmeasure: 10mozmm = mozmm", function(){ expect(adr.whatmeasure(o)).toBe('mozmm'); });
    it("whatmeasure: 10deg = deg", function(){ expect(adr.whatmeasure(p)).toBe('deg'); });
    it("whatmeasure: 10 = px", function(){ expect(adr.whatmeasure(q)).toBe('px'); });
    it("whatmeasure: 10.10 = px", function(){ expect(adr.whatmeasure(r)).toBe('px'); });
    it("whatmeasure: 'morris' = undefined", function(){ expect(adr.whatmeasure(s)).toBe(undefined); });
});
