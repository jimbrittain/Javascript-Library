"use strict";
/* global __imns */
(function(){
    var adr = __imns('util.dom');
    if (!('findAllChildElements' in adr)) {
        adr.findAllChildElements = function(elems){
            var uv = __imns('util.validation'),
                ud = __imns('util.dom'),
                ut = __imns('util.tools');
            if(uv.isHTMLElement(elems)){
                elems = [elems]; }
            if(uv.isArray(elems)){
                for(var i=0; i < elems.length; i+= 1){ //lose to allow pushing
                    var realChildren = [],
                        children = ('childNodes' in elems[i]) ? elems[i].childNodes : (('children' in elems[i]) ? elems[i].children : []);
                    for(var n=0, nmax = children.length; n<nmax; n+=1){
                        var child = children[n];
                        if ('nodeType' in child){
                            if(child.nodeType === 1 || child.nodeType === 9 || child.nodeType === 11){ //is element, docfrag or doc
                                realChildren.push(child); }
                        } else { realChildren.push(child); } //just in case
                    }
                    elems = elems.concat(realChildren);
                    elems = ut.arrayUnique(elems); }
                return elems; }
            return []; };
    }
})();
