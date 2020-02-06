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
      user: null,
      refresh_token: null,
      currentSong: null,
      currentPlaylist: [],
      currentPlaylistName: null,
      playlists: [],
      lastPlaylistId: 1,
      currentSearchResults: []
    }

    // this.getPlaylist = this.getPlaylist.bind(this);
    // this.playSong = this.playSong.bind(this);
    this.login = this.login.bind(this);
    this.searchHandler = this.searchHandler.bind(this);
    this.refreshAccess = this.refreshAccess.bind(this);
    this.resultsHandler = this.resultsHandler.bind(this);
    this.createPlaylist = this.createPlaylist.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
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
    // console.log("refreshing access with token:", refresh_token)

    axios.get(`http://localhost:3001/refresh_token`, {
      params: {
        refresh_token: refresh_token
      }
    })
    .then((response) => {
      spotifyAPI.setAccessToken(response.access_token);
      //refresh page?

    })
    .catch((error) => {
      console.log(error);
    })

  }


  //pulls access and refresh tokens from url
  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  //searhes spotify (will eventually be able to chose to search songs, artists, or albums specifically)
  searchHandler() {
    let newSong = document.getElementById('addSong').value;

    spotifyAPI.searchTracks(newSong)
      .then((data) => {
        let searchResults = data.tracks.items;

        this.setState({
          currentSearchResults: searchResults
        })

      }).catch(err => {
        if (err.status === 401) {
          if (confirm("You have been logged out of Spotify. To log back in, press 'Okay'")) {
            this.refreshAccess();

          }
        } else {
          console.log("Error retrieving song.. ", err)
        }
    });

  }


  resultsHandler (e) {
    e.preventDefault();

    let songId = e.target.id;
    let newSong = this.state.currentSearchResults[songId];

    let updatedPlaylist = this.state.currentPlaylist
    updatedPlaylist.push(newSong);

    console.log(this.state.currentPlaylist)
    this.setState({
      currentPlaylist: updatedPlaylist
    })

    //update playlist by adding song to db
    this.savePlaylist(newSong);

  }


  savePlaylist (newSong) {
    console.log("save playlist:", this.state.currentPlaylist)
    axios.post(`http://localhost:3001/db/update_playlist`, {
      params: {
        playlist: this.state.currentPlaylistName,
        song: newSong
      }
    })
    .then((response) => {
      console.log("Success saving playlist to database: ", response)
      //refresh page?

    })
    .catch((error) => {
      console.log("Error adding updating playlist to database:", error);
    })
  }


  // getPlaylist(playlist='main') {
  //   axios.get('/db/update_playlist', {
  //     params: {
  //       playlist: playlist
  //     }
  //   })
  //     .then(results => {
  //       let nowPlaying = results.data[0];

  //       this.setState({
  //         currentPlaylist: results.data,
  //         currentSong: nowPlaying,
  //         currentPlaylistName: playlist
  //       })
  //     })
  //     .catch(err => {
  //       console.log(err)
  //     })
  // }


  createPlaylist() {
    let newPlaylist = document.getElementById('add-playlist').value;
    let newPlaylistId = this.state.lastPlaylistId;

    axios.post(`http://localhost:3001/db/create_playlist`, {
      params: {
        newPlaylist: newPlaylist,
        newPlaylistId: newPlaylistId
      }
    }).then(data => {
      //increment lastplaylist id
      let updatedPlaylists = this.state.playlists;
      updatedPlaylists.push(newPlaylist);

      this.setState({
        lastPlaylistId: newPlaylistId + 1,
        playlists: updatedPlaylists

      })
      //add new playlist to playlists in state
      //if no current playlist, set it
    })
    .catch(err => {
      console.log("ERROR creating new playlist: ", err);
    })
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


  // playSong(e) {
  //   e.preventDefault();

  //   let songId = e.target.id;
  //   let playSong = this.state.songs[songId];

  //   this.setState({
  //     currentSong: playSong
  //   })
  // }


  componentDidMount() {
    let access_token = this.getHashParams().access_token;
    let refresh_token = this.getHashParams().refresh_token;

    if (access_token) {
      this.setState({
        loggedIn: true,
        user: 'haley',
        refresh_token: refresh_token
      })
      spotifyAPI.setAccessToken(access_token);
    }

    //get playlists, set first one to currentPlaylist in state
      //if not playlists add default one 'Main'
  }

  componentWillUnmount() {
    this.savePlaylist();
  }

  render() {
    console.log("LOKKKKOI", this.state.currentSearchResults)
    return (
      <div id='mainpage'>
        {this.state.loggedIn ?
            <div>
            <Player currentSong={this.state.currentSong}/>
            <PlaylistContainer playlists={this.state.playlists} changeSong={this.playSong} playlist={this.state.currentPlaylistName} songs={this.state.currentPlaylist} addPlaylist={this.createPlaylist} />

            <div id="search">
              <div id="search-bar">
                <div id="search-bar">

                  <form className="form" id="addItemForm">
                    <input
                      type="text"
                      className="input"
                      id="addSong"
                      placeholder="Search the title of a song"
                    />
                    <button className="button is-info" onClick={this.searchHandler}>
                      Add Song
                    </button>
                  </form>
                </div>
              </div>
              <SearchResults playlist={this.state.currentPlaylist} addSong={this.resultsHandler} results={this.state.currentSearchResults} />

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