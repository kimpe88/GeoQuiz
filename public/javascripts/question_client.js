$( document ).ready(function() {
  console.log( "ready!" );
  var l = window.location;
  var base_url = l.protocol + "//" + l.host + "/";
  console.log(base_url);
  var geo= { lat : 11, long : 11  };


  // Outputs the first question to the user and adds listeners 
  // to all the buttons for submitting answer
  var createGameSuccess = function (data) {
    $("#question-container").text(data.questionText);
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
