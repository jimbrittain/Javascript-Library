# Javascript isNumber function
isNumber attempts to determine if a supplied variable is a Number.
## Usage
```
var n = [];
    isNumber(n) === false;
    n = 1;
    isNumber(n) === true;
```

## Methodology

1. `return (n !== undefined && !isNaN(parseFloat(n)) && isFinite(n))`

## Issues

* Needs proper testing log, e.g. browser checks
* NS version uses IMNS, not currently using ES6 namespacing
