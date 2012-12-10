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

$(document).ready(function() {
  $.ajaxSetup({
    cache: false,
    contentType:'application/json; charset=UTF-8',
    dataType: 'json'
  });

  function showErrorWarning() {
    var warningRibbon = '<div id="errorRibbon" class="alert alert-error fade in">\
        <button type="button" class="close" data-dismiss="alert">&times;</button>\
        <strong>Uppss!</strong> Something crashed, please try reloading page. Sorry about that :( &nbsp;&nbsp;&nbsp;\
        <button type="button" class="btn" onclick="window.location.reload()">Reload</button>\
      </div>';
    $('#container').prepend(warningRibbon);  
    $('#errorRibbon').fadeIn();
  }

  //Fill genres list
  $.get('genre/list', function(genres) {

    if(genres.success == false){
      showErrorWarning();
      return;
    }

    if(genres){
      $('#genres').html(''); // clear combo
      for (var i = 0; i < genres.length; i++) {
        $('#genres').append('<option value=' + genres[i].id + '>' + genres[i].name + '</option>');
      };
      $('#genres').removeAttr('disabled');
      $('#suggestButton').removeAttr('disabled');
    }
  }, 'json');

  $('#suggestButton').click(function() {
    var button = $(this);
    var genreId = $('#genres').find(":selected").val();

    $('#resultContainer').hide();
    $('#loading').show();

    button.attr("disabled", true);

    //Get random movie by genre
    $.get('movie/genre/' + genreId, function(movie) {

      if(movie.success == false){
        showErrorWarning();
        return;
      }
      
      //decorate result
      $('#resultImg').attr('src', movie.poster);
      $('#resultTitle').html(movie.title);
      $('#resultOrigTitle').html(movie.originalTitle);
      $('#resultVote').html(movie.vote);

      //post decoration actions
      button.removeAttr("disabled");
      $('#resultContainer').show();
      $('#loading').hide();
      $('html, body').animate({
          scrollTop: $("#resultContainer").offset().top
       }, 1500);
    }, 'json');

  });

});//end of doc.ready