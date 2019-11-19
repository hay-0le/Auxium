import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import axios from 'axios';
// require('dotenv').config();

// var Spotify = require('spotify-web-api-js');
// var spotifyAPI = new Spotify();

// s

import PlayLists from './Playlists.jsx'

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false

    }
    this.login = this.login.bind(this);
  }

  login(e) {
    e.preventDefault();
    axios.get('/login')
      .then(res => {
        console.log('logged in!')
        console.log(res)
      })
      .catch(err => {
        console.log('error: ', err);
        // alert('error logging in')
      })
  }

  render () {
    return (
      <div id='mainpage'>
        {this.state.loggedIn ?
          <Playlists /> :
          <div id="spotifyLogin">
            <h2>Log In to Your Spotify</h2>
            <button id='login' onClick={this.login}>Login</button>
          </div>
          }

      </div>
    )
  }
}

export default App;