/**
 * Created by jaap on 10/07/2017.
 */
'use strict';

const fieldContainerClass = require('../lib/fieldContainer');
const rowTemplateClass = require('../lib/rowTemplate');

describe("fieldContainer", function() {


  describe("field manipulations:", function() {
    describe('adding and removing', function() {
      const fields = new fieldContainerClass();
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
      const fields = new fieldContainerClass();

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
    const fieldRow = new fieldContainerClass();

    let template = new rowTemplateClass();
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
      expect(fieldRow.get('id').name).toEqual('id');
      expect(fieldRow.get('telephone').name).toEqual('telephone');
      expect(fieldRow.get('not a field')).toEqual(false);
    });
  });

  describe('test delete', function() {
    const fieldRow = new fieldContainerClass();

    let template = new rowTemplateClass();
    template.readFile('../spec/rowTemplate.json');

    fieldRow.clear();

    expect(fieldRow.count()).toEqual(0);
    fieldRow.importRow(
      {
        A: '12345',B:'John',C:'the',D:'Bastard',E:'Google',F:'john@checkit.com',G:'0612345678',H:'',I:'Nowhere',J:'1234', K:'1017TE',L:'Amsterdam',M:'nl'
      },
      template
    );

    fieldRow.delete(2);
    fieldRow.delete('name');
    it('to remove a field by index', function() {
      expect(fieldRow.count()).toEqual(2);
      expect(fieldRow.get('id').name).toEqual('id');
      expect(fieldRow.get('email').name).toEqual('email');
      expect(fieldRow.get('telephone')).toEqual(false);
    });
  });

  describe('import information with errors', function() {
    const fieldRow = new fieldContainerClass();

    let template = new rowTemplateClass();
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
    const fieldRow = new fieldContainerClass();
    let template = new rowTemplateClass();
    template.readFile('../spec/rowTemplate.json');
    fieldRow.clear();
    expect(fieldRow.count()).toEqual(0);

    fieldRow.importRow(
      {
        A: '12345',B:'John',C:'the',D:'Bastard',E:'Google',F:'john@checkit.com',G:'0612345678',H:'',I:'Nowhere',J:'1234', K:'1017TE',L:'Amsterdam',M:'nl'
      },
      template
    );
    it('to have no errors', function() {
      expect(fieldRow.hasErrors()).toEqual(false);
    });
    it('to have a record id', function () {
      expect(fieldRow.id()).toEqual("12345");
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

 describe('fieldContainer changes', function() {
   const field1 = new fieldContainerClass();
   const field2 = new fieldContainerClass();
   const field3 = new fieldContainerClass();
   const field4 = new fieldContainerClass();
   const field5 = new fieldContainerClass();
   let template = new rowTemplateClass();
   template.readFile('../spec/rowTemplate.json');
   field1.importRow(
     {
       A: '12345',B:'John',C:'the',D:'Bastard',E:'Google',F:'john@checkit.com',G:'0612345678',H:'',I:'Nowhere',J:'1234', K:'1017TE',L:'Amsterdam',M:'nl'
     },
     template
   );
   field2.importRow(
     {
       A: '12345',B:'John',C:'the',D:'Bastard',E:'Google',F:'john@checkit.com',G:'0612345678',H:'',I:'Nowhere',J:'1234', K:'1017TE',L:'Amsterdam',M:'nl'
     },
     template
   );
   field3.importRow(
     {
       A: '12345',B:'John',C:'the',D:'Bastard',E:'Google',F:'john@checkit.com',G:'+31-0612345678',H:'',I:'Nowhere',J:'1234', K:'1017TE',L:'Amsterdam',M:'nl'
     },
     template
   );
   field4.importRow(
     {
       A: '12345',B:'John',C:'the',D:'Bastard',E:'Google',F:'john@checkit.com',G:'0612345678',H:'',I:'Nowhere',J:'1234', K:'1017TE',L:'Amsterdam',M:'nl'
     },
     template
   );
   field5.importRow(
     {
       A: '12345',B:'John',C:'the',D:'Bastard',E:'Google',F:'john@checkit.com',G:'0612345678',H:'',I:'Nowhere',J:'1234', K:'1017TE',L:'Amsterdam',M:'nl'
     },
     template
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
     expect(diff2.update()[0].field.data.value).toEqual('+31-0612345678');
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
     expect(diff3.add()[0].field.name).toEqual('telephone2');
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
   })
 });

describe('fieldContainer patching', function() {
  const field1 = new fieldContainerClass();
  const field2 = new fieldContainerClass();
  const field3 = new fieldContainerClass();
  const field4 = new fieldContainerClass();
  const field5 = new fieldContainerClass();
  let template = new rowTemplateClass();
  template.readFile('../spec/rowTemplate.json');
  field1.importRow(
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
    template
  );
  field2.importRow(
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
    template
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
    expect(field3.get("telephone2").data.value).toEqual('12345')
    expect(field3.get('email').data.value).toEqual('test@checkit.com')
  });
  it('has one update and one add', function() {
 //   expect(undo).toEqual(1);
    expect(undo.update().length).toEqual(1);
    expect(undo.delete().length).toEqual(1);
    expect(undo.add().length).toEqual(0);
  });
});

