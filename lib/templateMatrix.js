/**
 * The base class for all templates that the conversion from a matrix (row base) data
 * into the field constructor
 *
 *
 */
// const recordTemplateClass = require('./recordTemplate');
const Joi = require('joi');
const jsonFile = require('jsonfile');
const fs = require('fs');
const FieldNamespace = require('./fieldTypes');
const _ = require('lodash');

class templateMatrix {// extends recordTemplateClass {

  constructor() {
    //super();
    this._template = {
      startRow: 0,
      columns: []
    }
  }

  /**
   * return the schema to validate the template.
   */
  schema() {
    return Joi.object().keys({
      sheet : Joi.string(),
      startRow : Joi.number().integer(),
      columnNames : Joi.object(),
      columns : Joi.array().items(
        Joi.object().keys({
          fieldType: Joi.string().required(),
          select: Joi.string(),
          usage: Joi.array().items(
            Joi.string()
          ),
          fieldName : Joi.string().required(),
          required: Joi.number().integer(),
          data: Joi.object().required()
        }).required()
      )
    });
  }



  /**
   * validate a template
   *
   * @param template
   * @return {boolean}
   * @private
   */
  _validate(template) {
    const {error, value} =  Joi.validate(template, this.schema());
    if (error) {
      throw new Error(error);
    }
    // check that the fieldNames are unique
    let names = {};
    for (let l = 0; l < template.columns.length; l++) {
      let name = template.columns[l].fieldName;
      if (typeof names[name] !== 'undefined') {
        throw new Error(`the field ${name} is used multiple times`);
      }
      names[name] = true;
    }
    return true;
  }

  /**
   * set/get the template
   *
   * @param tmpl
   * @return the template
   */
  template(tmpl) {
    if (typeof tmpl !== 'undefined') {
      if (!this._validate(tmpl)) {
        throw new Error(`template is not valid`);
      }
      this._template = tmpl;
    }
    return this._template;
  }

  /**
   * read the definition from an JSON file
   *
   * @param filename
   * @returns template
   */
  readFile(filename) {
    if (filename[0] !== '/') {
      filename = __dirname + '/' + filename;
    }
    if (!fs.existsSync(filename)) {
      throw new Error(`file does not exist: ${filename}`);
    }
    const template = jsonFile.readFileSync(filename);
    return this.template(template);
  }

  /**
   * read the template from a json string
   * @param text
   */
  jsonString(json) {
    var template = JSON.parse(json);
    return this.template(template);
  }

  /**
   * set / get the template as an object
   * @param tmpl Object
   * @returns the active template
   */
  object(tmpl) {
    if (typeof tmpl !== 'undefined') {
      return this.template(tmpl);
    }
    return this.template();
  }
  /**
   * import one record
   * @param data     raw object of data
   * @param record  flexRecord
   */
  import(data, record) {
    for (let l = 0; l < this.columnCount(); l++) {
      let fieldDef = this.column(l);
      let row = {};
      for (let valueKey of Object.keys(fieldDef.data)) {
        let key = fieldDef.data[valueKey];
        const isOptional = key.charAt(key.length-1) === '?';
        if (isOptional) {
          key = valueKey.substr(0, valueKey.length -1);
        }
        if (typeof data[key] === 'undefined') {
          if (!isOptional) {
            record.addError('error', fieldDef.fieldName, `unknown fieldname ${key}`);
          }
        } else {
          row[valueKey] = data[key];
        }
      }
      if (! _.isEqual(row, {})) {
        record.add(fieldDef.fieldName, fieldDef.fieldType, row, fieldDef.usage);
      }
    }
  }

  /**
   * export the information into it's raw version
   * @param record FlexRecord
   * @return {*}
   */
  export(record, options = {}) {
    function findField(name) {
      for (let l = 0; l < record.items.length; l++) {
        if (record.items[l].refId == name) {
          return record.items[l];
        }
      }
      return false; // not found
    }

    function findSelectField(usage, type) {
      let tmpVal = false;
      for (let l = 0; l < record.items.length; l++) {
        if (record.items[l].refId) {  // only in our segment
          if (record.items[l].fieldType === type) {
            if (record.items[l].usage.indexOf(usage) >= 0) {
              return record.items[l];
            } else if (tmpVal === false) {  // remember first on if not found
              tmpVal = record.items[l];
            }
          }
        }
      }
      return tmpVal; // not found

    }
    // ------------------------
    if (typeof options.skipNotFound === 'undefined') {
      options.skipNotFound = true;
    }
    let result = {};
    for (let l = 0; l < this.columnCount(); l++) {
      let fieldDef = this.column(l);
      // we need to find the field that we want to export
      let dataField;
      if (typeof fieldDef.select !== 'undefined') { // we have to select a field
        dataField = findSelectField(fieldDef.select, fieldDef.fieldType);
      } else { // it's bound by field name
        dataField = findField(fieldDef.fieldName);
      }
      if (dataField) { // we have got it, so
        for (let key of Object.keys(fieldDef.data)) {
          if (typeof dataField.data[key] !== 'undefined') {
            result[fieldDef.data[key]] = dataField.data[key];
          } else {
            result[fieldDef.data[key]] = '';
          }
        }
      } else if (options.skipNotFound == false) {
        for (let key of Object.keys(fieldDef.data)) {
          result[fieldDef.data[key]] = '';
        }
      }
    }
    return result;
  }


  columnCount() {
    return this._template.columns.length;
  }
  column(index) {
    return this._template.columns[index];
  }

  /**
   *
   * @param template
   * @return string: the error message, true: is valid
   */
  validate(template) {
    try {
      this._validate(template);
      return true;
    } catch(err) {
//      console.log(err);
      return err.message;
    };
  }
}

module.exports = templateMatrix;