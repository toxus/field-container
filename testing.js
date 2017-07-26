"use strict";

/**
 * how it should work:
 */

const templatMatrixClass = require('./lib/templateMatrix');
const template = new templatMatrixClass();
const RecordClass = require('./lib/fieldContainer');

template.readFile('../spec/template.json');
let rec = new RecordClass();
const data =
  {
    A: '1234', B:'Jaap',C:'van der', D:'Kreeft',E:'Toxus',F:'info@example.com',G:'0612345678',H:'',I:'Eerste weg',J:'12',K:'1017TE',L:'Adam', M:'NL'
  };
template.import(data, rec);
console.log('err:', rec.hasErrors());
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