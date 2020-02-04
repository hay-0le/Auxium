import React from 'react';
import SongsList from './SongsList.jsx';
import Playlists from './Playlists.jsx';

const PlaylistContainer = ({ songs, playlist, playlists, changeSong}) => {


  return (
    <div id="playlistcontainer">
      <h3>Player: </h3>
    <SongsList changeSong={changeSong} playlist={playlist} songs={songs}/>
    <Playlists playlists={playlists}/>
    </div>
  )
}


export default PlaylistContainer;