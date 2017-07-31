/**
 * Created by jaap on 10/07/2017.
 */
"use strict";

const FieldCleanerClass = require('../lib/fieldCleaner');
const TypesClass = require('../lib/fieldTypes');

describe('fieldCleaner', function() {
  let cleaner = new FieldCleanerClass();

  it('hasData', () => {
    let txt = new TypesClass.text();
    expect(txt.hasData({data: {value : 'test'} })).toEqual(true);
    expect(txt.hasData({data: {value : ''} })).toEqual(false);
    expect(txt.hasData({data: {} })).toEqual(false);
  })



});