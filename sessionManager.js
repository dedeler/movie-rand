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

/**
sessionId:{object}
*/
var sessionConatiner = {};

module.exports = {
  sessionInterceptor: function(req, res, next) {
    // http://stackoverflow.com/a/3409200

    var nodeSessionId = getCookie('nodeSessionId', req);

    if( !nodeSessionId ){
      //There is no session, create one
      var sessionId = createNewSession();
      res.header('Set-Cookie', 'nodeSessionId=' + sessionId);
      ensureSession(nodeSessionId);
      req.params.nodeSessionId = nodeSessionId;
      req.session = getSession(nodeSessionId);
    }
    else{
      //TODO update last accessed date
      //TODO check ttl and delete session if needed
      //TODO ensure there is a session object for this sessionId
      ensureSession(nodeSessionId);
      req.params.nodeSessionId = nodeSessionId;
      req.session = getSession(nodeSessionId);
    }

    //FIXME simulated loggedin user
    var user = {
      username: "destan"
    };

    var currentSesion = getSession(nodeSessionId);
    currentSesion['user'] = user;

    return next();
  },
  setSessionAttribute: function(request, key, value){
    if(typeof key != "string" ){
      console.err("@sessionManager#setSessionAttribute: key is not of type 'string'");
      return null;
    }
    var session = getSession(request.params.nodeSessionId);
    session[key] = value;
  },
  getSessionAttribute: function(request, key){
    if(typeof key != "string" ){
      console.err("@sessionManager#getSessionAttribute: key is not of type 'string'");
      return null;
    }
    var session = getSession(request.params.nodeSessionId);
    return session[key];
  },
};

var uuidGenerator = function() {
  var S4 = function() {
     return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  };
  return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
};

var createNewSession = function() {
  var sessionId = uuidGenerator();
  sessionConatiner[sessionId] = {
    sessionId: sessionId,
    created: new Date().getTime(),
    lastAccessed: new Date().getTime()
  };
  return sessionId;
};

var getSession = function(key) {
  return sessionConatiner[key];
};

var ensureSession = function(sessionId) {
  if(!sessionConatiner[sessionId]){
    sessionConatiner[sessionId] = {
      sessionId: sessionId,
      created: new Date().getTime(),
      lastAccessed: new Date().getTime()
    };
    return false;
  }
  return true;
};

var getCookie = function(key, request) {
  var cookies = {};
  request.headers.cookie && request.headers.cookie.split(';').forEach(function( cookie ) {
    var parts = cookie.split('=');
    cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
  });
  return cookies[key];
};