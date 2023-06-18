# cRRnon-es
#### Status: Currently broken

This is a maintained fork of [cannon.js](https://github.com/schteppe/cannon.js), originally created by Stefan Hedman [@schteppe](https://github.com/schteppe).
It's a type-safe flatbundle (esm and cjs) which allows for **tree shaking** and usage in modern environments.
If instead you're using three.js in a **React** environment with [react-three-fiber](https://github.com/pmndrs/react-three-fiber), check out [use-cannon](https://github.com/pmndrs/use-cannon)! It's a wrapper around cannon-es.

## Installation

```bash
npm install cannon-es
yarn add cannon-es
pnpm install cannon-es
```
#### TODO:

- Finish Transform class to complete math api redesign
- V-HACD support (https://github.com/pmndrs/use-cannon/issues/35#issuecomment-600188994)
- Explore performance enhancements:
  - https://github.com/RandyGaul/qu3e
  - https://github.com/RandyGaul/cute_headers
  - https://github.com/TheRohans/dapao/issues?q=is%3Aissue
  - https://github.com/swift502/Sketchbook/commits/master/src/lib/cannon/cannon.js
  - https://github.com/schteppe/cannon.js/pulls

## Usage

```js
import { World } from "cannon-es";
// or, if you're using webpack, you can import it like this while still taking advantage of tree shaking:
import * as CANNON from "cannon-es";

// ...
```

## [Documentation](https://pmndrs.github.io/cannon-es/docs/)

[![](https://github.com/pmndrs/cannon-es/raw/master/screenshots/docs.png)](https://pmndrs.github.io/cannon-es/docs/)

## [Examples](https://pmndrs.github.io/cannon-es/)

[![](https://github.com/pmndrs/cannon-es/raw/master/screenshots/examples.png)](https://pmndrs.github.io/cannon-es/)

