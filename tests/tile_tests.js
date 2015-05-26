var expect = require('expect');
var utils = require('./utils');
var Tile = require('../models/tile');

describe('testing tiles', function () {
  var tile;
  beforeEach(function (done) {
    tile = new Tile({
      owner: "test",
      score: 10,
      geo: [59.19, 18.03]
    });
    tile.save(done);
  });
  afterEach(function (done) {
    tile.remove(done);
  });

  it('get score of tile by coordinates', function (done) {
    Tile.find([59.19, 18.03], function (err, results) {
      if(err)
        throw err;
      expect(results[0].score).toEqual(10);
      return done();
    });
  });

  it('counts tiles owned', function (done) {
    Tile.find({owner: "test"}, function (err, results) {
      if(err)
        throw err;
      expect(results.length).toEqual(1);
      return done();
    });
  });

  it('claim test tile (50,50)', function (done) {
    Tile.find([59.19, 18.03], function (err, results) {
      if(err)
        throw err;
      results[0].owner = "doomviking";
      expect(results[0].owner).toEqual("doomviking");
      return done();
    });
  });
});
