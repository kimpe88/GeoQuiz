$( document ).ready(function() {
  console.log( "ready!" );
  var l = window.location;
  var base_url = l.protocol + "//" + l.host + "/";
  console.log(base_url);
  var geo= { lat : 11, long : 11  };



  // Outputs the first question to the user and adds listeners 
  // to all the buttons for submitting answer
  var createGameSuccess = function (data) {
    // Start timer
    resetTimer();
    $("#question-container").text(data.questionText);
    checkAndSetLives(data.lives);
    var activeButtons = true;
    for (var i = 0; i < 4; i++) {
      $("#op"+i).text(data.alternatives[i]);
      $( "#op"+i ).click(function() {
        if(activeButtons){
          var button = $(this);
          var answer = { chosenAlternative:  $(this).attr("value")};
          $.ajax({
              type: "GET",
              url: base_url + "api/check_answer",
              data: answer,
              xhrFields: { withCredentials: true },
              success: function(serverResponse) {
                console.log(serverResponse);
                $("#score").text("Score: " + serverResponse.score);
                checkAndSetLives(serverResponse.lives);
                if(serverResponse.correctAnswer === true && serverResponse.timedOut === false) {
                  button.css('background-color', 'green');
                }else {
                  button.css('background-color', 'red');
                }
                activeButtons = false;
                setTimeout(function(){
                  button.removeAttr('style');
                  var question = serverResponse.nextQuestion;
                  $("#question-container").text(question.questionText);
                  for (var i = 0; i < 4; i++) {
                    $("#op"+i).text(question.alternatives[i]);
                  }
                  button.blur();
                  activeButtons = true;
                  resetTimer(timer);
                }, 1000);
              },
              dataType: "json"
          });
        }
      });
    }
  };


  $.ajax({
    type: "POST",
    url: base_url + "api/create_game",
    data: geo,
    xhrFields: { withCredentials: true },
    success: createGameSuccess,
    dataType: "json"
  });
});

/*
 * Updates the lives count and checks whether 
 * there are any lives left, if we are out of lives
 * redirect to the finished page to show the end screen
 * @param {Number} numLives The number of lives remaining
 */
function checkAndSetLives(numLives){
  $("#lives-left").text("Lives: " + numLives);
  // If we have no lives left redirect in 1 second
  if(numLives === 0){
    setTimeout(function(){
      window.location.assign("/play/quiz/finished");
    }, 1000);
  }

}

/* Timer countdown for the client
 * Has nothing to do with question logic just to show the user a visible timer
 * timeouts are handled on server side
 * @param {Interval} interval Reference to the timer
 * @param {Integer} time How many seconds to count down
 * @param {Function} functionality for each second countdown takes time left parameter
 * @param {Function} functionality for when timer reaches zero
 */

function timer(time,update,complete) {
    var start = new Date().getTime();
    interval = setInterval(function() {
        var now = time-(new Date().getTime()-start);
        if( now <= 0) {
            clearInterval(interval);
            complete();
        }
        else update(Math.floor(now/1000));
    },100);
}

/*
 * Starts/resets the timer
 */
var interval;
function resetTimer() {
  clearInterval(interval);
  timer(30000, function(timeleft){
    $('#time-left').text("Time left: " + (timeleft));
  }, function(){
    console.log("question timed out");
  });
}
