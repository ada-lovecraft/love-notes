# Example from the README.md

Create an `index.js` file
```js
// file: index.js
```

Create a `math.js` file and add a couple of sections
```js > math.js
// composable math functions
#sum
#other-methods

```

A simple addition method
```js > math.js#sum
function sum(a, b) {
  return a + b
}
```
Oh, we're gonna need an exports section!
```js > math.js
#exports
```

Whoops. I forgot to add these methods earlier.
```js > math.js#other-methods
#product
#square
#cube
```

## Mathemagical!

Let's multiply!
```js > math.js#product
function product(a, b) {
  return a * b
}
```

Use `product` to create a `square` function
```js > math.js#product
function square(a) {
  return product(a, a)
}
```

Compose `square` and `product` to create a `cube` function
```js > math.js#cube
function cube(a) {
  return product(a, square(a))
}
```

Don't forget to export your functions!
```js > math.js#exports

export default = {sum, product, square, cube}
```

And now, let's consume our `math` utility and have `index.js` do some science!
```js > index.js
import {cube} from './math'

const x = 3
console.log(`${x}^3 = ${cube(x)}`)
```
