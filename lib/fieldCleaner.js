/**
 * Created by jaap on 10/07/2017.
 */
"use strict";
const fieldNamespace = require('./fieldTypes');

class fieldCleaner {
  /**
   *
   * @param container fieldContainer
   */
  constructor(fields) {
    this._fields = fields;
    this._loadFieldTypes();
  }

  _loadFieldTypes() {
    this._fieldTypes = {};
    for (let key of Object.keys(fieldNamespace)) {
      if (key[0] !== '_') {
        this._fieldTypes[key] = new fieldNamespace[key](this._fields);
      }
    }
  };

  /**
   * scan all the field and formats them as expected
   *
   * @param fields fieldContainer
   */
  parse(fields) {
    for (let l = 0; l < fields.count(); l++) {
      let field = fields.get(l);
      if (typeof this._fieldTypes[field.fieldType] === 'undefined') {
        fields.addError('error', field.id, `unknown field type: '${field.fieldType}'`);
      } else {
        this._fieldTypes[field.fieldType].parse(field);
      }
    }
  }

  /**
   *
   * @param field
   * @returns if the field holds valid data
   */
  hasData(field) {
    if (typeof this._fieldTypes[field.fieldType] === 'undefined') {
      throw new Error(`unknown field type: '${field.fieldType}'`);
    } else {
      return this._fieldTypes[field.fieldType].hasData(field);
    }
  }
  /**
   * cleans one field
   *
   * @param field
   */
  standardize(field) {
    if (typeof this._fieldTypes[field.fieldType] === 'undefined') {
      throw new Error(`unknown field type: '${field.fieldType}'`);
    } else {
      this._fieldTypes[field.fieldType].parse(field);
    }
  }
}

module.exports = fieldCleaner;