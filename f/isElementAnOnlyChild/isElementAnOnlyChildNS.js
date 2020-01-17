"use strict";
/*global __imns */
var adr = __imns('util.validation');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('isElementAnOnlyChild' in adr)){
    /**
     * isElementAnOnlyChild
     * Javascript is queried element and only child function
     * Requires util.validation.isHTMLElement, util.dom.findParent, util.debug
     * @author JDB - jim@immaturedawn.co.uk 2013
     * @url - http://www.immaturedawn.co.uk
     * @license - Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
     * @copyright - Immature Dawn 2013-2016
     * @version - 0.2
     *
     * @function isElementAnOnlyChild
     * @param {HTMLElement} htmlElem
     * @return {Boolean}
     * Determines whether htmlElem is an only child of it's parent element
     */
    adr.isElementAnOnlyChild = function(htmlElem){
        var tv = __imns('util.validation'),
            td = __imns('util.dom'),
            tdb = __imns('util.debug');
        if(td.isHTMLElement(htmlElem)){
            var myParent = td.findParent(htmlElem);
            if(typeof myParent !== 'undefined'){
                var myNumberOfKids = ('childNodes' in myParent) ? myParent.childNodes.length : 0;
                var myRealNumberOfKids = 0;
                for(var i=0; i < myNumberOfKids; i += 1){
                    var p = myParent.childNodes[i];
                    if('nodeType' in p && p.nodeType !== 8){
                        //this is a fix for an IE bug where a childNode may not share the correct parent;
                        if(('parentElement' in p && p.parentElement === myParent) || ('parentNode' in p.parentNode === myParent)){ 
                            if(p.nodeType === 3){ //do a whitespace check;
                                var myText = ('textContent' in p) ? p.textContent : (('innerText' in p) ? p.innerText : "texttobreak");
                                if(myText.match(/\w/gi)){
                                    myRealNumberOfKids += 1;
                                    if(myRealNumberOfKids > 1){ break; }
                                } else { continue; }
                            } else {
                                myRealNumberOfKids += 1;
                                if(myRealNumberOfKids > 1){ break; }}}}}
                return ((myRealNumberOfKids > 1) ? false : true);
            } else {
                (new tdb.IMDebugger()).pass("isElementAnOnlyChild: Cannot determine elements parent");
                return true; }
        } else {
            (new tdb.IMDebugger()).pass("isElementAnOnlyChild: Must be supplied a valid HTMLElement");
            return false; }};

}
