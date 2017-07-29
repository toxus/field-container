/**
 * Template to map incoming data onto our record/field
 *
 * version 0.1.0 jvk 2017-07-15
 */


class recordTemplate {


  readFile(filename) {
   // throw new Error('readFile not implemented');
    return 'xxxxx'
  }
  jsonString(json) {
    throw new Error('jsonString not implemented');
  }

  /**
   * returns the schema to validate the template with
   */
  schema() {
  }

  /**
   * set or get the template
   * @param template
   * @return {*}
   */
  template(template) {
    return template;
  }

  /**
   * import a row into the
   * @param row     the data
   * @param record flexRecord
   */
  import(row, record) {

  }
}

module.exports = recordTemplate;