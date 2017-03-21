# love-notes
A literate programming tangler for javascript embedded into markdown

## What?
[Literate Programming](https://en.wikipedia.org/wiki/Literate_programming) is a method of writing code (conceived by [Donald Knuth](https://en.wikipedia.org/wiki/Donald_Knuth)) in which the documentation and code live side-by-side in the program source in such a way that the code can be extracted in a compilable format.

In the particular instance of `love-notes`, the source for a program is built by creating a markdown file that contains prose (the documentation) and codefences (the code) and is **tangled** into source files.

Having a hard time picturing it? How about a simple example? Take a look at [/test/test.md](this markdown file)

Running that file through the tangler will produce both: [examples/tangler-output/index.js](index.js) and [examples/tangler-output/math.js](math.js)

## Why?
One of the biggest issues we, as a community of developers, face, is the fact that our documentation doesn't generally reflect the state of mind or decision making process that we, as indivduals, went through when attempting to solve a problem. Worse than that, when we go back to document, or modify the code, we rarely remember *why* we made the decisions in the first place. Providing a few readable sentences providing an insight as to why a specific design choice was made (or as I've found to be much more insightful in communicating with other developers, why *other decisions* were *not* made) is incredibly helpful when attempting to re-enter the mindset you (or others) were in when developing said solution.

Further more, prose, as opposed to, say, a block comment, provides a much more expressive canvas to relate the context of the solution. Block comments intrinsically ask us to be as succinct with information as possible thus causing us to be terse with our documentaiton. Using a prose style of writing is open-ended and allows for as much or as little explanation as needed to properly convey the necessary information.

This method also supplies a more readable medium for the consumer (whether that's yourself in a year's time, or another developer digging through your api). As `love-notes` uses markdown, the final woven documentation is simple plain html, which allows for an endless amount of possibilities when it comes to stylistic presentation of the information.

Finally, and personally, to me, code is art. When working on personal projects, I find that I often have a story to tell with my code, and a lot of what I put into my work gets lost in translation. Using a literate style of programming, I've found that I enjoy relating (to no-one in particular) the life-events, or the work of friend and peers, that inspired me. It's also helped me learn and *retain* more information as each project I work on tends to bring with it hours and days of research. As I learn, I write. As I write, I start forming the basic ideas that will, in turn, end up being the project's core.

## Installation
1. clone the repo
2. `$ npm install`


## Usage
Currently, there is very little difference between a markdown file and a `love-note`, with a few notable exceptions:

When creating code fences in markdown, always surround your code fences with three backticks followed by the *insertion command* `>` and then a combination of filename and sectiontag. For Example:

<pre lang="no-highlight"><code>
The following code fence will be appended to the `root` section `index.js`:
```js
console.log('hello, world')
```

The next code fence will be appended to the `#bar` section of `foo.js`:
```js > foo.js#bar
console.log(baz)
```
</code></pre>

To create a sectiontag, add a `#section-tag` on its own line inside of a code block like this:

<pre lang="no-highlight"><code>
```js > foo.js
function bar(baz) {
  #bar
}
```
</code></pre>
When the file is tangled, any code fence with a command `> foo.js#bar`, will be inserted (in the order it appears in the document) into the `bar` section of `foo.js`

If you do not provide a filename, the code fence will be inserted into `index.js`. In the same vein, if you do not provide a `#section-tag`, the code fence will be inserted into the `root` section of the given file.


## Dev
`$ npm run test:watch` will run a 14 point test suite on the library

## Building
`$ npm run build`
`love-notes` uses rollup to create separate umd and `es` packages in the `dist` directory


## Example
`$ npm run example`

This example reads the `test.md` file found in the `test` directory and creates the properly tangled `index.js` and `math.js` files as indicated in the input markdown.



## TODO
- [x] Create Tangler
- [ ] Create Weaver
- [x] Create a proper README
- [x] Create a simple tangler example
- [ ] Create a simple weaver example
- [ ] Create an example project that tangles, weaves, and transpiles/includes other build technologies
