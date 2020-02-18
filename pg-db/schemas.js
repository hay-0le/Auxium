const { Pool } = require('pg');
require('dotenv').config();

const connectionString = `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`

const pool = new Pool({
  connectionString: connectionString
})

pool.on('connect', () => {
console.log("CONNECTED")

})

let createTables = () => {
  const createTablesQuery = `
    CREATE SCHEMA IF NOT EXISTS auxium AUTHORIZATION postgres;

    DROP TABLE IF EXISTS auxium.users;
    DROP TABLE IF EXISTS auxium.user_playlist;
    DROP TABLE IF EXISTS auxium.playlists;
    DROP TABLE IF EXISTS auxium.playlist_song;
    DROP TABLE IF EXISTS auxium.songs;

    CREATE TABLE IF NOT EXISTS auxium.users (
      userid TEXT NOT NULL,
      userName TEXT NOT NULL,
        CONSTRAINT u_id_pk PRIMARY KEY (userid)
    );


    CREATE TABLE IF NOT EXISTS auxium.playlists (
      playlistid SERIAL NOT NULL,
      playlistname TEXT NOT NULL,
      CONSTRAINT p_id_pk PRIMARY KEY (playlistid)

    );

    CREATE TABLE IF NOT EXISTS auxium.songs (
      songid SERIAL NOT NULL,
      url TEXT,
      href TEXT,
      title TEXT,
      artists TEXT,
      album TEXT,
      year integer,
      duration integer,
      playlist integer,
        CONSTRAINT s_pk PRIMARY KEY (songid)
    );

    CREATE TABLE IF NOT EXISTS auxium.user_playlist (
      userid TEXT,
      playlistid INTEGER,
        CONSTRAINT u_up_fk FOREIGN KEY (userid) REFERENCES auxium.users(userid),
        CONSTRAINT p_up_fk FOREIGN KEY (playlistid) REFERENCES auxium.playlists(playlistid)
    );

    CREATE TABLE IF NOT EXISTS auxium.playlist_song (
      playlistid INTEGER,
      songid INTEGER,
      songOrder INT,
        CONSTRAINT p_ps_fk FOREIGN KEY (playlistid) REFERENCES auxium.playlists(playlistid),
        CONSTRAINT s_ps_fk FOREIGN KEY (songid) REFERENCES auxium.songs(songid)
    );




    ALTER TABLE auxium.users OWNER TO postgres;
    ALTER TABLE auxium.user_playlist OWNER TO postgres;
    ALTER TABLE auxium.playlists OWNER TO postgres;
    ALTER TABLE auxium.playlist_song OWNER TO postgres;
    ALTER TABLE auxium.songs OWNER TO postgres;

  `;

  pool.query(createTablesQuery)
    .then((res) => {
      console.log("Success creating tables: ", res);
    })
    .catch((err) => {
      console.log("ERROR creating tables: ", err);
    })

    return;
}
createTables();


pool.on("error", () => {
  console.log("ERROR connecting to database: ", err)
})