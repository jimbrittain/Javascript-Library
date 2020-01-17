"use strict";
/* global window, IMDebugger, __imns, console */
var getBaseUrl = function(filepath){
    var url = window.location;
    var base = url.protocol + "//" + ((url.host !== '') ? url.host + "/" : '');
    var p = url.pathname.split('/');
    p.pop();
    var fullbase = p.join('/');
    fullbase += '/';
    if(filepath === undefined || typeof filepath !== 'string'){
        return base + fullbase;
    } else {
        if(filepath.indexOf('//') === -1){
            if(filepath.indexOf('/') === 0){
                return url.protocol + '//' + url.host + filepath;
            } else {
                var dirs = filepath.split('/');
                var currentdir = p;
                var filename = (filepath.lastIndexOf('/') !== (filepath.length !== -1)) ? dirs.pop() : '';
                for(var i=0, imax=dirs.length; i<imax; i+=1){
                    if(dirs[i] === '..'){
                        if(currentdir.length > 0){
                            currentdir.pop();
                        } else { 
                            return base + filename; }
                    } else { currentdir.push(dirs[i]); }}
                return url.protocol + '//' + ((url.host !== '') ? url.host + '/' : '') + (currentdir.join('/')) + '/' + filename;
            }
        } else {
            return filepath; //assumes external;
        }
    }
    return base + fullbase; };
