const querystring = require('querystring');
const request = require('request');

require('dotenv').config();

const redirect_uri = 'http://localhost:' + process.env.PORT + '/callback';


//First API call for O-Auth
  //Sends random string as state, along with credentials to request access to data (prompts user to login to their account)
let login = (req, res) => {
  console.log("ERE")
  let buildRandomString = (length) => {
    let str = '';
    let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    while (str.length < length) {
      str += letters[Math.floor(Math.random() * letters.length)];
    }
    return str;
  }

  let state = buildRandomString(16);
  let scope = 'user-read-email user-read-private user-read-playback-state streaming';
  res.cookie('spotify_auth_state', state);

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.CLIENT_ID,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }))
}

//requests access token and refresh token
let getAccessToken = (req, res) => {

  let code = req.query.code || null;
  let state = req.query.state || null;
  let storedState = req.cookies ? req.cookies['spotify_auth_state'] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' + querystring.stringify({
      error: 'state_mismatch'
    }));
  } else {
    res.clearCookie('spotify_auth_state');

    let authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {

        'Authorization': 'Basic ' + (new Buffer.from(
          process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET
          ).toString('base64'))
      },
      json: true
    }

    request.post(authOptions, (error, response, body) => {
       if (!error && response.statusCode === 200) {
          let access_token = body.access_token;
          let refresh_token = body.refresh_token;

          let options = {
            url: 'https://api/spotify.com/v1/me',
            headers: { 'Authorization': 'Bearer' + access_token },
            json: true
          };

          //use access token to access the Spotify APi
          request.get(options, (error, response, body) => {

          })

          res.redirect('/#' +
              querystring.stringify({
                access_token: access_token,
                refresh_token: refresh_token
              })
            );


        } else {
          console.log('error: ', err);
          res.redirect('/#' +
            querystring.stringify({
              error: 'invalid_token'
            })
          );
        }
    })
  }

}


//request new access token after one hour, using refresh token
let getRefreshToken = (req, res) => {

  let refresh_token = req.query.refresh_token;

  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    data: {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env_CLIENT_ID
    },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  }
console.log("authOptions", authOptions)
  request.post(authOptions, (err, response, body) => {
    console.log("BODY BODY", response.query)
    if (!err && response.statusCode === 200) {
      let access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    } else {
      console.log("Error with refresh_token:", response.body.error)
    }
  });

}


module.exports = {
  login: login,
  getAccessToken: getAccessToken,
  getRefreshToken: getRefreshToken
}