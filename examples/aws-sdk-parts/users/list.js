'use strict';

let S3      = require('aws-sdk/clients/s3'),
    bigFile = require('../lib/bigFile.json'),
    models  = require('../models');

let s3 = new S3();

module.exports.hello = (event, context, callback) => {
  s3.getObject({
    Bucket: 'yourbucket',
    Key:    'users.json',
  }, function(err, data) {
    if (err) {
      callback(err);
    } else {
      const response = {
        statusCode: 200,
        body:       JSON.stringify({
          message: 'Got users from S3',
          s3Body:  JSON.parse(data.Body),
          input:   event,
        }),
      };

      console.log('I was not browserified!', bigFile);

      callback(null, response);
    }
  });
};
