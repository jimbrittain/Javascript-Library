# preventEvent
Javascript function to prevent default behaviour bubbling.

## Usage

```
    preventEvent(evt);
```
Returns false;

## Methodology
stopPropagation, preventBubble, preventDefault; cancelBubble = true, returnValue = false;

## Requires

* util.tools.findEvent

## Issues

* Document cross-browser testing
* Jasmine not built
