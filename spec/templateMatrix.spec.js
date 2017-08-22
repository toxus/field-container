/**
 * Created by jaap on 12/07/2017.
 */
"use strict";
const templatMatrixClass = require('../lib/templateMatrix');
const RecordClass = require('../lib/flexRecord');
require('expectations');

describe('templateMatrix', () => {
  describe('read file', function() {
    const tmp1 = new templatMatrixClass();
    tmp1.readFile('../spec/rowTemplate.json');

    it("have sheet", function() {
      expect(tmp1.template().sheet).toEqual('Blad1');
    });

    it('the start row is used in counting', function() {
      expect(tmp1.columnCount()).toEqual(4);
      expect(tmp1.column(0).fieldType).toEqual('id');
    })

  });

  describe('duplicate field', function() {
    const template = new templatMatrixClass();

    it("throw error", function() {
      expect(function() {template.readFile('../spec/rowTemplate.duplicate.json')}).toThrow(new Error('the field telephone is used multiple times'));
    });
  });

  describe('validate', () => {
    const template = new templatMatrixClass();

    it("be invalid", function() {
      const err = template.validate(require('../spec/mocks/template.invalid'));
      expect(err.indexOf('ValidationError')).toEqual(0);
    });
    it("be valid", function() {
      const err = template.validate(require('../spec/mocks/template.valid'));
      expect(err).toEqual(true);
    });

  });

  describe('read string', function() {
    const tmp = new templatMatrixClass();
    const json = `{
      "sheet": "Blad1",
      "startRow": 2,
      "columnNames": {
        "A": "ID",
        "B": "voornaam",
        "C": "tussenvoegsel",
        "D": "achternaam",
        "E": "bedrijf",
        "F": "email"
      },
      "columns": [
        {
          "fieldType": "id",
          "fieldName": "id",
          "data": {
            "value": "A"
          }
        },
        {
          "fieldName": "name",
          "fieldType": "name",
          "required": 1,
          "data": {
            "firstName": "B",
            "prefix": "C",
            "lastName": "D",
            "company": "E"
          }
        }
      ]
    }`;
    tmp.jsonString(json);
    it('have two columns', function() {
      expect(tmp.columnCount()).toEqual(2);
      expect(tmp.column(0).fieldType).toEqual('id');
    })
  });

  describe('test fields', () => {
    const template = new templatMatrixClass();
    it('to except the file', () => {
      template.readFile('../spec/template.json')
    } )
  });

  describe('import', () => {
    const template = new templatMatrixClass();
    template.readFile('../spec/template.json');
    let rec = new RecordClass();
    const data =
      {
        A: '12345',
        B: 'John',
        C: 'the',
        D: 'Bastard',
        E: 'Google',
        F: 'john@checkit.com',
  //      G: '0612345678',  // test for optional parameter
        H: '',
        I: 'Nowhere',
        J: '1234',
        K: '1017TE',
        L: 'Amsterdam',
        M: 'nl'
      };
    template.import(data, rec);
    it('to have no errors', () => {
      expect(rec.hasErrors()).toEqual(false);

    });
  });

  describe('export', () => {
    const template = new templatMatrixClass();
    template.readFile('../spec/template.json');
    let rec = new RecordClass();
    rec.fields(require('../spec/mocks/flexRecord'));

    const shareId = rec.items[0].ref[0].shareRowId;

    rec.markByShare(shareId);
    const result = template.export(rec);
    it('to have an id', () => {
    //  console.log(result);
      expect(result.A).toEqual('1234');
    })
  })
});