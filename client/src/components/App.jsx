import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import axios from 'axios';
import PlaylistContainer from './PlaylistContainer.jsx';

// require('dotenv').config();
// var Spotify = require('spotify-web-api-js');
// var spotifyAPI = new Spotify();

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
      currentSong: null,
      currentPlaylist: null,
      songs: [],
      playlists: ['main']
    }
    this.login = this.login.bind(this);
    this.getPlaylist = this.getPlaylist.bind(this);
    this.playSong = this.playSong.bind(this);
  }

  login(e) {
    e.preventDefault();
    document.location.href='/login'
  }

  getPlaylist(playList='main') {
    axios.get(`/playlist/${playList}`)
      .then(results => {
        console.log('axios results type of: ', Array.isArray(results.data))
        this.setState({
          songs: results.data,
          currentPlaylist: playList
        })
      })
  }

  playSong(e) {
    e.preventDefault();
    console.log('clicked')
    let songId = e.target.id;
    let playSong = this.state.songs[id];

    this.setState({
      currentSong: playSong
    })
    console.log(songId, this.state.currentSong)
  }

  createPlaylist() {
    //add empty playlist to database
    //add playlist name to state
  }

  componentDidMount() {
    //fix this
    if (window.location.href.length > 35) {
      this.setState({
        loggedIn: true
      })
    }
    this.getPlaylist();

  }

  render() {
    return (
      <div id='mainpage'>
        {this.state.loggedIn ?
            <div>
            <PlaylistContainer  changeSong={this.playSong} playlist={this.state.currentPlaylist} songs={this.state.songs}/>
          </div>
          :
          <div id="spotifyLogin">
            <h2>Log In to Your Spotify</h2>
            <button id='login' onClick={this.login}>Click Here to Login</button>
          </div>
          }

      </div>
    )
  }
}

export default App;