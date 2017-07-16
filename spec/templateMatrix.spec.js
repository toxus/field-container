/**
 * Created by jaap on 12/07/2017.
 */
"use strict";
const templatMatrixClass = require('../lib/templateMatrix');

describe('templateMatrix 1', function() {
  const tmp1 = new templatMatrixClass();
  tmp1.readFile('../spec/rowTemplate.json');

  describe("have sheet", function() {
    expect(tmp1.template().sheet).toEqual('Blad1');
  });

  describe('the start row is used in counting', function() {
    expect(tmp1.columnCount()).toEqual(4);
    expect(tmp1.column(0).type).toEqual('id');
  })

});

describe('templateMatrix 2', function() {
  const template = new templatMatrixClass();

  it("throw duplicate error", function() {
    expect(function() {template.readFile('../spec/rowTemplate.duplicate.json')}).toThrow(new Error('the field telephone is used multiple times'));
  });
});

describe('templateMatrix 3', function() {
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
        "type": "id",
        "fieldName": "id",
        "data": {
          "value": "A"
        }
      },
      {
        "fieldName": "name",
        "type": "name",
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
  describe('have two columns', function() {
    expect(tmp.columnCount()).toEqual(2);
    expect(tmp.column(0).type).toEqual('id');
  })
});