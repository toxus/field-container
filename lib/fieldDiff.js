/**
 * container that stores the changes on a fieldContainer
 */
"use strict";

class fieldDiff {

  constructor() {
    this.clear();
  }

  clear() {
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