/**
 * Created by jaap on 13/07/2017.
 */

"use strict";

const fieldText = require('./fieldText');

class fieldId extends  fieldText {
  name() {
    return 'id'
  }
}
module.exports = fieldId;