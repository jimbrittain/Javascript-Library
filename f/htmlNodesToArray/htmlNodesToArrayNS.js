"use strict";
/* global __imns, console */
var adr = __imns('util.dom');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('htmlNodesToArray' in adr)){


    /**
        @module util.dom.htmlNodesToArray
        @method htmlNodesToArray
        @description convert a HTMLCollection to Array, useful in manipulation
     */
    adr.htmlNodesToArray = function(m){
        if('length' in m){
            var n = [];
            for(var i=0, imax=m.length; i<imax; i+=1){ n.push(m[i]); }
            return n; } 
        else { return m; }};
}
