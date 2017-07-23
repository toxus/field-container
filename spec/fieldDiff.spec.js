/**
 * Created by jaap on 14/07/2017.
 * Test the diff container
 */
"use strict";
const fieldDiffClass = require('../lib/fieldDiff');

describe('fieldDiff', function() {
  let diff = new fieldDiffClass();
  it('have no actions', function() {
    expect(diff.hasAction()).toEqual(false);
  })
});
describe('fieldDiff', function() {
  let diff = new fieldDiffClass();
  diff.add({text: 'someInfo'});
  it('test add', function() {
    expect(diff.hasAction()).toEqual(true);
    expect(diff.add()).toEqual([{ field : { text : 'someInfo' } }]);
  })
});
describe('fieldDiff', function() {
  let diff = new fieldDiffClass();
  diff.update({text: 'someInfo'});
  it('test update', function() {
    expect(diff.hasAction()).toEqual(true);
    expect(diff.update()).toEqual([{ field : { text : 'someInfo' } }]);
  })
});
describe('fieldDiff', function() {
  let diff = new fieldDiffClass();
  diff.delete({text: 'someInfo'});
  it('test delete', function() {
    expect(diff.hasAction()).toEqual(true);
    expect(diff.delete()).toEqual([{ field : { text : 'someInfo' } }]);
  })
});

describe('getting / setting', () => {
  let diff = new fieldDiffClass();
  diff.add({text: 'someInfo'});
  diff.delete({text: 'someInfo'});
  diff.update({text: 'someInfo'});
  expect(diff.delete()).toEqual([{ field : { text : 'someInfo' } }]);

  let struc = diff.obj();
  let diffOther = new fieldDiffClass();
  diffOther.obj(struc);
  expect(diffOther.delete()).toEqual([{ field : { text : 'someInfo' } }]);
});