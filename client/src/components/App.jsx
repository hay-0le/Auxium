// import $ from 'jquery';
// import queryString from 'query-string';
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import styled from 'styled-components';
import { Grid, GridItem } from 'styled-grid-component';

import Player from './Player.jsx';
import Header from './Header.jsx';
import PlaylistContainer from './PlaylistContainer.jsx';
import SearchPlayerContainer from './SearchPlayerContainer.jsx';
import SearchResults from './SearchResults.jsx';
import SongsContainer from './SongsContainer.jsx';


// require('dotenv').config();
var Spotify = require('spotify-web-api-js');
var Q = require('q')
var spotifyAPI = new Spotify();
spotifyAPI.setPromiseImplementation(Q);

const MainPage = styled.div`
  display: flex;
`;

const ContainerColumn = styled.div`
  margin: 15px;
`;


class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
      user: null,
      userid: null,
      refresh_token: null,
      currentSong: null,
      currentPlaylistSongs: [],
      currentPlaylist: null,
      currentPlaylistId: null,
      playlists: null,
      currentSearchResults: []
    }

    this.getPlaylist = this.getPlaylist.bind(this);
    this.login = this.login.bind(this);
    this.searchHandler = this.searchHandler.bind(this);
    this.refreshAccess = this.refreshAccess.bind(this);
    this.resultsHandler = this.resultsHandler.bind(this);
    this.createPlaylist = this.createPlaylist.bind(this);
    this.addSongToPlaylist = this.addSongToPlaylist.bind(this);
    this.getAllPlaylists = this.getAllPlaylists.bind(this);
    this.changePlaylist = this.changePlaylist.bind(this);
    this.getUserData = this.getUserData.bind(this);
    this.getSpotifyUser = this.getSpotifyUser.bind(this);
    this.deleteSong = this.deleteSong.bind(this);
  }


  login(e) {
    e.preventDefault();
    console.log("clicked")

    // axios.get('http://localhost:3001/login')
    //   .then(() => {
    //     console.log("Success logging in");
    //   })
    //   .catch(err => {
    //     console.log("Error logging in", err)
    //   })
    window.location = '/login';
  }


  refreshAccess() {
    let refresh_token = this.state.refresh_token;
    console.log("refreh", refresh_token)
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
//TODO: get search results out of state
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
    this.addSongToPlaylist(newSong)

    // let updatedPlaylist = this.state.currentPlaylistSongs
    // updatedPlaylist.push(newSong);

    // console.log(this.state.currentPlaylistSongs)
    // this.setState({
    //   currentPlaylistSongs: updatedPlaylist
    // })

  }


  addSongToPlaylist (newSong) {
console.log("ASDASD", this.state.currentPlaylistId)
    axios.post(`http://localhost:3001/db/update_playlist`, {
      params: {
        playlist: this.state.currentPlaylist,
        playlistid: this.state.currentPlaylistId,
        song: newSong
      }
    })
    .then((newSong) => {
      console.log("Success saving playlist to database: ", newSong)
      let updatedPlaylist = this.state.currentPlaylistSongs;

      updatedPlaylist.push(newSong.data);
      this.setState({
      currentPlaylistSongs: updatedPlaylist
    })

    })
    .catch((error) => {
      console.log("Error updating playlist in database:", error);
    })
  }


  createPlaylist(e) {
    let newPlaylist = document.getElementById('add-playlist').value;

    axios.post(`http://localhost:3001/db/create_playlist`, {
      params: {
        newPlaylist: newPlaylist,
        userid: this.state.userid
      }
    }).then(data => {
      let updatedPlaylists = this.state.playlists;
      updatedPlaylists.push(newPlaylist);
      console.log("HEY", updatedPlaylists)

      //if no current playlist, set it to newPlaylist, else keep it the same
      let currentPlaylist = this.state.currentPlaylist || newPlaylist;
      console.log("CURRENTPLAYLIST", currentPlaylist)
      this.setState({
        playlists: updatedPlaylists,
        currentPlaylist: currentPlaylist

      })
      //add new playlist to playlists in state
      //if no current playlist, set it
    })
    .catch(err => {
      console.log("ERROR creating new playlist: ", err);
    })
  }


  changePlaylist (e) {
    e.preventDefault();

    let nextPlaylist = e.target.innerHTML;
    let nextPlaylistId = e.target.id;

    this.getPlaylist(nextPlaylistId)
      .then(songs => {
        console.log("Songs", songs)

        this.setState({
          currentPlaylist: nextPlaylist,
          currentPlaylistSongs: songs
        })
      })
  }

  deleteSong (e) {
    let songid = e.currentTarget.id;

    return axios.delete('http://localhost:3001/db/delete_song', {
      params: {
        songid: songid,
      playlistid: this.state.currentPlaylistId
      }
    })
    .then(deletedId => {
      deletedId = deletedId.data[0].songid, this.state.currentPlaylistSongs;

      let songsList = this.state.currentPlaylistSongs.filter(song => song.songid !== deletedId);

      this.setState({
        currentPlaylistSongs: songsList
      })

    })
    .catch(err => {
      console.log("ERROR deleting song")
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


  getPlaylist (playlistid) {
    return axios.post(`http://localhost:3001/db/get_playlist`, {
        nextPlaylistId: playlistid
      })
      .then(songs => {
        songs = songs.data;

        if (songs.length === 0) {
          console.log("There are no songs in this playlist")
          return [];

        } else {
          return songs;
        }
      })
      .catch(err => {
        console.log("ERROR getting playlist: ", err);
      })
  }


  getAllPlaylists (userid, username) {
    return axios.post('/db/get_all_playlists', {
        userid, username
      })
      .then(data => {
        return data.data;
      })
      .catch(err => {
        console.log("ERROR retreiving playlists:", err)
      })
  }
// <3

  getSpotifyUser(){
    return this.getUserData().then((data) => {
      return data;
    })
    .catch(err => {
      console.log("Error retreiving user, and playlists", err)
    })
  }


  componentDidMount() {

    let access_token = this.getHashParams().access_token;
    let refresh_token = this.getHashParams().refresh_token;

    spotifyAPI.setAccessToken(access_token);

    if (this.state.loggedIn === false && access_token) {

      this.getSpotifyUser()
        .then(async (userData)=>{
          const musicData = await this.getAllPlaylists(userData.userid, userData.user);

          return { musicData, userData };
        })
        .then((data) => {
          const { playlists, songs } = data.musicData;
          const { user, userid } = data.userData;
console.log("SONGS", songs)
console.log("Playlists:", playlists)

          this.setState({
            loggedIn: true,
            user: user,
            userid: userid,
            refresh_token: refresh_token,
            currentPlaylistSongs: songs,
            currentPlaylist: songs[0].playlistname,
            currentPlaylistId: songs[0].playlistid,
            playlists: playlists
          })

        })
        .catch(err => {
          console.log("ERROR in componentDidMount:", err)
        })
    }
  }

  render() {
    return (

      <div id='main'>
        <Header />

        {this.state.loggedIn ?

          <Grid
            width="100%"
            height="75vh"
            templateColumns="repeat(6, 1fr)"
            gap="10px"
            autoRows="minmax(750px, auto)"
          >
            <GridItem column="1 / 2" row="1" id='playlist-container-column'>
              <PlaylistContainer playlists={this.state.playlists}   addPlaylist={this.createPlaylist} currentPlaylist={this.state.currentPlaylist} changePlaylist={this.changePlaylist} />
              </GridItem>

            <GridItem column="2 / 5" row="1" id='searchplayer-container-column' >
              <SearchPlayerContainer currentSong={this.state.currentSong} playlist={this.state.currentPlaylistSongs} addSong={this.resultsHandler} results={this.state.currentSearchResults} searchHandler={this.state.searchHandler} />
            </GridItem>

            <GridItem column="5 / 8" row="1" id='songs-container-column' >
              <SongsContainer changeSong={this.playSong} deleteSong={this.deleteSong} songs={this.state.currentPlaylistSongs} currentPlaylist={this.state.currentPlaylist} />
            </GridItem>

          </Grid>

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