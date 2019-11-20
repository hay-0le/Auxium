const { Song, db } = require('../../db/index.js');

//update
const addSong = (req, res) => {
  //save song to playlist
  let song = new Song(req.body);
  song.save((err, results) => {
    if (err) {
      console.log('Error adding song... ', err)
    } else {
      console.log('Song added to playlist')
    }
  })
}

//create
const createPlaylist = (req, res) => {


}

//delete
const deleteSong = (req, res) => {

}

//Read
const getPlaylist = (req, res) => {
  let playList = req.params.playList;
  console.log('playlist:', playList)

  let songs = Song.findOne({}, (err, data) => {
    if (err) {
      console.log("FindOne error: ", err)
    } else {
      res.send(data.playlist.songs);
    }
  })

}

module.exports = {
  getPlaylist,
  addSong,
  createPlaylist,
  deleteSong
}