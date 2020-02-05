
//update playlist with new song
const addSong = (req, res) => {
  //save song to playlist
  let playlist = req.body.params.playlist;
  let newSong = req.body.params.song;
  // console.log("PLYLIST", playlist)
  // console.log("SONG", newSong)
  //make an array of artists

  let id = newSong.id;
  let url = newSong.external_urls.spotify;
  let title = newSong.name;
  let artists = newSong.artists.map(artist => artist.name);
  console.log(artists)
  let href = newSong.href;
  let year = newSong.album.release_date.slice(0, 4);
  let album = newSong.album.name;
  let duration = newSong.duration_ms;

  console.log(`OBJECT TO SAVE:   id=${id}   url=${url}  title=${title}  artists=${artists}  href=${href}  year=${year}  album=${album}  duration=${duration}`)
  //to save: href, exteernal_urls.spotify,id, name, type

  //add to database
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