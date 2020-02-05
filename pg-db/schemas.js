const { Pool } = require('pg');
require('dotenv').config();

const connectionString = `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`

const pool = new Pool({
  connectionString: connectionString
})

pool.on('connect', () => {

  const createTablesQuery = `
    CREATE SCHEMA IF NOT EXISTS auxium AUTHORIZATION postgres;

    CREATE TABLE IF NOT EXISTS auxium.users (
      userid integer NOT NULL,
      playlists integer [],
      CONSTRAINT users_pk PRIMARY KEY (userid)
      );

    ALTER TABLE auxium.users OWNER TO postgres;

    CREATE TABLE IF NOT EXISTS auxium.playlists (
      playlistid integer NOT NULL,
      playlistname character varying(25)
      songs integer [],
      CONSTRAINT playlist_pk PRIMARY KEY (playlistid)
    );

    ALTER TABLE auxium.playlists OWNER TO postgres;

    CREATE TABLE IF NOT EXISTS auxium.songs (
      songid integer NOT NULL,
      url character varying(200),
      href character varying(200),
      title character varying(50),
      artists character varying(50),
      album character varying(50),
      year integer,
      duration integer,
      CONSTRAINT song_pk PRIMARY KEY (songid)
    )

    ALTER TABLE auxium.song OWNER TO postgres;

  `;

  pool.query(createTablesQuery)
    .then((res) => {
      console.log("Success creating tables: ", res);
      pool.end();
    })
    .catch((err) => {
      console.log("ERROR creating tables: ", err);
      pool.end();
    })
})