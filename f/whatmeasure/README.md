# Javascript whatmeasure function
whatmeasure attempts to determine what the supplied value is measured in.
## Usage
```
    var s = '10em',
        t = 10,
        v = 'morris';
    whatmeasure(s) === 'em';
    whatmeasure(t) === 'px';
    whatmeasure(v) === undefined;
```

## Methodology
Regular Expression;
```
/^([-+]?[0-9]*\.?[0-9]+)(px|rem|ch|vh|vw|vmin|vmax|%|ex|em|in|cm|mm|pc|pt|mozmm|deg)$/
```

## Issues

* Doesn't work if space between number and measurement. Preference to stay that way, but recall coming across a framework recently that needed a space. Reconsider?
* Is case-sensitive. Never found a reason why, but make insensitive?
* Number alone drops to 'px', this is because of standard of px to be unsuffixed in standard calls.
* Needs proper testing log, e.g. browser checks
* NS version uses IMNS, not currently using ES6 namespacing
