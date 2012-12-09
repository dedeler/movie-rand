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

var sessionManager = require('./sessionManager');
var apiRequestHelper = require('./apiRequestHelper');

var posterBase = 'http://cf2.imgobject.com/t/p/w342';

module.exports = {

  getGenres: function(req, res, next) {
    apiRequestHelper.httpGetRequest('/3/genre/list',function(responseString) {

      var apiResponse = JSON.parse(responseString);

      res.end(JSON.stringify(apiResponse.genres));
    });
  },
  getMovieByGenre: function(req, res, next) {
    var pageCount;
    var itemCount;

    var randomPage;
    var randomItem;

    if(req.params && req.params.id){
      apiRequestHelper.httpGetRequest('/3/genre/' + req.params.id + '/movies',function(responseString) {

        var apiResponse = JSON.parse(responseString);

        pageCount = apiResponse.total_pages;
        itemCount = apiResponse.results ? apiResponse.results.length : 0;

        randomPage = randomFromInterval(1, pageCount);
        randomItem = randomFromInterval(0, itemCount - 1);

        //TODO consider other pages :)

        var selectedMovie = apiResponse.results[randomItem];

        //process selected movie
        var processedResult = {
          id: selectedMovie.id,
          title: selectedMovie.title,
          originalTitle: selectedMovie.original_title,
          poster: posterBase + selectedMovie.poster_path,
          vote: selectedMovie.vote_average
        };

        res.end(JSON.stringify(processedResult));
      });
    }//end if
  }
};

function randomFromInterval(from, to) {
    return Math.floor(Math.random()*(to-from+1)+from);
}


