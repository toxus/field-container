/**
 * Created by jaap on 10/07/2017.
 */
"use strict";

const fieldDiffClass = require('./fieldDiff');
const _ = require('lodash');

class fieldContainer {

  /**
   *
   * @param options -> { countryCode : 'nl' }
   */
  constructor(options) {
    if (typeof options === 'undefined') {
      this._options = {}
    } else {
      this._options = options;
    }
    if (typeof this._options.languages === 'undefined') {
      this._options.languages = ['nl','en','de','fr','es','sv','fi','pt','et','ar']
    }
    if (typeof this._options.countryCode === 'undefined') {
      this._options.countryCode = 'NL'
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
    if (typeof index === 'string') {
      if (typeof this._keys[index] === 'undefined') {
        return false;
      }
      index = this._keys[index];
    }
    this._validateIndex(index);
    return this._fields[index];
  };

  /**
   * get or set the field definition
   * @param rawFields
   * @return {*|Array}
   */
  fields(rawFields) {
    if (typeof rawFields !== 'undefined') {
      this._fields = rawFields;
      this._keys = {};
      this._id = null;
      for (let l = 0; l < this._fields.length; l++) {  // rebuild fast search
        this._keys[this._fields[l].id] = l;
        if (this._fields[l].type === 'id') {
          //this.id(this._fields[l].data.value);
          this._id = this._fields[l].data.value;
        }
      }
    }
    return this._fields;
  }

  get data() {
    return this._fields;
  }
  /**
   * returns all keys of the fields
   * @return {{}|*}
   */
  keys() {
    return this._keys;
  }

  /**
   * return the id last id field of the collection
   * is set when the field(...) is set
   *
   * @param newId
   * @returns {null|*} null: not set
   */
  get id() {
    return this._id;
  }

  /*
  id(newId) {
    if (typeof newId !== 'undefined') {
      this._id = newId;
    }
    return this._id;
  }
  */


  /**
   * add a new field to the list and returns the index
   * @param name string or full object
   * @param type
   * @param data
   *
   */
  add(name, type, data, usage) {
    if (typeof this._cleaner === 'undefined') {
      let cleanerClass = require('./fieldCleaner')
      this._cleaner = new cleanerClass(this);
    }

    let result;

    if (typeof name === 'string') {
      result = {
        id: name,
        usage: usage,
        fieldType: type,
        data: data
      };
    } else {
      result = name;
    }
    try {
      this._cleaner.standardize(result);
    } catch(err) {
      this.addError('error', result.id, err);
      return false;
    }
    this._fields.push(result);
    this._keys[result.id] = this._fields.length - 1; // store the names
    if (type === 'id') {
      if (this._id !== null) {
        this.addError('warning', result.id, 'reseting this.id');
      } else if (typeof result.data.value === 'undefined') {
        this.addError('error', result.id, 'missing id.data.value field');
      } else {
        this._id = data.value;
      }
    }
    return this._fields.length - 1;
  }

  /**
   * removes element from the array
   *
   * @param index
   * @return fieldItem
   */
  delete(index) {
    if (typeof index === 'string') {
      if (typeof this._keys[index] === 'undefined') {
        throw new Error('unknown field');
      }
      index = this._keys[index];
    }
    this._validateIndex(index);
    delete this._keys[this._fields[index].id];
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
  /*
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
  */
  _compareArrays(a1, a2) {
    return _.isEqual(a1,a2);
    // https://stackoverflow.com/questions/7837456/how-to-compare-arrays-in-javascript
    if (typeof a1 === 'undefined' && typeof a2 === 'undefined') {
      return true;
    }
    return
      //typeof a1 !== 'undefined' &&
      //typeof a2 !== 'undefined' &&
      a1.length == a2.length &&
      a1.every( (v,i) => {
        v == a2[i]
      });
  }

  /**
   * calculate the difference to go from this to that
   * it returns the instruction to update this record so it will become the that record
   * which can be execute by the field.patch(...)
   *
   * @param fields fieldContainer
   * @returns fieldDiff
   */
  diff(that) {

    /**
     * returns true if something changed
     * @param useFrom
     * @param useTo
     * @returns {*}
     */
    function usageCompare( useFrom, useTo) {
      if (typeof useFrom === 'undefined') {
        return (typeof useTo !== 'undefined');        // from nothing to something
      } else if (typeof useTo === 'undefined') {
        return (typeof useFrom !== 'undefined');      // from something to nothing
      }
      if (useFrom.length != useTo.length) {
        return true;
      }
      return ! _.isEqual(useFrom.sort(), useTo.sort());
    }


    let fieldDiff = new fieldDiffClass();
    for (let l = 0; l < that.count(); l++) {
      // check that all fields in this are stored in that
      let thatField = that.get(l);
      let thisField = this.get(thatField.id);
      if (thisField === false) {
        fieldDiff.add(thatField);
      } else {
        if (thatField.type !== thisField.type) {
          fieldDiff.update(thatField, 'type');
        } else if (!_.isEqual(thisField.data, thatField.data)) {
          fieldDiff.update(thatField, 'data');
        } else if (usageCompare(thisField.usage, thatField.usage)) {  //
          fieldDiff.update(thatField, 'usage');
        }
      }
    }
    for (let l = 0; l < this.count(); l++) {
      let thisField = this.get(l);
      if (that.get(thisField.id) === false) {
        fieldDiff.delete(thisField)
      }
    }
    fieldDiff.rowId(this.id);
    return fieldDiff;
  }

  /**
   * update the current field definition by the patch created
   *
   * @param diff fieldDiff
   * @return path to undo this patch
   */
  patch(diff) {
    let patch = new fieldDiffClass();
    // add the new fields
    for (let l = 0; l < diff.add().length; l++) {
      let add = diff.add()[l];
      if (typeof this._keys[add.field.id] !== 'undefined') {
        this.addError('error', add.field.id, 'duplicate id')
      } else {
        this._fields.push(add.field);
        this._keys[add.field.id] = this.count() - 1;
        patch.delete(add.field);  // reverse of add is delete
      }
    }

    // update the existing ones
    for (let l = 0; l < diff.update().length; l++) {
      let upd = diff.update()[l];
      if (typeof this._keys[upd.field.id] === 'undefined') {
        this.add('error', upd.field.id, 'missing field to update');
      } else {
        let index = this._keys[upd.field.id];
        patch.update(this._fields[index], 'patch');
        this._fields[index] = upd.field;
      }
    }

    // remove the deleted fields
    for (let l = 0; l < diff.delete().length; l++) {
      let del = diff.delete()[l];
      patch.add(del);
      if (typeof this._keys[del.field.id] === 'undefined') {
        this.add('error', del.field.id, 'missing field to delete');
      } else {
        let index = this._keys[del.field.id];
        this.delete(index);
      }
    }
    return patch;
  }

  addError(type, field, message) {
    if (typeof message === 'object') {
      try {
        this._errors.push({type: type, field: field, message: message.message});
      } catch(e) {
        this._errors.push({type: type, field: field, message: 'can not set message:' + message});
      }
    } else {
      this._errors.push({type: type, field: field, message: message});
    }
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