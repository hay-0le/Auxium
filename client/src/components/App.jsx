import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import axios from 'axios';
import PlaylistContainer from './PlaylistContainer.jsx';
import { data } from '../../../db/dummydata.js'

// require('dotenv').config();

// var Spotify = require('spotify-web-api-js');
// var spotifyAPI = new Spotify();

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
      currentSong: data[0]
    }
    this.login = this.login.bind(this);
  }

  login(e) {
    e.preventDefault();
    // alert('clicked')
    // console.log(this.state)
    // axios.get('/login')
    //   .then(res => {
    //     console.log('logged in!')
    //   })
    //   .catch(err => {
    //     console.log('error: ', err);
    //   })
    // window.location.href.length > 35 ? this.setState({
    //   loggedIn: true
    // }) : '';
    this.setState({
      loggedIn: true
    })

    console.log(this.state)
  }

  componentDidMount() {

    console.log(data[0])
  }

  render() {
    return (
      <div id='mainpage'>
        {this.state.loggedIn ?
            <div>
            <PlaylistContainer song={this.state.currentSong}/>
          </div>
          :
          <div id="spotifyLogin">
            <h2>Log In to Your Spotify</h2>
            <a href='/login' onClick={this.login}>Log In</a>
          </div>
          }

      </div>
    )
  }
}

export default App;