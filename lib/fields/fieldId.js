/**
 * Created by jaap on 13/07/2017.
 */

const fieldBase = require('./fieldBase');

class fieldId extends  fieldBase {
  name() {
    return 'id'
  }
}
module.exports = fieldId;