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

var sessionManager = require('./sessionManager');

module.exports = {
  authenticationInterceptor: function(req, res, next) {
    return next();
  },
  login: function(req, res, next) {
    throw "Not implemented";
  },
  logout: function(req, res, next) {
    throw "Not implemented";
  }
};
