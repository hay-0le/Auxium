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

  let id = newSong.id;
  let url = newSong.external_urls.spotify;
  let href = newSong.href;
  let title = newSong.name;
  //map array of artist objects, to return array of artists names only
  let artists = newSong.artists.map(artist => artist.name);
  let year = newSong.album.release_date.slice(0, 4);
  let album = newSong.album.name;
  let duration = newSong.duration_ms;

  pool.connect()
    .then(() => {

    let queryString = `INSERT INTO auxium.songs (songid, url, href, title, artists, album, year, duration, playlist) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`

    pool.query(queryString, [id, url, href, title, artists, album, year, duration, playlist])
      .then(response => {
        console.log(`Success adding ${title} to playlist`);
        pool.end();
      })
      .catch(err => {
        console.log(`ERROR adding ${title} to playlist: `, err);
        pool.end();
      })
  })

  .catch(err => {
    console.log("ERROR connecting to pool to add song: ", err);
  })
}


//delete song from playlist
const deleteSong = (req, res) => {
  //TO DO: Should reference song by name, or url, or id?

  let song = req.body.params;
  console.log("song: ", song);

  pool.connect()
    .then(() => {

    let queryString = `DELETE FROM auxium.songs WHERE title = ${song}`;

    pool.query(queryString)
      .then(response => {
        console.log(`Successfully deleted song ${song}`)
      })
      .catch(err => {
        console.log(`ERROR deleteing song ${song}: `, error)
      })
    })

    .catch(err => {
      console.log("ERROR connecting to database to delete song: ", err)
    })



}

//Return requested playlist
const getPlaylist = (req, res) => {
  let playlist = req.body.params.playlist;
  console.log('playlist:', playlist)

  pool.connect()
    .then(() => {
      let queryString = `SELECT * FROM auxium.playlists WHERE playlistname = ${playlist}`;

      pool.query(queryString)
      .then(data => {
        console.log(`Successfully retreived playlist: ${playlist}`);
        res.send(data);
      })
      .catch(err => {
        console.log(`ERROR retreiving playlist ${playList}: `, err)
      })

    })
    .catch(err => {
      console.log("ERROR connecting to database while getting playlist:", err)
    })

}

//create new (empty) playlist
const addPlaylist = (req, res) => {
  let newPlaylist = req.body.params.newPlaylist;
  let newPlaylistId = req.body.params.newPlaylistId;
  console.log('NEW playlist:', newPlaylist, newPlaylistId)

  pool.connect()
    .then(() => {
      let queryString = `INSERT INTO auxium.playlists (playlistid, playlistname) VALUES ($1, $2)`;

      pool.query(queryString, [newPlaylistId, newPlaylist])
      .then(data => {
        console.log(`Successfully created playlist: ${newPlaylist}`);
        res.send(data);
      })
      .catch(err => {
        console.log(`ERROR creating playlist ${newPlaylist}: `, err)
      })

    })
    .catch(err => {
      console.log("ERROR connecting to database while creating playlist:", err)
    })

}


module.exports = {
  addSong,
  deleteSong,
  getPlaylist,
  addPlaylist
}