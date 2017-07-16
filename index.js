"use strict";

/**
 * how it should work:
 */

const fieldClass = require('./lib/fieldContainer');

let field1 = new fieldClass();
let index = field1.add('nr1', "telephone", {value: "+31-0610810547"}, ["telephone.mobile"]);

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