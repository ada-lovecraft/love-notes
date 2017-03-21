# Hello, World!
This is `love-notes` weaver test

## HTML Weaving
First, I'm gonna try dropping in a single html tag... I'm gonna use a simple `h3`:
```html <3
<h3>If this worked, you'll see this text in a heading immediately below</h3>
```

## JavaScript Weaving
Now, I'm gonna try dropping in some simple javascript.
```js <3
console.log('Hello, Weaver!')
```
Open your console <kbd>cmd+alt+j</kbd> to see if it worked


## Integrated Weaving
Finally, I'm gonna check to see if an inserted html node and a js snippet can interact with each other by making a simple canvas test


The canvas animation is gonna take a few steps: Fist, I'm gonna setup some constants
```js <3
  // Math shorthands
  const {sin, abs, random, PI, sign} = Math
  const TWO_PI = PI * 2

  // dimensions
  const {width, height} = {width: window.innerWidth, height: 200}

  // raf shorthand
  const raf = window.requestAnimationFrame
```

Next, let's write a function that creates a canvas, inserts it into the DOM, and creates a drawing context
```js <3
  function createCanvas(w, h, selector) {
    // grab the container
    const container = document.querySelector(selector)

    // create a canvas element
    const canvas = document.createElement('canvas')

    // set the canvas size
    canvas.width = w
    canvas.height = h

    // append the canvas to the container
    container.appendChild(canvas)

    // create and return a drawing context
    return canvas.getContext('2d')
  }
```

Now, I'm going to create a few quick shorthand functions for saving and restoring the canvas transformation matrix.
```js <3

  // short hands for transformation states
  function push() {
    ctx.save()
  }
  function pop() {
    ctx.restore()
  }
```

And a quick `randomInRange` function that will return an integer
```js <3
  const randomInRange = (start, end) => {
    const range = end - start
    return ~~(random() * range) + start
  }
```

And then I'll compose that function and create a `randomPointOnCanvas` function that will return a naive `point` object and create a shorthand alias for it: `poc` (_pointOnCanvas_)). I want the point to return any viable `x` but only `y` values upt to 1/4 the height of the canvas
```js <3
  const randomPointOnCanvas = () => {
    return {x: randomInRange(0, width), y: randomInRange(0, - height * 0.25)}
  }
  const poc = randomPointOnCanvas
```

I plan on drawing a bunch of random circles every frame, and I want my circles to be centered on the `point` they are drawn at... It's also faster to translate the canvas, than to translate the pen, so I'll use a combination of `push`, `pop`, `translate` and `arc` to draw them
```js <3
  function circle(center, radius = 10) {
    push()
    ctx.beginPath()
    ctx.translate(center.x, center.y)
    ctx.arc(0, 0, radius, 0, TWO_PI)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    pop()
  }
```



Ok, almost there... now we just have to `draw` something. I want to draw between 25 and 50 circles per tick. I want all of the circles for a particular tick to have the same color and radii. However, I want each tick to produce different sized circles from the frame before it. The circles should also appear to "drip" from the top of the frame. I also want the color of the circles to cycle. I'll use a color organ that cycles as a function of `sin(frameCount)`.

```js <3
  function draw() {
    // ctx.clearRect(0, 0, width, height)

    const step = frameCount * 0.0075
    // dripping effect
    push()
    ctx.scale(1.0, 1.05)
    ctx.drawImage(ctx.canvas, 0, 0)
    pop()

    // random number of circles
    const numCircles = randomInRange(5, 10)
    const radius = randomInRange(10, 50)

    // BITWISE DOUBLE NOT operator
    const mod = ~~abs(sin(frameCount * 0.0075) * 255)
    ctx.fillStyle = `rgb(${mod},${abs(128 - mod)},${255-mod})`
    ctx.strokeStyle = sign(sin(step)) >= 1 ? 'white' : 'black'
    push()
    for(let i = 0; i < numCircles; i++) {
      circle(poc(), radius)
    }

    circle(poc(), radius)
    pop()
  }
```

Because I'm using `frameCount`, I'm going to create a small function that updates the count and also updates a small node on the DOM to show the number
```js <3
function updateFrameCount() {
  frameCount++
  $frameCount.innerText = frameCount
}
```

Last piece of functionality to code is to create an animation loop that calls the `draw()` method, waits for another animation frame, and does it all again. Simple enough.

```js <3
var frameCount = 0
var $frameCount = null // dom element

function loop() {
  updateFrameCount()
  draw()
  raf(loop)
}
```




And now... we drop in the canvas and `$frameCount` element...
```html <3
<div id="canvas-container"></div>
<p><code>frameCount:</cod> <span id="frame-counter">0</span></p>
```

and kick this pig!
```js <3
// for simplicity's sake, I'm going to make the canvas context global
var ctx = createCanvas(width, height, `#canvas-container`)
$frameCount = document.querySelector('#frame-counter')

loop()
```
