"use strict";
/*global __imns, screen, document, window */
var adr = __imns('util.classes');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('ScreenProperties' in adr)){


    adr.ScreenProperties = function(){
        var uc = __imns('util.classes');
        if(uc.ScreenProperties.prototype.singleton !== undefined){ return uc.ScreenProperties.prototype.singleton; }
        uc.ScreenProperties.prototype.singleton = this; };
    adr.ScreenProperties.prototype.screenWidth = function(){ return ('width' in screen) ? parseInt(screen.width) : 0; };
    adr.ScreenProperties.prototype.screenHeight = function(){ return ('height' in screen) ? parseInt(screen.height) : 0; };
    adr.ScreenProperties.prototype.documentWidth = function(){
        var ud = __imns('util.dom');
        var bodyArr = ud.findElementsByTag('html'), temp = -1;
        if(bodyArr.length === 1){ 
            temp = parseInt(ud.findElementStyle(bodyArr[0], 'width')); }
        if(isNaN(temp) || temp === undefined || temp <= 0){
            if('clientWidth' in document.body){
                temp = parseInt(document.body.clientWidth);
            } else if(document.documentElement && ('clientWidth' in document.documentElement)){ temp = parseInt(document.documentElement.clientWidth); }}
        return (temp !== undefined && temp > 0 && !isNaN(temp)) ? temp : 0;};
    adr.ScreenProperties.prototype.documentHeight = function(){
        var ud = __imns('util.dom');
        var bodyArr = ud.findElementsByTag('html'), temp = -1;
        if(bodyArr.length === 1){
            temp = parseInt(ud.findElementStyle(bodyArr[0], 'height')); }
        if(isNaN(temp) || temp === undefined || temp <= 0){
            if('clientHeight' in document.body){
                temp = parseInt(document.body.clientHeight);
            } else if(document.documentElement && ('clientHeight' in document.documentElement)){ temp = parseInt(document.documentElement.clientHeight); }}
        return (temp !== undefined && !isNaN(temp) && temp > 0) ? temp : 0;};
    adr.ScreenProperties.prototype.offsetX = function(){
        var temp = -1;
        if(arguments.length === 1 && (typeof arguments[0] === "number")){
            temp = parseInt(arguments[0]);
            this.scrollTo(temp, this.offsetY());
            return temp; 
        } else {
            if('pageXOffset' in window){
                temp = parseInt(window.pageXOffset);
            } else if(document.documentElement && ('scrollLeft' in document.documentElement)){
                temp = parseInt(document.documentElement.scrollLeft);
            } else if('scrollLeft' in document.body){
                temp = parseInt(document.body.scrollLeft);
            } else if(document.body.scroll && 'left' in document.body.scroll){
                temp = parseInt(document.body.scroll.left);
            } else if('scrollX' in window){
                temp = window.scrollX; }
            return (temp !== undefined && temp > 0 && !isNaN(temp)) ? temp : 0; }};
    adr.ScreenProperties.prototype.offsetY = function(){
        var temp = -1;
        if(arguments.length === 1 && (typeof arguments[0] === "number")){
            temp = parseInt(arguments[0]);
            this.scrollTo(this.offsetX(), temp);
            return temp;
        } else {
            if('pageYOffset' in window){
                temp = parseInt(window.pageYOffset);
            } else if(document.documentElement && 'scrollTop' in document.documentElement){
                temp = parseInt(document.documentElement.scrollTop);
            } else if('scrollTop' in document.body){
                temp = parseInt(document.body.scrollTop);
            } else if(document.body.scroll && 'top' in document.body.scroll){
                temp = parseInt(document.body.scroll.top);
            } else if('scrollY' in window){
                temp = parseInt(window.scrollY); }
            return (temp !== undefined && temp > 0 && !isNaN(temp)) ? temp : 0; }};
    adr.ScreenProperties.prototype.scrollTo = function(x, y){ if(window.scrollTo){ window.scrollTo(x, y); } else if(window.scroll){ window.scroll(x, y); }};
    adr.ScreenProperties.prototype.windowWidth = function(){ return ('outerWidth' in window) ? parseInt(window.outerWidth) : 0; };
    adr.ScreenProperties.prototype.windowHeight = function(){ return ('outerHeight' in window) ? parseInt(window.outerHeight) : 0; };
    adr.ScreenProperties.prototype.innerWindowWidth = function(){
        var temp = -1;
        if('innerWidth' in window){
            temp = parseInt(window.innerWidth);
        } else if(document.documentElement && 'clientWidth' in document.documentElement && document.documentElement.clientWidth !== 0){
            temp = parseInt(document.documentElement.clientWidth);
        } else if('clientWidth' in document.body){
            temp = parseInt(document.body.clientWidth);
        }
        return (temp !== undefined && temp > 0 && !isNaN(temp)) ? temp : 0; };
    adr.ScreenProperties.prototype.innerWindowHeight = function(){
        var temp = -1;
        if('innerHeight' in window){
            temp = parseInt(window.innerHeight);
        } else if(document.documentElement && 'clientHeight' in document.documentElement && document.documentElement.clientHeight !== 0){
            temp = parseInt(document.documentElement.clientHeight);
        } else if('clientHeight' in document.body){
            temp = parseInt(document.body.clientHeight); }
        return (temp !== undefined && temp > 0 && !isNaN(temp)) ? temp : 0; };
    adr.ScreenProperties.prototype.visibleWidth = function(){ return (this.documentWidth() > this.innerWindowWidth()) ? this.documentWidth() : this.innerWindowWidth(); };
    adr.ScreenProperties.prototype.visibleHeight = function(){ return (this.documentHeight() > this.innerWindowHeight()) ? this.documentHeight() : this.innerWindowHeight(); };

    adr.ScreenProperties.prototype.getPageBounds = function(){
        var uc = __imns('util.classes');
        return new uc.BoundaryCoordinates({
            'left' 		: this.offsetX(), 
            'top'		: this.offsetY(), 
            'width' 	: this.innerWindowWidth(), 
            'height' 	: this.innerWindowHeight()}); };
    adr.ScreenProperties.prototype.getDocumentBounds = function(){
        var uc = __imns('util.classes');
        return new uc.BoundaryCoordinates({
            'left' 		: 0, 
            'top' 		: 0, 
            'width' 	: this.visibleWidth(), 
            'height' 	: this.visibleHeight()});};


}
