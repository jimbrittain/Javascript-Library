# Javascript isCSSCubicBezier function
isCSSCubicBezier attempts to determine if a supplied string is in CSS Cubic Bezier descriptive syntax.
## Usage
```
    var s = 'cubic-bezier(1,1,1,1)';
    isCSSCubicBezier(s) === true;
    s = 'cubic-bezier(-1,-1,-1,-1)';
    isCSSCubicBezier(s) === false;
```

## Methodology

Regular Expression - `/^cubic-bezier\(((0(\.[0-9]+)?)|(1(\.[0]+)?)),[ ]*([-+]?[0-9]*\.?[0-9]+),[ ]*((0(\.[0-9]+)?)|(1(\.[0]+)?)),[ ]*([-+]?[0-9]*\.?[0-9]+)\)$/;`

## Issues

* Needs proper testing log, e.g. browser checks
* NS version uses IMNS, not currently using ES6 namespacing
