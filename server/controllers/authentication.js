let login = (req,rest) => {
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

    request.post(authOptions, (err, response, body) => {
      if (response.statusCode !== 200 || err) {
        console.log('error: ', err);
        res.redirect('/#' +
        querystring.stringify({
            error: 'invalid_token'
          })
          );

      } else {
        let access_token = body.access_token;
        let refresh_token = body.refresh_token;

        let options = {
          url: 'https://api/spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer' + access_token },
          json: true
        }

        //use access token to access the Spotify APi
        request.get(options, (err, response, body) => {
          console.log("body", body);
          console.log("response", response)
        })

        res.redirect('http://localhost:3001/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
        }
    })
  }

}

let getRefreshToken = (req, res) => {
  let refresh_token = req.query.refresh_token;
  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic' + (new Buffer(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString)
    },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  }

  request.post(authOptions, (err, response, body) => {
    if (!err && response.statusCode === 200) {
      let access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });

}


module.exports = {
  login: login,
  getAccessToken: getAccessToken,
  getRefreshToken: getRefreshToken
}