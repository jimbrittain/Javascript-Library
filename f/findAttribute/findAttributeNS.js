"use strict";
/* global __imns */
(function(){
    var adr = __imns('util.classes');
    // var adr = window; //for stand-alone delete above and uncomment this line
    if(!('Attributer' in adr)){
        /**
            @module Attributer
            @class Attributer
            @version 0.2
            @constructor
            @singleton
         */

        adr.Attributer = function(){
            var uc = __imns('util.classes'),
                uv = __imns('util.validation');
            if(uc.Attributer.prototype.singleton !== undefined){ return uc.Attributer.prototype.singleton; }
            uc.Attributer.prototype.singleton = this; 
            var getMethods = [], getMethod = -1, canGet = true;
            getMethods[0] = function(o, n){
                if(o.hasAttribute && o.hasAttribute(n) && o.getAttribute){
                    getMethod = 0;
                    return o.getAttribute(n);
                } else if(o.getAttribute){
                    getMethod = 0;
                    return o.getAttribute(n);
                } else { return ""; }};
            getMethods[1] = function(o, n){
                if(o.getAttributeNode){
                    getMethod = 1;
                    return o.getAttributeNode(n);
                } else { return ""; }};
            getMethods[2] = function(o, n){
                    if(('attributes' in o || o.attributes)){
                        if(!(n in o.attributes) && (o.attributes.length > 0 && 'nodeName' in o.attributes[0])){
                            for(var i=0, imax = o.attributes.length; i<imax; i += 1){
                                if(o.attributes[i].nodeName === n){
                                    getMethod = 2;
                                    return o.attributes[i].nodeName; }}
                            return "";
                        } else if(n in o.attributes){
                            if(o.attributes[n] !== "" || o.attributes[n] !== null){ getMethod = 2; }
                            return o.attributes[n];
                        } else { return ""; }
                    } else { return ""; }};
            getMethods[3] = function(o, n){ if(n in o){ getMethod = 3; return o.n; } else { return ""; }};

            this.get = function(o, n){
                if(o !== undefined && uv.isHTMLElement(o)){
                    if(canGet && getMethod === -1){
                        var i = 0;
                        while(getMethod === -1 && i < getMethods.length){
                            try { getMethods[i](o, n); } catch(e){ }
                            i += 1; }
                        if(getMethod === -1){ canGet = false; }}
                    if(getMethod !== -1 && canGet){
                        return getMethods[getMethod](o, n);
                    }} else { return undefined; }};
            var setMethods = [];
            var setMethod = -1;
            var canSet = -1;
            /* setMethods */
            setMethods[0] = function(o, n, v){
                if(o.hasAttribute && o.setAttribute){
                    setMethod = 0;
                    try { 
                        o.setAttribute(n, v);
                        return ((new uc.Attributer()).get(o, n) === v) ? true : false;
                    } catch(e) {
                        return false; }}};
            setMethods[1] = function(o, n, v){
                if(o.setAttributeNode){
                    setMethod = 1;
                    try {
                        o.setAttributeNode(n, v); 
                        return ((new uc.Attributer()).get(o, n) === v) ? true : false;
                    } catch(e) {
                        return false; }}};
            setMethods[2] = function(o, n, v){
                if('attributes' in o || o.attributes){
                    if(!(n in o.attributes) && (o.attributes.length > 0 && 'nodeName' in o.attributes[0])){
                        setMethod = 2;
                        var found = false;
                        for(var i=0, imax = o.attributes.length; i<imax; i += 1){
                            if(o.attributes[i].nodeName === n){
                                found = true;
                                try {
                                    o.attributes[i].nodeValue = v;
                                    return ((new uc.Attributer()).get(o, n) === v) ? true : false;
                                } catch(e){
                                    return false; }}}
                        if(!found){
                            try {
                                o.attributes.push({'nodeName': n, 'nodeValue':v});
                                return ((new uc.Attributer()).get(o, n) === v) ? true : false;
                            } catch(e) {
                                return false; }}
                    } else { 
                        try {
                            o.attributes[n] = v;
                            return ((new uc.Attributer()).get(o, n) === v) ? true : false;
                        } catch(e){
                            return false; }}}};
            this.set = function(o, n, v){
                if(o !== undefined && uv.isHTMLElement(o)){
                    var hasErrored = false;
                    var returned = '';
                    try {
                        returned = (new uc.Attributer().get(o, n));
                    } catch(e){ hasErrored = true; }
                    if(!hasErrored){
                        //now do sets;
                        //need something here to kick it into remove if v == null
                        if(canSet && setMethod === -1){
                            var i = 0;
                            while(setMethod === -1 && i < setMethods.length){
                                try {
                                    setMethods[i](o, n, v);
                                } catch(e){}
                                i += 1; }
                            if(setMethod === -1){ canSet = false; }}
                        if(setMethod !== -1 && canSet){ return setMethods[setMethod](o, n, v); }}
                } else { return undefined; }};
            var canRemove = true,
                removeMethod = -1,
                removeMethods = [];
            removeMethods[0] = function(o, n){
                if(o.hasAttribute && o.removeAttribute){
                    removeMethod = 0;
                    try {
                        o.removeAttribute(n);
                        return ((new uc.Attributer()).get(o, n) === undefined) ? true : false;
                    } catch(e) {
                        return false; }} else { return false; }};
            removeMethods[1] = function(o, n){
                if(o.removeAttributeNode){
                    removeMethod = 1;
                    try {
                        o.removeAttributeNode(n);
                        return ((new uc.Attributer()).get(o, n) === undefined) ? true : false;
                    } catch(e){
                        return false; }} else { return false; }};
            removeMethods[2] = function(o, n){
                if('attributes' in o || o.attributes){
                    setMethod = 2;
                    if((!(n in o.attributes)) && (o.attributes.length > 0 && 'nodeName' in o.attributes[0])){
                        var found = false,
                            foundNum = -1,
                            hasRemoved = false;
                        for(var i = 0, imax = o.attributes.length; i < imax; i += 1){
                            if(o.attributes[i].nodeName === n){
                                found = true;
                                try {
                                    o.attributes.splice(i, 1);
                                    foundNum = i;
                                    hasRemoved = ((new uc.Attributer()).get(o, n) === undefined) ? true : false;
                                    break;
                                } catch(e){ }}}
                        if(found && !hasRemoved && foundNum !== -1){
                            o.attributes[i] = null;
                            return ((new uc.Attributer()).get(o, n) === undefined) ? true : false;
                        } else if(!found){ return false; }
                    } else {
                        try {
                            o.attributes[n] = null;
                            return ((new uc.Attributer()).get(o, n) === undefined) ? true : false;
                        } catch(e){
                            return false; }}} else { return false; }};
            this.remove = function(o, n){
                if(o !== undefined && uv.isHTMLElement(o)){
                    var hasErrored = false,
                        returned = '';
                    try {
                        returned = (new uc.Attributer().get(o, n));
                    } catch(e){ hasErrored = true; }
                    if(!hasErrored && returned !== ''){
                        if(canRemove && removeMethod === -1){
                            var i = 0,
                                hasRemoved = false;
                            while(removeMethod === -1 && i < removeMethods.length){
                                try {
                                    hasRemoved = removeMethods[i](o, n);
                                } catch(e){ }
                                i += 1; }
                            if(removeMethod === -1){ canRemove = false; }
                            return hasRemoved;
                        } else if(removeMethod !== -1 && canRemove){
                            return removeMethods[removeMethod](o, n);
                        } else { return false; }}
                } else { return false; }};
        };
        var ud = __imns('util.dom');
        ud.getAttribute = function(elem, attr){ 
            var uc = __imns('util.classes');
            return (new uc.Attributer()).get(elem, attr); };
        ud.getAttributer = ud.getAttribute; //old-style naming recovery
        ud.removeAttribute = function(elem, attr){ 
            var uc = __imns('util.classes');
            return (new uc.Attributer()).remove(elem, attr); };
        ud.removeAttributer = ud.removeAttribute; //old-style naming recovery
        ud.setAttribute = function(elem, attr, value){ 
            var uc = __imns('util.classes');
            return (new uc.Attributer()).set(elem, attr, value); };
        ud.setAttributer = ud.setAttribute; //old-style naming recovery
        ud.hasAttribute = function(elem, attr){
            var uc = __imns('util.classes');
            var a = (new uc.Attributer()).get(elem, attr);
            return (a === undefined || a === null) ? false : true;
        };

    }
})();
