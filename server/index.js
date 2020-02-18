///// IMPORTS /////
const cookieParser = require('cookie-parser');
const querystring = require('querystring');
const request = require('request');
const cors = require('cors');
const path = require('path');

///// IMPORT CONTROLLERS
const authentication = require('./controllers/authentication.js');
const mainPlayer = require('./controllers/mainPlayer.js');
const playlist = require('./controllers/playlist.js');

///// ENVIRONMENTAL VARIABLES /////
require('dotenv').config();
const port = process.env.PORT;
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

const redirect_uri = 'http://localhost:' + port + '/callback';

///// EXPRESS SERVER /////
const express = require('express');
const app = express();

app.use(express.static(__dirname + './../client/dist'));
app.use(cors());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true}))
app.use(express.json())

///// ENABLING CORS /////
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
    return res.status(200).json({});
  }
  next();
});

app.get('/', (req, res) => {
  res.send();
})

///// AUTHENTICATION ROUTES /////
app.get('/login', authentication.login);

//route after authorization server returns authorization code
  //Send Client ID and Secret code in headers along with authorization code --> Client then sends authorization code back, to exchange for access token
app.get('/callback', authentication.getAccessToken);

//Will need to request new access token after one hour --> use refresh token to do so
app.get('/refresh_token', authentication.getRefreshToken);



///// DATABASE ROUTES /////

app.post('/db/update_playlist', playlist.addSong);

app.post('/db/create_playlist', playlist.addPlaylist);

app.delete('/db/delete_song', playlist.deleteSong);

app.post('/db/get_playlist', playlist.getPlaylist);

app.post('/db/get_all_playlists', playlist.getAllPlaylists);


app.listen(port, () => {
  console.log('Listening on port: ', port)
})
