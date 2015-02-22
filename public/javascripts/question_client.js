$( document ).ready(function() {
    console.log( "ready!" );
    var l = window.location;
    var base_url = l.protocol + "//" + l.host + "/";
    console.log(base_url);
    var geo= { lat : 11, long : 11  };
    var username = "test";
    var password = "123";
    var create_game_success = function (data) {
    	console.log(data);
    	$("#question-container").text(data.questionText);
    	for (var i = 0; i < 4; i++) {
    		$("#op"+i).text(data.alternatives[i]);
    		$( "#op"+i ).click(function() {
    			var answer = { chosenAlternative:  $(this).attr("value")};
    			$.ajax({
  				type: "GET",
  				url: base_url + "api/check_answer",
  				data: answer,
  				beforeSend: function(xhr) { xhr.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password)); },
  				success: function(data){
  					console.log(data);
  				},
  				dataType: "json"
			});
		});
    	};
    };
    $.ajax({
  type: "POST",
  url: base_url + "api/create_game",
  data: geo,
  beforeSend: function(xhr) { xhr.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password)); },
  success: create_game_success,
  dataType: "json"
});
});