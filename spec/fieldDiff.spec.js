/**
 * Created by jaap on 14/07/2017.
 * Test the diff container
 */
"use strict";
const FieldDiffClass = require('../lib/fieldDiff');
const RecordClass = require('../lib/flexRecord');

describe('fieldDiff', function() {
  let diff = new FieldDiffClass();
  it('have no actions', function() {
    expect(diff.hasAction()).toEqual(false);
  })
});
describe('fieldDiff', function() {
  let diff = new FieldDiffClass();
  diff.add({text: 'someInfo'});
  it('test add', function() {
    expect(diff.hasAction()).toEqual(true);
    expect(diff.add()).toEqual([{ field : { text : 'someInfo' } }]);
  })
});
describe('fieldDiff', function() {
  let diff = new FieldDiffClass();
  diff.update({text: 'someInfo'});
  it('test update', function() {
    expect(diff.hasAction()).toEqual(true);
    expect(diff.update()).toEqual([{ field : { text : 'someInfo' } }]);
  })
});
describe('fieldDiff', function() {
  let diff = new FieldDiffClass();
  diff.delete({text: 'someInfo'});
  it('test delete', function() {
    expect(diff.hasAction()).toEqual(true);
    expect(diff.delete()).toEqual([{ field : { text : 'someInfo' } }]);
  })
});

describe('getting / setting', () => {
  let diff = new FieldDiffClass();
  diff.add({text: 'someInfo'});
  diff.delete({text: 'someInfo'});
  diff.update({text: 'someInfo'});
  expect(diff.delete()).toEqual([{ field : { text : 'someInfo' } }]);

  let struc = diff.obj();
  let diffOther = new FieldDiffClass();
  diffOther.obj(struc);
  expect(diffOther.delete()).toEqual([{ field : { text : 'someInfo' } }]);
});

describe('patch.exec', () => {
  const origin = '123123';


  it('add a field', () => {
    let diff = new FieldDiffClass();
    let fields = new RecordClass();
    diff.add( {id:'someField', text: 'someInfo'});
    diff.exec(fields.fields(), origin);
    expect(fields.fields().length).toEqual(1);
    expect(fields.fields()[0].id).toEqual('someField')
  });

  it('add a field', () => {
    let diff2 = new FieldDiffClass();
    let fields2 = new RecordClass();
    diff2.add( {id:'someField', text: 'someInfo'});
    diff2.add( {id:'otherField', text: 'Nr 14'});
    diff2.exec(fields2.fields(), origin);
//    console.log(fields2.fields());
    expect(fields2.fields().length).toEqual(2);
    expect(fields2.fields()[1].id).toEqual('otherField')
  });

  it('update a field', () => {
    let diff2 = new FieldDiffClass();
    let fields2 = new RecordClass();
    diff2.add( {id:'someField', text: 'someInfo'});
    diff2.add( {id:'otherField', text: 'Nr 14'});
    diff2.exec(fields2.fields(), origin);
    let diff3 = new FieldDiffClass();
    diff3.update({id:'otherField', text: 'new value'});
    diff3.exec(fields2.fields(), origin);
//    console.log(fields2.fields());
    expect(fields2.fields().length).toEqual(2);
    expect(fields2.fields()[1].text).toEqual('new value')
  });

  it('add a field', () => {
    let diff2 = new FieldDiffClass();
    let fieldsDel = new RecordClass();
    diff2.add( {id:'someField', text: 'someInfo'});
    diff2.add( {id:'otherField', text: 'Nr 14'});
    diff2.exec(fieldsDel.fields(), origin);
    let diff3 = new FieldDiffClass();
    diff3.delete({id:'otherField'});
    diff3.exec(fieldsDel.fields(), origin);

   // console.log(fieldsDel.fields());
    expect(fieldsDel.fields().length).toEqual(1);
    // expect(fieldsDel.fields()[1].id).toEqual('otherField')
  });


});