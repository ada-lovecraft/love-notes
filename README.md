# love-notes
A literate programming tool (**LPT**) for javascript embedded into markdown in the style of [CWEB](https://en.wikipedia.org/wiki/CWEB) and [noweb](https://en.wikipedia.org/wiki/Noweb)

## What?
[Literate Programming](https://en.wikipedia.org/wiki/Literate_programming) is a method of writing code (conceived by [Donald Knuth](https://en.wikipedia.org/wiki/Donald_Knuth)) in which the documentation and code live side-by-side in the source document in such a way that the code can be extracted in a compilable format.

## Why?
One of the biggest issues we, as a community of developers, face, is the fact that our documentation doesn't generally reflect the state of mind or decision making process that we, as indivduals, went through when attempting to solve a problem. Worse than that, when we go back to document, or modify the code, we rarely remember *why* we made the decisions in the first place. Providing a few readable sentences providing an insight as to why a specific design choice was made (or as I've found to be much more insightful in communicating with other developers, why *other decisions* were *not* made) is incredibly helpful when attempting to re-enter the mindset you (or others) were in when developing said solution.

Further more, prose, as opposed to, say, a block comment, provides a much more expressive canvas to relate the context of the solution. Block comments intrinsically ask us to be as succinct with information as possible thus causing us to be terse with our documentaiton. Using a prose style of writing is open-ended and allows for as much or as little explanation as needed to properly convey the necessary information.

This method also supplies a more readable medium for the consumer (whether that's yourself in a year's time, or another developer digging through your api). As `love-notes` uses markdown, the final woven documentation is simple plain html, which allows for an endless amount of possibilities when it comes to stylistic presentation of the information.

Finally, and personally, to me, code is art. When working on personal projects, I find that I often have a story to tell with my code, and a lot of what I put into my work gets lost in translation. Using a literate style of programming, I've found that I enjoy relating (to no-one in particular) the life-events, or the work of friend and peers, that inspired me. It's also helped me learn and *retain* more information as each project I work on tends to bring with it hours and days of research. As I learn, I write. As I write, I start forming the basic ideas that will, in turn, end up being the project's core.




## How?
There are two core abilities that an **LPT** must be able to perform: **Tangling** and **Weaving**.

**Tangling** is the ability of an **LPT** to produce "compilable" (or in the case of `love-notes` bundle-able or interpretable) code. This is achieved through the use of a layer of macros and meta-lingual programming. Currently, `love-notes` does not support user-defined macros, but there are some built-in macros that can already be used to produce rather robust source. Markdown already has some self-referential abilities in as much as it is a code file, that can produce an Abstract Syntax Tree (**AST**) that can be easily walked, modified, and rearranged after the fact using [wooorm's](http://github.com/wooorm) [unified](https://github.com/unifiedjs/unified) text processing interface.

**Weaving**, however, is the opposite side of the literate programming coin. This is the ability of an **LPT** to produce human-readable instructions about a program's development and maintenance. Aside from the fact that markdown is an easy to learn, non-intrusive writing tool, I chose it to be `love-notes`'s work-horse because it *already* does this. And with some minor tweaks to the **AST** upon saving, an html file consisting of documentational prose, live examples, and working program code can be made available to the developer, her collaborators, and external developers who wish to consume, or contribute to, the project.

### Tangling
Tangling in `love-notes` is achieved by using codefences and some (currently very limited) macro commands. Program code is tangled using the concepts of `CodeStores`, `CodeFiles` and `CodeSections`. Each `love-note` produces a single `CodeStore` that maintains the collection of `CodeFiles`, and generates the final sources. A `CodeFile` is created using only a filename, and contains a collection of `CodeSection` objects, which, in turn, contains a collection of nodes with each holding the raw source for a given code fence. A `CodeFile` name will, consequently, be the name of the file that is eventually written to disk, and will contain the tangled source for all `CodeSections` in said file.

#### Creating your first `CodeFile`
Technically, you don't have to do anything other than create a single well-formed code fence to create the default `CodeFile`:
<pre lang="no-highlight"><code>
Create an `index.js` file
```js
// file: index.js
```
</code></pre>

The preceeding example will automatically create a `CodeFile` named `index.js` that contains a single `CodeSection` named `root`. This `CodeSection` will then contain a single source block that holds the `MDAST` node for this codefence. Any code fence you create that doesn't have a macro attached to it will automatically append the code to the `root` section of the `index.js` file. Here's another example:

<pre lang="no-highlight"><code>
Create a `math.js` file and add a couple of sections
```js > math.js
// composable math functions
#sum
#other-methods

```
</code></pre>

This example, however, will create a `CodeFile` named `math.js` containing 3 `CodeSections`: `root`, `#sum`, and `#other-methods`. Out of the three sections created, only the `root` section will currently contain any source blocks. The source for `math.js#root` currently holds an `MDAST` node that contains a `content` property with a value of `//composable math functions\n#sum\#product\n`. However, the `root` section also now knows that it has two child sections, specifically: `[ '#sum', '#root']`. The `CodeFile` representing `math.js`, will use this information to build a dependency tree while generating the final source for the file. Again, just like in `index.js`, any further code fences wishing to insert into `math.js` that don't provide a section, will insert code blocks into the `root` section of `math.js`. `#CodeSections` are created if, and only if, a `#section-tag` starts a line, and is the only text a line contains

But, let me demonstrate how to target sections:

<pre lang="no-highlight"><code>
A simple addition method
```js > math.js#sum
function sum(a, b) {
  return a + b
}
```

Oh, we're gonna need an exports section!
```js > math.js
// section: #exports
#exports
```

Whoops. I forgot to add these methods earlier.
```js > math.js#other-methods
// section: #other-methods
#product
#square
#cube
```
</code></pre>

Each of these blocks target specifc sections of a file. The first being `math.js#sum`, the second being `math.js#root` and the final being `math.js#other-methods`. If source were generated at this moment from this file, it would look like:

```js
// composable math functions
function sum(a,b) {
  return a + b
}
// section: #other-methods
// section: #exports
```

Just for sake of completion, I'm going to quickly fill out the rest of this little project.

<pre lang="no-highlight"><code>
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
</code></pre>

When run through the `love-notes` tangler and weaver tools, this document will produce two code files (`index.js` and `math.js`) and an html file containing both the documentation and code blocks. [see output here](https://github.com/8-uh/love-notes/blob/master/docs)


### Inline Tangling
**TODO:** More robust documentation
Use the `<3` macro to insert the contents of a codeblock directly into the woven html file
<pre lang="no-highlight"><code>
Insert html directly into the built documentation file and keep the code block as well.
```html <3
<h3>I'm a heading!</h3>
```
Also insert javascript directly into the final output
```js <3
console.log('Oh what tangled webs we weave...')
```
the [weaver-example output](https://github.com/8-uh/love-notes/tree/master/examples/weaver-output/test) demonstrates the woven file created from [test2.md](https://github.com/8-uh/love-notes/blob/master/test/test2.md)

## Installation
1. clone the repo
2. `$ npm install`

## Dev
`$ npm run test:watch` will run a 14 point test suite on the library

## Building
`$ npm run build`
`love-notes` uses rollup to create separate umd and `es` packages in the `dist` directory

## Example
`$ npm run example:tangler` or `$ npm run example:weaver`

This example reads the `test.md` file found in the `test` directory and creates the properly tangled `index.js` and `math.js` files as indicated in the input markdown.



## Tools
### Syntax Highlighting
Most editors also already have the ability to highlight not only the markdown itself, but the code inside of properly formatted code fences. And, with the -very- recent advent of GitHub adopting a [formal spec for `gfm`](https://github.com/blog/2333-a-formal-spec-for-github-flavored-markdown), full support for proper syntax highlighting of `love-notes` in your favorite editor will be available soon.


## TODO
- [ ] Add macros for inline-tangling
- [ ] Create an example project that tangles, weaves, and transpiles/includes other build technologies
- [x] Create Tangler
- [x] Create Weaver
- [x] Create a proper README
- [x] Create a simple tangler example
- [x] Create a simple weaver example

