/**
 * Created by jaap on 13/07/2017.
 */
/**
 * uses: https://github.com/googlei18n/libphonenumber
 * convert 06-12345678 to +31-6-12345678
 */

"use strict";
const fieldText = require('./fieldText');


class fieldTelephone  extends fieldText {

  constructor(options) {
    super(options);
    this.PNF = require('google-libphonenumber').PhoneNumberFormat;
    this.phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
  }


  name() {
    return 'telephone'
  }

  _defaultCountryCode(country) {
    return 'NL'
  }
  /**
   * convert: 061 23 44 56767
   * to     : +31 61234456767
   *
   * @param field
   */
  parse(field) {
    super.parse(field);
    if (field.data.value) {
      try {
        let tel = this.phoneUtil.parse(field.data.value, 'NL'); // this._defaultCountryCode());
        field.data.value = this.phoneUtil.format(tel, this.PNF.RFC3966).substr(4);
      } catch(e) {
        throw new Error('incorrect format')
      }
    }
    return field.data;
  }
}

module.exports = fieldTelephone;