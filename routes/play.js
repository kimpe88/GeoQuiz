var express = require('express');
var router = express.Router();
var async = require('async');
var Tile = require("../models/tile.js");
var User = require('../models/user');
var Game = require('../models/game');

//is mapped to /play
router.get('/', function (req, res) {
    res.render('start_game');
});

//is mapped to /play/quiz
router.get('/quiz', function (req, res) {
    res.render('quiz');
});

router.get('/quiz/finished', function (req, res) {
    User.findOne({username: req.user.username}, function (err, user) {
        if (err || !user) {
            res.sendStatus(500);
        }

        Game.findOne({_id: user.currentGame}, function (err, game) {
            if (err || !game) {
                res.sendStatus(500);
            }

            //----------------------
            //---START CLAIM AREA---
            //----------------------
            var locations = getSurroundingAreas([game.lat, game.long]);
            var claimed_tiles = 0;
            var claimed_users = [];
            var iteratedTiles = 0;
            var response = "";
            var score = game.score;

            //Callback to wait until looped trough all tiles... I HATE async programming :(
            var readyCheck = function () {
                iteratedTiles++;
                if (iteratedTiles >= locations.length) {
                    res.render('quiz_succeeded', {CLAIMED_TILES: claimed_tiles, CLAIMED_USERS: claimed_users});
                }
            }


            //Go trough all locations (not verifying them...) and chekc which ones have lower score than the current
            async.each(locations, function (location, callback) {
                console.log(location.toString());
                var geo_data_num = [];
                var geo_data = location.toString().split(",");
                geo_data_num[0] = parseFloat(geo_data[0]).toFixed(3);
                geo_data_num[1] = parseFloat(geo_data[1]).toFixed(3);

                Tile.findOne(
                        {geo: {$all: [geo_data_num[0], geo_data_num[1]]}},
                function (err, found_tile) {
                    console.log("in async tile finder:\n" + geo_data_num[0] + ", " + geo_data_num[1]);
                    if (err) {
                        response += err.toString();
                    }
                    if (!found_tile) {
                        //NO EXISTS
                        console.log("\t...This tile does not exist!\n");
                        var new_tile = Tile({
                            owner: user.username,
                            score: score,
                            geo: [geo_data_num[0], geo_data_num[1]],
                        });
                        claimed_tiles++;
                        new_tile.save(function (err) {
                            if (err) {
                                console.log("there was an error saving\n");
                            } else {
                                console.log("saved tile!\n");
                            }
                        });
                    } else {
                        //IT EXISTS
                        console.log("\t...Tile exists[TILE: owner:" + found_tile.owner + ", score:" + found_tile.score + ", location:" + found_tile.geo + "]\n");
                        if (score > found_tile.score) {
                            claimed_tiles++;
                            claimed_users.push(found_tile.owner);
                            found_tile.owner = user.username;
                            found_tile.score = score;
                            found_tile.save(function (err) {
                                if (err) {
                                    console.log("there was an error saving\n");
                                } else {
                                    console.log("saved tile!\n");
                                }
                            });
                        }
                    }

                    readyCheck();
                    callback();
                });
            }, function (err) {
            })
            //----------------------
            //----END CLAIM AREA----
            //----------------------
        });
    });
});

var getSurroundingAreas = function (centre) {
    return [
        //Row 1/7
        [centre[0] + (0.001 * -3), centre[1] + (0.001 * 0)],
        //Row 2/7
        [centre[0] + (0.001 * -2), centre[1] + (0.001 * -1)],
        [centre[0] + (0.001 * -2), centre[1] + (0.001 * 0)],
        [centre[0] + (0.001 * -2), centre[1] + (0.001 * 1)],
        //Row 3/7
        [centre[0] + (0.001 * -1), centre[1] + (0.001 * -2)],
        [centre[0] + (0.001 * -1), centre[1] + (0.001 * -1)],
        [centre[0] + (0.001 * -1), centre[1] + (0.001 * 0)],
        [centre[0] + (0.001 * -1), centre[1] + (0.001 * 1)],
        [centre[0] + (0.001 * -1), centre[1] + (0.001 * 2)],
        //Row 4/7
        [centre[0] + (0.001 * 0), centre[1] + (0.001 * -3)],
        [centre[0] + (0.001 * 0), centre[1] + (0.001 * -2)],
        [centre[0] + (0.001 * 0), centre[1] + (0.001 * -1)],
        [centre[0] + (0.001 * 0), centre[1] + (0.001 * 0)],
        [centre[0] + (0.001 * 0), centre[1] + (0.001 * 1)],
        [centre[0] + (0.001 * 0), centre[1] + (0.001 * 2)],
        [centre[0] + (0.001 * 0), centre[1] + (0.001 * 3)],
        //Row 5/7
        [centre[0] + (0.001 * 1), centre[1] + (0.001 * -2)],
        [centre[0] + (0.001 * 1), centre[1] + (0.001 * -1)],
        [centre[0] + (0.001 * 1), centre[1] + (0.001 * 0)],
        [centre[0] + (0.001 * 1), centre[1] + (0.001 * 1)],
        [centre[0] + (0.001 * 1), centre[1] + (0.001 * 2)],
        //Row 6/7
        [centre[0] + (0.001 * 2), centre[1] + (0.001 * -1)],
        [centre[0] + (0.001 * 2), centre[1] + (0.001 * 0)],
        [centre[0] + (0.001 * 2), centre[1] + (0.001 * 1)],
        //Row 7/7
        [centre[0] + (0.001 * 3), centre[1] + (0.001 * 0)],
    ];
}

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


/**
 * Stores the geo data in the session
 */
router.post('/set_geo', function (req, res) {
    req.session.lat = req.body.lat;
    req.session.lng = req.body.lng;
    var replyData = {
        status: 'OK',
        geo: [req.session.lat, req.session.lng], //debug info
    };
    res.json(replyData);

});

module.exports = router;