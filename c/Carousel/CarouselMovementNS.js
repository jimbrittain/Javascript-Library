"use strict";
/* jshint -W069 */
/* global window, IMDebugger, $, __imns, document, console */
var adr = __imns('component.classes');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('CarouselMovement' in adr)){
    adr.CarouselMovement = function(carousel, distance){
        this.distance = '';
        this.target = '';
        this.carousel = null;
        this.init(carousel, distance); };
    adr.CarouselMovement.prototype.init = function(caro, d){
        var uv = __imns('util.validation'),
            cc = __imns('component.classes');
        if(caro instanceof cc.Carousel){
            this.carousel = caro;
            if(uv.isNumber(d)){
                this.setDistance(d);
                return true; }
        } else if(typeof caro === 'object'){
            if('carousel' in caro){ this.setCarousel(caro.carousel); }
            if('target' in caro){
                this.setTarget(caro.target);
                return (this.carousel !== null);
            } else if('distance' in caro){
                this.setDistance(caro.distance); 
                return (this.carousel !== null); }}
        if(this.target === '' && this.distance === ''){ this.setDistance(0); }
        return false; };
    adr.CarouselMovement.prototype.setCarousel = function(caro){
        this.carousel = (caro instanceof (__imns('component.classes')).Carousel) ? caro : this.carousel;
        return (this.carousel === caro); };
    adr.CarouselMovement.prototype.setDistance = function(d){
        this.distance = ((__imns('util.validation')).isNumber(d)) ? Math.round(d) : this.distance;
        if(this.distance !== ''){ this.target = ''; }
        return (this.distance === d); };
    adr.CarouselMovement.prototype.setTarget = function(t){
        this.target = ((__imns('util.validation')).isNumber(t)) ? Math.round(t) : this.target;
        if(this.target !== ''){ this.distance = ''; }
        return (this.target === t); };
    adr.CarouselMovement.prototype.getPriority = function(){
        if(this.target !== ''){
            return 'target';
        } else if(this.distance !== ''){
            return 'distance';
        } else { return false; }};
    adr.CarouselMovement.prototype.getDistance = function(){
        var t = 0,
            gi = this.carousel.numberOfItems();
         if(this.distance !== ''){ //rationalise distance;
             t = this.carousel.on.id + this.distance;
             if(t >= this.carousel.last && !this.carousel.canLoopForwards()){
                 return ((this.carousel.last - 1) - this.carousel.on.id);
             } else if(t < this.carousel.first && !this.carousel.canLoopBackwards()){
                 return (0 - this.carousel.on.id); }
             return this.distance;
         } else {
             var target = this.getTarget(); //so can rationalise;
             if(target > this.carousel.first && target < this.carousel.last){
                 return this.target - this.carousel.on.id;
             } else {
                if(target < 0){
                    if(this.carousel.canLoopBackwards()){
                         t = gi - (target % gi);
                         return t - this.carousel.on.id;
                    } else { return 0 - this.carousel.on.id; }
                } else {
                    if(this.carousel.canLoopForwards()){
                        t = target % gi;
                    } else {
                        return ((gi - 1) - this.carousel.on.id); }}}}};
    adr.CarouselMovement.prototype.getTarget = function(){
        if(this.target !== ''){
            if(this.target < this.carousel.first){
                return this.carousel.first;
            } else if(this.target >= this.carousel.last){
                return this.carousel.last - 1; }
            return this.target;
        } else {
            var distance = this.getDistance(),
                on = this.carousel.on.id + distance;
            if(on < this.carousel.first){
                if(!this.carousel.canLoopBackwards()){
                    return this.carousel.first;
                } else {
                    var t = on % this.carousel.numberOfItems();
                    return  (t < 0) ? (this.carousel.numberOfItems() + t) : t; }
            } else if(on >= this.carousel.last){
                if(!this.carousel.canLoopForwards()){
                    return (this.carousel.last - 1);
                } else {
                    return (on % this.carousel.numberOfItems()); }}
            return on; }};
    adr.CarouselMovement.prototype.update = function(change){
        switch (this.getPriority()){
            case 'target':
                this.target += change;
                return true;
            case 'distance':
                this.distance -= change; //think I only need to update distance if new recieved.
                return true; }
        return false; };
    /**
     @develop - Both Carousel.getBufferedDistance(), and Carousel.getBufferedTarget() may need check to find that they are out of scope.
    **/
    /**
      @method CarouselMovement.getBufferedDistance
      @requires Carousel.shouldUseBuffer
      @return {Number} Integer of movement of carousel when including buffer
    **/
    adr.CarouselMovement.prototype.getBufferedDistance = function(){
        var d = this.getDistance();
        if(this.carousel.shouldUseBuffer(this)){
            if(this.carousel.buffer > 0){
                if(d > 0){ 
                    d += this.carousel.buffer;
                } else if(d < 0){
                    d -= this.carousel.buffer; }}}
        //if((this.carousel.on.id + d) < this.carousel.first){ console.log('outside of scope (-) getBufferedDistance'); }
        //if((this.carousel.on.id + d) > this.carousel.last){ console.log('outside of scope (+) getBufferedDistance'); }
        return d; };
    /**
      @method CarouselMovement.getBufferedTarget
      @requires Carousel.shouldUseBuffer
      @return {Number} target id of carousel item when including buffer
     **/
    adr.CarouselMovement.prototype.getBufferedTarget = function(){
        var t = this.getTarget(),
            d = this.getDistance();
        if(this.carousel.shouldUseBuffer(this)){
            if(this.carousel.buffer > 0){
                if(d > 0){
                    t += this.carousel.buffer;
                } else if(d < 0){
                    t -= this.carousel.buffer; }}}
        if(t < this.carousel.first){ console.log('outside of scope (-) getBufferedTarget'); }
        if(t > this.carousel.last){ console.log('outside of scope (+) getBufferedTarget'); }
        return t; };
}
