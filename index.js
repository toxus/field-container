/**
 * Created by jaap on 10/07/2017.
 */
const rowTemplate = require('./lib/rowTemplate');
const fieldsClass = require('./lib/fieldContainer');
const fields = new fieldsClass();

let template = new rowTemplate();
template.readFile('../spec/rowTemplate.json');

fields.clear();
var cnt = fields.count();
fields.importRow(
  {
    A: '12345',B:'John',C:'the',D:'Bastard',E:'Google',F:'john@checkit.com',G:'0612345678',H:'',I:'Nowhere',J:'1234', K:'1017TE',L:'Amsterdam',M:'nl'
  },
  template
);

cnt = fields.count()
