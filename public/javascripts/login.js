$(document).ready(function()
{
  // When button is clicked send a post request to login user
  // if successful redirect to play view
  // this is a temporary hack, should be substituted with
  // something better
  $('#loginButton').click(function()
  {
    var username = $('#username').val();
    var password = $('#password').val();
    var l = window.location;
    var loginUrl = "http://" + username + ":" + password + "@" + l.host + "/login";

    $.ajax({
    type: "POST",
    url: loginUrl,
    success: function(data){
      window.location = '/play';
    },
    error: function() {
      alert("Failed to login");
    },
});
    return false;
  });
});
