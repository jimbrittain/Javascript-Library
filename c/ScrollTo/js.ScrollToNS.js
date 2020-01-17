"use strict";
/* global __imns, window, document */
var adr = __imns('util.classes');
//var adr = window; //uncomment this line and delete prior for standalone;
if(!('ScrollTo' in adr)){
    adr.ScrollTo = function(){
        var uc = __imns('util.classes'),
            ut = __imns('util.tools'),
            c = this;
        if(uc.ScrollTo.prototype.singleton !== undefined){
            return uc.ScrollTo.prototype.singleton; }
        this.animInitiated = false;
        this.animScrollX = {};
        this.animScrollY = {};
        this.nonePushInitiated = false;
        this.lastScroll = new c.Coordinates();
        this.defaults = {
            block: 'center',
            inline: 'nearest',
            behavior: 'instant' };
        this.canBehave = true;
        ut.fetter(document, 'DOMContentLoaded', function(){ c.getDefaults(); }, true);
        return this; };
    adr.ScrollTo.prototype.getDefaults = function(){
        var uc = __imns('util.classes'),
            ut = __imns('util.tools'),
            sb = new uc.SupportedCSSProperty('scroll-behavior');
        //behavior default from CSS;
        this.defaults.behavior = (sb.exists) ? ut.findElementStyleDeep(document.body, sb.cssProperty) : 'instant';
    };
    adr.ScrollTo.elementWatcher = function(elem){
        //if is at position
    };
    adr.ScrollTo.elementWatch = function(evt){
        //get Element;
        //check if Element past, check if should f
    };
    adr.ScrollTo.prepareAnchor = function(anchorStr){
        var uv = __imns('util.validation');
        if(uv.isString(anchorStr) && anchorStr.length > 0){
            anchorStr = (anchorStr.charAt(0) === '#') ? anchorStr.substring(1) : anchorStr;
            anchorStr = encodeURI(anchorStr);
        } else { anchorStr = ''; }
        return anchorStr;
    };
    adr.ScrollTo.currentLocationHash = function(){
        var anchorStr = '';
        if('location' in window && 'hash' in window.location){
            anchorStr = window.location.hash;
            anchorStr = (anchorStr.charAt(0) === '#') ? anchorStr.substring(1) : anchorStr;
        } else {
            if('href' in window.location){
                anchorStr = window.location.href;
                //regExp on anchorStr;
            }
        }
        return decodeURI(anchorStr);
    };
    adr.ScrollTo.initNonePushState = function(){
        this.nonePushInitiated = true;
        var ut = __imns('util.tools');
        ut.fetter(window, 'hashchange', function(){
            var ut = __imns('util.tools'),
                uc = __imns('util.classes'),
                st = new uc.ScrollTo();
            if(st.progChange){
                st.progChange = false;
                ut.preventDefault();
                return false; }
            return true;
        }, true);
    };
    adr.ScrollTo.silentlyUpDateHash = function(anchorStr){
        anchorStr = this.prepareAnchor(anchorStr);
        if(decodeURI(anchorStr) !== this.currentLocationHash()){
            if('history' in window && 'replaceState' in window.history){
                var stateObj = {};
                window.history.replaceState(stateObj, 'silent', '#' + anchorStr);
            } else {
                if(!this.nonePushInitiated){ this.initNonePushState(); }
                this.progChange = true;
                window.location.href = '#' + anchorStr;
            }
        } else { return true; }
    };
    adr.ScrollTo.prototype.scroll = function(a, b){
        var ud = __imns('util.dom'),
            uc = __imns('util.classes'),
            uv = __imns('util.validation');
        //To position, a,b currently numbers only !measure
        if(a instanceof uc.Coordinates){
            this.scrollToCoordinates(a);
        } else if(uv.isNumber(a) && uv.isNumber(b)){
            var co = new uc.Coordinates(a,b);
            this.scrollToCoordinates(co); }
        //object
        if(typeof a === 'object'){
            //a = HTMLElement
            if(uv.isHTMLElement(a)){
                //might have to allow for b to be Boolean to support Element Scroll Into View,
                this.scrollToElement({element: a});
            } else {
                //a = Options Work Through
                this.scrollToOptions(a); }}
        return false; };
    adr.ScrollTo.prototype.validateBehavior = function(b){
        var uv = __imns('util.validation');
        if(uv.isString(b)){
            b = b.toLowerCase();
            var reg = /^auto|smooth|instant$/;
            return (reg.test()) ? b : undefined; }
        return undefined; };
    adr.ScrollTo.prototype.validateBlock = function(block){
        var uv = __imns('util.validation'),
            reg = /^start|center|end|nearest$/;
        if(uv.isString(block)){
            block = block.toLowerCase();
            return (reg.test(block)) ? block : 'center'; }
        return 'center'; };
    //validateInline cannot alias validateBlock, as despite sharing values defaults to nearest, !center
    adr.ScrollTo.prototype.validateInline = function(inline){
        var uv = __imns('util.validation'),
            reg = /^start|center|end|nearest$/;
        if(uv.isString(inline)){
            inline = inline.toLowerCase();
            return (reg.test(inline)) ? inline : 'nearest'; }
        return 'nearest'; };
    adr.ScrollTo.prototype.calculateCoordinates = function(elem, block, inline){
        var uv = __imns('util.validation'),
            uc = __imns('util.classes'),
            temp = {
                element: (uv.isHTMLElement(elem)) ? elem : undefined,
                block: this.validateBlock(block),
                inline: this.validateInline(inline)
            };
        if(temp.element !== undefined){
            var targetCoordinates = new uc.BoundaryCoordinates({element: temp.element}),
                targetScreen = new uc.ScreenProperties(),
                viewCoordinates = targetScreen.getDocumentBounds(); //documentBounds really should be renamed to viewPort
        }
        
            //bounding box of element;
            //bounding box of viewport
    };
    adr.ScrollTo.prototype.isSmoothScrollSupported = function(){
        var uc = __imns('util.classes');
        return ((new uc.SupportedCSSProperty('scroll-behvaiour')).exists)? true : false; };
    adr.ScrollTo.prototype.initAnimationProperty = function(){
        if(!this.isSmoothScrollSupported()){
            var uc = __imns('util.classes');
            this.animScrollX = new uc.AnimationProperty({
                name: 'imnsScrollX',
                get: function(){
                    var uc = __imns('util.classes'),
                        uv = __imns('util.validation'),
                        scr = (new uc.ScreenProperties()).getDocumentBounds(),
                        val = Math.round(parseFloat(scr.left));
                    return (uv.isNumber(val)) ? val : 0; },
                set: function(elem, val, name){
                    var uc = __imns('util.classes'),
                        st = new uc.ScrollTo(),
                        scr = (new uc.ScreenProperties()).getDocumentBounds(),
                        lastX = st.lastScroll.x,
                        tolerance = 5,
                        isTolerant = ((lastX - tolerance) < scr.left && (lastX + tolerance) > scr.left) ? true : false;
                    if(isTolerant){
                        val = Math.round(val);
                        if('scrollTo' in window){
                            window.scrollTo(val, scr.top);
                        } else {
                            window.scroll(val.scr.top);
                        }
                        st.lastScroll.x = val;
                        return true;
                    } else {
                        st.animateX.pause();
                        st.animateX.clear(); 
                        return false; }
                },
                start: function(){
                },
                end: function(){
                }
            });
            this.animScrollY = new uc.AnimationProperty({
                name: 'imnsScrollY',
                get: function(){
                    var uc = __imns('util.classes'),
                        uv = __imns('util.validation'),
                        scr = (new uc.ScreenProperties()).getDocumentBounds(),
                        val = Math.round(parseFloat(scr.top));
                    return (uv.isNumber(val)) ? val : 0; },
                set: function(elem, val, name){
                    var uc = __imns('util.classes'),
                        st = new uc.ScrollTo(),
                        scr = (new uc.ScreenProperties()).getDocumentBounds(),
                        lastY = st.lastScroll.y,
                        tolerance = 5,
                        isTolerant = ((lastY - tolerance) < scr.top && (lastY + tolerance) > scr.top) ? true : false;
                    if(isTolerant){
                        val = Math.round(val);
                        if('scrollTo' in window){
                            window.scrollTo(scr.left, val);
                        } else {
                            window.scroll(scr.left, val);
                        }
                        st.lastScroll.y = val;
                        return true;
                    } else {
                        st.animateY.pause();
                        st.animateY.clear(); 
                        return false; }
                },
                start: function(){
                },
                end: function(){
                }
            });
            this.animInitiated = true;
        }
    };
    adr.ScrollTo.prototype.animatedScroll = function(o){
        var uc = __imns('util.classes');
        //need a catcher, so if the user tries to interact, shuts down animation.
        if(this.animInitiated()){
            if('pause' in this.animScrollX){ this.animScrollX.pause(); }
            if('pause' in this.animScrollY){ this.animScrollY.pause(); }
        } else {
            this.initAnimationProperty(); }
        if(o.left !== this.screen.getDocumentBounds().scrollX){
            this.ScrollTo.animScrollX = new uc.Animation({
                element: window,
                property: 'imnsScrollX'
            });
        }
        if(o.top !== this.screen.getDocumentBounds().scrollY){
            adr.ScrollTo.animScrollY = new uc.Animation({
                element: window,
                property: 'imnsScrollY' 
            });
        }
    };
    adr.ScrollTo.prototype.scroll = function(o){
        var ud = __imns('util.dom'),
            uv = __imns('util.validation'),
            temp = {
                top: undefined,
                left: undefined,
                behavior: undefined };
        if(typeof o === 'object'){
            if('element' in o){
                if(uv.isHTMLElement(o.element)){
                    var tempBlock, tempInline;
                    if('alignTop' in o){
                        tempBlock = 'start';
                        tempInline = 'nearest'; }
                    if('block' in o){
                        tempBlock = (this.validateBlock(o.block)) ? o.block : tempBlock; }
                    if('inline' in o){
                        tempInline = (this.validateInline(o.inline)) ? o.inline : tempInline; }
                    var co = this.calculateCoordinates(o.element, o.block, o.inline);
                    temp.left = co.x;
                    temp.top = co.y; }
            } else {
                if('top' in o){ temp.top = this.validateTop(o.top); }
                if('left' in o){ temp.left = this.validateLeft(o.left); }
            }
        }
        if(temp.top !== undefined && temp.left !== undefined){
            var uc = __imns('util.classes');
            if(temp.behavior !== undefined && uc.ScrollTo.prototype.canBehave){
                if(temp.behavior === 'smooth' && !this.isSmoothScrollSupported()){
                    this.animatedScroll(temp);
                    return true;
                } else {
                    if('scrollTo' in window){
                        try {
                            window.scrollTo({
                                top: temp.top,
                                left: temp.left,
                                behavior: temp.behavior });
                        } catch(e){
                            uc.ScrollTo.prototype.canBehave = false;
                            window.scroll(temp.left, temp.top); }
                        return true;
                    } else if('scroll' in window){
                        try {
                            window.scroll({
                                top: temp.top,
                                left: temp.left,
                                behavior: temp.behavior });
                        } catch(e) { 
                            uc.ScrollTo.prototype.canBehave = false;
                            window.scroll(temp.left, temp.top); }
                        return true; }
                } 
            }
        }
        return false; };
    //window.scrollTo(x, y)
    //window.scrollTo(options)
    //  options
    //      top: (y)
    //      left: (x)
    //      behavior: smooth, instant, auto
    //window.scroll(x, y)
    //window.scroll(options)
    //  options
    //      top: (y)
    //      left: (x)
    //      behavior: smooth, instant, auto
    //element.scrollIntoView()
    //element.scrollIntoView(Bool) alignToTop=Boolean
    //      alignToTop: true (equivalence block:start, inline: nearest) false (block:end, inline:nearest)
    //element.scrollIntoView(options)
    //      behavior: auto, instant, smooth
    //      block: start, center, end, nearest (default = center)
    //      inline: start, center, end, nearest (default = nearest)
}
