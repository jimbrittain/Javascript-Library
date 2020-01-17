# Javascript isArray function
isArray attempts to determine if a supplied variable is an array.
## Usage
```
var o = [];
    isArray(o) === true
    o = ''
    isArray(o) === false
```

## Methods

1. `Object.prototype.toString.call(o) === "[object Array]"`
2. `Array.isArray(o)` - if Array class has isArray method
3. `$.isArray(o)` - if jquery in window
4. `o instanceof Array`

## Issues

* Need to test on HTMLCollection, as behave similarly but lack methods
* Needs proper testing log, e.g. browser checks
* NS version uses IMNS, not currently using ES6 namespacing
