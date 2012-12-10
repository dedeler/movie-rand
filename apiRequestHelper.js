/*
  This program is part of MovieRand (https://github.com/destan/change-it-now)

  change-it-now is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  change-it-now is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with change-it-now.  If not, see <http://www.gnu.org/licenses/>.
*/

"use strict";

var http = require('http');
var apiKey = "api_key=" + properties.API_KEY;

module.exports = {
  httpGetRequest: function (path, callback) {
    /* As seen on http://docs.nodejitsu.com/articles/HTTP/clients/how-to-create-a-HTTP-request */

    // append api key
    if(path.indexOf('?') > -1){
      path += '&' + apiKey;
    }
    else{
      path += '?' + apiKey
    }

    var options = {
      headers: {
        accept: 'application/json'
      },
      host: 'api.themoviedb.org',
      path: path
    };

    var internalResponseCallback = function(response) {
      var str = '';

      //another chunk of data has been recieved, so append it to `str`
      response.on('data', function (chunk) {
        str += chunk;
      });

      //the whole response has been recieved, so we just print it out here
      response.on('end', function () {
        if(typeof callback == 'function'){
          callback(str);
        }
      });
    };

    var request = http.request(options, internalResponseCallback);

    request.on('error', function(e) {
      console.log("@apiRequestHelper#httpGetRequest: Error: " + e.message);

      if(typeof callback == 'function'){
        callback(JSON.stringify({"success": false}));
      }
    });

    request.end();
  }//end of httpGetRequest
};
