/**
 * invalid template with 2 errors:
 *
 */

const template = {
  "sheet" : "Blad1",
  "startRow" : 2,
  "columnNames" : {
    "A" : "ID",
    "B" : "voornaam",
    "C" : "tussenvoegsel",
    "D" : "achternaam",
    "E" : "bedrijf",
    "F" : "email",
    "G" : "telefoon",
    "H" : "fax",
    "I" : "straat",
    "J" : "nummer",
    "K" : "postcode",
    "L" : "plaats",
    "M" : "land"
  },
  "columns" : [
    {
      "fieldName" : "id",
      "fieldType" : "id",
      "data": {
        "value" : "A"
      }
    },
    {
      "fieldName": "name",
      "fieldType": "name",
      "required" : 1,
      "data": {
        "firstName": "B",
        "prefix": "C",
        "lastName": "D",
        "company": "E"
      }
    },
    {
      "fieldName" : "telephone",
      "fieldType" : "telephone",
      "select" : "#this",
      "data" : {
        "value" : "G"
      }
    },
    {
      "fieldName" : "email",
      "fieldType" : "email",
      "data" : {
        "value" : "F"
      }
    },
    {
      "fieldName" : "address",
      "fieldType" : "address",
      "data" : {
        "street" : "I",
        "number" : "J",
        "postalcode" : "K",
        "city" : "L",
        "country" : "M"
      }
    }
  ]
};
module.exports = template;