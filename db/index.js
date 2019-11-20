const mongoose = require('mongoose');
// const config = {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// };

mongoose.connect('mongodb://localhost:27017/mvp', {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true})
  .catch(err => {
    console.log("Error connecting to mongo")
  });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '));

db.once('open', () => {
  console.log('Mongo Connection Successful!');
})

let SongSchema = mongoose.Schema({
  playlist: {
    name: String,
    songs: [
      {
        song: String,
        artist: String,
        length: Number,
        coverArt: String
      }
    ]
  }
})

let Song = mongoose.model('Song', SongSchema);

module.exports = {
  Song,
  db
}