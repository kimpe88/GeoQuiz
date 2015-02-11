var expect = require('expect');
var utils = require('./utils');
var Tile = require('../models/tile');

describe('testing tiles', function () {
    var tile;
    beforeEach(function (done) {
        tile = new Tile({
            x: 50,
            y: 50,
            owner: "test",
            score: 10
        });
        tile.save(done);
    });
    afterEach(function (done) {
        tile.remove(done);
    });

    it('get score of tile by coordinates', function (done) {
        Tile.find({x: 50, y: 50}, function (err, results) {
            expect(results[0].score).toEqual(10);
            return done();
        });
    });

    it('counts tiles owned', function (done) {
        Tile.find({owner: "test"}, function (err, results) {
            expect(results.length).toEqual(1);
            return done();
        });
    });

    it('claim test tile (50,50)', function (done) {
        Tile.find({x: 50, y: 50}, function (err, results) {
            results[0].owner = "doomviking";
            expect(results[0].owner).toEqual("doomviking");
        });
        return done();
    });
});
