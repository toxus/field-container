/**
 * Created by jaap on 12/07/2017.
 */
"use strict";
const rowClass = require('../lib/rowTemplate');

describe('row template', function() {
  var template = new rowClass();

  template.readFile('../spec/rowTemplate.json');
  describe("read a template", function() {
    expect(template.template().sheet).toEqual('Blad1');
  });

  describe('the start row is used in counting', function() {
    expect(template.columnCount()).toEqual(4);
    expect(template.column(0).type).toEqual('id');
  })

});

describe('row template', function() {
  var template = new rowClass();

  it("throw duplicate error", function() {
    expect(function() {template.readFile('../spec/rowTemplate.duplicate.json')}).toThrow(new Error('the field telephone is used multiple times'));
  });

});
