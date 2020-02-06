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
    DROP TABLE IF EXISTS auxium.songs;
    DROP TABLE IF EXISTS auxium.playlists;

    CREATE TABLE IF NOT EXISTS auxium.users (
      userid SERIAL PRIMARY KEY,
      playlists integer []
    );

    ALTER TABLE auxium.users OWNER TO postgres;

    CREATE TABLE IF NOT EXISTS auxium.playlists (
      playlistid SERIAL PRIMARY KEY,
      playlistname character varying(25) NOT NULL,
      songs integer []
    );

    ALTER TABLE auxium.playlists OWNER TO postgres;

    CREATE TABLE IF NOT EXISTS auxium.songs (
      songid SERIAL PRIMARY KEY,
      url character varying(200),
      href character varying(200),
      title character varying(50),
      artists character varying(50),
      album character varying(50),
      year integer,
      duration integer,
      playlist character varying(50)
    );

    ALTER TABLE auxium.songs OWNER TO postgres;

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

}
createTables();


pool.on("error", () => {
  console.log("ERROR connecting to database: ", err)
})