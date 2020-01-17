"use strict";
/* global window, IMDebugger, $, __imns */
(function(){
    var adr = __imns('util.tools');
    // var adr = window; //for stand-alone delete above and uncomment this line
    if(!('returnTime' in adr)){
        adr.returnTime = function(supplyTiming, supplyMeasure){
            var uv = __imns('util.validation');
            var timing = 0,
                measure = 'ms',
                reg = /^(([0-9]+\.){0,1}?[0-9]+( )?)(s|ms|d|m|h)$/,
                subreg = /^(seconds|second|s|millisecond|milliseconds|ms|minutes|minute|min|m|hours|hour|h|day|days|d)$/;
            if(uv.isNumber(supplyTiming)){
                timing = Math.abs(supplyTiming);
            } else if (reg.test(supplyTiming)) {
                var calc = parseFloat(supplyTiming),
                    calcMeasure = 'ms';
                if(!uv.isNumber(calc)){
                    timing = 0;
                } else {
                    calc = Math.abs(calc);
                    var a = supplyTiming.match(reg);
                    if(a.length === 5){ calcMeasure = a[4]; }
                    switch (calcMeasure){
                        case 'd':
                            calc *= 1000 * 60 * 60 * 24;
                            break;
                        case 'h':
                            calc *= 1000 * 60 * 60;
                            break;
                        case 'm':
                            calc *= 1000 * 60;
                            break;
                        case 's':
                            calc *= 1000;
                            break;
                        default:
                            break; }
                    timing = calc; }}
            measure = (subreg.test(supplyMeasure)) ? supplyMeasure : measure;
            switch(measure){
                case 'day':
                case 'days':
                case 'd':
                    return (timing/(1000 * 60 * 60 * 24)) + 'd';
                case 'hour':
                case 'hours':
                case 'h':
                    return (timing/(1000 * 60 * 60)) + 'h';
                case 'minute':
                case 'minutes':
                case 'm':
                    return (timing/(1000 * 60)) + 'm';
                case 'seconds':
                case 'second':
                case 's':
                    return (timing/1000) + 's';
                case 'milliseconds':
                case 'millisecond':
                case 'ms':
                    return timing + 'ms'; }};
    }
})();
