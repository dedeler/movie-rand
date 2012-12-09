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
{
	key: {
		key: key,
		value: {},
		options: {
      ttl: 12312323(ms),
      createdOn: Date().getTime(),
      modifiedOn: Date().getTime()
    }
	}
}

*/
var cache = {};
var fs = require('fs');

module.exports = {
	put: function(key, value, options) {
		
		return undefined;
	},
  /**
    key is the fullpath for file types
  */
	get: function(key, options) {
		if(cache[key]){
			if(options && options.type == "file"){
				if(cache[key].options && cache[key].options.fullPath){
					// Checking modification date
					var st = fs.statSync(cache[key].options.fullPath);

          // TODO check TTL

					if(st.mtime.getTime() != cache[key].options.modifiedOn){
            // Updating cache
            cache[key].value = fs.readFileSync(cache[key].options.fullPath);
            cache[key].options.modifiedOn = st.mtime.getTime();
            console.log("@cache: cache is updated for " + cache[key].options.fullPath);
          }else{
            console.log("@cache: cache is up-to-date for " + cache[key].options.fullPath);
          }
				}
				else{
					console.error("@cache: missing arguments in options while cache type is file! Using cached value...");
				}
			}
			return cache[key].value;
		}
    else if(options && options.type == "file"){
      /* The file is not cached yet, putting it into the cache */
      cache[key] = {
        key: key,
        value: fs.readFileSync(key),
        options: {
          modifiedOn: fs.statSync(key).mtime.getTime(),
          fullPath: key,
          type: "file",
          ttl: 0, //default, means unlimited, ignored for files
          createdOn: new Date().getTime()
        }
      };
      console.log("@cache: cache created for " + key);
      return cache[key].value;
    }
    else{
		  return null;
    }
	},
	remove: function(key) {
		if(cache[key]){
			delete cache[key];
			return true;
		}
		return false;
	}
};