$(document).ready(function()
{
  // Submits the user information with AJAX to server when register button is clicked
  // Outputs the results to the user in the resultsbox div
  $('#registerButton').click(function()
  {
    var username = $('#username').val();
    var password = $('#password').val();
    var passwordConfirmation = $('#passwordConfirmation').val();

    if(password !== passwordConfirmation) {
      console.log("Password and confirmation do not match");
      setResults("Password and password confirmation do not match, please try again", false);
      return false;
    }

  if(password.length < 6) {
    console.log("Too short password");
    setResults("Please use a password of at least 6 characters", false);
    return false;
  }

    $.ajax({
    type: "POST",
    url: "/user",
    data: { username: username, password: password },
    dataType: "json",
    success: function(data){
      console.log("registration successful");
      setResults(data, true);
      $('#username').val("");
      $('#password').val("");
      $('#passwordConfirmation').val("");
    },
    error: function(data) {
      console.log("registration failed");
      setResults(data.responseJSON, false);
    },
  });
    return false;
  });
});

/*
 * Sets the text in the results div with the correct color
 * @param {String} text Text to display in div
 * @param {Boolean} success Whether operation to display results from was
 * successful or not
 */
function setResults(text, success) {
  $('#resultsbox').empty();
  $('#resultsbox').text(text);
  var col;
  if(success)
    col = "green";
  else
    col = "red";
  $('#resultsbox').css('color', col);
}
