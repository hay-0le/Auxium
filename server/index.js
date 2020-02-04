const request = require('request');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const querystring = require('querystring');
const path = require('path');

require('dotenv').config();
const port = process.env.PORT;
const redirect_uri = process.env.REDIRECT_URI || 'http://localhost:' + port + '/callback';

const authentication = require('./controllers/authentication.js')

const express = require('express');
const app = express();

app.use(express.static(__dirname + './../client/dist'));
app.use(cors());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true}))
app.use(express.json())

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

let buildRandomString = (length) => {
  let str = '';
  let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  while (str.length < length) {
    str += letters[Math.floor(Math.random() * letters.length)];
  }
  return str;
}


app.get('/', (req, res) => {
  //home page
  res.send("Hello Haley");
})


app.get('/login', authentication.login);
//   let state = buildRandomString(16);
//   let scope = 'user-read-email user-read-private user-read-playback-state streaming';
//   res.cookie('spotify_auth_state', state);

//   res.redirect('https://accounts.spotify.com/authorize?' +
//     querystring.stringify({
//       response_type: 'code',
//       client_id: process.env.CLIENT_ID,
//       scope: scope,
//       redirect_uri: redirect_uri,
//       state: state
//     }))
// })

//route after authorization server returns authorization code
//Send Client ID and Secret code in headers along with authorization code
//Client then sends authorization code back, to exchange for access token
app.get('/callback', authentication.getAccessToken);
  // let code = req.query.code || null;
  // let state = req.query.state || null;
  // let storedState = req.cookies ? req.cookies['spotify_auth_state'] : null;

  // if (state === null || state !== storedState) {
  //   res.redirect('/#' + querystring.stringify({
  //     error: 'state_mismatch'
  //   }));
  // } else {
  //   res.clearCookie('spotify_auth_state');

  //   let authOptions = {
  //     url: 'https://accounts.spotify.com/api/token',
  //     form: {
  //       code: code,
  //       redirect_uri: redirect_uri,
  //       grant_type: 'authorization_code'
  //     },
  //     headers: {

  //       'Authorization': 'Basic ' + (new Buffer.from(
  //         process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET
  //         ).toString('base64'))
  //     },
  //     json: true
  //   }

  //   request.post(authOptions, (err, response, body) => {
  //     if (response.statusCode !== 200 || err) {
  //       console.log('error: ', err);
  //       res.redirect('/#' +
  //       querystring.stringify({
  //           error: 'invalid_token'
  //         })
  //         );

  //     } else {
  //       let access_token = body.access_token;
  //       let refresh_token = body.refresh_token;

  //       let options = {
  //         url: 'https://api/spotify.com/v1/me',
  //         headers: { 'Authorization': 'Bearer' + access_token },
  //         json: true
  //       }

  //       //use access token to access the Spotify APi
  //       request.get(options, (err, response, body) => {
  //         console.log("body", body);
  //         console.log("response", response)
  //       })

  //       res.redirect('http://localhost:3001/#' +
  //         querystring.stringify({
  //           access_token: access_token,
  //           refresh_token: refresh_token
  //         }));
  //       }
  //   })
  // }
// })


//request access using refresh token
app.get('/refresh_token', authentication.getRefreshToken)
;//username=6auyw95oqfdnzc95jxyk5waqd'


app.get('/playlist/:playList', controllers.getPlaylist);

app.get('/playlist/:addSong', controllers.addSong);

app.listen(port, () => {
  console.log('Listening on port: ', port)
})




      // var options = {
      //   url: 'https://api/spotify.com/v1/me',
      //   headers: { 'Authorization': 'Bearer' + access_token},
      //   json: true
      // }

      // //use access token to access the Spotify APi
      // request.get(options, (err, response, body) => {
      //   console.log(body)
      // })