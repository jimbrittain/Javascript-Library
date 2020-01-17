"use strict";
/* jshint -W069 */
/* global window, IMDebugger, $, __imns, document, console, setTimeout */
/* remove setTimeout and -W069 from above */
//** Testing Part **/
var caro, test = 'hamster', caronext, caroprior, requestNext, requestPrior;
var overcaro, rn;
var maxnext = 10, maxprior = 4;
(function(){
    var ut = __imns('util.tools'),
        ud = __imns('util.dom'),
        cc = __imns('component.classes');
    var transition = function(p){
        var ud = __imns('util.dom'),
            ut = __imns('util.tools'),
            uc = __imns('util.classes');
        var cb = new uc.BoundaryCoordinates(p.currentElement),
            nb = new uc.BoudaryCoordinates(p.destinationElement);
        var containBounds = new uc.BoudaryCoordinates(p.carousel.container);
        var xMid = (containBounds.width/2);
        var destinationX = xMid - (cb.width/2);
        var origX = cb.x1 - parseFloat(p.destinationElement.style['left']);
        var distance = destinationX - origX;
        var arr = [];
        p.destinationElement.style['left'] = distance + 'px';
        var roarr = ut.arrayShuffleRangeCentre(p.items, arr);
        var roarrMid = Math.floor(roarr.length/2);
        var lower, upper;
        for(var i=1, imax=(roarr.length - roarrMid); i<imax; i+=1){
            lower = roarrMid - 1;
            upper = roarrMid - 1;
            if(roarr[lower] !== undefined){
                //need to work out if lower -= width of all;
                carouselXAssignment(roarr[lower], distance);
            }
            if(roarr[upper] !== undefined){
                //need to work out if lower -= width of all;
                carouselXAssignment(roarr[upper], distance);
            }}
    };
    var carouselXAssignment = function(elem, pxX){
        var uc = __imns('util.classes');
        if(!uc.SupportedCSSProperty('transition', elem).exists){
            elem.style[uc.SupporedCSSProperty('left')] = pxX;
        } else {
            console.log('build Animate');
        }
    };
    var requestNext = function(p){
        var arr = [];
        for(var i=0, imax = (p.bufferDistance + 1); i < imax; i+=1){
            var e = document.createElement('li');
            e.innerHTML = (p.carousel.on.id + i);
            maxnext -= 1;
            if(maxnext > 0){ 
                arr.push(e); 
            } else { break; }}
        p.carousel.receiveNext(arr, p); 
        if(maxnext <  1){ p.carousel.maximumNextReached(); }};
    var requestPrior = function(p){
        var arr = [];
        for(var i=0, imax = (Math.abs(p.bufferDistance) + 1); i < imax; i+=1){
            var e = document.createElement('li');
            e.innerHTML = (p.carousel.on.id - (1 + i));
            maxprior -= 1;
            if(maxprior > 0){ 
                arr.push(e); 
            } else { break; }}
        setTimeout(function(){
            p.carousel.receivePrior(arr, p);
            if(maxprior < 1){ p.carousel.maximumPriorReached(); }}, 1000);
        };

    var carouseltransition = function(t){
        var ud = __imns('util.dom'),
            ut = __imns('util.tools'),
            uc = __imns('util.classes');
        var bodyTag = ud.findElementsByTag('body')[0],
            i, imax;
        for(i=0, imax=t.passer.items.length; i<imax; i+=1){ t.passer.items[i].style.left = ''; }
        var destinationIndex = t.treatAsDestinationIndex(t.passer.destinationIndex),
            destinationElement = t.passer.items[destinationIndex];
        var ipBounds = new uc.BoundaryCoordinates(t.passer.carousel.itemParent()),
            cpBounds = new uc.BoundaryCoordinates(t.passer.carousel.container),
            destBounds = new uc.BoundaryCoordinates(destinationElement),
            offset = parseFloat(ud.findElementStyleDeep(t.passer.carousel.itemParent(), 'left')),
            origX = destBounds.x1 - cpBounds.x1,
            parentLeft = (offset - origX),
            anim = null,
            calc;
        if(!ud.hasClass(bodyTag, 'hastransition')){
            t.passer.carousel.itemParent().style['left'] = parentLeft + 'px';
        } else {
            anim = uc.Animation({
                element: t.passer.carousel.itemParent(),
                duration: 333,
                timingFunction: 'linear',
                property: {name: 'left', end: parentLeft + 'px'}});
            anim.forceJSAnimate();
            anim.setFPS(60); }
        var b = t.getVisibleLayoutAtSelectedItemId(t.passer.destinationIndex),
            found = false, incWidth;
        for(i=0, imax=b.length; i<imax; i+=1){
            var num = ut.findIdInArray(b[i], t.passer.items);
            if(num === t.passer.destinationIndex){ found = true; }
            if(num < t.passer.destinationIndex && found){
                calc = 0 - (offset - origX);
                b[i].style.left = (calc + incWidth) + 'px';
            } else if(num > t.passer.destinationIndex && !found){
                calc = (offset - origX);
                calc += parseFloat(ud.findElementStyle(destinationElement, 'outerWidth'));
                b[i].style.left = calc + 'px';
            } else { incWidth += parseFloat(ud.findElementStyle(destinationElement, 'outerWidth'));  }}
        if(anim !== null){ anim.run(); }};

    var testTransition = function(t){
        for(var m=0, mmax=t.passer.items.length; m<mmax; m+=1){ t.passer.items[m].style.left = ''; }
        var ud = __imns('util.dom'), ut = __imns('util.tools'), uc = __imns('util.classes');
        var destinationIndex = t.treatAsDestinationIndex(t.passer.destinationIndex), destinationElement = t.passer.items[destinationIndex];
        var ipBounds = new uc.BoundaryCoordinates(t.passer.carousel.itemParent()), cpBounds = new uc.BoundaryCoordinates(t.passer.carousel.container), destBounds = new uc.BoundaryCoordinates(destinationElement), offset = parseFloat(ud.findElementStyleDeep(t.passer.carousel.itemParent(), 'left')), calc, a;
        var origX = destBounds.x1 - cpBounds.x1;
        if((new uc.SupportedCSSProperty('transition-duration')).exists){
            t.passer.carousel.itemParent().style['left'] = (offset - origX) + 'px'; 
        } else { var cheese = 1; }
        var b = t.getVisibleLayoutAtSelectedItemId(t.passer.destinationIndex);
        var found = false, incWidth = 0;
        for(var n=0, nmax=b.length; n<nmax; n+=1){
            var num = ut.findIdInArray(b[n], t.passer.items);
            if(num === t.passer.destinationIndex){ found = true; }
            if(num < t.passer.destinationIndex && found){
                calc = offset - origX;
                calc = 0 - calc;
                calc += incWidth;
                b[n].style.left = calc + 'px'; 
            } else if(num > t.passer.destinationIndex && !found){
                calc = offset - origX;
                calc += parseFloat(ud.findElementStyle(destinationElement, 'outerWidth'));
                calc = 0 + calc;
                b[n].style.left = calc + 'px'; 
            } else { incWidth += parseFloat(ud.findElementStyle(destinationElement, 'outerWidth')); }}
    };
    var m = new (__imns('component.classes')).CarouselTransition({ 'transition': testTransition });
    
    var transitionover = function(t){
        var ud = __imns('util.dom'),
            uc = __imns('util.classes');
        ud.addClass(t.passer.currentElement, 'unselected'); 
        if(true || !(new uc.SupportedCSSProperty('transition')).exists){
            var c = this;
            var ani = new uc.Animation({
                element: t.passer.destinationElement,
                duration: 333,
                timingFunction: 'linear',
                property: { name: 'left', start: ud.findElementStyle(t.passer.destinationElement, 'left'), end: '0px' }});
            ani.forceJSAnimate();
            ani.setFPS(60);
            ani.run();
        }
    };
    var transitioncomplete = function(t){ 
        var ud = __imns('util.dom'),
            uc = __imns('util.classes');
        ud.removeClass(t.passer.currentElement, 'unselected'); 
        if(true || !(new uc.SupportedCSSProperty('transition')).exists){ t.passer.currentElement.style.left = '100%'; }
    };
    rn = new (__imns('component.classes')).CarouselTransition({ 'transition': transitionover, 'complete':transitioncomplete, 'time':'350ms' });
        ut.fetter(window, 'load', [test, function(){
            caro = new cc.Carousel({
                'container': ud.findElementById('caro'),
                'itemSelector': 'ol li',
                'first': 0,
                'advancement': [1,1],
                'requestNext' : requestNext,
                'requestPrior' : requestPrior,
                'transition' : m,
                'buffer': 4,
                'loop': true
            });
            caronext = new cc.CarouselControlNext(caro, ud.findElementById('caronext'));
            caroprior = new cc.CarouselControlPrior(caro, ud.findElementById('caroprior'));
            /*
            overcaro = new cc.Carousel({
                'container': ud.findElementById('overcaro'),
                'itemSelector': 'ol li',
                'first': 0,
                'advancement': [1,1],
                'requestNext': requestNext,
                'requestPrior': requestPrior,
                'transition': rn,
                'buffer' : 2,
                'loop': true
            });
            var uc = __imns('util.classes');
            if(true || !(new uc.SupportedCSSProperty('transition')).exists){
                overcaro.on.element.style.left = '0px';
            } */
        }], true, 'after');
    })();
