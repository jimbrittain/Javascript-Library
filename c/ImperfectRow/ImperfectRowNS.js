"use strict";
/*global window, document, console, navigator, clearTimeout, setTimeout, __imns */
/*jshint -W069 */
var adr = __imns('component.classes');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('ImperfectRow' in adr)){
    adr.ImperfectRow = function(){
        var cc = __imns('component.classes');
        if(cc.ImperfectRow.prototype.singleton !== undefined){
            if(arguments && arguments.length){ cc.ImperfectRow.prototype.singleton.build(arguments); }
            return cc.ImperfectRow.prototype.singleton;
        } else {
            cc.ImperfectRow.prototype.singleton = this; }
        this.rows = [];
        this.fixOnResize = true;
        this.build(arguments);
        if(this.fixOnResize){ this.setResize(this.fixOnResize); }};
    adr.ImperfectRow.prototype.build = function(args){
        var uv = __imns('util.validation'),
            cc = __imns('component.classes');
        var rowObj = null;
        while(uv.isArguments(args) && args.length === 1){ args = args[0]; }
        if(args.length === 2){
            rowObj = new cc.ImperfectRowObject({ element: args[0], boxIdentifier: args[1]});
        } else if(typeof args === 'object' && 'element' in args && 'boxIdentifier'){
            rowObj = new cc.ImperfectRowObject(args); }
        if(rowObj instanceof cc.ImperfectRowObject && rowObj.isValid()){
            if(!this.elementExists(rowObj.element)){
                this.rows.push(rowObj);
                this.rows[this.rows.length - 1].fix();
                return true; }}
        return false; };
    adr.ImperfectRow.prototype.findRowIdFromElement = function(elem){
        var uv = __imns('util.validation');
        if(elem !== undefined && uv.isHTMLElement(elem)){
            var _e = false;
            for(var i=0, imax = this.rows.length; i<imax; i+=1){
                if(elem === this.rows[i].element){
                    _e = i;
                    break; }}
            return _e; }
        return false; };
    adr.ImperfectRow.prototype.findRowFromElement = function(elem){
        var id = this.findRowIdFromElement(elem);
        return (id !== false) ? this.rows[id] : undefined; };
    adr.ImperfectRow.prototype.elementExists = function(elem){ return (this.findRowIdFromElement(elem) === false) ? false : true; };
    adr.ImperfectRow.prototype.addRow = function(r){
        var cc = __imns('component.classes');
        if(r instanceof cc.ImperfectRowObject){
            if(!this.elementExists(r.element)){
                this.rows.push(r);
                this.rows[this.rows.length - 1].fix();
                return this.rows[this.rows.length - 1];
            }
            return this.rows[this.findRowIdFromElement(r.element)]; }
        return undefined; };
    adr.ImperfectRow.prototype.deleteRowFromElement = function(elem){
        var uv = __imns('util.validation');
        var rowId = -1;
        if(elem !== undefined && uv.isHTMLElement(elem)){
            if(this.elementExists(elem)){
                rowId = this.findRowIdFromElement(elem);
                return this.deleteRowFromId(rowId); }}
        return false; };
    adr.ImperfectRow.prototype.deleteRowFromId = function(id){
        var uv = __imns('util.validation');
        id = (uv.isNumber(id)) ? Math.round(id) : id;
        if(uv.isNumber(id) && id > -1 && id < this.rows.length){
            this.rows.splice(id,1);
            return true; }
        return false; };
    adr.ImperfectRow.prototype.deleteRedundantRows = function(){
        var uv = __imns('util.validation'),
            ud = __imns('util.dom');
        var i = this.rows.length - 1, del = false;
        while(i > -1){
            if(this.rows[i].element === undefined || !uv.isHTMLElement(this.rows[i].element) || !ud.inVisibleDOM(this.rows[i].element)){
                del = this.deleteRowFromId(i); }
            i -= 1; }
        return this.rows.length; };
    adr.ImperfectRow.prototype.setResize = function(b){
        var ut = __imns('util.tools');
        var setter = (b !== undefined && b === false) ? false : true, c = this;
        if(setter){
            this.fixOnResize = setter;
            ut.fetter(window, 'resize', [c, function(){
                (__imns('util.tools')).debounce(function(){ c.resize(); }, 500);
            }], true, 'both'); }};
    adr.ImperfectRow.prototype.resize = function(){
        var uv = __imns('util.validation');
        var c = this, i = 0;
        if(this.fixOnResize && this.rows !== undefined && this.rows.length > 0){
            i = this.rows.length - 1;
            while(i > -1){
                if(this.rows[i].element !== undefined && uv.isHTMLElement(this.rows[i].element)){
                    if(this.rows[i].resize === true){ c.rows[i].fix(); }
                } else { this.deleteRowFromId(i); }
                i -= 1; }
            return true; }
        return false; };
    adr.ImperfectRowObject = function(a){
        this.active = true;
        this.resize = true;
        this.element = '';
        this.boxIdentifier = '*'; 
        this.margin = 'right';
        this.valid = false; 
        if(a !== undefined){ this.init(a); }};
    adr.ImperfectRowObject.prototype.init = function(args){
        if(typeof args === 'object'){
            if('element' in args){ this.setElement(args.element); }
            if('boxIdentifier' in args){ this.setBoxIdentifier(args.boxIdentifier); }
            if('margin' in args){ this.setMargin(args.margin); }
        }
    };
    adr.ImperfectRowObject.prototype.isValid = function(){
        var uv = __imns('util.validation');
        if(this.element !== null && this.boxIdentifier !== ''){
            if(uv.isHTMLElement(this.element) && this.childArray().length > 0){
                return true; }}
        return false; };
    adr.ImperfectRowObject.prototype.setActive = function(b){
        var uv = __imns('util.validation');
        this.active = (uv.isBoolean(b)) ? b : true; 
        return this.active; };
    adr.ImperfectRowObject.prototype.setElement = function(elem){
        var uv = __imns('util.validation'),
            ud = __imns('util.dom');
        if(uv.isHTMLElement(elem)){
            this.element = elem;
            return true;
        } else if(uv.isString(elem)){
            var elems = ud.findElementsBySelector(elem);
            this.element = (elems.length === 1) ? elems[0] : null;
            return (elems.length === 1) ? true : false; }
        return false; };
    adr.ImperfectRowObject.prototype.setMargin = function(str){
        var uv = __imns('util.validation');
        if(uv.isString(str)){
            switch(str){
                case 'left':
                case 'l':
                    this.margin = 'left';
                    return true;
                default:
                    this.margin = 'right';
                    return true; }}
        return false; };
    adr.ImperfectRowObject.prototype.getMargin = function(){ return 'margin-' + this.margin; };
    adr.ImperfectRowObject.prototype.setBoxIdentifier = function(str){
        var ud = __imns('util.dom'),
            uv = __imns('util.validation');
        if(uv.isString(str)){
            this.boxIdentifier = (ud.findElementsBySelector(this.element, str).length > 0) ? str : '*'; 
            return (str === this.boxIdentifier); }
        return false; };
    adr.ImperfectRowObject.prototype.fix = function(){
        console.log('here');
        var ud = __imns('util.dom');
        if(this.active){
            var children = this.childArray(),
                existingWidth = 0,
                visibleChildren = [],
                individualMargin = 0,
                i=0, imax=0;
            for(i=0, imax=children.length; i<imax; i+=1){ children[i].style[this.getMargin()] = '0px'; }
            visibleChildren = this.childArrayVisible();
            for(i=0, imax=visibleChildren.length; i<imax; i+=1){
                existingWidth += parseFloat(ud.findElementStyle(visibleChildren[i], 'offsetWidth')); }
            var freeWidth = this.getContainerWidth() - existingWidth;
            freeWidth /= (visibleChildren.length - 1);
            freeWidth = Math.floor(freeWidth);
            for(i=0, imax=children.length; i<imax; i+=1){
                var elem = children[i];
                //var newWidth = parseFloat(ud.findElementStyle(elem, this.getMargin()));
                elem.style[this.getMargin()] = freeWidth + 'px'; }
                return true; }
        return false; };
    adr.ImperfectRowObject.prototype.getContainerWidth = function(){
        var ud = __imns('util.dom');
        return parseFloat(ud.findElementStyle(this.element, 'innerWidth')); };
    adr.ImperfectRowObject.prototype.childArray = function(){
        var ud = __imns('util.dom');
        return ud.findElementsBySelector(this.element, this.boxIdentifier); };
    adr.ImperfectRowObject.prototype.childArrayVisible = function(){
        var ud = __imns('util.dom'),
            uc = __imns('util.classes');
        var children = this.childArray(),
            fcBoundary = new uc.BoundaryCoordinates(children[0]),
            bottomY = parseInt(fcBoundary.y2),
            arr = [],
            cBoundary = new uc.BoundaryCoordinates(this.element);
        for(var i=0, imax=children.length; i<imax; i+= 1){
            var ob = new uc.BoundaryCoordinates(children[i]);
            if(parseInt(ob.y1) < bottomY && cBoundary.isOver(ob)){ arr.push(children[i]); }}
        return arr; };
}
