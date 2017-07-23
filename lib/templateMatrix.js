/**
 * The base class for all templates that the conversion from a matrix (row base) data
 * into the field constructor
 *
 *
 */
const recordTemplateClass = require('./recordTemplate');
const Joi = require('joi');
const jsonFile = require('jsonfile');
const fs = require('fs');

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
          type: Joi.string().required(),
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
    let names = {}
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
   * @param data
   * @param record
   */
  import(data, record) {
    for (let l = 0; l < this.columnCount(); l++) {
      let fieldDef = this.column(l);
      let row = {};
      for (let valueKey of Object.keys(fieldDef.data)) {
        if (typeof data[fieldDef.data[valueKey]] === 'undefined') {
          record.addError('error', fieldDef.fieldName, `unknown fieldname ${fieldDef.data[valueKey]}`);
        } else {
          row[valueKey] = data[fieldDef.data[valueKey]];
        }
      }
      record.add(fieldDef.fieldName, fieldDef.type, row, fieldDef.usage);
    }
  }

  columnCount() {
    return this._template.columns.length;
  }
  column(index) {
    return this._template.columns[index];
  }
}

module.exports = templateMatrix;