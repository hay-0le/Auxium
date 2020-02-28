const { Pool } = require('pg');
require('dotenv').config();
const db = require('../../pg-db/pg-index.js');


const connectionString = `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`

const pool = new Pool({
  connectionString: connectionString
})

//update playlist by adding new song
const addSong = (req, res) => {
  console.log("Params: ", req.body.params)
  let { playlist, playlistid } = req.body.params.playlist;
  let newSong = req.body.params.song;

  let url = newSong.external_urls.spotify;
  let href = newSong.href;
  let title = newSong.name;
  //map array of artist objects, to return array of artists names only
  let artists = newSong.artists.map(artist => artist.name);
  let year = newSong.album.release_date.slice(0, 4);
  let album = newSong.album.name;
  let duration = newSong.duration_ms;


    let addSongQueryString = `INSERT INTO auxium.songs (url, href, title, artists, album, year, duration) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`

    let connectSongToPlaylistQueryString = `
    INSERT INTO auxium.playlist_song (playlistid, songid) VALUES ($1, $2)`;


    db.task(t => {
      return t.one(addSongQueryString, [url, href, title, artists, album, year, duration])
                .then(async(song) => {
                  await t.none(connectSongToPlaylistQueryString, [playlistid, song.songid]);

                  res.send(song);
                })
                .catch(err => {
                  console.log(`ERROR adding ${title} to playlist: `, err);
                  res.end();
                })
    })
    .catch(err => {
      console.log("ERROR with task - Adding Song: ", err);
      res.end();
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

  let songsQueryString = `
    SELECT
      s.title,
      s.artists,
      s.album,
      s.year,
      s.duration,
      s.url,
      ps.songOrder
    FROM auxium.playlist_song ps
    JOIN auxium.songs s
    ON ps.songid = s.songid
    JOIN auxium.playlists p
    ON ps.playlistid = p.playlistid
    WHERE p.playlistid = $1
    ORDER BY ps.songOrder;`

    db.any(songsQueryString, [playlistid])
      .then(songs => {
        console.log("SSSsongs", songs);
        res.send(songs)
      })
      .catch(err => {
        console.log("ERROR retrieving playlist's songs: ", err)
        res.end();
      })

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
      ps.songOrder,
      p.playlistname,
      p.playlistid
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
//TODO return playlistid and name separate from each song returned
      return t.one(createUserQueryString, [userid, username])
                .then(async (data) => {
                  const playlists = await t.any(playlistQueryString, data.userid);
                  const songs = await t.any(songQueryString, data.userid);
console.log("These ol songs", songs)
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