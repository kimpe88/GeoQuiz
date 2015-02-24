var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'VikingQuest : Login' });
});

router.get('/howtoplay', function(req, res) {
  res.render('howtoplay', { title: 'VikingQuest : How To Play' });
});

router.get('/register', function(req, res) {
  res.render('register', {title: 'VikingQuest : Register'});
});

module.exports = router;
