/**
 * container that stores the changes on a fieldContainer
 */


class fieldDiff {

  constructor() {
    this.clear();
  }

  clear() {
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
   * returns true if there is something to do
   * @return {boolean}
   */
  hasAction() {
    return this._actions.add.length > 0 || this._actions.update.length > 0 || this._actions.delete.length > 0;
  }

}

module.exports = fieldDiff;