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

properties = require("./properties");// Should be the first, ensure that it is a global variable
var restify = require("restify");
var staticHandler = require('./staticHandler');
var restHandler = require('./restHandler');
var sessionManager = require('./sessionManager');
var authenticationHandler = require('./authenticationHandler');

/* SERVER CONFIGURATION */
var server = restify.createServer({name: "MovieRand_Server"});
server.use( restify.bodyParser({ mapParams: false }) );        //register body parser
server.use(restify.queryParser({ mapParams: true }));          //register query parser
server.use(sessionManager.sessionInterceptor);                 //register session interceptor
server.use(authenticationHandler.authenticationInterceptor);   //register authentication interceptor

server.listen(properties.PORT, properties.IP, function() {
  console.log('%s listening at %s', server.name, server.url);
});

// Controllers
server.get('/genre/list', restHandler.getGenres);
server.get('/movie/genre/:id', restHandler.getMovieByGenre);
server.get('/movie/:id', restHandler.getMovieById);

// Serving static content, ensure to be the last handler
server.get('/.*', staticHandler.serveStaticContent); //ensure to be the last handler
