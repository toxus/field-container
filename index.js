
const fieldContainerClass = require('./lib/fieldContainer');
const rowTemplateClass = require('./lib/rowTemplate');


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
let undo = field3.patch(diff2);
