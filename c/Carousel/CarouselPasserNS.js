"use strict";
/* jshint -W069 */
/* global window, IMDebugger, $, __imns, document, console */
var adr = __imns('component.classes');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('CarouselPasser' in adr)){
    adr.CarouselPasser = function(caro, movement, waiting){
        var cc = __imns('component.classes');
        if(!(caro instanceof cc.Carousel)){ return false; }
        this.waiting = (waiting === true) ? true : false;
        this.carousel = caro;
        this.destinationIndex = movement.getTarget();
        this.destinationDistance = Math.abs(movement.getDistance());
        this.bufferDistance = Math.abs(movement.getBufferedDistance());
        this.container = this.carousel.container;
        this.innerContainer = this.carousel.innercontainer;
        this.items = this.carousel.getItems();
        this.numberOfItems = this.items.length;
        this.direction = 'advance';
        this.currentIndex = this.carousel.on.id;
        this.currentElement = this.carousel.onItem();
        this.destinationElement = this.items[this.destinationIndex];
        this.numberVisible = this.carousel.numberVisible();
        this.complete = this.carousel.transitionComplete; };
}
