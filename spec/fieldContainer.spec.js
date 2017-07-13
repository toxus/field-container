/**
 * Created by jaap on 10/07/2017.
 */
const fieldsClass = require('../lib/fieldContainer');
const rowTemplate = require('../lib/rowTemplate');

describe("fieldContainer", function() {


  describe("field manipulations:", function() {
    describe('adding and removing', function() {
      const fields = new fieldsClass();
      it("Has a count function", function() {
        expect(typeof fields.count).toEqual('function');
      });
      fields.clear();
      it('had no fields', function() {
        expect(fields.count()).toEqual(0);
      });

      it("Has a add function", function () {
        expect(typeof fields.add).toEqual('function');
      });

      let index;
      it("Add a field", function () {
        index = fields.add('nr1', "telephone", {number: "0610810547", country: "31"}, ["telephone.mobile"]);
        expect(index).toEqual(0)
      });

      it('to have one member', function() {
        expect(fields.count()).toEqual(1);
      });

      it("returns the field", function() {
        expect(fields.get(index)).toEqual({ name: "nr1", usage: ["telephone.mobile"],fieldType: "telephone", data: {number: "0610810547", country: "31"}});
      });
      it("returns an error if the index is out of bounce", function() {
        expect(function() { fields.get(-1)}).toThrow(new Error('index out of bounce'));
      });
      it("to remove an element", function() {
        expect(fields.delete(index)).toEqual({ name: "nr1", usage: ["telephone.mobile"], fieldType: "telephone", data: {number: "0610810547", country: "31"}})
      });

      it('to have one member', function() {
        index = fields.add({ name: "nr2", fieldType: "telephone", data: {value: "0612345678"}, usage: ["telephone.mobile"]});

        expect(fields.count()).toEqual(1);
      });
      it("returns the field", function() {
        expect(fields.get(index)).toEqual({ name: "nr2", usage: ["telephone.mobile"], fieldType: "telephone", data: {value: "0612345678"}});
      });

    });

    describe('group action', function() {
      const fields = new fieldsClass();

      it("to remove all", function() {
        fields.clear();
        expect(fields.count()).toBe(0);
      });

      it('stores errors', function() {
        fields.addError('error', 'test','a message');
        expect(fields.hasErrors()).toEqual(true);
        expect(fields.errors().length).toEqual(1);
        expect(fields.errors()[0]).toEqual({type: 'error', field: 'test', message: 'a message'});
      });

      it('clears the errors', function() {
        fields.clearErrors();
        expect(fields.hasErrors()).toEqual(false);
      })
    })
  });

  describe('import information', function() {
    const fieldRow = new fieldsClass();

    let template = new rowTemplate();
    template.readFile('../spec/rowTemplate.json');

    fieldRow.clear();

    expect(fieldRow.count()).toEqual(0);
    fieldRow.importRow(
      {
        A: '12345',B:'John',C:'the',D:'Bastard',E:'Google',F:'john@checkit.com',G:'0612345678',H:'',I:'Nowhere',J:'1234', K:'1017TE',L:'Amsterdam',M:'nl'
      },
      template
    );

    it('all is valid', function() {
      expect(fieldRow.count()).toEqual(4);  // four fields
      expect(fieldRow.get(0).data.value).toEqual('12345');
      expect(fieldRow.get(0).name).toEqual('id');
      expect(fieldRow.get(0).fieldType).toEqual('id');

      expect(fieldRow.get(1).fieldType).toEqual('name');

      expect(fieldRow.hasErrors()).toEqual(false);
    });
    it('to find by name', function() {
      expect(fieldRow.getByName('id').name).toEqual('id');
      expect(fieldRow.getByName('telephone').name).toEqual('telephone');
      expect(fieldRow.getByName('not a field')).toEqual(false);
    });

  });

  describe('import information with errors', function() {
    const fieldRow = new fieldsClass();

    let template = new rowTemplate();
    template.readFile('../spec/rowTemplate.json');

    fieldRow.clear();

    expect(fieldRow.count()).toEqual(0);
    fieldRow.importRow(
      {
        A: '12345',B:'John',C:'the',UU:'Bastard',E:'Google',F:'john@checkit.com',G:'0612345678',H:'',I:'Nowhere',J:'1234', K:'1017TE',L:'Amsterdam',M:'nl'
      },
      template
    );
    it('has an error', function() {
      expect(fieldRow.hasErrors()).toEqual(true);
    });
    it('shows the field missing', function() {
      expect(fieldRow.errors()).toEqual([ { type : 'error', field : 'name', message : 'unknown fieldname D' } ]);
    });
  });

  describe("standarizing the row", function() {
    const fieldRow = new fieldsClass();
    let template = new rowTemplate();
    template.readFile('../spec/rowTemplate.json');
    fieldRow.clear();
    expect(fieldRow.count()).toEqual(0);

    fieldRow.importRow(
      {
        A: '12345',B:'John',C:'the',D:'Bastard',E:'Google',F:'john@checkit.com',G:'0612345678',H:'',I:'Nowhere',J:'1234', K:'1017TE',L:'Amsterdam',M:'nl'
      },
      template
    );
    fieldRow.stardardize();
    it("to have no errors", function() {
      expect(fieldRow.hasErrors()).toEqual(false);
      expect(fieldRow.errors()).toEqual([]);
    });
    it('to have a proper name', function() {
      expect(fieldRow.getByName('name').data.firstName).toEqual('John')
    });
    it('to have a telephone with layout', function() {
      expect(fieldRow.getByName('telephone').data).toEqual({ value : '+31-6-12345678' });
    })

  })

});