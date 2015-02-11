/**
 * Tile consists of:
 * Coordinate (int x, int y)
 * Owner (String username)
 * Score (int)
 */
var mongoose = require('mongoose');

//Schema
var tileSchema = mongoose.Schema({
    x: Number,
    y: Number,
    owner: String,
    score: Number
});

//The Actual Object
var Tile;
if (mongoose.models.Tile) {
    Tile = mongoose.model('Tile');
} else {
    Tile = mongoose.model('Tile', tileSchema);
}

module.exports = Tile;
