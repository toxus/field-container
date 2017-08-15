/**
 * Created by jaap on 10/07/2017.
 */
'use strict';
// debug test routines
//global.expect = require("jasmine").expect;


const FlexRecordClass = require('../lib/flexRecord');
const templatMatricClass = require('../lib/templateMatrix');
const _ = require('lodash');
require('expectations');

describe("flexRecord 1", function() {

  describe("Field manipulations:", function() {
    describe('Adding and removing', function() {
      const field1 = new FlexRecordClass();
      it("Has a count function", function() {
        expect(typeof field1.count).toEqual('function');
      });
      field1.clear();
      it('had no field1', function() {
        expect(field1.count()).toEqual(0);
      });

      it("Has a add function", function () {
        expect(typeof field1.add).toEqual('function');
      });

      let index;
      it("Add a field", function () {
        index = field1.add('nr1', "telephone", {value: "+31-0610810547"}, ["telephone.mobile"]);
        expect(field1.errors()).toEqual([]);
        expect(index).toEqual(0)
      });

      it('to have one member', function() {
        expect(field1.count()).toEqual(1);
      });

      it("returns the field", function() {
        expect(field1.get(index)).toEqual({ refId: "nr1", usage: ["telephone.mobile"],fieldType: "telephone", data: {value: "+31-6-10810547"}});
      });
      it("returns an error if the index is out of bounce", function() {
        expect(function() { field1.get(-1)}).toThrow(new Error('index out of bounce'));
      });
      it("to remove an element", function() {
        expect(field1.delete(index)).toEqual({ refId: "nr1", usage: ["telephone.mobile"], fieldType: "telephone", data: {value: "+31-6-10810547"}})
      });

      it('to have one member', function() {
        index = field1.add({ refId: "nr2", fieldType: "telephone", data: {value: "0612345678"}, usage: ["telephone.mobile"]});

        expect(field1.count()).toEqual(1);
      });
      it("returns the field", function() {
        expect(field1.get(index)).toEqual({ refId: "nr2", usage: ["telephone.mobile"], fieldType: "telephone", data: {value: "+31-6-12345678"}});
      });

    });

    describe('group action', function() {
      const fields = new FlexRecordClass();

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
      });

      it('assign other fields', () => {
        fields.fields([
          { refId: 'test', data: { x: 'xx'}},
          { refId: 'test2', data: { x: 'yy'}},
        ]);
        expect(fields.fields().length).toEqual(2);
        expect(fields.get('test').refId).toEqual('test');
      });
    })
  });

  describe('import information', function() {
    const fieldRow = new FlexRecordClass();

    let template = new templatMatricClass();
    template.readFile('../spec/rowTemplate.json');

    fieldRow.clear();
    it('to import', () => {
      expect(fieldRow.count()).toEqual(0);
      expect(fieldRow.errors()).toEqual([]);
      //fieldRow.importRow(
      template.import(
        {
          A: '12345',B:'John',C:'the',D:'Bastard',E:'Google',F:'john@checkit.com',G:'0612345678',H:'',I:'Nowhere',J:'1234', K:'1017TE',L:'Amsterdam',M:'nl'
        },
        fieldRow
      );
    });

    it('all is valid', function() {
      expect(fieldRow.count()).toEqual(4);  // four fields
      expect(fieldRow.get(0).data.value).toEqual('12345');
      expect(fieldRow.get(0).refId).toEqual('id');
      expect(fieldRow.get(0).fieldType).toEqual('id');

      expect(fieldRow.get(1).fieldType).toEqual('name');

      expect(fieldRow.errors()).toEqual([]);
    });
    it('to find by name', function() {
      // console.log('RES', fieldRow.get('id'));
      expect(fieldRow.get('id').refId).toEqual('id');
      expect(fieldRow.get('telephone').refId).toEqual('telephone');
      expect(fieldRow.get('not a field')).toEqual(false);
    });
  });

  describe('test delete', function() {
    const fieldRow = new FlexRecordClass();

    let template = new templatMatricClass();
    template.readFile('../spec/rowTemplate.json');

    fieldRow.clear();

    template.import(
      {
        A: '12345',B:'John',C:'the',D:'Bastard',E:'Google',F:'john@checkit.com',G:'0612345678',H:'',I:'Nowhere',J:'1234', K:'1017TE',L:'Amsterdam',M:'nl'
      },
      fieldRow
    );



    fieldRow.delete(2);
    fieldRow.delete('name');
    it('to remove a field by index', () => {
      expect(fieldRow.count()).toEqual(2);
      expect(fieldRow.get('id').refId).toEqual('id');
      expect(fieldRow.get('email').refId).toEqual('email');
      expect(fieldRow.get('telephone')).toEqual(false);
    })
  });

  describe('import information with errors', function() {
    const fieldRow = new FlexRecordClass();

    let template = new templatMatricClass();
    template.readFile('../spec/rowTemplate.json');

    fieldRow.clear();

//    expect(fieldRow.count()).toEqual(0);
    template.import(
      {
        A: '12345',B:'John',C:'the',UU:'Bastard',E:'Google',F:'john@checkit.com',G:'0612345678',H:'',I:'Nowhere',J:'1234', K:'1017TE',L:'Amsterdam',M:'nl'
      },
      fieldRow
    );
    it('has an error', function() {
      expect(fieldRow.hasErrors()).toEqual(true);
    });
    it('shows the field missing', function() {
      expect(fieldRow.errors()).toEqual([ { type : 'error', field : 'name', message : 'unknown fieldname D' } ]);
    });
  });

  describe("standarizing the row", function() {
    const fieldRow = new FlexRecordClass();
    let template = new templatMatricClass();
    template.readFile('../spec/rowTemplate.json');
    fieldRow.clear();
//    expect(fieldRow.count()).toEqual(0);

    template.import(
      {
        A: '12345',B:'John',C:'the',D:'Bastard',E:'Google',F:'john@checkit.com',G:'0612345678',H:'',I:'Nowhere',J:'1234', K:'1017TE',L:'Amsterdam',M:'nl'
      },
      fieldRow
    );
    it('to have no errors', function() {
      expect(fieldRow.hasErrors()).toEqual(false);
    });
    it('to have a record id', function () {
      expect(fieldRow.id).toEqual("12345");
    });
    fieldRow.stardardize();
    it("to have no errors", function() {
      expect(fieldRow.hasErrors()).toEqual(false);
      expect(fieldRow.errors()).toEqual([]);
    });
    it('to have a proper name', function() {
      expect(fieldRow.get('name').data.firstName).toEqual('John')
    });
    it('to have a telephone with layout', function() {
      expect(fieldRow.get('telephone').data).toEqual({ value : '+31-6-12345678' });
    })

  })

});

 describe('flexRecord changes', function() {
   const field1 = new FlexRecordClass();
   const field2 = new FlexRecordClass();
   const field3 = new FlexRecordClass();
   const field4 = new FlexRecordClass();
   const field5 = new FlexRecordClass();
   let template = new templatMatricClass();
   template.readFile('../spec/rowTemplate.json');
   template.import(
     {
       A: '12345',B:'John',C:'the',D:'Bastard',E:'Google',F:'john@checkit.com',G:'0612345678',H:'',I:'Nowhere',J:'1234', K:'1017TE',L:'Amsterdam',M:'nl'
     },
     field1
   );
   template.import(
     {
       A: '12345',B:'John',C:'the',D:'Bastard',E:'Google',F:'john@checkit.com',G:'0612345678',H:'',I:'Nowhere',J:'1234', K:'1017TE',L:'Amsterdam',M:'nl'
     },
     field2
   );
   template.import(
     {
       A: '12345',B:'John',C:'the',D:'Bastard',E:'Google',F:'john@checkit.com',G:'+31-123456789',H:'',I:'Nowhere',J:'1234', K:'1017TE',L:'Amsterdam',M:'nl'
     },
     field3
   );
   template.import(
     {
       A: '12345',B:'John',C:'the',D:'Bastard',E:'Google',F:'john@checkit.com',G:'0612345678',H:'',I:'Nowhere',J:'1234', K:'1017TE',L:'Amsterdam',M:'nl'
     },
     field4
   );
   template.import(
     {
       A: '12345',B:'John',C:'the',D:'Bastard',E:'Google',F:'john@checkit.com',G:'0612345678',H:'',I:'Nowhere',J:'1234', K:'1017TE',L:'Amsterdam',M:'nl'
     },
     field5
   );


   let diff = field1.diff(field2);
   it('to have no changes', function() {
     expect(diff.hasAction()).toEqual(false);
   });
   it('no add', function() {
     expect(diff.add()).toEqual([]);
   });
   it('no update', function() {
     expect(diff.update()).toEqual([]);
   });
   it('no delete', function() {
     expect(diff.delete()).toEqual([]);
   });

   let diff2 = field1.diff(field3);
   it('to have changes', function() {
     expect(diff2.hasAction()).toEqual(true);
   });
   it('no add', function() {
     expect(diff2.add()).toEqual([]);
   });
   it('one update', function() {
     expect(diff2.update().length).toEqual(1);
     expect(diff2.update()[0].field.data.value).toEqual('+31-123456789');
   });
   it('no delete', function() {
     expect(diff2.delete()).toEqual([]);
   });

   field4.add('telephone2', "telephone", { value: '+31-5555555'});
   //expect(field4).toEqual('');
   let diff3 = field1.diff(field4);
   it('to have changes', function() {
     expect(diff3.hasAction()).toEqual(true);
   });
   it('one add', function() {
     expect(diff3.add().length).toEqual(1);
     expect(diff3.add()[0].field.refId).toEqual('telephone2');
     expect(diff3.add()[0].field.data).toEqual({ value: '+31-5555555'});
   });
   it('no update', function() {
     expect(diff3.update().length).toEqual(0);
   });
   it('no delete', function() {
     expect(diff3.delete()).toEqual([]);
   });

   describe('check delete field', function() {
     field5.delete('telephone');

     let diff4 = field1.diff(field5);
     it('to have changes', function() {
       expect(diff4.hasAction()).toEqual(true);
     });
     it('no add', function() {
       expect(diff4.add().length).toEqual(0);
     });
     it('no update', function() {
       expect(diff4.update().length).toEqual(0);
     });
     it('one delete', function() {
       expect(diff4.delete().length).toEqual(1);
     });
   });


   describe('usage', () =>{
      let usField = new FlexRecordClass();
      for (let l = 0; l < field1.data.length; l++) {
        delete field1.data[l].usage;
      }
      // field1 and usField are now the same but not linked with no usage
      it('no change if both undefined', () => {
        usField.fields(_.clone( field1.data));
        expect(field1.diff(usField).hasAction()).toEqual(false);
      });
     it('update on set', () => {
       usField.fields(_.cloneDeep( field1.data));
       usField.data[0].usage = ['test'];
       const d = field1.diff(usField);
       expect(d.hasAction()).toEqual(true);
       expect(d.update().length).toEqual(1);
     });
     it('update on clear', () => {
       usField.fields(_.cloneDeep( field1.data));
       field1.data[0].usage = ['test'];
       const d = field1.diff(usField);
       expect(d.hasAction()).toEqual(true);
       expect(d.update().length).toEqual(1);
     });
     it('update on change', () => {
       usField.fields(_.cloneDeep( field1.data));
       field1.data[0].usage = ['test'];
       usField.data[0].usage = ['some others'];
       const d = field1.diff(usField);
       expect(d.hasAction()).toEqual(true);
       expect(d.update().length).toEqual(1);
     });
     it('update on add element', () => {
       usField.fields(_.cloneDeep( field1.data));
       field1.data[0].usage = ['test'];
       usField.data[0].usage = ['test', 'some others'];
       const d = field1.diff(usField);
       expect(d.hasAction()).toEqual(true);
       expect(d.update().length).toEqual(1);
     });
     it('update missing', () => {
       usField.fields(_.cloneDeep( field1.data));
       field1.data[0].usage = [];
       delete usField.data[0].usage;
       const d = field1.diff(usField);
       expect(d.hasAction()).toEqual(false);
     })


   });
 });

describe('flexRecord patching', function() {
  const field1 = new FlexRecordClass();
  const field2 = new FlexRecordClass();
  const field3 = new FlexRecordClass();
  const field4 = new FlexRecordClass();
  const field5 = new FlexRecordClass();
  let template = new templatMatricClass();
  template.readFile('../spec/rowTemplate.json');
  template.import(
    {
      A: '12345',
      B: 'John',
      C: 'the',
      D: 'Bastard',
      E: 'Google',
      F: 'john@checkit.com',
      G: '0612345678',
      H: '',
      I: 'Nowhere',
      J: '1234',
      K: '1017TE',
      L: 'Amsterdam',
      M: 'nl'
    },
    field1
  );
  template.import(
    {
      A: '12345',
      B: 'John',
      C: 'the',
      D: 'Bastard',
      E: 'Google',
      F: 'test@checkit.com',
      G: '0612345678',
      H: '',
      I: 'Nowhere',
      J: '1234',
      K: '1017TE',
      L: 'Amsterdam',
      M: 'nl'
    },
    field2
  );
  field2.add('telephone2', 'telephone', {value: '12345'});
  let diff2 = field1.diff(field2);
  it('to have no errors', function() {
    expect(field1.hasErrors()).toEqual(false);
  });
  field3.add('email', 'email', {value: 'xxxx'}); // it must have the email to update it
  let undo = field3.patch(diff2);
  it('to have new fields', function() {
    //expect(field3).toEqual(1);
    expect(field3.count()).toEqual(2);
    expect(field3.get("telephone2").data.value).toEqual('+31-12345')
    expect(field3.get('email').data.value).toEqual('test@checkit.com')
  });
  it('has one update and one add', function() {
 //   expect(undo).toEqual(1);
    expect(undo.update().length).toEqual(1);
    expect(undo.delete().length).toEqual(1);
    expect(undo.add().length).toEqual(0);
  });

  it('to have an id', () => {
    expect(field1.id).toEqual('12345');
  })
});

describe('flexRecord.update clear', () => {
  let template = new templatMatricClass();
  template.readFile('../spec/rowTemplate.json');
  let field1 = new FlexRecordClass();
  template.import(
    {
      F:'john@checkit.com',A: '12345',B:'John',C:'the',D:'Bastard',E:'Google',G:'0612345678',H:'',I:'Nowhere',J:'1234', K:'1017TE',L:'Amsterdam',M:'nl'
    },
    field1
  );
  let fieldNew = new FlexRecordClass();
  fieldNew.fields(_.cloneDeep(field1.data));
  fieldNew.get('email').data.value = '';

  let diff = field1.diff(fieldNew);

  it('no update', () => {
    expect(diff.update().length).toEqual(0);
  });
  it('a delete', () => {
    expect(diff.delete().length).toEqual(1);
  })
});

describe('flexRecord.missing fields', () => {
  let template = new templatMatricClass();
  template.readFile('../spec/rowTemplate.json');
  let field1 = new FlexRecordClass();
  template.import(
    {
      F:'john@checkit.com',A: '12345',B:'John',C:'the',D:'Bastard',E:'Google',G:'0612345678',H:'',I:'Nowhere',J:'1234', K:'1017TE',L:'Amsterdam',M:'nl'
    },
    field1
  );
  let fieldNew = new FlexRecordClass();
  fieldNew.fields(_.cloneDeep(field1.data));
  fieldNew.delete(2);

  let diff = field1.diff(fieldNew, {notFoundIsDelete : false});

  it('no update', () => {
    expect(diff.update().length).toEqual(0);
  });
  it('a delete', () => {
    expect(diff.delete().length).toEqual(0);
  })

});

describe('flexRecord.filterByShare', () => {
  let fr = new FlexRecordClass();
  fr.fields(require('../spec/mocks/flexRecord'));
  const shareId = fr.items[0].ref[0].shareRowId;
  it('mark refId', () =>{
    const filtered = fr.markByShare(shareId);
    expect(filtered).toEqual(5);
  })

});
