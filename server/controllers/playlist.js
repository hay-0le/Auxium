const { Pool } = require('pg');
require('dotenv').config();

const connectionString = `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`

const pool = new Pool({
  connectionString: connectionString
})


//update playlist by adding new song
const addSong = (req, res) => {

  let playlist = req.body.params.playlist;
  let newSong = req.body.params.song;
  // console.log("PLYLIST", playlist)
  // console.log("SONG", newSong)
  //make an array of artists

  let id = newSong.id;
  let url = newSong.external_urls.spotify;
  let href = newSong.href;
  let title = newSong.name;
  let artists = newSong.artists.map(artist => artist.name);
  let year = newSong.album.release_date.slice(0, 4);
  let album = newSong.album.name;
  let duration = newSong.duration_ms;

  console.log(`OBJECT TO SAVE:   id=${id}   url=${url}  title=${title}  artists=${artists}  href=${href}  year=${year}  album=${album}  duration=${duration}`)

  //add to database
  pool.on('connect', () => {

    let queryString = `INSERT INTO songs (songid, url, href, title, artists, album, year, duration, playlist) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`

    pool.query(queryString, [id, url, href, title, artists, album, year, duration, playlist])
      .then(response => {
        console.log(`Success adding ${title} to playlist`);
        pool.end();
      })
      .catch(err => {
        console.log(`Error adding ${title} to playlist: `, err)
      })
  })
}

//create
const createPlaylist = (req, res) => {


}

//delete song from database
const deleteSong = (req, res) => {
  //TO DO: Should reference song by name, or url, or id?

  let song = req.body.params;
  console.log("song: ", song);

  pool.on('connect', () => {

    let queryString = `DELETE FROM songs WHERE title = ${song}`;

    pool.query(queryString)
      .then(response => {
        console.log(`Successfully deleted song ${song}`)
      })
      .catch(err => {
        console.log(`Error deleteing song ${song}: `, error)
      })
  })



}

//Read
const getPlaylist = (req, res) => {
  let playlist = req.body.params.playList;
  console.log('playlist:', playlist)

  pool.on('connect', () => {
    let queryString = `SELECT * FROM playlists WHERE playlistname = ${playlist}`;

    pool.query(queryString)
    .then(data => {
      console.log(`Successfully retreived playlist: ${playlist}`);
      res.send(data);
    })
    .catch(err => {
      console.log(`Error retreiving playlist ${playList}: `, err)
    })
  })

}

module.exports = {
  getPlaylist,
  addSong,
  createPlaylist,
  deleteSong
}