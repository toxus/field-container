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
    diff.add( {refId:'someField', text: 'someInfo'});
    diff.exec(fields.fields(), origin);
    expect(fields.fields().length).toEqual(1);
    expect(fields.fields()[0].refId).toEqual('someField')
  });

  it('add a field', () => {
    let diff2 = new FieldDiffClass();
    let fields2 = new RecordClass();
    diff2.add( {refId:'someField', text: 'someInfo'});
    diff2.add( {refId:'otherField', text: 'Nr 14'});
    diff2.exec(fields2.fields(), origin);
//    console.log(fields2.fields());
    expect(fields2.fields().length).toEqual(2);
    expect(fields2.fields()[1].refId).toEqual('otherField')
  });

  it('update a field', () => {
    let diff2 = new FieldDiffClass();
    let fields2 = new RecordClass();
    diff2.add( {refId:'someField', text: 'someInfo'});
    diff2.add( {refId:'otherField', text: 'Nr 14'});
    diff2.exec(fields2.fields(), origin);
    let diff3 = new FieldDiffClass();
    diff3.update({refId:'otherField', text: 'new value'});
    diff3.exec(fields2.fields(), origin);
//    console.log(fields2.fields());
    expect(fields2.fields().length).toEqual(2);
    expect(fields2.fields()[1].text).toEqual('new value')
  });

  it('add a field', () => {
    let diff2 = new FieldDiffClass();
    let fieldsDel = new RecordClass();
    diff2.add( {refId:'someField', text: 'someInfo'});
    diff2.add( {refId:'otherField', text: 'Nr 14'});
    diff2.exec(fieldsDel.fields(), origin);
    let diff3 = new FieldDiffClass();
    diff3.delete({refId:'otherField'});
    diff3.exec(fieldsDel.fields(), origin);

    // console.log('IN:', fieldsDel.fields());
    expect(fieldsDel.fields().length).toEqual(1);
    // expect(fieldsDel.fields()[1].refId).toEqual('otherField')
  });

/**  DOES NOT RUN ON TRAVIS
 *
  it('delete a mongoose element', (done) => {
    const origin = '123123';
    const mongoose = require('mongoose');
    mongoose.Promise = require('bluebird'); // global.Promise;
    mongoose.connect( 'mongodb://localhost:27017/FieldTest', {useMongoClient: true} ,(err) => {

      const Schema = mongoose.Schema;
      const testModel = {
        name: {type: Schema.Types.String},
        fields: [
          {
            refId: {type: Schema.Types.String},
            fieldType: {type: Schema.Types.String},
            data: {
              value: {type: Schema.Types.String}
            }
          }
        ]
      };
      let TestClass = mongoose.model('test', testModel);

      let rec1 = new TestClass();
      rec1.name = 'Jack';
      const cEmail = {refId: '1', fieldType: 'email', data: {value: 'j@x.com'}};
      rec1.fields.push(cEmail);
      rec1.fields.push({refId: '4', fieldType: 'fax', data: {value: '12123123'}})
      rec1.save().then((rec) => {
        // console.log('RES:', rec);

        expect(rec.fields.length).toEqual(2);
        let diff = new FieldDiffClass();
        diff.delete(cEmail );
        diff.exec(rec1.fields, origin);
        rec1.save().then( (patched) => {
          //console.log('Patched:', patched);
          expect(rec.fields.length).toEqual(1);
          mongoose.connection.close();
          done();
        })
      })
    });
  })
*/
});