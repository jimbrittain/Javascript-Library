"use strict";
/*global window, document, console, navigator, clearTimeout, setTimeout, __imns */
/*jshint -W069 */
var adr = __imns('component.classes');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('PerfectGrid' in adr)){

    // PerfectGrid Class
    /* Requires debounce,isHTMLElement

    * To call; 
    * 	either PerfectGrid(x) or new PerfectGrid.build(x);
    * 	2 versions;
    * 		PerfectGrid(
    * 			2 arguments:
    * 				first, holder : either HTMLElement or css selector string to element references;
    * 				second, boxIdentifier [optional] : css selector string that defines box relative to holder, defaults to all;
    * 		)
    * 		PerfectGrid(
    * 			1 object {
    * 				'holder' [required] 	: either HTMLElement or css selector string to element references;
    * 				'box' [optional]		: css selector string that defines box relative to holder, defaults to all;
    * 				'margin' [opt] 			: minimumMargin (only used on float so far), if not included uses margin-right on boxes
    * 				'multiline' [opt]		: boolean, grid (true), row (false), also can use perfectrow class on holder or 'row' variable on this object
    * 				'resize' 	[opt]		: boolean for fixing or resize
    * 				'method' [opt] 			: 'strict' || 'loose'
    * 			}
    * 		)
    * If you use first-creation build, i.e. new PerfectGrid(object), or first inclusion the PerfectGrid prototype will use vars as defaults;
    * */

    /**
     * Perfect Grid
     * @class PerfectGrid
     * @module PerfectGrid
     * @version 0.2
     * @author Immature Dawn
     * @constructor
     * @type Singleton
     * @copyright JDB 2014
     * @license - add license in here
     * @date 20140303
     * @requires isHTMLElement, PerfectGridArgs, GridObject, $.debounce, jQuery
     */
    adr.PerfectGrid = function(){
        var cc = __imns('component.classes');
        var first_run_boo = false, can_build_boo = false, args_obj = {};
        if(cc.PerfectGrid.prototype.singleton !== undefined){
            if(arguments && arguments.length){ cc.PerfectGrid.prototype.singleton.build(arguments); }
            return cc.PerfectGrid.prototype.singleton;
        } else { 
            cc.PerfectGrid.prototype.singleton = this;
            first_run_boo = true; }
        this.rows = [];
        this.args = [];
        this.fix_on_resize_boo = true; //boolean
        this.refresh_boo = true;
        this.minimum_margin = 0; //include conversion;
        this.last_method_str = 'strict'; // strict | loose
        this.multiline_boo = true; //boolean
        if(arguments.length > 0){
            args_obj = new cc.PerfectGridArgs();
            can_build_boo = args_obj.init(arguments);
            if(first_run_boo){
                this.minimum_margin = ('margin' in args_obj.optional) ? args_obj.optional.margin : this.minimum_margin;
                this.refresh_boo = ('refresh' in args_obj.optional) ? args_obj.optional.refresh : this.refresh_boo;
                this.fix_on_resize_boo = ('resize' in args_obj.optional) ? args_obj.optional.resize : this.fix_on_resize_boo;
                this.last_method_str = ('method' in args_obj.optional) ? args_obj.optional.method : this.last_method_str;
                this.multiline_boo = ('multiline' in args_obj.optional) ? args_obj.optional.multiline : this.multiline_boo; }
            if(can_build_boo){ this.build(arguments); }}
        if(this.fix_on_resize_boo){ this.setResize(); }
        return this; };
    /**
     * Perfect Grid findRowIdFromElement
     * @method findRowIdFromElement
     * @requires isHTMLElement
     * @param {HTMLElement} elem Argument 1
     * @return {Number|False} Number for PerfectGrid.rows or false for not found
     */
    adr.PerfectGrid.prototype.findRowIdFromElement = function(elem){
        var uv = __imns('util.validation'),
            udb = __imns('util.debug');
        if(elem !== undefined && uv.isHTMLElement(elem)){
            var _e = false;
            for(var i=0, max = this.rows.length; i < max; i+=1){
                if(elem === this.rows[i].element){
                    _e = i;
                    break; }}
            return _e;
        } else {
            (new udb.IMDebugger()).pass("PerfectRows.returnRowIdFromElement must be supplied a HTML Element");
            return false; }};
    /**
     * Perfect Grid findRowFromElement
     * @method findRowFromElement
     * @requires isHTMLElement
     * @dependencies findRowFromElement
     * @param {HTMLElement}
     * @return {GridObject|undefined} GridObject instance from PerfectGrid.rows
     */
    adr.PerfectGrid.prototype.findRowFromElement = function(elem){
        var id = this.findRowIdFromElement(elem);
        if(id !== false){
            return this.rows[id];
        } else { return undefined; }};
    /**
     * Perfect Grid addRow
     * @method addRow
     * @requires isHTMLElement
     * @dependencies elementExists, findRowIdFromElement
     * @param {GridObject} g Argument 1
     * @return {GridObject|undefined} GridObject instance from PerfectGrid.rows (whether or not added). Undefined if not a valid GridObject
     */
    adr.PerfectGrid.prototype.addRow = function(g){
        var cc = __imns('component.classes'),
            udb = __imns('util.debug');
        if(g instanceof cc.GridObject){
            if(!this.elementExists(g.element)){
                this.rows.push(g);
                this.rows[this.rows.length - 1].fix();
                return this.rows[this.rows.length - 1];
            } else { return this.rows[this.findRowIdFromElement(g.element)]; }
        } else { 
            (new udb.IMDebugger()).pass("PerfectGrid.addRow must be supplied a valid GridObject.");
            return undefined; }};
    /**
     * PerfectGrid deleteRowFromElement
     * @method deleteRowFromElement
     * @requires isHTMLElement
     * @dependencies elementExists, findRowIdFromElement, deleteRowFromId
     * @param {HTMLElement} elem Argument 1
     * @return {Boolean} true | false - latter if not found
     */
    adr.PerfectGrid.prototype.deleteRowFromElement = function(elem){
        var uv = __imns('util.validation'),
            udb = __imns('util.debug');
        var row_id = -1;
        if(elem !== undefined && uv.isHTMLElement(elem)){
            if(this.elementExists(elem)){
                row_id = this.findRowIdFromElement(elem);
                return this.deleteRowFromId(row_id);
            } else { return false; }
        } else {
            (new udb.IMDebugger()).pass("PerfectGrid.deleteRowFromElement must be supplied a valid HTMLElement.");
            return false; }};
    /**
     * PerfectGrid deleteRowFromId
     * @method deleteRowFromId
     * @return {Boolean} true | false, latter if not valid id;
     */
    adr.PerfectGrid.prototype.deleteRowFromId = function(id){
        if(id > -1 && id < this.rows.length){
            this.rows.splice(id,1);
            return true;
        } else {
            var udb = __imns('util.debug');
            (new udb.IMDebugger()).pass("PerfectGrid.deleteRowFromId was supplied an invalid id that is outside the acceptable range.");
            return false;}};
    /**
     * PerfectGrid deleteRedundantRows
     * @event deleteRedundantRows
     * @requires isHTMLElement, inVisibleDOM
     * @needs PerfectGrid.deleteRowFromId
     * @param {none}
     * @return {Number} Rows Length;
     */
    adr.PerfectGrid.prototype.deleteRedundantRows = function(){
        var uv = __imns('util.validation'),
            ud = __imns('util.dom');
        var i = this.rows.length - 1, del = false;
        while(i > -1){
            if(this.rows[i].element === undefined || !uv.isHTMLElement(this.rows[i].element) || !ud.inVisibleDOM(this.rows[i].element)){
                del = this.deleteRowFromId(i); }
            i -= 1; }
        return this.rows.length; };
    /**
     * Perfect Grid elementExists
     * Simple boolean response to if Element exists already within this.findRowIdFromElement;
     * @method elementExists
     * @requires isHTMLElement
     * @dependencies findRowIdFromElement
     * @param {HTMLElement} elem Argument 1
     * @return {Boolean}
     */
    adr.PerfectGrid.prototype.elementExists = function(elem){ return (this.findRowIdFromElement(elem) === false) ? false : true; };
    /**
     * Perfect Grid build
     * Builds the GridObjects and Arguments Objects necessary for operation
     * @method build
     * @requires PerfectGridArgs, isHTMLElement, GridObject
     * @uses PerfectGrid.elementExists
     * @uses PerfectGrid.findRowFromElement
     * @param {PerfectGridArgs | holder & box }
     * @return GridObjects
     */
    adr.PerfectGrid.prototype.build = function(){
        var cc = __imns('component.classes'),
            uv = __imns('util.validation'),
            ud = __imns('util.dom'),
            udb = __imns('util.debug');
        var args_obj = false, error_boo = false, obj = {}, element_arr = [], grid_returns_arr = [], grid_obj = null, len = 0;
        if(arguments && arguments.length > 0){
            args_obj = new cc.PerfectGridArgs(arguments);
            if(args_obj !== false){
                obj.multiline = ('multiline' in args_obj.optional) ? args_obj.optional.multiline : this.multiline_boo;
                obj.margin = ('margin' in args_obj.optional) ? args_obj.optional.margin : this.minimum_margin;
                obj.resize = ('resize' in args_obj.optional) ? args_obj.optional.resize : this.fix_on_resize_boo;
                obj.method = ('method' in args_obj.optional) ? args_obj.optional.method : this.last_method_str;
                obj.refresh = ('refresh' in args_obj.optional) ? args_obj.optional.refresh : this.refresh_boo;
                if(uv.isHTMLElement(args_obj.holder)){
                    element_arr.push(args_obj.holder);
                } else if(typeof(args_obj.holder) === 'string'){ 
                    element_arr = ud.findElementsBySelector(args_obj.holder);
                    //element_arr = $(args_obj.holder); 
                }
                for(var i=0, max = element_arr.length; i < max; i+=1){
                    obj.id = this.rows.length;
                    obj.holder = element_arr[i];
                    obj.box = args_obj.box;
                    grid_obj = new cc.GridObject(obj);
                    if(grid_obj instanceof cc.GridObject){
                        if(!this.elementExists(obj.holder)){
                            this.rows.push(grid_obj);
                            len = this.rows.length - 1;
                            this.rows[len].fix();
                            grid_returns_arr.push(this.rows[len]);
                        } else { grid_returns_arr.push(this.findRowFromElement(grid_obj.element)); }}}
                if(obj.refresh){
                    obj.holder = args_obj.holder;
                    obj.box = args_obj.box;
                    var found = false;
                    for(var j=0, jmax = this.args.length; j < jmax; j+= 1){
                        if(this.args[j].holder === obj.holder){ found = true; break; }}
                    if(!found){ this.args.push(obj); }}
            } else { error_boo = true; }
        } else { error_boo = true; }
        if(!error_boo && grid_returns_arr.length > 0){
            return (grid_returns_arr.length === 1) ? grid_returns_arr[0] : grid_returns_arr;
        } else {
            (new udb.IMDebugger()).pass("PerfectGrid.build not supplied with valid objects");
            return false; }};
    /**
     * PerfectGrid refresh
     * @method refresh
     * @uses PerfectGrid.build
     * @param {none}
     * @return {none}
     */
    adr.PerfectGrid.prototype.refresh = function(){ 
        this.deleteRedundantRows();
        for(var i = 0, max = this.args.length; i < max; i += 1){ this.build(this.args[i]); }};
    /**
     * PerfectGrid resize
     * @event resize
     * @requires GridObject, isHTMLElement
     * @uses GridObject.fix
     * @param {none}
     * @return {Boolean} true | false, generally unnecessary
     */
    adr.PerfectGrid.prototype.resize = function(){
        var uv = __imns('util.validation');
        var c = this, i = 0;
        if(this.fix_on_resize_boo && this.rows !== undefined && this.rows.length > 0){
            i = this.rows.length - 1;
            while(i > -1){
                if(this.rows[i].element !== undefined && uv.isHTMLElement(this.rows[i].element)){
                    if(this.rows[i].resize === true){ c.rows[i].fix(); }
                } else { this.deleteRowFromId(i); }
                i -= 1; }
            return true;
        } else { return false; }};
    /**
     * PerfectGrid setResize
     * @method setResize
     * @param {boolean | none} sets resize on or off, none = off
     * 	@default {none}
     * @requires jQuery, jQuery.debounce
     */
    adr.PerfectGrid.prototype.setResize = function(b){
        var setter = (b !== undefined && b === false) ? false : true, c = this, ut = __imns('util.tools');
        if(setter){
            this.fix_on_resize_boo = true;
            ut.fetter(window, 'resize', [c, function(){ 
                var ut = __imns('util.tools');
                ut.debounce(function(){ c.resize(); }, 500);
            }], true, 'both');
            //$(window).resize($.debounce(500, function(){ c.resize(); })); //this uses debounce? use your own?
        } else { this.fix_on_resize_boo = false; }};
    //adr.PerfectGrid.prototype.resizeHook = function(){
        //var c = this, ut = __imns('util.tools');
        //ut.limitExecution(c.resize, 500); };
    /**
     * GridObject
     * @class GridObject
     * @module GridObject
     * @submodule GridObject
     * @requires isHTMLElement, PerfectGrid
     * @constructor
     */
    adr.GridObject = function(){
        this.to = ""; //used to hold resize timeout
        this.id = -1;
        this.resize = false;
        this.element = undefined;
        this.boxIdentifier = '*';
        this.type = 'justify';
        this.multiline = true;
        this.customMarginRight = 0;
        this.minimumMarginRight = 0;
        this.hideOverflow = false;
        this.numberOfItemsPerRow = 1;
        this.totalItems = 0;
        this.lastline = 0;
        this.last_method = 'strict';
        this.callForMore = false;
        this.callMoreAction = null;
        this.resizeHold = "";

        var uv = __imns('util.validation');
        var obj = arguments;
        while(uv.isArguments(obj) && obj.length === 1){ obj = obj[0]; }
        return (this.init(obj)) ? this : undefined;
    }; //not a valid holder, so snapping;
    adr.GridObject.prototype.setElement = function(elem){
        var uv = __imns('util.validation'), ud = __imns('util.dom');
        if(typeof elem === 'string'){
            var l = ud.findElementsBySelector(elem);
            elem = (l.length > 0) ? l[0] : null; }
        if(uv.isHTMLElement(elem)){
            this.element = elem;
            return true;
        }
        return false; };
    adr.GridObject.prototype.disableMultiline = function(){
        var uv = __imns('util.validation');
        var children = this.childArray(), child = (children.length > 0 && uv.isHTMLElement(children[0])) ? children[0] : undefined;
        if(!this.multiline){
            this.hideOverflow = true;
            var childHeight = '100px';
            if(uv.isHTMLElement(child)){
                var cb = new (__imns('util.classes')).BoundaryCoordinates(child);
                childHeight = cb.height; }
            this.element.style['height'] = childHeight;
            this.element.style['overflow'] = 'hidden'; }};

    adr.GridObject.prototype.init = function(obj){
        var uv = __imns('util.validation'), ud = __imns('util.dom');
        if('holder' in obj){ this.setElement(obj.holder); }
        if(this.element !== undefined){
            this.id = ('id' in obj) ? parseInt(obj.id) : this.id;
            this.resize = ('resize' in obj && (obj.resize === true || obj.resize === false)) ? obj.resize : this.resize;
            this.last_method = ('method' in obj && (obj.method === 'strict' || obj.method === 'loose')) ? obj.method : this.last_method;
            this.multiline = ('multiline' in obj && (obj.multiline === true || obj.multiline === false)) ? obj.multiline : this.multiline;
            this.multiline = ('row' in obj) ? false : this.multiline;
            this.multiline = (ud.hasClass(this.element, 'perfectrow') || !this.multiline) ? false : this.multiline;
            var m = (ud.findElementsBySelector(this.element, obj.box)).length;
            this.boxIdentifier = ('box' in obj && (ud.findElementsBySelector(this.element, obj.box)).length > 0) ? obj.box : '*';
            var children = this.childArray(), child = (children.length > 0 && uv.isHTMLElement(children[0])) ? children[0] : undefined;
            this.totalItems = children.length;
            if(!this.multiline){ this.disableMultiline(); }
            this.minimumMarginRight = ('margin' in obj) ? parseFloat(obj.margin) : parseFloat(ud.findElementStyle(child, 'margin-right'));
            return true;
            } else {  return false; }};
    /**
     * GridObject fix
     * @method fix
     * @param {none}
     * @return {none}
     */
/*    adr.GridObject.prototype.childArray = function(){ 
        var ud = __imns('util.dom');
        return ud.findElementsBySelector(this.element, this.boxIdentifier); }; */
    adr.GridObject.prototype.childArray = function(){
        var ud = __imns('util.dom'),
            uv = __imns('util.validation');
        var arr = ud.findElementsBySelector(this.element, this.boxIdentifier);
        for(var i=0; i<arr.length; i+=1){
            if(ud.findParent(arr[i]) !== this.element){
                arr.splice(i,1);
                i -= 1; 
            } else if(ud.findElementStyleDeep(arr[i], 'display') === 'none'){
                arr.splice(i, 1);
                i -= 1; }}
        return arr; };
    adr.GridObject.prototype.firstChild = function(){
        var children = this.childArray();
        return (children.length > 0) ? children[0] : null; };
    adr.GridObject.prototype.fix = function(){
        var children = this.childArray();
        for(var i=0, imax = children.length; i<imax; i+=1){ 
            children[i].style['margin-right'] = 0;
            this.resolveItem(children[i], i); }};
    /**
     * GridObject getSpaceSize
     * @method getSpaceSize
     * @param {none}
     * @return {Number}
     * @notes Uses a 720/2048 space size (0.351562) rounded to 1dp
     */
    adr.GridObject.prototype.getSpaceSize = function(){
        var spaceSize = 0.3, ud = __imns('util.dom'), ut = __imns('util.tools'), fontSize = ud.findElementStyle(this.element, 'font-size');
        return (parseFloat(ut.measure(fontSize,'px', this.element)) * spaceSize); };
    /**
     * GridObject determineType
     * @method determineType
     * @param {none}
     * @requiries isHTMLElement, findElementStyle
     * @return {string} 'float'|'justify' dependent on object style
     */
    adr.GridObject.prototype.determineType = function(){
        var child = this.firstChild(), uv = __imns('util.validation'), ud = __imns('util.dom');
        if(uv.isHTMLElement(child)){
            var disp = ud.findElementStyle(child, 'display');
            if(disp === 'inline-block' && this.multiline){
                this.type = 'justify';
            } else if(disp === 'block' || !this.multiline){ this.type = 'float'; }}
        return this.type; };
    /**
     * GridObject getItemHeight
     * @method getItemHeight
     * @param {none}
     * @return {Number} maximum pixel height of items within row;
     * @requires isHTMLElement, findElementStyle
     */
    adr.GridObject.prototype.getItemHeight = function(){
        var uv = __imns('util.validation'),
            ud = __imns('util.dom'),
            udb = __imns('util.debug');
        var largest=0, children = this.childArray(), i=children.length, h = 0;
        if(i > 0 && this.element !== undefined && uv.isHTMLElement(this.element)){
            while(i > 0){
                i -= 1;
                h = parseFloat(ud.findElementStyle(children[i], 'outerHeight'));
                h = Math.ceil(h);
                largest = (h > largest) ? h : largest; }
            return largest; 
        } else { 
            (new udb.IMDebugger()).pass('Grid Element does not exist!');
            return 0; }};
    /**
     * GridObject getItemWidth
     * @method getItemWidth
     * @param {none}
     * @return {Number} average pixel width of items within row
     */
    adr.GridObject.prototype.getItemWidth = function(){
        var uv = __imns('util.validation'),
            ud = __imns('util.dom'),
            udb = __imns('util.debug');
        var children = this.childArray(), fullWidth = 0, numChildren = children.length;
        if(this.element !== undefined && uv.isHTMLElement(this.element)){
            for(var i=0; i<numChildren; i+= 1){ 
                fullWidth += parseFloat(ud.findElementStyle(children[i], 'offsetWidth')); }
            return (fullWidth > 0) ? Math.ceil(fullWidth/numChildren) : 0;
        } else { 
            (new udb.IMDebugger()).pass('Row Element does does not exist!');
            return 0; }};
    /**
     * GridObject calculateCustomMargin
     * @method calculateCustomMargin
     * @param {none}
     * @return {Number}
     * @requires jQuery
     * @dependencies getSpaceSize
     */
    adr.GridObject.prototype.calculateCustomMargin = function(){
        var ud = __imns('util.dom'),
            uc = __imns('util.classes');
        var children = this.childArray(), 
            firstChild = (children[0]) ? children[0] : null, 
            secondChild = (children[1]) ? children[1] : null,
            firstPos = (firstChild !== null) ? parseFloat((new uc.BoundaryCoordinates(firstChild)).left) : 0,
            secondPos = (secondChild !== null) ? parseFloat((new uc.BoundaryCoordinates(secondChild)).left) : 0;
        //firstPos += parseFloat(ud.findElementStyle(firstChild, 'outerWidth')); //may need to remove margin-left
        firstPos += parseFloat(ud.findElementStyle(firstChild, 'offsetWidth'));
        secondPos -= firstPos;
        secondPos -= this.getSpaceSize();
        secondPos = Math.ceil(secondPos);
        return (secondPos < 0) ? 0 : secondPos; };
    /**
     * GridObject resolveItem
     * @method resolveItem
     * @param {HTMLElement} item
     * @param {childNumber} number - potentially this could be done programmatically
     * @return {none}
     */
    adr.GridObject.prototype.resolveItem = function(item, childNumber){
        var on_id = childNumber, c = this;
        switch (childNumber){
            case 0:
                this.initialize();
                /* falls through */
            case 1:
                this.resolveFromSecondItem(item);
                /* falls through */
            default:
                this.defaultItemResolution(item);
                if((childNumber + 1) % this.numberOfItemsPerRow === 0){ this.lastOfRowResolution(item); }
                if(childNumber % this.numberOfItemsPerRow === 0){ this.firstOfRowResolution(item); }
                if(childNumber >= this.lastline && (childNumber !== (this.totalItems - 1)) || !this.multiline){ this.finalRowItemFix(item); }
                if(childNumber >= this.lastline && (childNumber === (this.totalItems - 1))){ 
                    c.to = setTimeout(
                        function(){ 
                            c.resize = c.resizeHold;
                            c.resizeHold = "";
                            clearTimeout(c.to);
                        }, 1000); }
                if(childNumber >= this.numberOfItemsPerRow){ this.overflowResolution(item); }
                break; }};
    /**
     * GridObject initialize
     * @method initialize
     * @param {none}
     * @return {none}
     */
    adr.GridObject.prototype.initialize = function(){
        var ud = __imns('util.dom'),
            uv = __imns('util.validation');
        var i, imax, paddingHeight, height=0, children = this.childArray(), width = 0, ieBreak = null;
        this.resizeHold = this.resize;
        this.resize = false;
        ieBreak = ud.findElementsBySelector(this.element, 'br.ie7breakpoints');
        if(uv.isHTMLElement(ieBreak) && 'removeChild' in this.element){ this.element.removeChild(ieBreak); }
        for(i=0, imax = children.length; i<imax; i+=1){ children[i].style['margin-right'] = '0'; }
        width = ud.findElementStyle(this.element, 'offsetWidth');
        if(!this.multiline){
            height = parseFloat(this.getItemHeight());
            paddingHeight = parseFloat(ud.findElementStyle(this.element, 'offsetHeight')) - parseFloat(ud.findElementStyle(this.element, 'innerHeight'));
            this.element.style['height'] = (paddingHeight + height) + 'px';
            this.element.style['min-height'] = (paddingHeight + height) + 'px'; }
        switch(this.determineType()){
            case 'justify':
                this.initializeJustify();
                break;
            case 'float':
                this.initializeFloat();
                break; }};

    adr.GridObject.prototype.initializeJustify = function(){
        var ud = __imns('util.dom');
        var width = ud.findElementStyle(this.element, 'offsetWidth'),
            priorIt = 0, i = 0, imax = 0,
            children = this.childArray(),
            actualSpaceSize = this.getSpaceSize(),
            actualWidth = width + actualSpaceSize; //as last space is not counted
        this.numberOfItemsPerRow = Math.floor(actualWidth/(this.getItemWidth() + actualSpaceSize));
        this.customMarginRight = width - (this.getItemWidth() * this.numberOfItemsPerRow);
        this.customMarginRight /= this.numberOfItemsPerRow;
        if((this.customMarginRight + actualSpaceSize) < this.minimumMarginRight){ // attempt at fixing for lower margins
            var newMargin = 0;
            priorIt = 0;
            newMargin = this.minimumMarginRight - actualSpaceSize;
            var nmt = newMargin + 'px';
            for(i=0, imax = children.length; i < imax; i+= 1){ children[i].style['margin-right'] = nmt; }
            priorIt = this.numberOfItemsPerRow;
            this.numberOfItemsPerRow = Math.floor((actualWidth/(this.getItemWidth() + newMargin + actualSpaceSize)));
            if(this.numberOfItemsPerRow !== priorIt){
                this.customMarginRight = width - (this.getItemWidth() * this.numberOfItemsPerRow);
                this.customMarginRight /= this.numberOfItemsPerRow;
                newMargin = this.customMarginRight - actualSpaceSize;
                nmt = newMargin + 'px';
                for(i=0, imax = children.length; i < imax; i+=1){ children[i].style['margin-right'] = nmt; }}
            var lastOfRowChildren = ud.findElementsBySelector(this.element, (this.boxIdentifier + ':nth-of-type(' + this.numberOfItemsPerRow + 'n)'));
            for(i=0, imax=lastOfRowChildren.length; i<imax; i+=1){ lastOfRowChildren[i].style['margin-right'] = '0'; }
            this.customMarginRight = newMargin; }
        this.lastline = this.totalItems % this.numberOfItemsPerRow;
        this.lastline = (this.lastline === 0) ? this.numberOfItemsPerRow : this.lastline;
        this.lastline = this.totalItems - this.lastline; };

    adr.GridObject.prototype.initializeFloat = function(){ this.calculateCustomMarginRight(); };
    adr.GridObject.prototype.calculateCustomMarginRight = function(){
        var ud = __imns('util.dom');
        var width = parseFloat(ud.findElementStyle(this.element, 'innerWidth')), priorIt = 0;
        width -= 1; //used for rounding issues;
        this.numberOfItemsPerRow = Math.floor(width/(this.getItemWidth() + this.getSpaceSize()));
        this.customMarginRight = width - ((this.getItemWidth() + this.getSpaceSize()) * this.numberOfItemsPerRow);
        this.customMarginRight += (Math.floor(this.getSpaceSize()) * (this.numberOfItemsPerRow)); //JDB 1606-new addition beware of issues;
        this.customMarginRight = this.customMarginRight/(this.numberOfItemsPerRow - 1);
        this.customMarginRightFix(); };
    adr.GridObject.prototype.customMarginRightFix = function(){
        var ud = __imns('util.dom');
        var priorIt = 0, width = parseFloat(ud.findElementStyle(this.element, 'innerWidth'));
        if(this.customMarginRight < this.minimumMarginRight){
            this.customMarginRight = this.minimumMarginRight;
            priorIt = this.numberOfItemsPerRow;
            this.numberOfItemsPerRow = Math.floor((width + this.customMarginRight)/(this.getItemWidth() + this.customMarginRight + this.getSpaceSize())); 
            if(priorIt !== this.numberOfItemsPerRow){
                this.customMarginRight = width - (this.getItemWidth() * this.numberOfItemsPerRow);
                this.customMarginRight = this.customMarginRight/(this.numberOfItemsPerRow - 1);
                this.customMarginRight = this.customMarginRight; }}};
    /**
     * GridObject resolveFromSecondItem
     * @method resolveFromSecondItem
     * @param {none}
     * @return {none} sets customMarginRight;
     * @dependencies calculateCustomMargin
     */
    adr.GridObject.prototype.resolveFromSecondItem = function(){
        if(this.type === 'justify' && this.last_method === 'loose'){ this.customMarginRight = this.calculateCustomMargin(); }};
    /**
     * GridObject defaultItemResolution
     * @event defaultItemResolution
     * @param {HTMLElement} item
     * @requires jQuery
     * @return {none}
     */
    adr.GridObject.prototype.defaultItemResolution = function(item){
        var is = item.style;
        is['visibility'] = 'visible';
        is['clear'] = 'none';
        switch (this.type){
            case 'justify':
                is['margin-left'] = '0';
                break;
            case 'float':
                is['margin-right'] = this.customMarginRight + 'px';
                break; }};
    /**
     * GridObject overflowResolution
     * @event overflowResolution
     * @param {HTMLElement} item
     * @requires jQuery
     * @return {none}
     */
    adr.GridObject.prototype.overflowResolution = function(item){ 
        var is = item.style;
        if(!this.multiline && this.hideOverflow){ 
            is['visibility'] = 'hidden';
            is['margin-right'] = '0'; }};
    adr.GridObject.prototype.createBrElement = function(){
        var ud = __imns('util.dom');
        var elem = null;
        if('createElement' in document){ 
            elem = document.createElement('br');
            ud.setAttribute(elem, 'clear', 'all');
            ud.setAttribute(elem, 'class', 'ie7breakpoints');
            ud.setAttribute(elem, 'style', 'clear:both'); }
        return elem; };
    /**
     * GridObject firstOfRowResolution
     * @method firstOfRowResolution
     * @param {HTMLElement} item
     * @requires jQuery
     * @return {none}
     */
    adr.GridObject.prototype.firstOfRowResolution = function(item){
        if(this.multiline){
            switch (this.type){
                case 'float':
                    item.style['clear'] = 'left';
                    if(navigator.appVersion.indexOf("MSIE 7.") !== -1 && !window.opera){ //ie7 fixes;
                        this.resize = false;
                        if('insertBefore' in item){ this.element.insertBefore(item, this.createBrElement()); }}
                    break; }}};
    /**
     * @event lastOfRowResolution
     * @param {HTMLElement} item Argument 1
     * @return {none}
     */
    adr.GridObject.prototype.lastOfRowResolution = function(item){
        switch (this.type){
            case 'float':
                item.style['margin-right'] = '0';
                break; }};
    /**
     * @event finalRowItemFix
     * @param {HTMLElement} item Argument 1
     * @return {none}
     */
    adr.GridObject.prototype.finalRowItemFix = function(item){
        var ud = __imns('util.dom');
        var firstChild = this.firstChild(), children = this.childArray(), actualHeight = 0;
        if(this.multiline){
            switch (this.type){
                case 'justify':
                    switch (this.last_method){
                        case 'loose':
                            item.style['margin-right'] = this.customMarginRight;
                            break;
                        case 'strict':
                            item.style['margin-right'] = this.calculateExactMargin(item) + 'px';
                            break; }
                    break; }
        } else {
            actualHeight = parseFloat(ud.findElementStyle(firstChild, 'outerHeight')) - parseFloat(ud.findElementStyle(firstChild, 'offsetHeight'));
            actualHeight = (isNaN(actualHeight)) ? 9 : actualHeight;
            actualHeight += parseInt(this.getItemHeight());
            actualHeight = actualHeight + 'px';
            for(var i=0, imax=children.length; i<imax; i+=1){
                children[i].style['height'] = actualHeight;
                children[i].style['min-height'] = actualHeight;
            }}};
    /**
     * GridObject findBoxId
     * @method findBoxId
     * @param {HTMLElement} elem
     * @return {Number | Boolean false}
     */
    adr.GridObject.prototype.findBoxId = function(elem){
        var uv = __imns('util.validation'),
            udb = __imns('util.debug');
        var c = this, _e = false, elem_arr = null, children = this.childArray();
        if(elem !== undefined && uv.isHTMLElement(elem)){
            for(var i=0, imax = children.length; i < imax; i += 1){
                if(children[i] === elem){ _e = i; break; }}
            return _e;
        } else {
            (new udb.IMDebugger()).pass("GridObject.findBoxId must be supplied a HTML Element");
            return false; }};
    /**
     * GridObject calculateExactMargin
     * @method calculateExactMargin
     * @param {HTMLELement} item
     * @return {Number}
     */
    adr.GridObject.prototype.calculateExactMargin = function (item){
        var uc = __imns('util.classes'),
            ud = __imns('util.dom');
        var onId = this.findBoxId(item), firstRowEquivalent = onId % this.numberOfItemsPerRow, currentLeft = 0, targetLeft = 0, children = this.childArray();
        if(firstRowEquivalent === onId){
            return this.minimumMarginRight;
        } else {
            targetLeft = parseFloat((new uc.BoundaryCoordinates(children[firstRowEquivalent + 1])).left);
            currentLeft = parseFloat((new uc.BoundaryCoordinates(children[onId])).left) + parseFloat(ud.findElementStyle(children[onId], 'outerWidth'));
            targetLeft -= currentLeft;
            targetLeft -= this.getSpaceSize();
        }
        return targetLeft; };
    /**
     * @class PerfectGridArgs
     * @module PerfectGrid
     * @submodule PerfectGridArgs
     * @constructor
     * @param {object|holder and box} Object ('holder','box' required: margin, multiline,resize,refresh,method optional);
     */
    adr.PerfectGridArgs = function(){
        var g = false;
        this.holder = null;
        this.box = null;
        this.optional = {};
        if(arguments.length > 0){ 
            g = this.init(arguments);
            return (g === false) ? false : this;
        } else { return this; }};
    /**
     * @method init
     * @param {object|holder and box} Object ('holder','box' required: margin, multiline,resize,refresh,method optional);
     * @return {Boolean} true|false
     */
    adr.PerfectGridArgs.prototype.init = function(args){
        var uv = __imns('util.validation');
        var v;
        while(uv.isArguments(args) && args.length === 1){ args = args[0]; }
        if(args.length === 2){
            this.holder = args[0];
            this.box = args[1];
        } else if(typeof(args) === 'object'){
            this.holder = ('holder' in args) ? args.holder : null;
            this.box = ('box' in args) ? args.box : null;
            if('margin' in args){ 
                v = (typeof(args.margin) === 'string') ? parseFloat(args.margin) : Number(args.margin);
                if(!isNaN(v)){ this.optional.margin = args.margin; }}
            if('multiline' in args){ this.optional.multiline = (args.multiline === false) ? false : true; }
            if('resize' in args){ this.optional.resize = (args.resize === false) ? false : true; }
            if('refresh' in args){ this.optional.refresh = (args.refresh === false) ? false : true; }
            if('method' in args){ this.optional.method = (args.method === 'strict' || args.method === 'loose') ? args.method : 'strict'; }
        }
        return (this.box !== null && this.holder !== null) ? true : false; };


}
