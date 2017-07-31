/**
 * Created by jaap on 13/07/2017.
 */

"use strict";

const fieldBase = require('./fieldBase');
const Joi = require('joi');

class fieldText extends fieldBase {
  name() {
    return 'text'
  }
  parse(field) {
    if (typeof field.data === 'undefined' ) {              // need data
      field.data = {};
    } else if (typeof field.data.value === 'undefined') { // must only have value
      field.data = {};              // remove it
    } else {
      field.data.value = field.data.value.trim(); // remove space, etc
      if (field.data.value.length === 0) {  // if no length
        field.data = {};                    // remove it
      }
    }
    return field.data;
  }

  validate(field) {
    const schema = Joi.object().keys({
      data: Joi.object().keys({
        value: Joi.string()     // not required because we can remove the information
      }).required()
    });
    return this.checkSchema(field, schema);
  }
  hasData(field) {
    //return field.data.value.trim().length > 0;
    return field.data.value ? (field.data.value.trim().length > 0) : false;
  }
}

module.exports = fieldText;