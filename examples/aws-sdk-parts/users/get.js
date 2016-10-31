'use strict';

let Rx      = require('rxjs/Rx');
let request = require('request');

var doGet = function(url) {
  return Rx.Observable.create(function(observer) {
    request(
      {
        method: 'GET',
        uri:    url,
        gzip:   true,
      }, function(error, response, body) {
        if (error) {
          observer.error();
        } else if (response.statusCode != 200) {
          observer.error(response);
        } else {
          observer.next(response);
        }

        observer.complete();
      });
  });
};

var responseStream = doGet('https://gist.githubusercontent.com/doapp-ryanp/bdba55784d79c8a9118fcd2c45e21f49/raw/412326d4b135ad2e0b9082126dcdad146f39f595/test.json');

module.exports.hello = (event, context, callback) => {
  responseStream.subscribe(
    r => {
      const response = {
        statusCode: 200,
        body:       JSON.stringify({
          message:  'test multi module w exclude',
          httpBody: r,
          input:    event,
        }),
      };

      callback(null, response);
    },
    error => {
      callback(error);
    }
  );
};
