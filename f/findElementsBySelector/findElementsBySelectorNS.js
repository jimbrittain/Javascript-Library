"use strict";
/*global __imns, document, window, console */
(function(){
    var adr = __imns('util.classes');
    if(!('SelectorParser' in adr)){
        adr.SelectorParser = function(selectors, elems){
            var uv = __imns('util.validation');
            this.selectors = '';
            this.elems = '*';
            this.chains = [];
            if(selectors !== undefined){
                var a = this.init(selectors); }
            if(elems !== undefined){
                elems = (uv.isHTMLElement(elems)) ? [elems] : elems;
                if(uv.isArray(elems)){ this.elems = elems; }}
        };
        adr.SelectorParser.prototype.init = function(str){
            if(typeof str === 'string'){
                //could put a proper validator regexp here;
                var re = /,\s*/;
                this.chains = str.split(re);
                return (this.chains.length > 0) ? true : false; }};
        adr.SelectorParser.prototype.process = function(){
            var uc = __imns('util.classes'),
                ut = __imns('util.tools');
            var elems = [];
            if(this.chains.length > 0){
                for(var i = 0, imax = this.chains.length; i<imax; i+=1){
                    var p = new uc.SelectorParserChain(this.chains[i]),
                        arr = p.find(this.elems);
                    elems = elems.concat(arr); }}
            elems = (elems.length > 0) ? ut.arrayUnique(elems) : elems;
            return elems; };
    }
})();
(function(){
    var adr = __imns('util.dom');
    if(!('parseCSSSelector' in adr)){
        adr.parseCSSSelector = function(str, elems){
            var uv = __imns('util.validation'),
                uc = __imns('util.classes');
            if(uv.isString(str)){
                if(elems === undefined){ elems = '*'; }
                return (new uc.SelectorParser(str, elems)).process(); }
            return []; };
    }
})();
(function(){
    var uc = __imns('util.classes');
    if (!('SelectorParserChain' in uc)){
        uc.SelectorParserChain = function(str){
            var uv = __imns('util.validation');
            this.chain = [];
            this.lastWasCombinator = true;
            str = (str !== undefined && uv.isString(str) && str.length > 0) ? str : '';
            if (str.length > 0) { this.parse(str); }};
        uc.SelectorParserChain.prototype.parse = function(selector){
            var uv = __imns('util.validation'),
                uc = __imns('util.classes');
            this.chain = [];
            if(uv.isString(selector)){
                var re = /\s+(?![^\{\(\[\"]*[\}\]\)\"])/; //space character not between [,",{
                this.chain = selector.split(re);
                for(var i=0, imax=this.chain.length; i<imax; i+=1){
                    this.chain[i] = new uc.SelectorParserSingleSelector(this.chain[i]);
                }}};
        uc.SelectorParserChain.prototype.find = function(elems){
            var uc = __imns('util.classes'),
                ud = __imns('util.dom'),
                uv = __imns('util.validation'),
                ut = __imns('util.tools');
            if(uv.isArray(elems)){
                elems = ud.findAllChildElements(elems);
            } else { elems = '*'; }
            for(var i=0, imax=this.chain.length; i<imax; i+=1){
                var on = this.chain[i];
                if((new uc.CombinatorParserRules()).is(on.selector) && !this.lastWasCombinator){
                    elems = (new uc.CombinatorParserRules()).check(on.selector, elems);
                    this.lastWasCombinator = true;
                } else {
                    if(!this.lastWasCombinator){
                        elems = ud.findAllChildElements(elems);
                        elems = ut.arrayUnique(elems); }
                    elems = this.chain[i].findWithin(elems); 
                    this.lastWasCombinator = false;
                }
                if (elems.length === 0){ break; }}
            return elems; };
        uc.SelectorParserChain.prototype.chainExp = /\s+(?![^\{\(\[\"]*[\}\]\)\"])/;
        uc.SelectorParserChain.prototype.isChain = function(str){
            var uv = __imns('util.validation'),
                ut = __imns('util.tools');
            if(uv.isString(str) && str.length > 0){
                var l = str.split(uc.SelectorParserChain.prototype.chainExp);
                if(l.length > 1 || l.length === 0){
                    return true; }}
            return false;
        };
    }
})();
(function(){
    var uv = __imns('util.validation');
    if(!('isMultiLevelCSSSelector' in uv)){
        uv.isMultiLevelCSSSelector = function(str){
            var ut = __imns('util.tools'),
                uc = __imns('util.classes');
            return (new uc.SelectorParserChain()).isChain(str); };
    }
})();
(function(){
    var uc = __imns('util.classes');
    if(!('SelectorParserSingleSelector' in uc)){
        uc.SelectorParserSingleSelector = function(str){
            this.selector = '*';
            if(str !== undefined){
                this.setSelector(str);
            }};
        uc.SelectorParserSingleSelector.prototype.setSelector = function(str){
            var uv = __imns('util.validation'),
                ut = __imns('util.tools');
            if(typeof str === 'string' && str.length > 0 && !uv.isMultiLevelCSSSelector(str)){
                this.selector = str;
            } else {
                this.selector = '*';
            }
            return this.selector; };
        uc.SelectorParserSingleSelector.prototype.find = function(){
            var uc = __imns('util.classes');
            return (new uc.SelectorParserRules()).check('*', this.selector);
        };
        uc.SelectorParserSingleSelector.prototype.findWithin = function(elems){
            var ud = __imns('util.dom'),
                uv = __imns('util.validation'),
                uc = __imns('util.classes');
            //elems = (typeof elems === 'string') ? '*' : ud.findAllChildElements(elems);
            var a = (new uc.SelectorParserRules()).check(elems, this.selector);
            return a;
        };
        uc.SelectorParserSingleSelector.prototype.ascertain = function(elem){
            var uv = __imns('util.validation');
            var is = true;
            if (!uv.isHTMLElement(elem)) { return false; }
            for(var i=0, imax = this.rules.length; i<imax; i+=1){
                if(!this.rules[i].check(elem)){ return false; }}
            return true; };
    }
})();
(function(){
    var uc = __imns('util.classes');
    if(!('SelectorParserRules' in uc)){
        uc.SelectorParserRules = function(){
            var uc = __imns('util.classes');
            if (uc.SelectorParserRules.prototype.singleton !== undefined){
                return uc.SelectorParserRules.prototype.singleton; }
            uc.SelectorParserRules.prototype.singleton = this;
            this.rules = [];
        };
        uc.SelectorParserRules.prototype.check = function(elem, selector){
            var uv = __imns('util.validation');
            if(uv.isString(selector)){
                for(var i=0, imax=this.rules.length; i<imax; i+=1){
                    elem = this.rules[i].check(elem, selector);
                    if (elem.length === 0){ return []; }}
                return elem; }
            return []; };
        uc.SelectorParserRules.prototype.run = uc.SelectorParserRules.prototype.check;
        uc.SelectorParserRules.prototype.addRule = function(r){
            var uc = __imns('util.classes');
            if(!(r instanceof uc.SelectorParserRule)){
                r = new uc.SelectorParserRule(r);
            }
            if(r instanceof uc.SelectorParserRule && !this.hasRule(r)){
                this.rules.push(r);
                return true; }
            return false; };
        uc.SelectorParserRules.prototype.findRuleByName = function(str){
            var uv = __imns('util.validation');
            if(uv.isString(str) && str.length > 0){
                for(var i=0, imax=this.rules.length; i<imax; i+=1){
                    if(this.rules[i].name === str){
                        return this.rules[i]; }}}
            return undefined; };
        uc.SelectorParserRules.prototype.findRuleByRule = function(r){
            var uc = __imns('util.classes');
            if(r instanceof uc.SelectorParserRule){
                for(var i=0, imax=this.rules.length; i<imax; i+=1){
                    if (r === this.rules[i]){
                        return this.rules[i]; }}}
            return undefined; };
        uc.SelectorParserRules.prototype.findRule = function(r){
            var uv = __imns('util.validation'),
                uc = __imns('util.classes');
            if(r !== undefined){
                if(uv.isString(r)){
                    return this.findRuleByName(r);
                } else if(r instanceof uc.SelectorParserRule){
                    return this.findRuleByRule(r);
                } else {
                    r = new uc.SelectorParserRule(r);
                    return this.findRuleByRule(r); }}
            return undefined; };
        uc.SelectorParserRules.prototype.hasRule = function(r){ return (this.findRule(r) !== undefined) ? true : false; };
    }
})();
(function(){
    var uc = __imns('util.classes');
    if(!('CombinatorParserRules' in uc)){
        uc.CombinatorParserRules = function(){
            var uc = __imns('util.classes');
            if(uc.CombinatorParserRules.prototype.singleton !== undefined){
                return uc.CombinatorParserRules.prototype.singleton; }
            uc.CombinatorParserRules.prototype.singleton = this;
            this.rules = []; };
        uc.CombinatorParserRules.prototype.addRule = function(r){
            var uc = __imns('util.classes');
            if(!(r instanceof uc.CombinatorParserRule)){
                r = new uc.CombinatorParserRule(r);
            }
            if(!this.hasRule(r) && r instanceof uc.CombinatorParserRule){
                this.rules.push(r); 
                return true; }
            return false; };
        uc.CombinatorParserRules.prototype.hasRule = function(o){
            var uc = __imns('util.classes'),
                uv = __imns('util.validation');
            if(o !== undefined){
                if(uv.isString(o)){
                    return this.findRuleByName(o);
                } else if(o instanceof uc.CombinatorParserRule){
                    return this.findRuleByRule(o);
                } else {
                    var r = new uc.CombinatorParserRule(o);
                    return this.findRuleByRule(r); }}
            return false; };
        uc.CombinatorParserRules.prototype.findRuleByRule = function(r){
            var uc = __imns('util.classes');
            if(r !== undefined){
                if(r instanceof uc.CombinatorParserRule){
                    for(var i=0, imax=this.rules.length; i<imax; i+=1){
                        if(this.rules[i] === r){
                            return true; }}}}
            return false; };
        uc.CombinatorParserRules.prototype.findRuleByName = function(name){
            var uv = __imns('util.validation');
            if(name !== undefined && uv.isString(name) && name.length > 0){
                for(var i=0, imax=this.rules.length; i<imax; i+=1){
                    if(this.rules.name === name){
                        return true; }}}
            return false; };
        uc.CombinatorParserRules.prototype.is = function(combinator){
            for(var i=0, imax=this.rules.length; i<imax; i+=1){
                if(this.rules[i].is(combinator)){
                    return true; }}
            return false; };
        uc.CombinatorParserRules.prototype.check = function(combinator, elems){
            for(var i=0, imax=this.rules.length; i<imax; i+=1){
                elems = this.rules[i].check(combinator, elems); }
            return elems; };
    }
})();
(function(){
    var uc = __imns('util.classes');
    if(!('CombinatorParserRule' in uc)){
        uc.CombinatorParserRule = function(o){
            this.name = '';
            this._check = null;
            this._is = null;
            if(o !== undefined){
                var v = this.init(o); 
                if(!v){ return false; }}};
        uc.CombinatorParserRule.prototype.init = function(o){
            if(o === undefined){ return false; }
            var uv = __imns('util.validation');
            if(typeof o === 'object'){
                if('check' in o){ this.setCheck(o.check); }
                if('is' in o){ this.setIs(o.is); }
                if('name' in o){ this.setName(o.name); }
            }
            return this.valid(); };
        uc.CombinatorParserRule.prototype.is = function(combinator){
            var uv = __imns('util.validation');
            if(this._is !== null && uv.isFunction(this._is)){
                return this._is(combinator); }
            return false; };
        uc.CombinatorParserRule.prototype.check = function(combinator, elems){
            var uv = __imns('util.validation');
            if(this.is(combinator)){
                if(this._check !== null && uv.isFunction(this._check)){
                    return this._check(combinator, elems); }}
            return elems; };
        uc.CombinatorParserRule.prototype.setName = function(n){
            var uv = __imns('util.validation');
            if(n !== undefined && uv.isString(n) && n.length > 0){
                this.name = n;
                return true; }
            return false; };
        uc.CombinatorParserRule.prototype.setCheck = function(f){
            var uv = __imns('util.validation');
            if(f !== undefined && uv.isFunction(f) && this._check === null){
                this._check = f;
                return true; }
            return false; };
        uc.CombinatorParserRule.prototype.setIs = function(f){
            var uv = __imns('util.validation');
            if(f !== undefined && uv.isFunction(f) && this._is === null){
                this._is = f;
                return true; }
            return false; };
        uc.CombinatorParserRule.prototype.valid = function(){
            return (this.name !== '' && this._check !== null && this._is !== null) ? true : false; };
    }
})();
(function(){
    var uc = __imns('util.classes');
    if('CombinatorParserRule' in uc && 'CombinatorParserRules' in uc){
        var com = new uc.CombinatorParserRules();
        com.addRule({
            'name' : 'after',
            'is': function(combinator){
                var re = /^\~$/;
                if(combinator !== undefined && typeof combinator === 'string'){
                    return re.test(combinator); }
                return false; },
            'check': function(combinator, elems){
                var ud = __imns('util.dom'),
                    ut = __imns('util.tools'),
                    uv = __imns('util.validation');
                var arr = [];
                elems = ud.htmlNodesToArray(elems);
                elems = ut.arrayUnique(elems);
                for(var i=0, imax=elems.length; i<imax; i+=1){
                    var elem = elems[i];
                    if(uv.isHTMLElement(elem)){
                        var next = elem;
                        while((next = ud.findNextRealSibling(next)) !== null){
                            if(uv.isHTMLElement(next)){
                                arr.push(next); }}}}
                arr = (arr.length > 0) ? ut.arrayUnique(arr) : arr;
                return arr; }
        });
        com.addRule({
            'name': 'adjacent',
            'is': function(combinator){
                var re = /^\+$/;
                if(combinator !== undefined && typeof combinator === 'string'){
                    return re.test(combinator); }
                return false; },
            'check': function(combinator, elems){
                var ud = __imns('util.dom'),
                    ut = __imns('util.tools'),
                    uv = __imns('util.validation');
                var arr = [];
                elems = ud.htmlNodesToArray(elems);
                for(var i=0, imax = elems.length; i<imax; i+=1){
                    var elem = elems[i],
                        re = /^\s*$/,
                        next = ud.findNextRealSibling(elem);
                    while(uv.isHTMLElement(next)){
                        if('nodeType' in next){
                            if(next.nodeType === 1){
                                arr.push(next);
                                break;
                            } else if(next.nodeType === 3 && re.test(next.innerHTML)){
                                next = next.nextSibling;
                            } else { next = null; }
                        } else { next = null; }}}
                arr = (arr.length > 0) ? ut.arrayUnique(arr) : arr; 
                return arr; }
        });
        com.addRule({
            'name': 'direct-child',
            'is': function(combinator){
                var re = /^\>$/;
                if(combinator !== undefined && typeof combinator === 'string'){
                    return re.test(combinator); }
                return false; },
            'check': function(combinator, elems){
                var ud = __imns('util.dom'),
                    ut = __imns('util.tools'),
                    uv = __imns('util.validation');
                var arr = [];
                elems = ud.htmlNodesToArray(elems);
                for(var i=0, imax=elems.length; i<imax; i+=1){
                    var elem = elems[i];
                    if(uv.isHTMLElement(elem)){
                        var children = ('childNodes' in elem) ? elem.childNodes : (('children' in elem) ? elem.children : []);
                        for(var n=0, nmax=children.length; n<nmax; n+=1){
                            var child = children[n];
                            if('nodeType' in child){
                                if(child.nodeType === 1 || child.nodeType === 9 || child.nodeType === 11){
                                    arr.push(child); }}}}}
                arr = (arr.length > 0) ? ut.arrayUnique(arr) : arr;
                return arr; }
        });
    }
})();
(function(){
    var uc = __imns('util.classes');
    if(!('SelectorParserRule' in uc)){
        uc.SelectorParserRule = function(o){
            this.name = '';
            this._check = null; 
            if(o !== undefined){
                this.init(o); }};
        uc.SelectorParserRule.prototype.init = function(o){
            if (o === undefined) { return false; }
            var uv = __imns('util.validation');
            if(uv.isFunction(o)){
                this.setCheck(o);
            } else if(uv.isString(o)){
                this.setName(o);
            } else if(typeof o === 'object'){
                if('name' in o){ this.setName(o.name); }
                if('func' in o){ 
                    this.setCheck(o.func); 
                } else if('check' in o){
                    this.setCheck(o.check); }}};
        uc.SelectorParserRule.prototype.setName = function(str){
            var uv = __imns('util.validation');
            if(uv.isString(str) && str.length > 0){
                this.name = str;
                return true; }
            return false; };
        uc.SelectorParserRule.prototype.setCheck = function(fun){
            var uv = __imns('util.validation');
            if (fun !== undefined && uv.isFunction(fun)){
                this._check = fun;
                return true; }
            return false; };
        uc.SelectorParserRule.prototype.check = function(elem, selector){
            var uv = __imns('util.validation');
            var r = [];
            if(uv.isFunction(this._check)){
                r = this._check(elem, selector); }
            //return (r === true ) ? true : false; };
            return r; };
    }
    /* Lets Try Making Some Rules */
    (new uc.SelectorParserRules()).addRule({
        name: 'poundid',
        check: function(elem, selector){
            var uv = __imns('util.validation'),
                ud = __imns('util.dom'),
                ut = __imns('util.tools');
            var elems = null;
            if(uv.hasCSSIdSelector(selector)){
                var dotIds = ut.getCSSIdSelectors(selector);
                for(var i=0, imax=dotIds.length; i<imax; i+=1){
                    var e = ud.findElementById(dotIds[i]);
                    e = [e];
                    if (elems === null){
                        elems = e;
                    } else {
                        elems = ut.arraySimilarity(elems, e);
                    }}
                if(uv.isArray(elem)){
                   elem = ut.arraySimilarity(elem, elems);
                   return elem;
                } else {
                    return elems;
                }}
            return elem; }});
    (new uc.SelectorParserRules()).addRule({
        name: 'dotclass',
        check: function(elem, selector){
            var uv = __imns('util.validation'),
                ud = __imns('util.dom'),
                ut = __imns('util.tools');
            var elems = null;
            if(uv.hasCSSClassDotSelector(selector)){
                var dotClasses = ut.getCSSClassDotSelectors(selector);
                for(var i=0, imax=dotClasses.length; i<imax; i+=1){
                    var e = ud.findElementsByClass(dotClasses[i]);
                    if (elems === null){
                        elems = e;
                    } else {
                        elems = ut.arraySimilarity(elems, e);
                    }}
                if(uv.isArray(elem)){
                   elem = ut.arraySimilarity(elem, elems);
                   return elem;
                } else {
                    return elems;
                }}
            return elem; }});
    (new uc.SelectorParserRules()).addRule({
        name: 'tag',
        check: function(elem, selector){
            var ut = __imns('util.tools'),
                ud = __imns('util.dom'),
                uv = __imns('util.validation');
            var elems = null;
            if(uv.hasCSSTagSelector(selector)){
                var tags = ut.getCSSTagSelectors(selector);
                for(var i=0, imax=tags.length; i<imax; i+=1){
                    var e = ud.findElementsByTag(tags[i]);
                    if (elems === null){
                        elems = e;
                    } else {
                        elems = ut.arraySimiliarity(elems, e);
                    }}
                if(uv.isArray(elem)){
                    elem = ut.arraySimilarity(elem, elems);
                    return elem;
                } else {
                    return elems;
                }}
            return elem; }});
})();
(function(){
    //ut.cssIdentifierRegExp = /[a-zA-Z0-9\_\-\u00A0-\u10FFFD]*/;
    //var ut.cssIdentifierRegExp = /^(?!(--|-[0-9]|[0-9]))[a-zA-Z0-9\_\-\u00A0-\u10FFFD]+$/;
    //class /(?:\.)(?!(--|-[0-9]|[0-9]))[a-zA-Z0-9\_\-\u00A0-\u10FFFD]+/
    //id /?:\#)(?!(--|-[0-9]|[0-9]))[a-zA-Z0-9\_\-\u00A0-\u10FFFD]+/
    //tag /(?:\s|^)(?!(--|-[0-9]|[0-9]))[a-zA-Z0-9\_\-\u00A0-\u10FFFD]+/
    var ut = __imns('util.tools'),
        uv = __imns('util.validation');
    ut.cssIdentifierReg = '(?!(--|-[0-9]|[0-9]))[a-zA-Z0-9\\_\\-\\u00A0-\\u10FFFD]+';
    if(!('getCSSTagSelectors' in ut)){
        ut.getCSSTagSelectors = function(str){
            var ut = __imns('util.tools'),
                uv = __imns('util.validation');
            var re = new RegExp('(?:\\s|^)(' + ut.cssIdentifierReg + ')', 'g'),
                m = null,
                matches = [];
            if(uv.isString(str)){
                while((m = re.exec(str)) !== null){ matches.push(m[1]); }}
            return matches; };
    }
    if(!('getCSSClassDotSelectors' in ut)){
        ut.getCSSClassDotSelectors = function(str){
            var ut = __imns('util.tools'),
                uv = __imns('util.validation');
            var re = new RegExp('(?:\\.)(' + ut.cssIdentifierReg + ')', 'g'),
                m = null,
                matches = [];
            if(uv.isString(str)){
                while((m = re.exec(str)) !== null){ matches.push(m[1]); }}
            return matches; };
    }
    if(!('getCSSIdSelectors' in ut)){
        ut.getCSSIdSelectors = function(str){
            var ut = __imns('util.tools'),
                uv = __imns('util.validation');
            var re = new RegExp('(?:\\#)(' + ut.cssIdentifierReg + ')', 'g'),
                m = null,
                matches = [];
            if(uv.isString(str)){
                while((m = re.exec(str)) !== null){ matches.push(m[1]); }}
            return matches; };
    }
    if(!('hasCSSTagSelector' in uv)){
        uv.hasCSSTagSelector = function(str){
            var ut = __imns('util.tools');
            return (ut.getCSSTagSelectors(str).length > 0) ? true : false; };
    }
    if(!('hasCSSDotSelector' in uv)){
        uv.hasCSSClassDotSelector = function(str){
            var ut = __imns('util.tools');
            return (ut.getCSSClassDotSelectors(str).length > 0) ? true : false; };
    }
    if(!('hasCSSIdSelector' in uv)){
        uv.hasCSSIdSelector = function(str){
            var ut = __imns('util.tools');
            return (ut.getCSSIdSelectors(str).length > 0) ? true : false; };
    }
})();


(function(){
    var adr = __imns('util.dom');
    if(!('findElementsBySelector' in adr)){
        adr.findElementsBySelector = function(element, selector){
            if(element === null && selector === null){ return []; }
            var ud = __imns('util.dom');
            if(element === document && selector !== undefined){
                element = selector;
                selector = undefined; }
            if(selector === undefined){
                return (typeof element === 'string') ? ud.findElementsBySelector.prototype.all(element) : [];
            } else {
                var uv = __imns('util.validation');
                if(typeof element === 'string'){
                    var ec = ud.findElementsBySelector.prototype.all(element);
                    element = (ec.length > 0) ? ec[0] : undefined; }
                if(uv.isHTMLElement(element)){
                    return ud.findElementsBySelector.prototype.from(element, selector);
                }
            }
            return [];
        };
        adr.findElementsBySelector.prototype.from = function(element, selector){
            var uv = __imns('util.validation'), ud = __imns('util.dom'), el, arr = [];
            if(uv.isHTMLElement(element)){
                if('querySelectorAll' in element && typeof selector === 'string'){
                    el = element.querySelectorAll(selector);
                    return ud.htmlNodesToArray(el);
                } else if('jQuery' in window){
                    el = window.jQuery(element).children(selector);
                    return ud.htmlNodesToArray(el);
                }
            }
            return []; };
        adr.findElementsBySelector.prototype.all = function(selector){
            if(typeof selector === 'string'){
                var el, arr = [], ud = __imns('util.dom');
                selector = (selector.length === 0) ? '*' : selector;
                if('querySelectorAll' in document){
                    el = document.querySelectorAll(selector);
                    return ud.htmlNodesToArray(el);
                } else if('jQuery' in window){
                    el = window.jQuery('selector');
                    return ud.htmlNodesToArray(el);
                } else {
                    return ud.parseCSSSelector(selector);
                }
            }
            return []; };
    }
})();
