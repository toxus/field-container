/**
 * Created by jaap on 10/07/2017.
 */


var fieldNamespace = {};
fieldNamespace._container = this.container;
fieldNamespace.text = require('./fields/fieldText');
fieldNamespace.id = require('./fields/fieldId');
fieldNamespace.email = require('./fields/fieldEmail');
fieldNamespace.name = require('./fields/fieldName');
fieldNamespace.telephone = require('./fields/fieldTelephone');
fieldNamespace.address = require('./fields/fieldAddress');

module.exports = fieldNamespace;