

const fields = [
  {
    "_id" :"598459f2fe5947ead9ea8134",
    "data" : {
      "value" : "1234"
    },
    "fieldType" : "id",
    "ref" : [
      {
        "shareRowId":"598459f2fe5947ead9ea813a",
        "refId": "id",
      },
    ],
    "isHidden" : false,
    "usage" : []
  },
  {
    "_id" :"598459f2fe5947ead9ea8135",
    "data" : {
      "company" : "Toxus",
      "lastName" : "Kreeft",
      "prefix" : "van der",
      "firstName" : "Jaap"
    },
    "fieldType" : "name",
    "ref" : [
      {
        "shareRowId":"598459f2fe5947ead9ea813a",
        "refId": "name",
      },
    ],
    "refId" : "name",
    "isHidden" : false,
    "usage" : []
  },
  {
    "_id" :"598459f2fe5947ead9ea8136",
    "data" : {
      "value" : "+31-6-12345678"
    },
    "fieldType" : "telephone",
    "ref" : [
      {
        "shareRowId":"598459f2fe5947ead9ea813a",
        "refId": "telephone",
      },
    ],

    "isHidden" : false,
    "usage" : []
  },
  {
    "_id" :"598459f2fe5947ead9ea999",
    "data" : {
      "value" : "+31-6-98765453"
    },
    "fieldType" : "telephone",
    "ref" : [
      {
        "shareRowId":"598459f2fe5947ead9ea999",
        "refId": "telephone",
      },
    ],

    "isHidden" : false,
    "usage" : []
  },
  {
    "_id" :"598459f2fe5947ead9ea8137",
    "data" : {
      "value" : "info@example.com"
    },
    "fieldType" : "email",
    "ref" : [
      {
        "shareRowId":"598459f2fe5947ead9ea813a",
        "refId": "email",
      },
    ],
    "isHidden" : false,
    "usage" : []
  },
  {
    "_id" :"598459f2fe5947ead9ea8138",
    "data" : {
      "city" : "Adam",
      "postalcode" : "1017TE",
      "number" : "12",
      "street" : "Eerste weg",
      "country" : "nl"
    },
    "fieldType" : "address",
    "ref" : [
      {
        "shareRowId":"598459f2fe5947ead9ea813a",
        "refId": "address",
      },
    ],
    "isHidden" : false,
    "usage" : []
  }
];

module.exports = fields;