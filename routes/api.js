var express = require('express');
var router = express.Router();

router.post('/create_game', function(req, res) {
  var userId = req.body.userId;
  var lat = req.body.lat;
  var long = req.body.long;
  // If not all request params are supplied
  // respond with an error message
  if(!userId || !lat || !long){
    return invalidRequest(res);
  }




  res.status(201);
  res.send();
});


function invalidRequest(res){
  var err = {
    success: false,
    message: 'required request params not supplied'
  };
  res.status(400);
  res.json(err);
}

module.exports = router;
