"use strict";
/* global window, IMDebugger, $, __imns, console */
var adr = __imns('util.tools');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('addKeyframes' in adr)){
    adr.addKeyframes = function(name, syntax, stylesheet){
        var ut = __imns('util.tools');
        //get stylesheet or create;
        var kp = ut.clone(ut.addKeyframes.prototype.prefixes),
            worked = false,
            error = false;
        for(var i=0; i < kp.length; i+=1){
            var on = kp[i];
                //worked = false;
            try {
                var n = '@' + on + 'keyframes ' + name ;
                if(stylesheet === undefined){ //need fuller check here;
                    var a = ut.addStyleSheet({title: 'programatic'});
                    stylesheet = ut.findStyleSheet({title: 'programatic'}); }
                var r = ut.addStyleSheetRule(n, syntax, stylesheet);
                if(r){ worked = true; }
            } catch(e) { 
                (new (__imns('util.debug')).IMDebugger()).pass(e);
                error = true;
                //ut.addKeyframes.prototype.removePrefix(on); 
            }
            if(worked){ 
                var m = 1;
                //ut.addKeyframes.prototype.replacePrefixes(on); 
                //return true; 
            }
        }
        return worked;
        //return false; 
    };
    adr.addKeyframes.prototype.prefixes = ['', '-webkit-', '-moz-', '-ms-', '-o-', '-khtml-'];
    adr.addKeyframes.prototype.replacePrefixes = function(p){
        var ut = __imns('util.tools');
        ut.addKeyframes.prototype.prefixes = [p];
        return true; };
    adr.createKeyframes = adr.addKeyframes;
    /*
    // :::::::::::: Removed as user syntax error could cause an unintended removal ::::::::::::::
    adr.addKeyframes.prototype.removePrefix = function(p){
        var ut = __imns('util.tools');
        var kp = ut.addKeyframes.prototype.prefixes;
        for(var i=0, imax = kp.length; i<imax; i+=1){
            var on = kp[i];
            if(on === p){
                kp.splice(i, 1);
                return true; }}
        return false; }; */
}
