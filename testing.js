"use strict";

/**
 * how it should work:
 */

const templatMatrixClass = require('./lib/templateMatrix');
const template = new templatMatrixClass();
const RecordClass = require('./lib/fieldContainer');
const FieldDiffClass = require('./lib/fieldDiff');


const origin = '123123';
let diff2 = new FieldDiffClass();
let fields2 = new RecordClass();
diff2.add( {id:'someField', text: 'someInfo'});
diff2.add( {id:'otherField', text: 'Nr 14'})
;
diff2.exec(fields2.fields(), origin);

let diff3 = new FieldDiffClass();
diff3.delete({id:'otherField'});
diff3.exec(fields2.fields(), origin);
console.log(fields2.fields());

/*
template.readFile('../spec/template.json');
let rec = new RecordClass();
const data =
  {
    A: '1234', B:'Jaap',C:'van der', D:'Kreeft',E:'Toxus',F:'info@example.com',G:'0612345678',H:'',I:'Eerste weg',J:'12',K:'1017TE',L:'Adam', M:'NL'
  };
template.import(data, rec);
console.log(rec.get('telephone'));
*/
/*
const fieldClass = require('./lib/fieldContainer');

let field1 = new fieldClass();
let index = field1.add('nr1', "telephone", {value: "+31-0610810547"}, ["telephone.mobile"]);
*/
/*


 function updateRecord() {
 let share = findShare();

 let record = new fieldClass();
 let template = new templateClass();
 template.readFile('./spec/rowTemplate.json');

 // we now have bufer to import the information
 record.importRow(jsonData, template);
 record.stardardize();

 // now we have the standard record that can be written to disk
 // find the existing record
 findShareData(share, record).then((shareData) => {

 }).catch( (err) => {

 });
 }

 */