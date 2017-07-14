/**
 * Created by jaap on 10/07/2017.
 */

class fieldContainer {

  /**
   *
   * @param options -> { countryCode : 'nl' }
   */
  constructor(options) {
    if (typeof options === 'undefined') {
      this._options = {
        countryCode : 'NL',
        languages : ['nl','en','de','fr','es','sv','fi','pt','et','ar']
      };
    } else {
      this._options = options;
    }
    this.clear();
  }

  /**
   * removes all elements from the container
   */
  clear() {
    this._id = null;
    this._fields = [];
    this._keys = {};
    this._errors = [];
  }

  _validateIndex(index) {
    if (index < 0 || index > this._fields.length - 1) {
      throw new Error(`index out of bounce`);
    }
  }

  /**
   * return the 2 letter country code default to the system
   * @return {string}
   */
  countryCode() {
    return this._options.countryCode;
  }
  options() {
    return this._options;
  }

  count() {
    return this._fields.length;
  };
  get(index) {
    this._validateIndex(index);
    return this._fields[index];
  };
  getByName(name) {
    if (typeof this._keys[name] !== 'undefined') {
      return this._fields[this._keys[name]];
    }
    return false;
  }

  fields() {
    return this._fields;
  }
  keys() {
    return this._keys;
  }

  id(newId) {
    if (typeof newId !== 'undefined') {
      this._id = newId;
    }
    return this._id;
  }
  /**
   * add a new field to the list and returns the index
   * @param name string or full object
   * @param type
   * @param data
   *
   */
  add(name, type, data, usage) {
    let result;

    if (typeof name === 'string') {
      result = {
        name: name,
        usage: usage,
        fieldType: type,
        data: data
      };
    } else {
      result = name;
    }
    this._fields.push(result);
    this._keys[result.name] = this._fields.length - 1; // store the names
    if (type === 'id') {
      if (this._id !== null) {
        this.addError('warning', result.name, 'reseting this.id');
      } else if (typeof result.data.value === 'undefined') {
        this.addError('error', result.name, 'missing id.data.value field');
      } else {
        this._id = data.value;
      }
    }
    return this._fields.length - 1;
  }

  /**
   * removes element from the array
   * @param index
   * @return fieldItem
   */
  delete(index) {
    if (typeof index === 'string') {
      index = this._keys[index];
    }
    this._validateIndex(index);
    delete this._keys[this._fields[index].name];
    let l = 0;
    for (let key of Object.keys(this._keys)) {
      if (l >= index) {
        this._keys[key]--;
      }
      l++;
    }
    return this._fields.splice(index, 1)[0];
  }

  /**
   * cleans all fields and make it standard layout
   *
   */
  stardardize() {
    if (!this._cleaner) {
      let cleanerClass = require('./fieldCleaner');
      this._cleaner = new cleanerClass();
    }
    this._cleaner.parse(this);
  }

  /**
   *
   * @param row the array of columns
   * @param template the rowTemplate
   * @return a row { id: null, fields: [ ... ]
   */
  importRow(row, template) {
    this.clear();
    for (let l = 0; l < template.columnCount(); l++) {
      let fieldDef = template.column(l);
      let data = {};
      for (let valueKey of Object.keys(fieldDef.data)) {
        if (typeof row[fieldDef.data[valueKey]] === 'undefined') {
          this.addError('error', fieldDef.fieldName, `unknown fieldname ${fieldDef.data[valueKey]}`);
        } else {
          data[valueKey] = row[fieldDef.data[valueKey]];
        }
      }
      this.add(fieldDef.fieldName, fieldDef.type, data, fieldDef.usage);
    }
  }



  addError(type, field, message) {
    this._errors.push({type: type, field: field, message: message});
    return this._errors[this._errors.length - 1];
  }
  clearErrors() {
    this._errors.length = 0;
  }
  hasErrors() {
    return this._errors.length > 0;
  }
  errors() {
    return this._errors;
  }
}


module.exports = fieldContainer;