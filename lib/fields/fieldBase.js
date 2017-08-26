/**
 * Created by jaap on 13/07/2017.
 */

"use strict";
const Joi = require('joi');
const _ = require('lodash');

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

  usageCompare( useFrom, useTo) {
    if (typeof useFrom === 'undefined') {
      return  ! (typeof useTo === 'undefined' || useTo.length === 0);        // from nothing to something
    } else if (typeof useTo === 'undefined') {
      return ! (typeof useFrom === 'undefined' || useFrom.length === 0);      // from something to nothing
    }
    if (useFrom.length !== useTo.length) {
      return true;
    }
    return ! _.isEqual(useFrom.sort(), useTo.sort());
  }
  /**
   * compares the value of two fields
   * @param field
   */
  isEqual(field) {
    return this.usageCompare(field.usage, this.usage);
  }
}

module.exports = fieldBase;