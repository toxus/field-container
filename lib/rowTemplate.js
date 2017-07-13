/**
 * Class the defines how a row in converted into a fieldContainer
 *
 * version 0.0.1 jvk 2017-07-12
 */

const jsonFile = require('jsonfile');
const fs = require('fs');
const Joi = require('joi');

class rowTemplate {

  constructor() {
    this._template = {
      startRow: 0,
      columns: []
    }
  }

  /**
   * validate a template
   *
   * @param template
   * @return {boolean}
   * @private
   */
  _validate(template) {
    const schema = Joi.object().keys({
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
    const {error, value} =  Joi.validate(template, schema);
    if (error) {
      throw new Error(error);
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
    var template = jsonFile.readFileSync(filename);
    return this.template(template);
  }


  columnCount() {
    return this._template.columns.length;
  }
  column(index) {
    return this._template.columns[index];
  }

}

module.exports = rowTemplate;