# Changelog

All notable changes to this project will be documented in this file.

## 2018.02.15

### Changed

* Frontend can now pass callbacks: gif.onProcess & gif.onFinished
* Don't need to pass the last chart to show the last scene. It automatically adds few frames if it is the last.

### Removed

* The last chart's been removed accordingly.

## 2018.02.14

### Added

* Test environment: babel-core, babel-jest, jest, regenerator-runtime
* Change log
* `getChildG(gParent)` in BarFactory.
* `_drawSkeleton(svgElement, chart)` for refactoring. Used to draw structured `<g>`

### Changed

* Easing functions for single bar chart transition set to `easeBackOut`
* From single `<g>` to multiple structured `<g>` in `<svg>`.
* Clear svg before render static chart.

### Removed

* Dummy test file: App.test.js
