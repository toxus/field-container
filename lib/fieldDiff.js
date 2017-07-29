/**
 * container that stores the changes on a flexRecord
 */
"use strict";

const _ = require('lodash');

class fieldDiff {

  constructor() {
    this.clear();
  }

  clear() {
    this._errors = [];
    this._rowId = false;
    this._actions = {
      add: [],
      update: [],
      delete: []
    }
  }
  /**
   * the field should be added to the other container
   * @param field
   */
  add(field) {
    if (typeof field !== 'undefined') {
      this._actions.add.push({field: field})
    }
    return this._actions.add;
  }

  /**
   * replace the field with this information.
   * @param field the new values
   * @param reason what did change
   */
  update(field, reason) {
    if (typeof field !== 'undefined') {
      this._actions.update.push({field: field, reason: reason});
    }
    return this._actions.update;
  }

  /**
   * remove the field from the store
   * @param field
   * @param reason
   */
  delete(field) {
    if (typeof field !== 'undefined') {
      this._actions.delete.push({field: field});
    }
    return this._actions.delete;
  }

  /**
   * can be anything, but identifies the current patch to a row
   *
   * @param value any
   * @returns any
   */
  rowId(value) {
    if (typeof value !== 'undefined') {
      this._rowId = value;
    }
    return this._rowId;
  }
  /**
   * returns true if there is something to do
   * @return {boolean}
   */
  hasAction() {
    return this._actions.add.length > 0 || this._actions.update.length > 0 || this._actions.delete.length > 0;
  }

  /**
   * execute this patch on the row. Row is the flexRecord.fields
   * returns the undo information
   * 
   * @param rowData array of fields
   * @param origin String: the value to set on the origin field.
   * @param options Object configuration settings (fieldname: '..')
   */
  exec(rowData, origin, options) {

    /**
     * finds the rowIndex for this fieldname
     *
     * this could be cached if it seems to slow, but is more code.....
     *
     * @param fieldname
     * @returns {number|boolean} false if not found
     */
    function findField(fieldname) {
      for (let rowIndex = 0; rowIndex < rowData.length; rowIndex++) {
        if (rowData[rowIndex][options.fieldname] == fieldname) {
          return rowIndex;
        }
      }
      return false;
    }

    /**
     * copy only then fields defined in data into the field
     *
     * @param field
     * @param data
     */
    function writeInfo(field, data) {
      for (let key of Object.keys(data)) {
        field[key] = _.cloneDeep(data[key]);  // make a copy of it
      }
    }

    this._errors = [];

    let undo = new fieldDiff();
    if (typeof options === 'undefined') { options = {}; }
    if (typeof options.fieldname === 'undefined') {options.fieldname = 'id'}

    // add the new fields
    for (let l = 0; l < this.add().length; l++) {
      let add = this.add()[l];
      if (findField(add.field.id) !== false) {
        this._errors.push({ type: 'error', fieldname: add.field.id, message:'duplicate field' });
      } else {
        add.field.origin = origin;
        undo.delete(add.field);  // reverse of add is delete
        rowData.push(add.field);
      }
    }

    // update the existing ones
    for (let l = 0; l < this.update().length; l++) {
      let upd = this.update()[l];
      const index = findField(upd.field.id);
      if (index === false) {
        this._errors.push({ type: 'error', fieldname: upd.field.id, message:'missing update field' });
      } else {
        undo.update(rowData[index], 'undo');
        // rowData[index] = upd.field;
        writeInfo(rowData[index], upd.field);
      }
    }

    // remove the deleted fields
    for (let l = 0; l < this.delete().length; l++) {
      let del = this.delete()[l];

      let index = findField(del.field.id);
      if (index === false) {
        this._errors.push({ type: 'error', fieldname: del.field.id, message:'missing delete field' });
      } else {
        undo.add(del);
        rowData.splice(index, 1);
      }
    }

    return undo;    
  }

  hasErrors() {
    return this._errors.length > 0;
  }
  get errors (){
    return this._errors;
  }
  /**
   * get / set the data of the class
   * @param diff the object to set
   * @returns object
   */
  obj(diff) {
    if (typeof diff !== 'undefined') {
      this._actions = {
        add: diff.add,
        update: diff.update,
        delete: diff.delete
      };
      this._rowId = diff._rowId
    }

    return {
      add : this._actions.add,
      update: this._actions.update,
      delete: this._actions.delete,
      rowId : this._rowId
    }
  }
}

module.exports = fieldDiff;