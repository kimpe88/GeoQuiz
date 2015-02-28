var express = require('express');
var router = express.Router();
var async = require('async');
var Tile = require("../models/tile.js");

//is mapped to /play
router.get('/', function (req, res) {
    res.render('start_game');
});

//is mapped to /play/quiz
router.get('/quiz', function (req, res) {
    res.render('quiz');
});

//is mapped to /play/quiz_failed
router.get('/quiz_failed', function (req, res) {
    res.render('quiz_failed', {AREA_NAME: 'KISTA 35.20'});
});

//is mapped to /play/quiz_failed
router.get('/quiz_succeeded', function (req, res) {
    res.render('quiz_succeeded', {AREA_NAME: 'KISTA 35.20', MYRANK: 3, MYSCORE: 37500});
});

//is mapped to /play/claim_area
router.post('/claim_area', function (req, res) {
    //var new_owner = req.user.username;
    var new_owner = "user2";
    var score = 3;
    var locations = req.body.geo_data; //All locations in range (in the client we trust xD...)
    var claimed_tiles = 0;
    var claimed_users = [];
    var iteratedTiles = 0;
    var response = "";

    //Callback to wait until looped trough all tiles... I HATE async programming :(
    var readyCheck = function () {
        iteratedTiles++;
        if (iteratedTiles >= locations.length) {
            response += " ...end...";

            //respond with JSON
            if (req.xhr) {
                var replyData = {
                    status: 'OK',
                    conquer_count: claimed_tiles,
                    conquered_users: claimed_users,
                    score: score,
                    debug_info: response
                };
                res.json(replyData);
            } else {
                res.redirect('/');
            }
        }
    }
    
    //Go trough all locations (not verifying them...) and chekc which ones have lower score than the current
    async.each(locations, function (location, callback) {
        var geo_data_num = [];
        var geo_data = location.split(",");
        geo_data[0] = geo_data[0].substr(1);
        geo_data_num[0] = parseFloat(geo_data[0]).toFixed(3);
        geo_data_num[1] = parseFloat(geo_data[1]).toFixed(3);

        Tile.findOne(
                { geo: { $all: [ geo_data_num[0], geo_data_num[1] ] } },  
                function (err, found_tile) {
            response += "in async tile finder:\n" + geo_data_num[0] + ", " + geo_data_num[1];
            response += "\n";
            if(err){
                response += err.toString();
            }
            if (!found_tile) {
                //NO EXISTS
                response += "\t...This tile does not exist!\n";
                var new_tile = Tile({
                    owner: new_owner,
                    score: score,
                    geo: [geo_data_num[0], geo_data_num[1]],
                });
                claimed_tiles++;
                new_tile.save(function (err) {
                    if (err) {
                        response += "there was an error saving\n";
                    } else {
                        response += "saved tile!\n";
                    }
                });
            } else {
                //IT EXISTS
                response += "\t...Tile exists[TILE: owner:" + found_tile.owner + ", score:" + found_tile.score  + ", location:" + found_tile.geo + "]\n";
                if (score > found_tile.score) {
                    claimed_tiles++;
                    claimed_users.push(found_tile.owner);
                    found_tile.owner = new_owner;
                    found_tile.score = score;
                    found_tile.save(function (err) {
                        if (err) {
                            response += "there was an error saving\n";
                        } else {
                            response += "saved tile!\n";
                        }
                    });
                }
            }

            readyCheck();
            callback();
        });
    }, function(err){});
});

//is mapped to /play/get_known_locations
router.post('/get_known_locations', function (req, res) {
    var debug = "";
    // query for all tiles (yes this would cause a major explosion on whatever 
    // device handling this, but this is a demo...)
    var query = Tile.find({});
    query.select('owner geo');
    query.exec(function (err, allTiles) {
        if (err) {
            res.send("Unable to query database for places").status(500);
        }

        debug += "retrieved " + allTiles.length + " places from database\n";


        // was JSONP requested does querystring have callback
        // allow remote domains to request places json
        if (req.xhr) {
            var replyData = {
                status: 'OK',
                tiles: allTiles,
                debug_info: debug
            };
            res.json(replyData);
        } else {
            res.redirect('/');
        }

    });
});

module.exports = router;
