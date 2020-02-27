const { Pool } = require('pg');
require('dotenv').config();
const db = require('../../pg-db/pg-index.js');

//TODO: switch to using pg-promise
//TODO one pool connect

const connectionString = `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`

const pool = new Pool({
  connectionString: connectionString
})

//update playlist by adding new song
const addSong = (req, res) => {
  let playlist = req.body.params.playlist;
  let newSong = req.body.params.song;
console.log("Add song")
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

    let queryString = `INSERT INTO auxium.songs (url, href, title, artists, album, year, duration, playlist) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`

    pool.query(queryString, [url, href, title, artists, album, year, duration, playlist])
      .then(response => {
        console.log(`Success adding ${title} to playlist`);
      })
      .catch(err => {
        console.log(`ERROR adding ${title} to playlist: `, err);
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
      console.log("ERROR connecting to database to delete song: ", err);

    })



}

//Return requested playlist
const getPlaylist = (req, res) => {
  let playlistid = req.body.nextPlaylistId;
console.log("...", playlistid)
  let songsQueryString = `SELECT s.songid, s.title, s.url, ps.songOrder
    FROM auxium.playlist_song ps
    JOIN auxium.songs s
    ON ps.songid = s.songid
    JOIN auxium.playlists p
    ON ps.playlistid = p.playlistid
    WHERE p.playlistid = $1
    ORDER BY ps.songOrder;`

    db.manyOrNone(songsQueryString, [playlistid])
      .then(songs => {
        console.log("songs", songs)
      })
      .catch(err => {
        console.log("ERROR retrieving playlist's songs: ", err)
      })


  // pool.connect()
  //   .then(() => {
  //     let queryString = `SELECT * FROM auxium.songs WHERE playlist = '${playlist}'`;

  //     pool.query(queryString)
  //     .then(data => {
  //       console.log(`Successfully retreived playlist: ${playlist}`);
  //       res.send(data);
  //     })
  //     .catch(err => {
  //       console.log(`ERROR retreiving playlist ${playlist}: `, err)
  //     })

  //   })
  //   .catch(err => {
  //     console.log("ERROR connecting to database while getting playlist:", err);

  //   })

}

//create new (empty) playlist
const addPlaylist = (req, res) => {
  let newPlaylist = req.body.params.newPlaylist;
  let userid = req.body.params.userid;

  let addPlaylistQueryString = `
    INSERT INTO auxium.playlists (playlistname) VALUES ($1) RETURNING playlistid`;

  let connectPlaylistToUserQueryString = `
    INSERT INTO auxium.user_playlist (userid, playlistid) VALUES ($1, $2) RETURNING playlistid`;

  db.task(t => {
    return t.one(addPlaylistQueryString, [newPlaylist])
              .then((playlistid) => {
                console.log(playlistid);
                return t.one(connectPlaylistToUserQueryString, [userid, playlistid.playlistid])
              }
              )
              .catch(err => {
                console.log("ERROR adding playlist: ", err);
                res.end();
              })
  })
  .catch(err => {
    console.log("ERROR with task - Adding Playlist: ", err);
    res.end();
  })

}

const getAllPlaylists = (req, res) => {
  console.log('test')
  console.log("In getAllPlaylists: ", req.body)

  let userid = req.body.userid;
  let username = req.body.username;


      let createUserQueryString = `
      INSERT INTO auxium.users (userid, username) VALUES ($1, $2) ON CONFLICT (userid) DO UPDATE SET userid = EXCLUDED.userid RETURNING userid;
      `


      let playlistQueryString = `SELECT p.playlistid, p.playlistname FROM auxium.playlists p
      JOIN auxium.user_playlist up
      ON p.playlistid = up.playlistid
      WHERE up.userid = $1;`


      let songQueryString = `SELECT
      s.songid,
      s.title,
      s.artists,
      s.album,
      s.year,
      s.duration,
      s.url,
      ps.songOrder
    FROM
      auxium.playlist_song ps
    JOIN
      auxium.songs s
    ON
      ps.songid = s.songid
    JOIN
      auxium.playlists p
    ON
      ps.playlistid = p.playlistid
    WHERE
      p.playlistid = (
        SELECT
          p.playlistid
        FROM
          auxium.user_playlist up
        JOIN
          auxium.playlists p
        ON
          up.playlistid = p.playlistid
        JOIN
          auxium.users u
        ON
          up.userid = u.userid
        WHERE
          u.userid = $1
        LIMIT 1
      )
    ORDER BY ps.songOrder;`;

    db.task(t => {

      return t.one(createUserQueryString, [userid, username])
                .then(async (data) => {
                  const playlists = await t.any(playlistQueryString, data.userid);
                  const songs = await t.any(songQueryString, data.userid);

                  res.send({ playlists, songs })
                })
                .catch(err => {
                  console.log("ERROR with task queries: ", err);
                  res.end();
                })
    })
    .catch(err => {
      console.log("ERROR with task: ", err);
      res.end();
    })

}


module.exports = {
  addSong,
  deleteSong,
  getPlaylist,
  addPlaylist,
  getAllPlaylists
}