const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:5463/mvp');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '));

db.once('open', () => {
  console.log('Mongo Connection Successful!');
})

let PlaylistSchema = mongoose.Schema({
  song: String,
  artist: String,
  length: Number,

})

let Playlist = mongoose.model('Playlist', PlaylistSchema);

default export Playlist;