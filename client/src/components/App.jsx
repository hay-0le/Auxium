import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import axios from 'axios';
import Player from './Player.jsx';
import queryString from 'query-string';
import PlaylistContainer from './PlaylistContainer.jsx';
import SearchResults from './SearchResults.jsx';

// require('dotenv').config();
var Spotify = require('spotify-web-api-js');
var spotifyAPI = new Spotify();

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
      refresh_token: null,
      currentSong: null,
      currentPlaylist: null,
      songs: [],
      playlists: ['main', 'code'],
      currentSearchResults: []
    }

    // this.getPlaylist = this.getPlaylist.bind(this);
    // this.playSong = this.playSong.bind(this);
    this.login = this.login.bind(this);
    this.searchHandler = this.searchHandler.bind(this);
    this.refreshAccess = this.refreshAccess.bind(this);
    this.resultsHandler = this.resultsHandler.bind(this);
  }

  login(e) {
    e.preventDefault();

    console.log("clicked")
    // axios.get('http:/login')
    //   .then(response => {
    //     console.log("Response", response)
    //   })
    //   .catch(err => {
    //     console.log("Error:", err)
    //   })
    window.location = 'http://localhost:3001/login'
  }

  refreshAccess() {
    let refresh_token = this.state.refresh_token;
    console.log("refreshing access")

    axios.get(`http://localhost:3001/refresh_token`)
    .then(response => {

      if (response.status === 202) {
        console.log(response)
      }

    }).catch(error => {
      console.log(error.response)
    })

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

  searchHandler() {
    let newSong = document.getElementById('addInput').value;
    console.log('clicked: ', newSong)

    spotifyAPI.searchTracks(newSong)
      .then(function(data) {
        console.log('Artist albums', data.tracks.items);

      }).catch(err => {
        if (err.status === 401) {
          if (confirm("You have been logged out of Spotify. To log back in, press 'Okay'")) {
            console.log("confirmed")

            this.refreshAccess();

          }
        } else {
          console.log("Error retrieving song.. ", err)
        }
    });

  }

  resultsHandler (e) {
    e.preventDefault();
  }

  // getNowPlaying () {
  //   spotifyWebApi.getMyCurrentPlaybackState()
  //     .then(result => {
  //       // this.setState({
  //       //   currentSong:
  //       // })
  //       console.log(result);
  //     })
  // }


  // getPlaylist(playList='main') {
  //   axios.get(`/playlist/${playList}`)
  //     .then(results => {
  //       let nowPlaying = results.data[0];

  //       this.setState({
  //         songs: results.data,
  //         currentSong: nowPlaying,
  //         currentPlaylist: playList
  //       })
  //     })
  //     .catch(err => {
  //       console.log(err)
  //     })
  // }

  // playSong(e) {
  //   e.preventDefault();

  //   let songId = e.target.id;
  //   let playSong = this.state.songs[songId];

  //   this.setState({
  //     currentSong: playSong
  //   })
  // }

  // createPlaylist() {
  //   //add empty playlist to database
  //   //add playlist name to state
  // }

  componentDidMount() {

    let access_token = this.getHashParams().access_token;
    let refresh_token = this.getHashParams().refresh_token;

    // console.log("access toke", access_token);
    // console.log("refresh toke", refresh_token);

    if (access_token) {
      this.setState({
        loggedIn: true,
        refresh_token: refresh_token
      })
      spotifyAPI.setAccessToken(access_token);
    }

  }

  render() {
    return (
      <div id='mainpage'>
        {this.state.loggedIn ?
            <div>
            <Player currentSong={this.state.currentSong}/>
            <PlaylistContainer playlists={this.state.playlists} changeSong={this.playSong} playlist={this.state.currentPlaylist} songs={this.state.songs}/>

            <div id="search">
              <div id="search-bar">
                <div id="search-bar">

                  <form className="form" id="addItemForm">
                    <input
                      type="text"
                      className="input"
                      id="addInput"
                      placeholder="Search the title of a song"
                    />
                    <button className="button is-info" onClick={this.searchHandler}>
                      Add Song
                    </button>
                  </form>
                </div>
              </div>
              <SearchResults playlist={this.state.currentPlaylist} addSong={this.resultsHandler} results={this.currentSearchResults} />

            </div>
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