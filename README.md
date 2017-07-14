# field-container

A storage space for variable field record.

## Status

[![npm version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]

## Installation

Install the package via `npm`:

```sh
npm install @toxus/field-container --save
```

## Usage

A simple import statement

```js
const rowTemplate = require('./lib/rowTemplate');
const fieldsClass = require('./lib/fieldContainer');
const fields = new fieldsClass();

let template = new rowTemplate();
template.readFile('./spec/rowTemplate.json');

fields.clear();
var cnt = fields.count();
fields.importRow(
  {
    A: '12345',B:'John',C:'the',D:'Bastard',E:'Google',F:'john@checkit.com',G:'0612345678',H:'',I:'Nowhere',J:'1234', K:'1017TE',L:'Amsterdam',M:'nl'
  },
  template
);
```

## Licenses

This package is licensed under MIT. 

[npm-image]: https://img.shields.io/npm/v/google-libphonenumber.svg?style=flat-square
[npm-url]: https://npmjs.org/package/google-libphonenumber
[travis-image]: https://img.shields.io/travis/seegno/google-libphonenumber.svg?style=flat-square
[travis-url]: https://travis-ci.org/seegno/google-libphonenumber
