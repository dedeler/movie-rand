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

function refresh(){
  window.location.hash='';
  window.location.reload();
}

$(document).ready(function() {

  $.ajaxSetup({
    cache: false,
    contentType:'application/json; charset=UTF-8',
    timeout: 10000,
    dataType: 'json',
    error: function(xhr, status, error) {
      if(status == "timeout") {
        showErrorWarning("Timeout occurred");
      }
      else{
       showErrorWarning(); 
      }

      $('#loading').hide();
      $('.mutex1').hide();
      $('#suggestButton').removeAttr("disabled");
    }
  });

  function showErrorWarning(error) {
    error = error || "Something crashed";

    var warningRibbon = '<div id="errorRibbon" class="alert alert-error fade in">\
        <button type="button" class="close" data-dismiss="alert">&times;</button>\
        <strong>Uppss!</strong> ' + error + ' , please try again. If the problem persists please try reloading the page. Sorry about that :( &nbsp;&nbsp;&nbsp;\
        <button type="button" class="btn" onclick="refresh()">Reload</button>\
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
  });

  $('#suggestButton').click(function() {
    var button = $(this);
    var genreId = $('#genres').find(":selected").val();

    $('.mutex1').hide();
    $('#loading').show();
    $('#resultImg').attr('src', '');//prevents old picture's flashing out just before new one's arrival (on FF)

    button.attr("disabled", true);

    //Get random movie by genre
    $.get('movie/genre/' + genreId, function(movie) {
      decorateByMovie(movie);
    });//end of ajax

  });//end of suggestButton click

  //Check if url has any path
  if(window.location.hash.substring(1,7) == "movie/" && !isNaN(window.location.hash.substring(7)) ){
    var movieId = window.location.hash.substring(7);

    $('.mutex1').hide();
    $('#loading').show();

    //Get movie by id
    $.get('movie/' + movieId, function(movie) {
      decorateByMovie(movie);
    });//end of ajax
  }

  $('#tweeterPopupLink').click(function(event) {
    var width  = 575,
        height = 400,
        left   = ($(window).width()  - width)  / 2,
        top    = ($(window).height() - height) / 2,
        url    = this.href,
        opts   = 'status=1' +
                 ',width='  + width  +
                 ',height=' + height +
                 ',top='    + top    +
                 ',left='   + left;
    
    window.open(url, 'twitter', opts);
 
    return false;
  });

});//end of doc.ready

function decorateByMovie(movie) {
  var detailsLinkBase = 'http://www.themoviedb.org/movie/';
  var imdbLinkBase = 'http://www.imdb.com/title/';
  var katLinkBase = 'http://kat.ph/usearch/';

  var button = $('#suggestButton');
  button.removeAttr("disabled");

  if(movie.success == false && movie.code == "EMPTY"){
    $('.mutex1').hide();
    $('#noResult').show();
    return;
  }

  if(movie.success == false){
    showErrorWarning();
    return;
  }

  //change url to reflect current movie
  window.location.hash = 'movie/' + movie.id;

  //decorate result
  var releaseDate = movie.releaseDate ? movie.releaseDate.substring(0,4) : "????";

  $('#resultImg').attr('src', movie.poster);
  $('#resultTitle').html(movie.title + ' (' + releaseDate + ')');
  if(movie.title != movie.originalTitle){
    $('#originalTitle').html('(' + movie.originalTitle + ')');
  }
  $('#tagline').html(movie.tagline);
  $('#resultOverview').html(movie.overview);
  $('#resultVote').html(movie.vote);
  $('#imdbLink').attr('href', imdbLinkBase + movie.imdb);
  $('#detailsLink').attr('href', detailsLinkBase + movie.id);
  $('#katLink').attr('href', katLinkBase + movie.title + '/');

  //post decoration actions
  $('.mutex1').hide();
  $('#resultContainer').show();
  $('html, body').animate({
      scrollTop: $("#resultContainer").offset().top
   }, 1500);

  //updateTweetButton
  var url = 'https://twitter.com/intent/tweet?original_referer=http%3A%2F%2F0.0.0.0%3A3169%2F&text=I%20have%20just%20found%20a%20movie%20via%20%23MovieRand&tw_p=tweetbutton&url=http%3A%2F%2F0.0.0.0%3A3169%2F%23movie%2F';
  $('#tweeterPopupLink').attr('href', url + movie.id);

  //update facebook button

  $('#facebookButtonContainer').html('<iframe src="//www.facebook.com/plugins/like.php?href=' + encodeURIComponent(window.location.href) + '&amp;send=false&amp;layout=button_count&amp;width=150&amp;show_faces=true&amp;font&amp;colorscheme=light&amp;action=recommend&amp;height=21" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:450px; height:21px;" allowTransparency="true"></iframe>');

}//decorateByMovie