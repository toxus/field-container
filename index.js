
const fieldContainerClass = require('./lib/fieldContainer');
const rowTemplateClass = require('./lib/rowTemplate');


const field1 = new fieldContainerClass();
const field2 = new fieldContainerClass();
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

field2.delete('telephone');
let diff = field1.diff(field2);