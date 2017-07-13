/**
 * Created by jaap on 13/07/2017.
 */
const Joi = require('joi');

class fieldBase {

  constructor(container) {
    //   assert.ok(!!container, 'The field should have a container');
    this.fieldContainer = container;
  }

  options() {
    return this.fieldContainer.options();
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
    this.fieldContainer.addError('error', fieldName, message);
  }
  addWarning(fieldName, message) {
    this.fieldContainer.addError('warn', fieldName, message);
  }
}

module.exports = fieldBase;