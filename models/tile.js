/**
 * Tile is used for area claiming, mostly for visual effect
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TileSchema = new Schema({
    owner: {type: String, required: true},
    score: {type: Number, required: true},
    geo: {type: [Number], index: {type: '2dsphere', sparse: true}, required: true, unique: true},
})

var Tile;
if (mongoose.models.Tile) {
    Tile = mongoose.model('Tile');
} else {
    Tile = mongoose.model('Tile', TileSchema);
}

module.exports = Tile;
