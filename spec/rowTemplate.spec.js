/**
 * Created by jaap on 12/07/2017.
 */

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
