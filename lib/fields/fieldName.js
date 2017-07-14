/**
 * Created by jaap on 13/07/2017.
 */
"use strict";

const baseType = require('./fieldBase');
const Joi = require('joi');

class fieldName extends baseType {
  name() {
    return 'name'
  }
  validate(field) {
    const { error, value} = Joi.object().keys({
      firstName : Joi.string().max(100),
      prefix: Joi.string().max(20),
      lastName: Joi.string().max(100),
      company: Joi.string().max(100)
    })
  }

  /**
   * remove any not wanted information
   * @param field
   */
  parse(field) {
    let data = {};
    if (field.data.firstName) {
      data.firstName = field.data.firstName
    }
    if (field.data.prefix) {
      data.prefix = field.data.prefix;
    }
    if (field.data.lastName) {
      data.lastName = field.data.lastName;
    }
    if (field.data.company) {
      data.company = field.data.company;
    }
    field.data = data;
  }

}

module.exports = fieldName;
