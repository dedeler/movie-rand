/*
  This program is part of movrand (https://github.com/destan/change-it-now)

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

var path = require('path');
var fs = require('fs');
var cache = require('./cache');
var sessionManager = require('./sessionManager');

module.exports = {
  serveStaticContent: function(req, res, next) {
    var mimeMap = {
      '.txt': 'text/plain',
      '.html': 'text/html',
      '.htm': 'text/html',
      '.css': 'text/css',
      '.xml': 'application/xml',
      '.json': 'application/json',
      '.js': 'application/javascript',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.png': 'image/png',
      '.vcf': 'text/vcard',
      '.doc': 'application/msword',
      '.pdf': 'application/pdf'
      };

    console.log('@staticHandler: serving ' + req.url);

    if(req.url.match("^" + properties.ERROR_PAGES_PATH)){//FIXME buggy pattern!
      var filePath = '.' + req.url;          
    }
    else{
      var filePath = properties.WEB_CONTENT_PATH + req.url;
      if (req.url === "/" ){
        filePath = properties.WEB_CONTENT_PATH + '/' + properties.WELCOME_PAGE; // Default page (welcome page)          
      }
    }

    // Get rid of request paramaters if any
    filePath = filePath.split("?")[0];
    filePath = filePath.split("#")[0];

    // Decide Content-Type
    var extname = path.extname(filePath);
    var contentType = mimeMap[extname] ? mimeMap[extname] : 'text/html';

    path.exists(filePath, function(exists) {

      if (exists) { 
        fs.stat(filePath, function(err, stats) {
          if(stats.isFile()){
            var content = cache.get(filePath, {'type':'file'});
            res.writeHead(200, {
              'Content-Type': contentType
            });
            res.end(content, 'utf-8');
          }else{//The asset is a folder
            //TODO serve file list optionally
            res.header('Location', properties.ERROR_PAGES_PATH + '/404.html');
            res.send(302);
          }
        });
      }
      else {// Filenot found, redirect to 404 page
            res.header('Location', properties.ERROR_PAGES_PATH + '/404.html');
            res.send(302);
      }
    });//end of path.exists
  }
};
