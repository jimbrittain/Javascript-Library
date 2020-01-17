"use strict";
/* jshint -W069 */
/* global window, IMDebugger, $, __imns, document, console, setTimeout */
/* remove setTimeout and -W069 from above */
var adr = __imns('component.classes');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('Carousel' in adr)){
    /**
      @module Carousel
      @class Carousel
      @constructor
      @property initialised {Boolean}
      @property infinite {Boolean}
      @property container {HTMLElement|null}
      @property innercontainer {HTMLElement|null}
      @property itemSelector {String}
      @property direction {Number}
      @property core {String} first,last,asc,center
      @property on {Number}
     **/
    /**
      To develop: 
        - Check over with thinking about a variable width item. Would need to assume width based on primary, and then check as we go
        - Need to look at CarouselTransition, develop the linear version to a Standard/Extends
        - onReceipt, need to fire an event on receipt, which says how many are being received(?) and definitely if front or rear
     **/
    adr.Carousel = function(o){
        var cc = __imns('component.classes');
        this.initialised = false;
        this.active = true;

        this.infinite = false;
        this.container = null;
        this.id = '';
        this.innercontainer = null;
        this.itemSelector = '*';
        this.on = new cc.CarouselItemReference(0, null, this);
        this.loop = false;
        this.advancement = new cc.CarouselAdvancement();
        this.buffer = 0;

        this.events = {};
        this._requestNext = null;
        this._requestPrior = null;
        this._transition = null;
        this._visibility = null;

        this.first = -Infinity;
        this.last = Infinity;

        this._nextdirection = null;

        this.waitingonnext = false;
        this.waitingonprior = false;

        this._innerclassname = 'imcarouselinner';
        if(cc.Carousel.prototype.idint === undefined){ cc.Carousel.prototype.idint = 0; }

        this.init(o); };

    /**
      @method Carousel.init
      @param o {Object} see description
      @return {Boolean}
      @description -
        {
            container: HTMLElement,
            itemSelector: String (selector)
            direction: Number|String
            first: Number
            last: Number
            loop: Boolean
            infiniteVisible: Boolean
            initial: Boolean
            requestNext: Function|null
            requestPrior: Function|null
            transition: Function|null
        }
     **/
    adr.Carousel.prototype.init = function(o){
        var uc = __imns('util.classes'),
            ut = __imns('util.tools');
        if(typeof o === 'object'){
            var obj = {
                advancement: [1,1],
                buffer: 0,
                container: null,
                direction: '',
                first: -Infinity,
                infiniteVisible: false,
                initial: false,
                itemSelector: '*',
                last: Infinity,
                loop: false,
                requestNext: null,
                requestPrior: null,
                transition: null,
                visibility: null
            };
            o = ut.handlePassedArguments(o, obj);
            var a = this.setContainer(o.container);
            var b = this.setItems(o.itemSelector);
            this.initContainer();
            this.buildInnerContainer();

            this.setBuffer(o.buffer);
            this.setLoop(o.loop);
            this.setAdvancement(o.advancement);
            this.setFirst(o.first);
            this.setLast(o.last);
            this.setOnlyInitial(o.initial);

            this.setRequestNext(o.requestNext);
            this.setRequestPrior(o.requestPrior);
            this.setTransition(o.transition);
            this.setVisibilityTest(o.visibility);

            if(o.direction !== ''){
                this.fixNextDirection(o.direction);
            } else { this.softFixNextDirection(); }

            this.events = {
                'requestedNext' : ut.createEvent('carouselRequestNext'),
                'requestedPrior' : ut.createEvent('carouselRequestPrior'),
                'receivedNext' : ut.createEvent('carouselReceivedNext'),
                'receivedPrior' : ut.createEvent('carouselReceivedPrior'),
                'transitionStart' : ut.createEvent('carouselTransitionStart'),
                'transitionEnd' : ut.createEvent('carouselTransitionEnd'),
                'error' : ut.createEvent('carouselError'),
                'initialised' : ut.createEvent('carouselInitialised'),
                'reachedFirst' : ut.createEvent('carouselReachedFirst'),
                'reachedLast' : ut.createEvent('carouselReachedLast'),
                'setActive' : ut.createEvent('carouselSetActive'),
                'setInactive' : ut.createEvent('carouselSetInactive'),
                'slide' : ut.createEvent('carouselSlide'),
                'loopFirst' : ut.createEvent('carouselLoopFirst'),
                'loopLast' : ut.createEvent('carouselLoopLast')
            };
            if(a && b){ 
                this.initialised = true; 
                this.setOn(0);
                ut.fireElementEvent(this.container, this.events.initialised); }}
        return this.initialised; };
    /**
      @method Carousel.setFirst
      @param num {Number}
      @return {Boolean}
      @description - attempts to set first; if valid sets, if not -Infinity
     **/
    adr.Carousel.prototype.setFirst = function(num){
        var uv = __imns('util.validation');
        var n = num;
        if(uv.isNumber(n)){
            n = parseInt(n);
            if(n > 0){ n = 0; }
            this.first = n;
        } else { this.first = -Infinity; }
        return (num === this.first); };
    /**
      @method Carousel.setLast
      @param num {Number}
      @return {Boolean}
      @description - attempts to set last; if valid sets, if not Infinity
     **/
    adr.Carousel.prototype.setLast = function(num){
        var uv = __imns('util.validation');
        var n = num;
        if(uv.isNumber(n)){
            n = parseInt(n);
            if(n < 0){ n = 0; }
            this.last = n;
        } else { this.last = Infinity; }
        return (num === this.last); };
    adr.Carousel.prototype.setAdvancement = function(n, p){ this.advancement= new (__imns('component.classes')).CarouselAdvancement(n, p); };
    /**
      @method Carousel.setInfiniteVisible
      @alias Carousel.infiniteItems
      @param b {Boolean}
      @return {Boolean} - has set
     **/
    adr.Carousel.prototype.setInfiniteVisible = function(b){
        var uv = __imns('util.validation');
        b = (b === undefined) ? true : b;
        if(uv.isBoolean(b)){
            this.infinite = b;
            return true; }
        return false; };
    adr.Carousel.prototype.infiniteItems = adr.Carousel.prototype.setInfiniteVisible;
    /**
      @method Carousel.setContainer
      @param elem {HTMLElement}
      @return {Boolean}
      @description - set this.container, if good calls buildInnerContainer
     **/
    adr.Carousel.prototype.setContainer = function(elem){
        var ud = __imns('util.dom'),
            uv = __imns('util.validation');
        if(uv.isString(elem)){
            var es = ud.findElementsBySelector(elem);
            elem = (es.length === 1) ? es[0] : elem; }
        if(uv.isHTMLElement(elem)){
            this.container = elem;
            //this.initContainer();
            //this.buildInnerContainer();
            return true; }
        return false; };
    adr.Carousel.prototype.initContainer = function(){
        var ud = __imns('util.dom'),
            cc = __imns('component.classes');
        ud.addClass(this.container, 'carousel');
        if(!(ud.hasAttribute('tabindex'))){
            ud.setAttribute(this.container, 'tabindex', '-1');
        }
        if(!(ud.hasAttribute(this.container, 'id'))){
            cc.Carousel.prototype.idint += 1;
            ud.setAttribute(this.container, 'imcarousel' + cc.Carousel.prototype.idint); }
        this.id = ud.getAttribute(this.container, 'id');
    };
    /**
      @method Carousel.buildInnerContainer
      @return {Boolean}
      @description adds an innercontainer as the first child of the container, and inserts the descendants of container into it. Used for animation and hiding;
     **/
    adr.Carousel.prototype.buildInnerContainer = function(){
        var uv = __imns('util.validation'),
            ud = __imns('util.dom');
        if(this.container !== null){
            var firstChild = ('childNodes' in this.container) ? this.container.childNodes[0] : (('children' in this.container) ? this.container.children[0] : null);
            if(!uv.isHTMLElement(firstChild) || !(ud.hasClass(firstChild, this._innerclassname))){
                var tag = '';
                if('createElement' in document){
                    tag = document.createElement('div');
                    tag.setAttribute('class', this._innerclassname);
                } else { tag = '<div class="' + this._innerclassname + '"></div>'; }
                ud.wrapElementsWithElement(this.getItems(), tag);
                this.innercontainer = ud.findElementsBySelector(this.container, ('.' + this._innerclassname))[0];
            } else { return true; }}
        return false; };
    /**
      @method Carousel.setItems
      @param str {String}
      @return {Boolean}
      @description - sets Child selector relative to container, there MUST be at least one item avaiable at initiation or it fails.
     **/
    adr.Carousel.prototype.setItems = function(str){
        var ud = __imns('util.dom'),
            uv = __imns('util.validation');
        if(uv.isString(str) && this.container !== null){
            var es = ud.findElementsBySelector(this.container, str);
            if(es.length > 0){ 
                this.itemSelector = str; 
                return true; }}
        return false; };
    /**
      @method Carousel.setTransition
      @param f {CarouselTransition|Function|null}
      @return {Boolean}
      @description - Set the transition handler, decided to make separate as otherwise limits potential
     **/
    adr.Carousel.prototype.setTransition = function(f){
        var uv = __imns('util.validation'),
            cc = __imns('component.classes');
        if(uv.isFunction(f) || f === null || f instanceof cc.CarouselTransition){
            this._transition = f;
            return true; }
        return false; };
    /**
      @method Carousel.setVisibilityTest
      @param f {Function|null}
      @return {Boolean}
      @description -Set the visibility handler, if not set uses default
     **/
    adr.Carousel.prototype.setVisibilityTest = function(f){
        var uv = __imns('util.validation');
        if(uv.isFunction(f) || f === null){
            this._visibility = f;
            return true; }
        return false; };
    /**
      @method Carousel.setBuffer
      @param n {Number}
      @return {Boolean}
      @description - attempts to set buffer capability of carousel
     **/
    adr.Carousel.prototype.setBuffer = function(n){
        var uv = __imns('util.validation');
        this.buffer = (uv.isNumber(n)) ? Math.abs(Math.round(n)) : this.buffer;
        return (n === this.buffer); };
    /**
      @method Carousel.setLoop
      @param b {Boolean}
      @return {Boolean}
      @description - attempts to set looping capability of carousel
     **/
    adr.Carousel.prototype.setLoop = function(b){
        var uv = __imns('util.validation');
        var a = (uv.isBoolean(b)) ? b : false;
        this.loop = a;
        return (a === b); };
    /**
      @method Carousel.directionKeys
      @param next {Boolean}
      @return {Array} containing KeyCode and Key references for directional movement
      @description - from Carousel._nextdirection/Carousel.getNextDirection provides key codes for that movement,
                    e.g. if right = returns ArrowRight, 39, bottom = returns ArrowDown, 40, topright = ArrowRight, ArrowDown, 39, 40
                    if next {Boolean} provided if false returns the prior direction
      @alias Carousel.nextDirectionKeys = Carousel.directionKeys(true)
      @alias Carousel.priorDirectionKeys = Carousel.directionKeys(false)
     **/
    adr.Carousel.prototype.directionKeys = function(next){
        next = (next === undefined || next !== false) ? 0 : 180; //used to get previous direction.
        var dir = (this._nextdirection !== null) ? this._nextdirection : this.getNextDirection();
        dir += next;
        dir %= 360;
        dir = (dir < 0) ? 360 - dir : dir;
        var keys = [];
        if(dir === 0 || (dir > 0 && dir < 90) || (dir > 270 && dir < 360)){ // --> x
            keys.push('ArrowRight');
            keys.push(39);
        } else if(dir > 90 && dir < 270){ // <-- x
            keys.push('ArrowLeft');
            keys.push(37); }
        if(dir > 0 && dir < 180){ // down y (guess as is invert y axis)
            keys.push('ArrowDown');
            keys.push(40);
        } else if(dir > 180 && dir < 360){
            keys.push('ArrowUp');
            keys.push(38); }
        return keys; };
    adr.Carousel.prototype.nextDirectionKeys = function(){ return this.directionKeys(true); };
    adr.Carousel.prototype.priorDirectionKeys = function(){ return this.directionKeys(false); };
    /**
      @method Carousel.softFixNextDirection
      @description - Attempts to softly judge direction based on the containerElement.dir||containerElement.style['direction']
     **/
    adr.Carousel.prototype.softFixNextDirection = function(){
        var ud = __imns('util.dom');
        var dir = 'ltr';
        if(ud.hasAttribute(this.container, 'dir') && ud.getAttribute(this.container, 'dir') !== null){
            dir = ud.getAttribute(this.container, 'dir');
            this.fixNextDirection(dir);
        } else {
            dir = ud.findElementStyleDeep(this.container, 'direction');
            if(dir !== 'ltr'){ this.fixNextDirection(dir); }}};
    /**
      @method Carousel.getNextDirection
      @description -Attempts to calculate next direction based on the on Item Element, and next Item Element current positions
                    will FAIL if next item is stacked, or has no display. MUST be hard set on initiation if this is the case,
                    using Carousel.fixNextDirection.
     **/
    adr.Carousel.prototype.getNextDirection = function(){
        var uc = __imns('util.classes');
        var items = this.getItems(),
            onb = null,
            neb = null;
        var id = this.on.id;
        onb = (items[id] !== undefined) ? new uc.BoundaryCoordinates(items[id]) : null;
        id += 1;
        neb = (items[neb] !== undefined) ? new uc.BoundaryCoordinates(items[id]) : null;
        if(neb !== null && onb !== null){
            var onc = new uc.Coordinates(onb.x1, onb.y1),
                nec = new uc.Coordinates(onc.x1, onc.y1),
                diff = new uc.Coordinates(onc.distanceToX(nec), onc.distanceToY(nec));
            if(diff.x > 0){
                return (diff.y < 0) ? 315 : ((diff.y > 0) ? 45 : 0);
            } else if(diff.x < 0){
                return (diff.y < 0) ? 225 : ((diff.y > 0) ? 135 : 0);
            } else if(diff.x === 0){
                return (diff.y < 0) ? 270 : ((diff.y > 0) ? 90 : 0); }}
        return 0; };
    /**
      @method Carousel.fixNextDirection
      @param dir {String|Number}
      @return {Boolean}
      @description -Use either a numerical degrees or string to establish direction
                    Strings include 'left', 'ltr', 'l', 'right', 'rtl', 'r', 'top', 'ttb', 't', 'bottom', 'btt', 'b'
                    'topleft', 'tl', 'lefttop', 'lt'
                    'topright', 'tr', 'righttop', 'rt'
                    'bottomleft', 'bl', 'leftbottom', 'lb'
                    'bottomright', 'br', 'rightbottom', 'rb'
      @develop     -Add Radian and Degree methods
      @concern     -Think ltr, and rtl, ttb, btt are all backwards;
     **/
    adr.Carousel.prototype.fixNextDirection = function(dir){
        var uv = __imns('util.validation');
        if(uv.isNumber(dir)){
            dir %= 360;
            dir = (dir < 0) ? 360 - dir : dir;
            this._nextdirection = dir;
            return true;
        } else if(uv.isString(dir)){
            dir = dir.toLowerCase();
            switch (dir){
                case 'left':
                case 'rtl':
                case 'l':
                    this._nextdirection = 180;
                    return true;
                case 'right':
                case 'ltr':
                case 'r':
                    this._nextdirection = 0;
                    return true;
                case 'top':
                case 'btt':
                case 't':
                    this._nextdirection = 270;
                    return true;
                case 'bottom':
                case 'ttb':
                case 'b':
                    this._nextdirection = 90;
                    return true;
                case 'topleft':
                case 'tl':
                case 'lt':
                case 'lefttop':
                    this._nextdirection = 315;
                    return true;
                case 'topright':
                case 'tr':
                case 'rt':
                case 'righttop':
                    this._nextdirection = 225;
                    return true;
                case 'bottomleft':
                case 'bl':
                case 'lb':
                case 'leftbottom':
                    this._nextdirection = 135;
                    return true;
                case 'bottomright':
                case 'br':
                case 'rb':
                case 'rightbottom':
                    this._nextdirection = 45;
                    return true; }}
        return false; };
    /**
      @method Carousel.setActive
      @param b {Boolean}
      @alias Carousel.setInactive = Carousel.setActive false;
     **/
    adr.Carousel.prototype.setActive = function(b){
        var uv = __imns('util.validation'),
            ut = __imns('util.tools');
        var a = (uv.isBoolean(b)) ? b : true;
        if(a){
            this.active = true;
            ut.fireElementEvent(this.container, 'setActive');
        } else {
            this.active = false;
            ut.fireElementEvent(this.container, 'setInactive'); }
        return (a === b); };
    adr.Carousel.prototype.setInactive = function(){ return this.setActive(false); };
    /**
      @method Carousel.getItems
      @return {Array} of HTMLElements which are the items
     **/
    adr.Carousel.prototype.getItems = function(){
        var ud = __imns('util.dom');
        return ud.findElementsBySelector(this.container, this.itemSelector); };
    /**
      @method Carousel.numberOfItems
      @return {Number} of Items
     **/
    adr.Carousel.prototype.numberOfItems = function(){ return this.getItems().length; };
    /**
      @method Carousel.findItemId
      @param elem {HTMLElement}
      @return {Number|false} - caution 0 !== false
     **/
    adr.Carousel.prototype.findItemId = function(elem){
        var uv = __imns('util.validation');
        if(uv.isHTMLElement(elem)){
            var id = -1,
                gi = this.getItems();
            for(var i=0, imax=gi.length; i<imax; i+=1){
                if(elem === gi[i]){ return i; }}}
        return false; };
    /**
      @method Carousel.isItem
      @param elem {HTMLElement}
      @return {Boolean}
      @requires Carousel.findItemId
     **/
    adr.Carousel.prototype.isItem = function(elem){ return (this.findItemId(elem) !== false) ? true : false; };
    /**
      @method Carousel.onItem
      @return {HTMLElement|null}
     **/
    adr.Carousel.prototype.onItem = function(){
        var a = this.getItems();
        return (a[this.on.id] !== undefined) ? a[this.on.id] : null; };
    /**
      @method Carousel.numberVisible
      @return {Number}
     **/
    adr.Carousel.prototype.numberVisible = function(){
        var uc = __imns('util.classes');
        if(this.initialised){
            if(!this.infinite){
                var items = this.getItems(),
                    visible = 0;
                for(var i=0, imax = items.length; i<imax; i+=1){
                    if(this.isItemVisible(items[i])){ 
                        visible += 1; 
                    }}
                return visible;
            } else { return Infinity; }
        }
        return 0; };
    /**
      @method Carousel.isItemVisible
      @param item {HTMLElement|Number}
      @return {Boolean}
      @description - is there an overlap between item and Carousel
     **/
    adr.Carousel.prototype.isItemVisible = function(item){
        var uc = __imns('util.classes'),
            ud = __imns('util.dom'),
            uv = __imns('util.validation');
        if(uv.isNumber(item)){
            item = (Math.abs(item) === item && item > -1 && item > this.numberOfItems()) ? this.getItems()[item] : -1;
        } else if(uv.isHTMLElement(item)){
            item = (this.isItem(item)) ? item : -1; }
        if(uv.isHTMLElement(item)){
            var done = false;
            if(this._visibility !== null && uv.isFunction(this._visibility)){
                var b = this._visibility(item);
                if(uv.isBoolean(b)){
                    done = true; //not needed
                    return b; }} 
            if(!done){
                if(ud.findElementStyleDeep(item, 'display') === 'none'){ return false; }
                var cb = new uc.BoundaryCoordinates(this.container),
                    ib = new uc.BoundaryCoordinates(item);
                return (cb.isOverlap(ib)) ? true : false; }}
         return false; };
    /**
      @method Carousel.onlyCurrent
      @alias Carousel.setOnlyInitial
      @param b {Boolean}
      @return {Boolean}
      @description - sets the Carousel to not request any further items and only works with current;
     **/
    adr.Carousel.prototype.onlyCurrent = function(b){
        var uv = __imns('util.validation');
        if(uv.isBoolean(b)){
            this.initial = b;
            if(this.initial){
                this.setFirst(0);
                this.setLast(this.getItems().length);
            } else {
                this.first = this.first;
                this.last = this.last; }
            return true; }
        return false; };
    adr.Carousel.prototype.setOnlyInitial = adr.Carousel.prototype.onlyCurrent;

    /** :::::::::::::::::::::::::::::::::::::: USER RELEVANT METHODS ::::::::::::::::::::::::::::::::::::::::::::: **/
    adr.Carousel.prototype.prior = function(){ this._move(new (__imns('component.classes')).CarouselMovement({ carousel: this, distance: (0 - this.advancement.prior)})); };
    adr.Carousel.prototype.next = function(){ this._move(new (__imns('component.classes')).CarouselMovement({ carousel: this, distance: this.advancement.next})); };
    /**
      @method Carousel.advance
      @param n {Number}
      @description advances by a user-defined number, rather than the carousel-owned next and prior values
     **/
    adr.Carousel.prototype.advance = function(n){
        var uv = __imns('util.validation'),
            cc = __imns('component.classes');
        if(uv.isNumber(n)){
            n = Math.round(n);
            if(n > 0){
                var movement = new cc.CarouselMovement({carousel: this, distance: n});
                this._move(movement); 
            } else if(n < 0){
                this.retreat(Math.abs(n)); }}};
    /**
      @method Carousel.retreat
      @param n {Number}
      @description retreats by a user-defined number, rather than the carousel-owned next and prior values
    **/
    adr.Carousel.prototype.retreat = function(n){
        var uv = __imns('util.validation'),
            cc = __imns('component.classes');
        if(uv.isNumber(n)){
            n = Math.round(n);
            n = 0 - n;
            if(n < 0){
                var movement = new cc.CarouselMovement({carousel: this, distance: n});
                this._move(movement);
            } else if(n > 0){
                this.advance(n); }}};
    /**
     @method Carousl.goto
     @param n {Number}
     @warning - the user defined number may be updated during adding in prior values, the user should handle this
   **/
    adr.Carousel.prototype.goto = function(n){
        var uv = __imns('util.validation'),
            cc = __imns('component.classes');
        if(uv.isNumber(n)){
            n = Math.round(n);
            var movement = new cc.CarouselMovement({carousel: this, target: n});
            if(movement.getTarget() === n){
                this._move(movement); }}};
    /**
      @method Carousel._move
      @param movement {CarouselMovement}
      @internal
     **/
    adr.Carousel.prototype._move = function(movement){
        var cc = __imns('component.classes'),
            uv = __imns('util.validation');
        movement = (!(movement instanceof cc.CarouselMovement) && uv.isNumber(movement)) ? new cc.CarouselMovement(this, movement) : movement;
        if(this.active && this.initialised && movement instanceof cc.CarouselMovement){
           if(this.hasAvailable(movement) && (!(this.shouldUseBuffer(movement)) || this.hasBufferAvailable(movement))){
               this.transition(movement);
           } else {
               var d = movement.getDistance();
               if(d > 0){
                   this.waitingonnext = true;
                   this.requestNext(movement);
               } else if(d < 0){
                   this.waitingonprior = true;
                   this.requestPrior(movement); }}}};
    /** :::::::::::::::::::::::::::::::::::::: USER RELEVANT METHODS END ::::::::::::::::::::::::::::::::::::::::: **/
    adr.Carousel.prototype.firstAvailableId = function(){ return 0; };
    /**
      @method Carousel.firstAvailable
      @returns {HTMLElement} first available element
     **/
    adr.Carousel.prototype.firstAvailable = function(){ return this.getItems()[this.firstAvailableId()]; };
    /**
      @method Carousel.lastAvailable
      @return {HTMLElement} last available element
     **/
    adr.Carousel.prototype.lastAvailableId = function(){ 
        var gi = this.getItems().length - 1;
        return (gi < 0) ? 0 : gi; };
    adr.Carousel.prototype.lastAvailable = function(){ return this.getItems()[this.lastAvailableId()]; };
    /**
     @method Carousel.firstVisibleId
     @return {Number} first visible Id
    **/
    adr.Carousel.prototype.firstVisibleId = function(){
        var ud = __imns('util.dom');
        var items = this.getItems(),
            first = this.on.id;
        for(var i=this.on.id, imin = -1; i>imin; i-=1){
            if(ud.findElementStyleDeep(items[i], 'display') !== 'none' && this.isItemVisible(items[i])){
                first = i;
            } else { break; }}
        return first; };
    adr.Carousel.prototype.firstVisible = function(){ return this.getItems()[this.firstVisibleId()]; };
    /**
      @method Carousel.lastVisibleId
      @return {Number}
      @description - finds the last visible id
     **/
    adr.Carousel.prototype.lastVisibleId = function(){
        var ud = __imns('util.dom');
        var items = this.getItems(),
            last = this.on.id;
        for(var i=this.on.id, imax=items.length; i<imax; i+=1){
            if(ud.findElementStyleDeep(items[i], 'display') !== 'none' && this.isItemVisible(items[i])){
                last = i;
            } else { break; }}
        return last; };
    adr.Carousel.prototype.lastVisible = function(){ return this.getItems()[this.lastVisibleId()]; };
    adr.Carousel.prototype.shouldUseBuffer = function(movement){
        if(this.buffer !== 0){
            var cc = __imns('component.classes');
            if(!(movement instanceof cc.CarouselMovement)){
                movement = new cc.CarouselMovement(this, movement); }
            if(movement.getDistance() > 0){
                return (this.last !== this.numberOfItems()) ? true : false;
            } else if(movement.getDistance() < 0){
                return (this.first < 0) ? true : false;
            } else { return false; }
        } else { return false; }};
    adr.Carousel.prototype.hasAvailable = function(movement){
        var uv = __imns('util.validation'),
            cc = __imns('component.classes');
        if(!(movement instanceof cc.CarouselMovement)){ //assumes distance;
            movement = new cc.CarouselMovement(movement); }
        var ft = movement.getTarget(),
            fd = movement.getDistance(),
            gi = this.numberOfItems();
        if(ft < 0){
            return false;
        } else if(ft >= gi){
            return false;
        } else { return true; }};
    adr.Carousel.prototype.hasBufferAvailable = function(movement){
        if(this.buffer !== 0){
            var uv = __imns('util.validation'),
                cc = __imns('component.classes');
            if(!(movement instanceof cc.CarouselMovement)){ //assumes distance;
                movement = new cc.CarouselMovement(movement); }
            var ft = movement.getTarget(),
                fd = movement.getDistance(),
                gi = this.numberOfItems();
            ft = (fd > 0) ? ft + this.buffer : ((fd < 0) ? ft - this.buffer : ft);
            if(ft < 0){
                return (ft >= this.first) ? false : true;
            } else if(ft > gi){
                return (ft < this.last) ? false : true;
            } else { return true; }
        } else { return this.hasAvailable(movement); }};
    /**
      @method Carousel setSelected
      @param id
     **/
    adr.Carousel.prototype.setSelected = function(on, off){
        var ud = __imns('util.dom'),
            uv = __imns('util.validation');
        if(off !== undefined && 'element' in off && off.element !== null){ ud.removeClass(off.element, 'selected'); }
        if(on !== undefined && 'element' in on && on.element !== null){ ud.addClass(on.element, 'selected');}}; 
    /**
     * @method Carousel.setOn
     * @param id {Number}
     **/
    adr.Carousel.prototype.setOn = function(id){
        var ut = __imns('util.tools'),
            cc = __imns('component.classes');
        var off = this.on;
        this.on = new cc.CarouselItemReference(id, this.getItems()[id], this);
        this.setSelected(this.on, off);
        if(this.isAtLast()){ this.reachedLast(); }
        if(this.isAtFirst()){ this.reachedFirst(); }
        ut.fireElementEvent(this.container, this.events.slide, {'on':this.on, 'off':off}); };
    /**
     * @method Carousel.transition
     * @param id {Number}
     **/
    adr.Carousel.prototype.transition = function(n){
        var cc = __imns('component.classes'),
            uv = __imns('util.validation'),
            ut = __imns('util.tools');
        var movement = (!(n instanceof cc.CarouselMovement) && uv.isNumber(n)) ? new cc.CarouselMovement({carousel:this, target:n}) : n;
        var c = this;
        var p = new cc.CarouselPasser(c, movement);
        this.setOn(movement.getTarget());
        this.setActive(false);
        ut.fireElementEvent(this.container, this.events.transitionStart);
        if(this._transition !== null){
            if(this._transition instanceof cc.CarouselTransition){
                this._transition.transition(p);
            } else { this._transition(p); }
        } else { this.transitionComplete(); }
        return true; };
    /**
     * @method Carousel.transitionComplete
     **/
    adr.Carousel.prototype.transitionComplete = function(){
        var ut = __imns('util.tools');
        this.setActive(true);
        ut.fireElementEvent(this.container, this.events.transitionEnd); 
        if(this.isAtLast()){ this.reachedLast(); }
        if(this.isAtFirst()){ this.reachedFirst(); }};

    adr.Carousel.prototype.isAtLast = function(){
        if(this.canLoopForwards()){
            return false;
        } else { return (this.on.id < (this.last - 1)) ? false : true; }};
    adr.Carousel.prototype.isAtFirst = function(){
        if(this.canLoopBackwards()){
            return false;
        } else {
            return (this.on.id > this.first) ? false : true; }};
    adr.Carousel.prototype.canLoopForwards = function(){ return (this.loop && this.first > -Infinity); };
    adr.Carousel.prototype.canLoopBackwards = function(){ return (this.loop && this.last < Infinity); };
    adr.Carousel.prototype.canLoop = function(){ return (this.loop && this.canLoopForwards() && this.canLoopBackwards()); };
    adr.Carousel.prototype.reachedFirst = function(){
        var ut = __imns('util.tools');
        if(this.isAtFirst()){
            if(this.loop && this.canLoopBackwards()){
                ut.fireElementEvent(this.container, this.events.loopFirst);
                return true;
            } else {
                ut.fireElementEvent(this.container, this.events.reachedFirst);
                return true; }}
        return false; };
    adr.Carousel.prototype.reachedLast = function(){
        var ut = __imns('util.tools');
        if(this.isAtLast()){
            if(this.loop && this.canLoopForwards()){
                ut.fireElementEvent(this.container, this.events.loopLast);
                return true;
            } else {
                ut.fireElementEvent(this.container, this.events.reachedLast);
                return true; }}
        return false; };
    /**
      @method Carousel.atFirst
      @requires util.tools.fireElementEvent
      @return {Boolean}
      @description Events/Methods fired when at first
     **/
    adr.Carousel.prototype.atFirst = function(){
        var ut = __imns('util.tools');
        if(this.loop){
            ut.fireElementEvent(this.container, this.events.loopFirst);
        } else {
            ut.fireElementEvent(this.container, this.events.reachedFirst);
            return false; }};
    /**
      @method Carousel.atLast
      @requires util.tools.fireElementEvent
      @return {Boolean}
      @description Events/Methods fired when at last;
     **/
    adr.Carousel.prototype.atLast = function(){
        var ut = __imns('util.tools');
        if(this.loop){
            ut.fireElementEvent(this.container, this.events.loopLast);
        } else {
            ut.fireElementEvent(this.container, this.events.reachedLast);
            return false; }};
    /**
      @method Carousel.requestPrior
      @param n {Number} Optional - index of needed;
      @return {Boolean}
     **/
    adr.Carousel.prototype.requestPrior = function(movement){
        var uv = __imns('util.validation'),
            cc = __imns('component.classes');
        movement = (!(movement instanceof cc.CarouselMovement) && uv.isNumber(movement)) ? new cc.CarouselMovement({carousel: this, distance: 0 - movement}) : movement;
        if(uv.isFunction(this._requestPrior)){ 
            var p = new cc.CarouselPasser(this, movement, this.waitingonprior);
            this.waitingonprior = false;
            this._requestPrior(p); 
        } else {
            this.onlyCurrent();
            this._move(movement); }
        return false; };
    adr.Carousel.prototype.requestNext = function(movement){
        var uv = __imns('util.validation'),
            cc = __imns('component.classes');
        movement = (!(movement instanceof cc.CarouselMovement) && uv.isNumber(movement)) ? new cc.CarouselMovement({carousel: this, distance: movement}) : movement;
        if(uv.isFunction(this._requestNext)){ 
            var p = new cc.CarouselPasser(this, movement, this.waitingonnext);
            this.waitingonnext = false;
            this._requestNext(p); 
        } else {
            this.onlyCurrent();
            this._move(movement); }
        return false; };
    adr.Carousel.prototype.onReceipt = function(){
        //console.log('received');
    };
    adr.Carousel.prototype.maximumPriorReached = function(){
        this._requestPrior = null;
        this.setFirst(0); 
        if(this.isAtFirst()){ this.reachedFirst(); }};
    adr.Carousel.prototype.maximumNextReached = function(){
        this._requestNext = null;
        this.setLast(this.getItems().length); 
        if(this.isAtLast()){ this.reachedLast(); }};
    adr.Carousel.prototype.setRequestPrior = function(f){
        var uv = __imns('util.validation');
        if(uv.isFunction(f) || f === null){
            this._requestPrior = f;
            return true; }
        return false; };
    adr.Carousel.prototype.setRequestNext = function(f){
        var uv = __imns('util.validation');
        if(uv.isFunction(f) || f === null){
            this._requestNext = f;
            return true; }
        return false; };
    adr.Carousel.prototype.receiveNext = function(a, passer){
        var uv = __imns('util.validation'),
            cc = __imns('component.classes'),
            ut = __imns('util.tools');
        var p = this.itemParent(),
            received = false,
            onElement = this.getItems()[this.on.id];
        a = (uv.isHTMLElement(a)) ? [a] : a;
        if(p !== undefined && uv.isHTMLElement(p)){
            if(uv.isArray(a)){
                for(var i=0, imax=a.length; i<imax; i+=1){
                    var b = a[i];
                    if(uv.isHTMLElement(b)){
                            if('appendChild' in p){
                                p.appendChild(b);
                                received = true;
                            } else if('innerHTML' in p && 'outerHTML' in b){
                                p.innerHTML += b.outerHTML;
                               received = true; }}}
            } else if(uv.isString(a) && a.length > 0){
                if('innerHTML' in p){ 
                    p.innerHTML += a; 
                    received = true;
                }}}
        var notEnough = false,
            movement = null;
        if(received){
            ut.fireElementEvent(this.container, this.events.receivedNext);
            var num = passer.numberOfItems;
            if((this.numberOfItems() - num) < Math.abs(passer.destinationDistance)){ //failure needs to reset destination;
                notEnough = true;
            } else {
                movement = new cc.CarouselMovement({carousel: this, target: passer.destinationIndex});
                var diff = this.on.id;
                this.on.update();
                diff = diff - this.on.id;
                movement.update(diff); 
                if(passer.waiting){ this.transition(movement); }
                this.waitingonnext = false; }}
        if(!received || notEnough){
            this.error = true;
            this.setLast(this.getItems().length);
            if(this.waitingonnext){
                movement = new cc.CarouselMovement({carousel: this, target: this.numberOfItems() - 1});
                this.transition(movement); 
            }
            this.waitingonnext = false;
            this.atLast();
            (new (__imns('util.debug')).IMDebugger()).pass('Carousel Error: receiveNext did not receive any more/enough results');
            return false; }
    };
    adr.Carousel.prototype.receivePrior = function(a, passer){
        var uv = __imns('util.validation'),
            cc = __imns('component.classes'),
            ut = __imns('util.tools');
        var p = this.itemParent(),
            received = false,
            numberBeforeAdd = this.numberOfItems();
        a = (uv.isHTMLElement(a)) ? [a] : a;
        var gi = this.getItems(),
            gl = gi.length,
            onElement = gi[this.on.id];
        if(p !== undefined && uv.isHTMLElement(p)){
            if(uv.isArray(a)){
                for(var i=0, imax = a.length; i<imax; i+=1){
                    var b = a[i];
                    if(uv.isHTMLElement(b)){
                        if('insertBefore' in p){
                            var firstChild = ('childNodes' in p) ? p.childNodes[0] : (('children' in p) ? p.children[0] : null);
                            if(firstChild !== null){
                                p.insertBefore(b, p.childNodes[0]);
                            } else { 
                                p.appendChild(b); }
                            received = true;
                        } else if('innerHTML' in p){
                            p.innerHTML = b.outerHTML + p.innerHTML;
                            received = true; }}}
            } else if(uv.isString(a) && a.length > 0){
                if('innerHTML' in p){ 
                    p.innerHTML += a;
                    received = true; }}}
        var notEnough = false,
            movement = null;
        if(received){
            ut.fireElementEvent(this.container, this.events.receivedPrior);
            var numberReceived = (this.numberOfItems() - numberBeforeAdd);
            //need to have crap in here to deal with the selection change;
            this.setLast(this.last + numberReceived);
            if(numberReceived < Math.abs(passer.destinationDistance)){ //failure needs to reset destination;
                notEnough = true;
            } else {
                movement = new cc.CarouselMovement({carousel: this, target: -passer.destinationIndex});
                var diff = this.on.id;
                this.on.update();
                diff = diff - this.on.id;
                movement.update(diff); 
                if(passer.waiting){ this.transition(movement); }
                this.waitingonprior = false; }}
        if(!received || notEnough){
            this.error = true;
            this.setFirst(0);
            if(this.waitingonprior){
                movement = new cc.CarouselMovement({carousel: this, target: 0});
                this.transition(movement); }
            this.waitingonprior= false;
            this.atFirst();
            (new (__imns('util.debug')).IMDebugger()).pass('Carousel Error: receivePrior did not receive any more/enough results');
            return false; }};
    /**
      @method Carousel.itemParent
      @return {HTMLElement|null}
      @description - returns HTMLElement (direct parent of item) or null if none;
     **/
    adr.Carousel.prototype.itemParent = function(){
        var ud = __imns('util.dom');
        var a = ud.findElementsBySelector(this.container, this.itemSelector);
        if(a.length > 0){ return ud.findParent(a[0]); }
        return null; };

    adr.CarouselControlAction = function(label, action, func){
        this.label = '';
        this.action = '';
        this.func = '';
        this.valid = false;
        this.init(label, action, func); };
}
