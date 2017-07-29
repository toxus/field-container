/**
 * Created by jaap on 10/07/2017.
 */
"use strict";
const fieldNamespace = require('../lib/fieldTypes');
const FlexRecordClass = require('../lib/flexRecord');

describe('Test field standardization of', function() {

  var container = new FlexRecordClass();

  describe('text', function() {

    var text = new fieldNamespace['text'](container);
    it('To have the type text', function() {
      expect(text.name()).toEqual('text');
    });

    var field = {data : {value: 'test'}};
    it('to unchange the content', function() {
      text.parse(field);
      expect(field).toEqual({data: {value : 'test'}});
    });

    it('to validate wrong info', function() {
      expect(function() {text.validate({}); }).toThrow(new Error('ValidationError: child "data" fails because ["data" is required]'));
      expect(function() {text.validate({data: {test:'xx'}}); }).toThrow(new Error('ValidationError: child "data" fails because ["test" is not allowed]'));
      expect(text.validate({data: {value: 'a test'}})).toEqual(true);
    });

    var f2 = {data : {value: '  \t  '}};
    text.parse(f2);
    it('to remove empty elements', function() {
      expect(f2.data).toEqual({});
    });
    var f3 =  {data : {wrong: 'This is it'}};
    text.parse(f3);
    it('to remove if no value active', function() {
      expect(f3.data).toEqual({});
    });
  });


  describe('email', function() {
    var email = new fieldNamespace['email'](container);

    it('to have the type of email', function() {
      expect(email.name()).toEqual('email');
    });
    var e1 = { data: { value: 'info@example.com'}};
    email.parse(e1);
    it('to except valid email', function() {
      expect(e1.data.value).toEqual('info@example.com');
    });
    var e2 = { data: { value: 'INFO@example.com'}};
    email.parse(e2);
    it('to keep the case', function() {
      expect(e2.data.value).toEqual('INFO@example.com');
    });
    var e3 = { data: { value: '@example.com'}};
    email.parse(e3);
    it('to remove invalid email', function() {
      expect(e3.data).toEqual({});
    });
  });

  describe('telephone', function() {
    var tel = new fieldNamespace['telephone'](container);
    it('to have a type', function() {
      expect(tel.name()).toEqual('telephone')
    });
    var t1 = {data: { value: '0612345678'}};
    tel.parse(t1);
    it('to add country code', function() {
      expect(t1.data.value).toEqual('+31-6-12345678');
    });
    var t2 = {data: { value: '061234567890123234234234'}};
    it('mark wrong numbers', function() {
      expect(function() {tel.parse(t2)}).toThrow(new Error('incorrect format'));
      //expect(t2.data).toEqual({});
    });
  });

  describe('address', function() {
    var addr = new fieldNamespace['address'](container);
    it('to have a type', function() {
      expect(addr.name()).toEqual('address')
    });
    var a1 = { data: {street: 'a', city:'p', country : 'Frankrijk'}};
    it("to find the country code in dutch", function() {
      expect(addr.parse(a1).country).toEqual('FR');
    });
    it("to set the default country", function() {
      expect(addr.parse({ data: {street : 'testing', city: 'ams'}}).country).toEqual('NL');
    });
    it('to translate belgie', function() {
      expect(addr.parse({ data: {street: 'aa', city: 'antw', country : 'belgie'}}).country).toEqual('BE');
    });
    it('to translate french names', function() {
      expect(addr.parse({ data: {street: 'aa', city: 'paris', country : 'France'}}).country).toEqual('FR');
    });
    it('to parse the street', function() {
      var a2 = addr.parse({data: {streetNumber: 'Teststraat 25-3', city: 'ams'}});
      expect(container.errors()).toEqual([]);
      expect(a2.country).toEqual('NL');
      expect(a2.street).toEqual('Teststraat');
      expect(a2.number).toEqual('25');
      expect(a2.suffix).toEqual('-3');
    })
    // should write a lot more test because the regex still isn't very good.
  })

});