/**
 * Created by jaap on 13/07/2017.
 */
"use strict";


const fieldText = require('./fieldText');

/**
 * validates the email
 * removes it if it's not a valid address.
 */
class fieldEmail extends  fieldText {
  name() {
    return 'email';
  }

  _validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  parse(field) {
    super.parse(field);
    if (field.data.value) {
      // field.data.value = field.data.value.toLowerCase();
      if (!this._validateEmail(field.data.value)) {
        field.data = {};
      }
    }
    return field.data;
  }
}

module.exports = fieldEmail;