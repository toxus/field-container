/**
 * Created by jaap on 10/07/2017.
 *
 * version 2.0: Uses the ref instead of refId
 *
 * ref: [
 *  { shareRowId : '123', rowId: '44', refId: '77' },
 *  { shareRowId : '565', rowId: 'dd', refId: '88' } *
 * ]
 * So the field can belong to multiple shares
 *
 *
 */
"use strict";

const fieldDiffClass = require('./fieldDiff');
const _ = require('lodash');
const CleanerClass = require('./fieldCleaner');


class flexRecord {

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
        this._keys[this._fields[l].refId] = l;
        if (this._fields[l].fieldType === 'id') {
          //this.id(this._fields[l].data.value);
          this._id = this._fields[l].data.value;
        }
      }
    }
    return this._fields;
  }

  get items() {
    return this._fields;
  }
  /**
   * returns the internal array
   * @returns {Array|*}
   */
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

  /**
   * hard one: set the internal and fields id
   * @param id {null|*} null: not set
   */
  set id(id) {
    for (let l = 0; l < this._fields.length; l++) {  // rebuild fast search
      if (this._fields[l].fieldType === 'id') {
        this._fields[l].data.value = id;
        this._id = id;
        return;
      }
    }
    // not found, so we insert an id field on the first position
    this._id = null;
    const f = this.add('id', 'id', { value: id}, []);
  }

  get cleaner() {
    if (typeof this._cleaner === 'undefined') {
      this._cleaner = new CleanerClass(this);
    }
    return this._cleaner;
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
        refId: name,
        usage: usage,
        fieldType: type,
        data: data
      };
    } else {
      result = name;
    }
    try {
      this.cleaner.standardize(result);
    } catch(err) {
      this.addError('error', result.id, err);
      return false;
    }
    this._fields.push(result);
    this._keys[result.refId] = this._fields.length - 1; // store the names
    if (type === 'id') {
      if (this._id !== null) {
        this.addError('error', result.refId, 'reseting this.refId');
      } else if (typeof result.data.value === 'undefined') {
        this.addError('error', result.refId, 'missing refId.data.value field');
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
    delete this._keys[this._fields[index].refId];
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
     this.cleaner.parse(this);
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
  }

  /**
   * calculate the difference to go from this to that
   * it returns the instruction to update this record so it will become the that record
   * which can be execute by the field.patch(...)
   *
   * @param fields flexRecord
   * @param options object: notFoundIsDelete : mark the field as delete if no found in that
   * @returns fieldDiff
   */
  diff(that, options) {

    /**
     * returns true if something changed
     * @param useFrom
     * @param useTo
     * @returns {*}
     */
    function usageCompare( useFrom, useTo) {
      if (typeof useFrom === 'undefined') {
        return  ! (typeof useTo === 'undefined' || useTo.length === 0);        // from nothing to something
      } else if (typeof useTo === 'undefined') {
        return ! (typeof useFrom === 'undefined' || useFrom.length === 0);      // from something to nothing
      }
      if (useFrom.length != useTo.length) {
        return true;
      }
      return ! _.isEqual(useFrom.sort(), useTo.sort());
    }

    /**
     * returns true if the field has valid data. Otherwise the field will be deleted
     * @param field
     */
    function hasData(cleaner, field) {
      return cleaner.hasData(field);
    }

    if (typeof options === 'undefined') { options = {} };
    if (typeof options.notFoundIsDelete === 'undefined') { options.notFoundIsDelete = true};

    let fieldDiff = new fieldDiffClass();
    // the rowId of this and that should be equal (we are working on the same record)
    // for new record this id is not yet set
    this._id = that.id;
    // do the same for the diff, because the id field might not be included
    fieldDiff.rowId(that.id);

    for (let l = 0; l < that.count(); l++) {
      // check that all fields in this are stored in that
      let thatField = that.get(l);
      let thisField = this.get(thatField.refId);
      if (thisField === false) {
        fieldDiff.add(thatField);
      } else {
        if (thatField.fieldType !== thisField.fieldType) {
          fieldDiff.update(thatField, 'type');
        } else if (!_.isEqual(thisField.data, thatField.data)) {
          if (hasData(this.cleaner, thatField)) {
            fieldDiff.update(thatField, 'data');
          } else {
            fieldDiff.delete(thisField);  // field not valid anymore
          }
        } else if (usageCompare(thisField.usage, thatField.usage)) {  //
          fieldDiff.update(thatField, 'usage');
        }
      }
    }
    if (options.notFoundIsDelete) { // the sets must have the same fields. that is not a subset
      for (let l = 0; l < this.count(); l++) {
        let thisField = this.get(l);
        if (that.get(thisField.refId) === false) {
          fieldDiff.delete(thisField)
        }
      }
    }
    fieldDiff.rowId(this.refId);
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
      if (typeof this._keys[add.field.refId] !== 'undefined') {
        this.addError('error', add.field.refId, 'duplicate refId')
      } else {
        this._fields.push(add.field);
        this._keys[add.field.refId] = this.count() - 1;
        patch.delete(add.field);  // reverse of add is delete
      }
    }

    // update the existing ones
    for (let l = 0; l < diff.update().length; l++) {
      let upd = diff.update()[l];
      if (typeof this._keys[upd.field.refId] === 'undefined') {
        this.add('error', upd.field.refId, 'missing field to update');
      } else {
        let index = this._keys[upd.field.refId];
        patch.update(this._fields[index], 'patch');
        this._fields[index] = upd.field;
      }
    }

    // remove the deleted fields
    for (let l = 0; l < diff.delete().length; l++) {
      let del = diff.delete()[l];
      patch.add(del);
      if (typeof this._keys[del.field.refId] === 'undefined') {
        this.add('error', del.field.refId, 'missing field to delete');
      } else {
        let index = this._keys[del.field.refId];
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

  /**
   * filters the fields so only comparing the refId will be limited to the defined share and rowId
   * If parameters are ommited it will remove the existing refId.
   * 
   * @param shareId
   * @return the number of marked fields
   */
  markByShare(shareId = false) {
    let count = 0;
    for (let l = 0; l < this._fields.length; l++) {
      if (typeof this._fields[l].ref !== 'undefined') {
        for (let rId = 0; rId < this._fields[l].ref.length; rId++) {
          if (this._fields[l].ref[rId].shareRowId == shareId) {
            this._fields[l].refId = this._fields[l].ref[rId].refId;
            count++;
          } else if (typeof this._fields[l].refId !== 'undefined') {
            delete this._fields[l].refId;
          }
        }
      } else if (typeof refId !== 'undefined') {
        delete this._fields[l].refId;
      }
    }
    return count;
  }

  /**
   * returns an array of fields of a specific type.
   *
   * @param fieldType
   * @param options   - markedOnly (default true) only the marked are checked
   * @return {Array} for Field
   */
  findByType(fieldType, options = {}) {
    let result = [];
    if (typeof options.markedOnly === 'undefined') {
      options.markedOnly = true;
    }
    for (let l = 0; l < this.items.length; l++) {
      if (this.items[l].fieldType == fieldType) {
        if (options.markedOnly == false || ((options.markedOnly && this.items[l].refId))) {
          result.push(this.items[l]);
        }
      }
    }
    return result;
  }

}


module.exports = flexRecord;