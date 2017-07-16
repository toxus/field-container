/**
 * Class the defines how a row in converted into a fieldContainer
 *
 * version 0.0.1 jvk 2017-07-12
 */
"use strict";

const jsonFile = require('jsonfile');
const fs = require('fs');
const Joi = require('joi');
const templateMatrixClass = require('./templateMatrix');


class rowTemplate extends recordTemplateClass {

  constructor() {
    super();
    this.template.sheet = '';
  }

}

module.exports = rowTemplate;