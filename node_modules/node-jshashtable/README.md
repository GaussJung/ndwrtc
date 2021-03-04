# node-jshashtable

![Node](https://img.shields.io/node/v/node-jshashtable.svg?style=flat-square)
[![NPM](https://img.shields.io/npm/v/node-jshashtable.svg?style=flat-square)](https://www.npmjs.com/package/node-jshashtable)
[![Travis](https://img.shields.io/travis/liuy97/node-jshashtable/master.svg?style=flat-square)](https://travis-ci.org/liuy97/node-jshashtable)
[![David](https://img.shields.io/david/liuy97/node-jshashtable.svg?style=flat-square)](https://david-dm.org/liuy97/node-jshashtable)
[![Coverage Status](https://img.shields.io/coveralls/liuy97/node-jshashtable.svg?style=flat-square)](https://coveralls.io/github/liuy97/node-jshashtable)

> A standalone implementation of hash table in node, which is forked from https://github.com/timdown/jshashtable

### Usage

```js
import Hashtable from 'node-jshashtable';

```

### Installation

Install via [yarn](https://github.com/yarnpkg/yarn)

	yarn add node-jshashtable (--dev)

or npm

	npm install node-jshashtable (--save-dev)


### configuration

You can pass in extra options as a configuration object (➕ required, ➖ optional, ✏️ default).

```js
import hashtable from 'node-jshashtable';

```

➖ **property** ( type ) ` ✏️ default `
<br/> 📝 description
<br/> ❗️ warning
<br/> ℹ️ info
<br/> 💡 example

### methods

#### #name

```js
Hashtable

```

### Examples

See [`example`](example/script.js) folder or the [runkit](https://runkit.com/liuy97/node-jshashtable) example.

### Builds

If you don't use a package manager, you can [access `node-jshashtable` via unpkg (CDN)](https://unpkg.com/node-jshashtable/), download the source, or point your package manager to the url.

`node-jshashtable` is compiled as a collection of [CommonJS](http://webpack.github.io/docs/commonjs.html) modules & [ES2015 modules](http://www.2ality.com/2014/0
  -9/es6-modules-final.html) for bundlers that support the `jsnext:main` or `module` field in package.json (Rollup, Webpack 2)

The `node-jshashtable` package includes precompiled production and development [UMD](https://github.com/umdjs/umd) builds in the [`dist` folder](https://unpkg.com/node-jshashtable/dist/). They can be used directly without a bundler and are thus compatible with many popular JavaScript module loaders and environments. You can drop a UMD build as a [`<script>` tag](https://unpkg.com/node-jshashtable) on your page. The UMD builds make `node-jshashtable` available as a `window.hashtable` global variable.

### License

The code is available under the [Apache-2.0](LICENSE) license.

### Contributing

We are open to contributions, see [CONTRIBUTING.md](CONTRIBUTING.md) for more info.

### Misc

This module was created using [generator-module-boilerplate](https://github.com/duivvv/generator-module-boilerplate).
