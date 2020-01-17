"use strict";
/* jshint -W069 */
/* global window, IMDebugger, $, __imns, document, console, setTimeout, clearTimeout */
var adr = __imns('component.classes');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('CarouselTransition' in adr)){
    adr.CarouselTransition = function(o){
        this.weighting = 'front';
        this._transition = null;
        this._complete = null;
        this.transitiontime = 0;
        this.to = null;
        this.passer = null;
        this.init(o); };
    adr.CarouselTransition.prototype.init = function(o){
        if(typeof o === 'object'){
            if('transition' in o){ this.setTransition(o.transition); }
            if('complete' in o){this.setTransitionComplete(o.complete); }
            if('time' in o){ this.setTransitionTime(o.time); }
            if('weighting' in o){ this.setWeighting(o.weighting); }}};
    adr.CarouselTransition.prototype.setTransitionTime = function(t){ this.transitiontime = parseFloat((__imns('util.tools')).returnTime(t, 'ms')); };
    adr.CarouselTransition.prototype.setTransitionComplete = function(f){
        if(f === null || (__imns('util.validation')).isFunction(f)){
            this._complete = f;
            return true; }
        return false; };
    adr.CarouselTransition.prototype.setTransition = function(f){
        if(f === null || (__imns('util.validation')).isFunction(f)){
            this._transition = f;
            return true; }
        return false; };
    adr.CarouselTransition.prototype.setWeighting = function(str){
        var uv = __imns('util.validation');
        if(uv.isString(str)){
            str = str.toLowercase();
            switch(str) {
                case 'back':
                    this.weighting = 'back';
                    return true;
                case 'center':
                case 'mid':
                case 'middle':
                    this.weighting = 'center';
                    return true;
                default:
                    this.weighting = 'front'; }
            return true; 
        } else {
            var a123 = 'emptyblockkiller';
            //this would be where you try and guess it;
        }
        return false; };
    adr.CarouselTransition.prototype.clearTransitionTimeout = function(){
        if(this.to !== null){
            clearTimeout(this.to);
            this.to = null; }};
    adr.CarouselTransition.prototype.complete = function(p){
        p = (p === undefined && this.passer !== null) ? this.passer : p;
        if(p instanceof (__imns('component.classes')).CarouselPasser){
            var uv = __imns('util.validation');
            this.passer = p;
            this.clearTransitionTimeout();
            p.carousel.transitionComplete();
            if(this._complete !== null){ this._complete(this); }
            if(this.passer !== null){ this.passer = null; }
        } else {
            this.invalidCarouselPasser();
            return []; }};
    adr.CarouselTransition.prototype.transition = function(p){
        this.passer = p;
        if(this._transition !== null){
            this._transition(this);
            //this._transition(p);
            if(this.transitiontime !== 0){
                this.clearTransitionTimeout();
                var c = this;
                this.to = setTimeout(function(){ c.complete(p); }, this.transitiontime);
           } else { this.complete(); }
           return true;
        } else {
            (new (__imns('util.debug')).IMDebugger()).pass('components.classes.CarouselTransition.transition does not have a transition set up, use ...setTransition(function)');
             return false; }};
    adr.CarouselTransition.prototype.getVisibleLayoutAtSelectedItemId = function(id, p){
        p = (p === undefined && this.passer !== null) ? this.passer : p;
        if(p instanceof (__imns('component.classes')).CarouselPasser){
            var ut = __imns('util.tools');
            var workingArray = this.getLayoutAtSelectedItemId(id),
                visible = p.numberVisible,
                upperRange = p.numberVisible - 1,
                lowerRange = p.numberVisible - 1,
                revisedId = ut.findIdInArray(p.items[id], workingArray);
            switch(this.weighting){
                case 'back':
                    upperRange = 0;
                    break;
                case 'center':
                    upperRange = Math.ceil(upperRange/2);
                    lowerRange = Math.floor(lowerRange/2);
                    break;
                default:
                    lowerRange = 0; }
           if((revisedId - lowerRange) < 0){
               var lowerReduction = revisedId - lowerRange; //val (-)
               upperRange -= lowerReduction;
               lowerRange += lowerReduction; }
           if((revisedId + upperRange + 1) >= workingArray.length){
               var upperReduction = (revisedId + upperRange + 1) - workingArray.length; //val (+)
               lowerRange += upperReduction;
               upperRange -= upperReduction; }
            var r = workingArray.slice(0, revisedId + upperRange + 1);
            r = r.slice((revisedId - lowerRange));
            return r;
        } else {
            (new (__imns('util.debug')).IMDebugger()).pass('components.classes.CarouselTransition.transition does not have a transition set up, use ...setTransition(function)');
             return false; }};
    adr.CarouselTransition.prototype.getVisibleItemElementsAtSelectedItemId = adr.CarouselTransition.prototype.getVisibleLayoutAtSelectedItemId;
    adr.CarouselTransition.prototype.getVisibleItemIdsAtSelectedId = function(id, p){
        p = (p === undefined && this.passer !== null) ? this.passer : p;
        if(p instanceof (__imns('component.classes')).CarouselPasser){
            var ut = __imns('util.tools');
            var r = [],
                visibleArray = this.getVisibleItemElementsAtSelectedItemId(id, p);
            for(var i=0, imax = visibleArray.length; i<imax; i+=1){
                r.push(ut.findIdInArray(visibleArray[i], p.items)); }
            return r;
        } else {
            (new (__imns('util.debug')).IMDebugger()).pass('components.classes.CarouselTransition.transition does not have a transition set up, use ...setTransition(function)');
             return false; }};
    adr.CarouselTransition.prototype.getInvisibleItemElementsAtSelectedItemId = function(id, p){
        p = (p === undefined && this.passer !== null) ? this.passer : p;
        if(p instanceof (__imns('component.classes')).CarouselPasser){
            var ut = __imns('util.tools');
            var workingArray = ut.clone(p.items),
                visibleArray = this.getVisibleItemIdsAtSelectedId(id,p),
                r = [];
            if(visibleArray.length > 0 && visibleArray.length < workingArray.length){
                for(var i=0, imax=p.items.length; i<imax; i+=1){
                    if(ut.findIdInArray(p.items[i], visibleArray) === false){ r.push(p.items[i]); }}}
            return r;
        } else {
            (new (__imns('util.debug')).IMDebugger()).pass('components.classes.CarouselTransition.transition does not have a transition set up, use ...setTransition(function)');
             return false; }};
    adr.CarouselTransition.prototype.treatAsDestinationIndex = function(id, p){
        p = (p === undefined && this.passer !== null) ? this.passer : p;
        if(p instanceof (__imns('component.classes')).CarouselPasser){
            var ut = __imns('util.tools');
            if(!p.carousel.canLoop()){
                var visibleArray = this.getVisibleItemElementsAtSelectedItemId(id, p);
                var elem = p.items[id];
                switch(this.weighting){
                    case 'back':
                        elem = visibleArray[visibleArray.length - 1];
                        break;
                    case 'center':
                        elem = visibleArray[Math.floor(visibleArray.length/2)];
                        break;
                    default:
                        //elem = visibleArray[1]; //?
                        elem = visibleArray[0];
                        break; }
                return ut.findIdInArray(elem, p.items); }
            return id;
        } else {
            (new (__imns('util.debug')).IMDebugger()).pass('components.classes.CarouselTransition.transition does not have a transition set up, use ...setTransition(function)');
             return false; }};
    adr.CarouselTransition.prototype.getInvisibleItemIdsAtSelectedItemId = function(id, p){
        p = (p === undefined && this.passer !== null) ? this.passer : p;
        if(p instanceof (__imns('component.classes')).CarouselPasser){
            var ut = __imns('util.tools');
            var workingArray = this.getInvisibleItemElementsAtSelectedItemId(id,p),
                r = [];
            for(var i=0, imax=workingArray.length; i<imax; i+=1){ r.push(p.items[i]); }
            return r;
        } else {
            (new (__imns('util.debug')).IMDebugger()).pass('components.classes.CarouselTransition.transition does not have a transition set up, use ...setTransition(function)');
             return false; }};
    adr.CarouselTransition.prototype.getLayoutAtSelectedItemId = function(id, p){
        p = (p === undefined && this.passer !== null) ? this.passer : p;
        if(p instanceof (__imns('component.classes')).CarouselPasser){
            var ut = __imns('util.tools'),
                uv = __imns('util.validation');
            var workingArray = ut.clone(p.items);
            if(p.carousel.canLoop()){
                workingArray = ut.clone(p.items);
                workingArray = ut.arrayShuffleRangeCenter(workingArray, id); }
            return workingArray;
        } else {
            (new (__imns('util.debug')).IMDebugger()).pass('components.classes.CarouselTransition.transition does not have a transition set up, use ...setTransition(function)');
             return false; }};
    adr.CarouselTransition.prototype.getLayoutAtSelectedItemElement = function(elem, p){
        p = (p === undefined && this.passer !== null) ? this.passer : p;
        if(p instanceof (__imns('component.classes')).CarouselPasser){
            var id = (__imns('util.tools')).findIdInArray(elem, p.items);
            return this.getLayoutAtSelectedItemId(id, p);
        } else {
            (new (__imns('util.debug')).IMDebugger()).pass('components.classes.CarouselTransition.transition does not have a transition set up, use ...setTransition(function)');
             return false; }};
    /*
    adr.CarouselTransition.prototype.willItemIdLoop = function(id, p){
        p = (p === undefined && this.passer !== null) ? this.passer : p;
        if(p instanceof (__imns('component.classes')).CarouselPasser){
            if(p.carousel.canLoop()){
                var ut = __imns('util.tools');
                var endArray = this.getLayoutAtSelectedItemId(p.destinationIndex, p),
                    endId = ut.findIdInArray(p.items[id], endArray),
                    diffId = endId - id,
                    diffSelected = p.destinationIndex - p.currentIndex;
                return ((diffId < 0 && diffSelected > 0) || (diffId > 0 && diffSelected < 0)) ? true : false; }
            return false;
        } else {
            (new (__imns('util.debug')).IMDebugger()).pass('components.classes.CarouselTransition.transition does not have a transition set up, use ...setTransition(function)');
             return false; }};
    adr.CarouselTransition.prototype.willItemElementLoop = function(elem, p){
        p = (p === undefined && this.passer !== null) ? this.passer : p;
        if(p instanceof (__imns('component.classes')).CarouselPasser){
            var id = (__imns('util.tools')).findIdInArray(elem, p.items);
            return this.willItemIdLoop(id, p);
        } else {
            (new (__imns('util.debug')).IMDebugger()).pass('components.classes.CarouselTransition.transition does not have a transition set up, use ...setTransition(function)');
             return false; }};
    */
    /**
    adr.CarouselTransition.prototype.getSelectedItemIdsInSteps = function(p){
        p = (p === undefined && this.passer !== null) ? this.passer : p;
        if(p instanceof (__imns('component.classes')).CarouselPasser){
            var inc = (p.destinationDistance >= 0) ? 1 : -1,
                steps = 0,
                totalsteps = Math.abs(p.destinationDistance) + 1,
                canLoop = p.carousel.canLoop;
            var r = [],
                currentId = p.currentIndex;
            while(steps < totalsteps && currentId !== undefined){
                steps += 1;
                if(canLoop){
                    currentId %= p.items.length;
                    r.push(currentId);
                } else {
                    if(currentId < 0 || currentId >= p.items.length){
                        currentId = undefined;
                        (new (__imns('util.debug')).IMDebugger()).pass('component.classes.CarouselTransition.getCenterItemIdsInSteps broke at currentId');
                    } else { r.push(currentId); }}
                currentId += inc; }
             return r;
        } else {
            this.invalidCarouselPasser();
            return []; }};
    adr.CarouselTransition.prototype.getSelectedItemElementsInSteps = function(p){
        p = (p === undefined && this.passer !== null) ? this.passer : p;
        if(p instanceof (__imns('component.classes')).CarouselPasser){
            var ci = this.getCenterItemIdsInSteps(p),
                r = [];
            for(var i=0, imax=ci.length; i<imax; i+=1){
                if(i > -1 && i < p.items.length){
                    r.push(p.items[i]); }}
            return r;
        } else {
            this.invalidCarouselPasser();
            return []; }};
    adr.CarouselTransition.prototype.getInvisibleItemIdsAcrossSteps = function(p){
        p = (p === undefined && this.passer !== null) ? this.passer : p;
        if(p instanceof (__imns('component.classes')).CarouselPasser){
            var ut = __imns('util.tools'),
                uv = __imns('util.validation');
            var seenIds = this.getVisibleItemIdsInSteps(p),
                r = [];
            for(var i=0, imax = p.items.length; i<imax; i+=1){
                if(!uv.isInArray(seenIds, i)){
                    r.push(i); }}
            return r;
        } else {
            this.invalidCarouselPasser();
            return []; }};
    adr.CarouselTransition.prototype.getInvisibleItemElementsAcrossSteps = function(p){
        p = (p === undefined && this.passer !== null) ? this.passer : p;
        if(p instanceof (__imns('component.classes')).CarouselPasser){
            var invisibleIds = this.getInvisibleItemIdsAcrossSteps(p),
                r = [];
            for(var i=0, imax = invisibleIds.length; i<imax; i+=1){ r.push(p.items[invisibleIds[i]]); }
            return r;
        } else {
            this.invalidCarouselPasser();
            return []; }};
    adr.CarouselTransition.prototype.getVisibleItemIdsInSteps = function(p){
        p = (p === undefined && this.passer !== null) ? this.passer : p;
        if(p instanceof (__imns('component.classes')).CarouselPasser){
            var ut = __imns('util.tools');
            var ci = this.getVisibleItemElementsInSteps(p),
                r = [];
            for(var i=0, imax=ci.length; i<imax; i+=1){
                var onid = ut.findIdInArray(ci[i], p.items);
                if(onid > -1 && onid < p.items.length){ r.push(onid); }}
            return r;
        } else {
            this.invalidCarouselPasser();
            return []; }};
    adr.CarouselTransition.prototype.getVisibleItemElementsInSteps = function(p){
        p = (p === undefined && this.passer !== null) ? this.passer : p;
        if(p instanceof (__imns('component.classes')).CarouselPasser){
            var ut = __imns('util.tools'),
                uv = __imns('util.validation');
            var onCenters = this.getCenterItemIdsInSteps(p),
                upperRange = p.numberVisible - 1,
                lowerRange = p.numberVisible - 1;
            switch(this.weighting){
                case 'back':
                    upperRange = 0;
                    break;
                case 'center':
                    upperRange = Math.ceil(upperRange/2);
                    lowerRange = Math.floor(lowerRange/2);
                    break;
                default:
                    lowerRange = 0; }
            var r = [], m, mmax, n, nmax;
            for(var i=0, imax = onCenters.length; i<imax; i+=1){
                var on = onCenters[i], currentId = on, currentElement = p.items[on];
                var workingArray = ut.clone(p.items);
                if(!uv.isInArray(r, currentElement)){ r.push(currentElement); }
                if(p.carousel.canLoop()){
                    workingArray = ut.arrayShuffleCenter(workingArray, on);
                    currentId = ut.findIdInArray(currentElement, workingArray); }
                if(currentId - lowerRange < 0){
                    var lowerReduction = currentId - lowerRange; //val (-)
                    upperRange -= lowerReduction;
                    lowerRange += lowerReduction; }
                if(currentId + upperRange >= workingArray.length){
                    var upperReduction = (currentId + upperRange) - (workingArray.length - 1); //val (+)
                    lowerRange += upperReduction;
                    upperRange -= upperReduction; }
                for(m = (currentId - 1) , mmax = ((currentId - lowerRange) - 1); m > mmax; m-=1){
                    if(!uv.isInArray(r, workingArray[m])){
                        r.push(workingArray[m]); }}
                for(n = (currentId + 1), nmax = (currentId + upperRange) + 1; n < nmax; n+=1){
                    if(!uv.isInArray(r, workingArray[n])){
                        r.push(workingArray[n]); }}}
            return r;
        } else {
            this.invalidCarouselPasser();
            return []; }};
    adr.CarouselTransition.prototype.invalidCarouselPasser = function(){ 
        (new (__imns('util.debug')).IMDebugger()).pass('component.classes.CarouselTransition not supplied proper CarouselPasser'); }; */
}
