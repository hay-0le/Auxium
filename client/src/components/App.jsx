// import $ from 'jquery';
// import queryString from 'query-string';
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Player from './Player.jsx';
import PlaylistContainer from './PlaylistContainer.jsx';
import SearchResults from './SearchResults.jsx';

// require('dotenv').config();
var Spotify = require('spotify-web-api-js');
var Q = require('q')
var spotifyAPI = new Spotify();
spotifyAPI.setPromiseImplementation(Q);

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
      playlists: null,
      currentSearchResults: []
    }

    this.getPlaylist = this.getPlaylist.bind(this);
    // this.playSong = this.playSong.bind(this);
    this.login = this.login.bind(this);
    this.searchHandler = this.searchHandler.bind(this);
    this.refreshAccess = this.refreshAccess.bind(this);
    this.resultsHandler = this.resultsHandler.bind(this);
    this.createPlaylist = this.createPlaylist.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.getAllPlaylists = this.getAllPlaylists.bind(this);
    this.changePlaylist = this.changePlaylist.bind(this);
    this.getUserData = this.getUserData.bind(this);
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

    //TODO turn into async/await so song isn't added to state until its added to db
    //update playlist by adding song to db
    this.savePlaylist(newSong)

    let updatedPlaylist = this.state.currentPlaylist
    updatedPlaylist.push(newSong);

    // console.log(this.state.currentPlaylist)
    // this.setState({
    //   currentPlaylist: updatedPlaylist
    // })



  }


  savePlaylist (newSong) {
    console.log("Add song to playlist:", this.state.currentPlaylist)
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
      console.log("Error updating playlist in database:", error);
    })
  }


  getAllPlaylists (userid) {
    //TODO: create new userid in db if newUser = true
    //TODO: change to async
    console.log("Getting all playlists at id", userid)
    axios.post('/db/get_all_playlists', {
      userid
    })
      .then(data => {
        //extra only the playlist names from the returned object
        data = data.data.rows.map(playlist => playlist.playlistname);

        return data;
      })
      .catch(err => {
        console.log("ERROR retreiving playlists:", err)
      })
  }



  createPlaylist() {
    let newPlaylist = document.getElementById('add-playlist').value;

    axios.post(`http://localhost:3001/db/create_playlist`, {
      params: {
        newPlaylist: newPlaylist
      }
    }).then(data => {
      let updatedPlaylists = this.state.playlists;
      updatedPlaylists.push(newPlaylist);

      //if no current playlist, set it to newPlaylist, else keep it the same
      let currentPlaylist = this.state.currentPlaylistName || newPlaylist;

      this.setState({
        playlists: updatedPlaylists,
        currentPlaylistName: currentPlaylist

      })
      //add new playlist to playlists in state
      //if no current playlist, set it
    })
    .catch(err => {
      console.log("ERROR creating new playlist: ", err);
    })
  }




  changePlaylist (e) {
    //TODO : grab playlist by id instead of name
    e.preventDefault();

    let nextPlaylist = e.target.innerHTML;
    let songs = this.getGetPlaylist(nextPlaylist);

    this.setState({
      currentPlaylistName: nextPlaylist,
      currentPlaylist: songs
    })

  }









  getUserData() {
    return new Promise((resolve, reject) => {
      spotifyAPI.getMe()
      .then(userData => {
        if (userData) {
          let userAndID = {
            user: userData.display_name,
            userid: userData.id
          }
          resolve(userAndID)
        } else {
          console.log("Error getting user data from spotify")
        }
      })
    })

  }










  getPlaylist (playlist) {
    axios.post(`http://localhost:3001/db/get_playlist`, {
      nextPlaylist: playlist
    })
    .then(data => {
      songs = data.data.rows;
      if (songs.length === 0) {
        console.log("There are no songs in this playlist")
        this.setState({
          currentPlaylist: []
        });
        return;

      } else {
        return songs;
      }
    })
    .catch(err => {
      console.log("ERROR getting playlist: ", err);
    })

  }


  componentDidMount() {

    let access_token = this.getHashParams().access_token;
    let refresh_token = this.getHashParams().refresh_token;

    spotifyAPI.setAccessToken(access_token);


    if (this.state.loggedIn === false && access_token) {
      let user;

      this.getUserData().then((data) => {
        // console.log("DATA", data)
        user = data;
        return data.userid;
      })
      .then(id => {
        let playlists = this.getAllPlaylists(id);
        // console.log("Playlists", id)
      })
      .catch(err => {
        console.log("error retreiving user, and playlists", err)
      })

        // let playlists = await this.getAllPlaylists(userid);

        // //get songs for first playlist
        // let songs = await this.getPlaylist(playlists[0]);

        // this.setState({
        //   loggedIn: true,
        //   user: user,
        //   refresh_token: refresh_token,
        //   currentPlaylist: songs,
        //   playlists: playlists
        // })

    };
  }

  render() {
    return (
      <div id='mainpage'>
        {this.state.loggedIn ?
            <div>
            <Player currentSong={this.state.currentSong}/>
            <PlaylistContainer playlists={this.state.playlists} changeSong={this.playSong} playlist={this.state.currentPlaylistName} songs={this.state.currentPlaylist} addPlaylist={this.createPlaylist} currentPlaylist={this.state.currentPlaylistName} changePlaylist={this.changePlaylist} />
            <div></div>
            <div id="search">
              <div id="search-bar">
                <div id="search-bar">
                  <h4>Add a song to this playlist </h4>
                  <form className="form" id="addItemForm">
                    <input
                      type="text"
                      className="input"
                      id="addSong"
                      placeholder="Search the title of a song"
                    />
                    <button className="button is-info" onClick={this.searchHandler}>
                      Search
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