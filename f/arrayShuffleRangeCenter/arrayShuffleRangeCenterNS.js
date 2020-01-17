"use strict";
/* global window, IMDebugger, $, __imns, console */
var adr = __imns('util.tools');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('arrayShuffleRangeCenter' in adr)){
    adr.arrayShuffleRangeCenter = function(arr, centreId, rangeLeft, rangeRight){
        var uv = __imns('util.validation');
        var r = [],
            i = 0, on, n;
        centreId = (uv.isNumber(centreId)) ? Math.round(centreId) : 0;
        if(centreId >= arr.length){
            (new (__imns('util.debug')).IMDebugger()).pass('function util.tools.arrayShuffleCenter supplied a centre greater than the array this could give unexpected results'); }
        var centre = Math.ceil(arr.length/2) + centreId;
        rangeLeft = (uv.isNumber(rangeLeft) && Math.round(rangeLeft) !== 0) ? Math.abs(Math.round(rangeLeft)) : 0;
        rangeRight = (uv.isNumber(rangeRight) && Math.round(rangeRight) !== 0) ? Math.abs(Math.round(rangeRight)) : 0;
        if((rangeLeft + rangeRight + 1) > arr.length){
            rangeLeft = 0;
            rangeRight = 0; 
            (new (__imns('util.debug')).IMDebugger()).pass('function util.tools.arrayShuffleCenter supplied an invalid range'); }
        if(rangeLeft > 0 || rangeRight > 0){
            rangeLeft -= Math.floor(arr.length/2);
            rangeRight -= Math.floor(arr.length/2);
            rangeLeft = (rangeLeft < 0) ? 0 : rangeLeft;
            rangeRight = (rangeRight < 0) ? 0 : rangeRight; }
        while(i < arr.length){
            n = i;
            on = (centre + i) % arr.length;
            if(rangeLeft > 0 || rangeRight > 0){
                n += rangeLeft;
                n -= rangeRight; 
                n = (n < 0) ? arr.length + n : n;
                n %= arr.length; }
            r[n] = arr[on];
            i += 1; }
        return r; };
    adr.arrayShuffleRangeCentre = adr.arrayShuffleRangeCenter;
    adr.arrayShuffleCenter = function(arr, centreId){ return (__imns('util.tools')).arrayShuffleRangeCenter(arr, centreId); };
    adr.arrayShuffleCentre = adr.arrayShuffleCenter;
}
