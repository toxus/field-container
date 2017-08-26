/**
 * Created by jaap on 13/07/2017.
 */
"use strict";

const fieldBase = require('./fieldBase');
const Joi = require('joi');

/**
 * the address converter class
 *
 * see: https://en.wikipedia.org/wiki/Address_(geography)
 */
class fieldAddress extends fieldBase {

  constructor(options) {
    super(options);
    this.countries = require('@bassettsj/i18n-iso-countries');
    this.countryPatch = require('./countryPatch');
    this.countryFormat = require('./countryAddressFormat');
  }

  name() {
    return 'address'
  }

  _countryName(caption) {
    if (this.countryPatch[caption]) {
      return this.countryPatch[caption];
    }
    return caption;
  }
  _countryCode(caption) {
    let country = this._countryName(caption);
    for (let languageCode of (this.options().languages)) {
      let code = this.countries.getAlpha2Code(country, languageCode);
      if (code) {
        return code;
      }
    }
    return caption;
  }
  validate(field) {
    return this.checkSchema(field, new Joi.object().keys({
      data: Joi.object.keys({
        street: Joi.string(),
        streetNumber: Joi.string(),
        number: Joi.string(),
        suffix: Joi.string(),
        postalcode: Joi.string(),
        city : Joi.string(),
        country: Joi.string()
      })
    }));
  }

  /**
   * parse the address definition removing all parts not part of the address
   */
  parse(field) {
    if (!field.data) {
      field.data = {}
    } else {
      var data = {};
      if (field.data.country) {
        data.country = this._countryCode(field.data.country);
      } else {
        data.country = this.options().countryCode;
      }
      if (field.data.street) {
        data.street = field.data.street.trim();
        if (field.data.number) {
          data.number = field.data.number.trim();
        }
        if (field.data.addition) {
          data.suffix = field.data.suffix.trim();
        }
      } else if (field.data.streetNumber) { // https://gist.github.com/devotis/c574beaf73adcfd74997
        if (this.countryFormat[data.country] && this.countryFormat[data.country].nrLeft == 0) {
          const re = /^(\d*[\wäöüß\d '\-\.]+)[,\s]+(\d+)\s*([\wäöüß\d\-\/]*)$/i;
          let match = field.data.streetNumber.match(re);
          if (match) {
            match.shift(); // verwijder element 0=het hele item
            //match is nu altijd een array van 3 items
            data.street = match[0].trim();
            data.number = match[1].trim();
            data.suffix = match[2].trim();
          } else {
            this.addError(field.id, `unknown address format: ${field.data.streetNumber}`);
            data.street = field.data.streetNumber;
          }
        } else {
          this.addWarning(field.id, `country[${data.country}] can not be parsed for streetNumber`);
          data.street = field.data.streetNumber;
        }
      }
      if (field.data.postalcode) {
        if (data.country === 'NL') {
          data.postalcode = field.data.postalcode.replace(/\s/g,'').toUpperCase();
          const regex = /^[1-9][0-9]{3} ?(?!sa|sd|ss)[a-z]{2}$/i;
          if (!regex.test(data.postalcode)) {
            this._addWarning(field.id, `invalid postalcode: ${data.postalcode}`);
          }
        } else {
          data.postalcode = field.data.postalcode.trim();
        }
      }
      if (field.data.state) {
        data.state = field.data.state.trim();
      }
      if (! field.data.city) {
        this.addWarning(field.id, 'missing city')
        data = {};
      } else if (!data.street || data.street.length == 0) {
        this.addWarning(field.id, 'missing street')
        data = {};
      } else {
        data.city = field.data.city;
      }
      field.data = data;
    }

    return field.data;
  }

  hasData(field) {
    return ! (field.data.city == '' && field.data.street == '');
  }
  /**
   * compares the value of two fields
   * @param field
   */
  isEqual(field) {
    if (super.isEqual(field)) {
      // all fields should be defined
      for (let key of Object.keys(this.data.field)) { // one th
        if (this.data[key] != field.data[key]) {
          return false;
        }
      }
      return true;
    }
    return false;
  }


}

module.exports = fieldAddress;