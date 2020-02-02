const request = require('request');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const querystring = require('querystring');

require('dotenv').config();
const port = process.env.PORT;
var scopes = process.env.SCOPES;
const redirect_uri = process.env.REDIRECT_URI || 'http://localhost:' + port + '/callback';

const controllers = require('./controllers/playlist.js')

const express = require('express');
const app = express();

app.use(cors());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true}))
app.use(express.json())
app.use(express.static(__dirname + './../client/dist'));

// Enabling CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
    return res.status(200).json({});
  }
  next();
});

app.get('/login', (req, res) => {
  console.log("Hello from log in request")
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.CLIENT_ID,
      scope: 'user-read-private user-read-email',
      redirect_uri: redirect_uri
    }))
})

//route after login request is made
app.get('/callback', (req, res) => {
  let code = req.query.code || null;
  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(
        process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET
      ).toString('base64'))
    },
    json: true
  }
  request.post(authOptions, (err, response, body) => {
    if (err) {
      console.log('error: ', err)
    } else {
      console.log('response: ', response)
      var access_token = body.access_token;

      // var options = {
      //   url: 'https://api/spotify.com/v1/me',
      //   headers: { 'Authorization': 'Bearer' + access_token},
      //   json: true
      // }

      // //use access token to access the Spotify APi
      // request.get(options, (err, response, body) => {
      //   console.log(body)
      // })

      let uri = 'http://locahost:5463/';
      res.redirect(uri + '?access_token=' + access_token)
    }
  })
})

//username=6auyw95oqfdnzc95jxyk5waqd'

app.get('/playlist/:playList', controllers.getPlaylist)

app.listen(port, () => {
  console.log('Listening on port: ', port)
})