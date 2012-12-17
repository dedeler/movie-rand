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

var sessionManager = require('./sessionManager');
var apiRequestHelper = require('./apiRequestHelper');

var posterBase = 'http://cf2.imgobject.com/t/p/w342';

module.exports = {

  getGenres: function(req, res, next) {
    apiRequestHelper.httpGetRequest('/3/genre/list',function(responseString) {

      var apiResponse = JSON.parse(responseString);

      // return unsuccessful response if present
      if(apiResponse.success == false){
        res.end(JSON.stringify(apiResponse));     
        return;   
      }

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

        // return unsuccessful response if present
        if(apiResponse.success == false){
          res.end(JSON.stringify(apiResponse));   
          return;     
        }

        pageCount = apiResponse.total_pages;

        if(pageCount == 0){// there is no result for this genre
          res.end(JSON.stringify({
            "success":false,
            "code":"EMPTY"
          }));
          return;
        }

        randomPage = randomFromInterval(1, pageCount);

        if(randomPage != 1){
          apiRequestHelper.httpGetRequest('/3/genre/' + req.params.id + '/movies?page=' + randomPage, function(responseString) {
            apiResponse = JSON.parse(responseString);

            // return unsuccessful response if present
            if(apiResponse.success == false){
              res.end(JSON.stringify(apiResponse));   
              return;     
            }

            pickRandomMovieAndRespondBack();
          });
          return;
        }

        function pickRandomMovieAndRespondBack() {
          itemCount = apiResponse.results ? apiResponse.results.length : 0;
          randomItem = randomFromInterval(0, itemCount - 1);
          var selectedMovie = apiResponse.results[randomItem];

          //get movie details
          apiRequestHelper.httpGetRequest('/3/movie/' + selectedMovie.id, function(responseString) {
              var theMovie = JSON.parse(responseString);

              // return unsuccessful response if present
              if(theMovie.success == false){
                res.end(JSON.stringify(theMovie));     
                return;   
              }

              //process selected movie
              var processedResult = {
                id: theMovie.id,
                title: theMovie.title,
                overview: theMovie.overview,
                imdb: theMovie.imdb_id,
                originalTitle: theMovie.original_title,
                poster: posterBase + theMovie.poster_path,
                vote: theMovie.vote_average,
                releaseDate: theMovie.release_date,
                tagline: theMovie.tagline
              };

              res.end(JSON.stringify(processedResult));
              });

        }

        pickRandomMovieAndRespondBack();

      });
    }//end if
  }
};

function randomFromInterval(from, to) {
    return Math.floor(Math.random()*(to-from+1)+from);
}


