/**
 * Created by jaap on 13/07/2017.
 */

"use strict";
const Joi = require('joi');

class fieldBase {

  constructor(container) {
    //   assert.ok(!!container, 'The field should have a container');
    this.flexRecord = container;
  }

  options() {
    return this.flexRecord.options();
  }
  name() {
    return 'base';
  }

  /**
   * validate that only the allowed fields are stored
   *
   * @return {boolean}
   */
  validate(field) {
    return true;
  }
  checkSchema(field, schema) {
    const {error, value} = Joi.validate(field, schema);
    if (error) {
      throw new Error(error)
    }
    return true;
  }

  parse(field) {
    // does nothing but removing the data
    field.data = {};
  }

  addError(fieldName, message) {
    this.flexRecord.addError('error', fieldName, message);
  }
  addWarning(fieldName, message) {
    this.flexRecord.addError('warn', fieldName, message);
  }

  /**
   * checks if the data is valid. Standard never valid
   *
   * @param field
   * @returns {boolean}
   */
  hasData(field) {
    return false;
  }
}

module.exports = fieldBase;