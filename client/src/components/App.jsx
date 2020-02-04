import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import axios from 'axios';
import PlaylistContainer from './PlaylistContainer.jsx';
import queryString from 'query-string';

// require('dotenv').config();
var Spotify = require('spotify-web-api-js');
var spotifyAPI = new Spotify();

class App extends React.Component {
  constructor(props) {
    super(props);
    let params = getHashParams();
    this.state = {
      loggedIn: false,
      currentSong: null,
      currentPlaylist: null,
      songs: [],
      playlists: ['main', 'code']
    }

    if (params.access_token) {
      spotifyWebApi.setAccessToken(params.access_token);
    }

    this.login = this.login.bind(this);
    this.getPlaylist = this.getPlaylist.bind(this);
    this.playSong = this.playSong.bind(this);
  }

  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  getNowPlaying () {
    spotifyWebApi.getMyCurrentPlaybackState()
      .then(result => {
        // this.setState({
        //   currentSong:
        // })
        console.log(result);
      })
  }

  login(e) {
    e.preventDefault();
    document.location.href='/login'
  }

  getPlaylist(playList='main') {
    axios.get(`/playlist/${playList}`)
      .then(results => {
        let nowPlaying = results.data[0];

        this.setState({
          songs: results.data,
          currentSong: nowPlaying,
          currentPlaylist: playList
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  playSong(e) {
    e.preventDefault();

    let songId = e.target.id;
    let playSong = this.state.songs[songId];

    this.setState({
      currentSong: playSong
    })
  }

  createPlaylist() {
    //add empty playlist to database
    //add playlist name to state
  }

  componentDidMount() {
    //fix this
    // let access_token = queryString.parse(window.location.search).access_token;
    // console.log(access_token)
    // if (!access_token) {
    //   return;
    // }

    // axios.get('http://api.spotify.com/v1/me')


    //   this.setState({
    //     loggedIn: true
    //   })


  }

  render() {
    return (
      <div id='mainpage'>
        {this.state.loggedIn ?
            <div>
            <Player currentSong={this.state.currentSong}/>
            <PlaylistContainer playlists={this.state.playlists} changeSong={this.playSong} playlist={this.state.currentPlaylist} songs={this.state.songs}/>
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