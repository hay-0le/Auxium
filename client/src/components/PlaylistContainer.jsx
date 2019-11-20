import React from 'react';
import SongsList from './SongsList.jsx';
import Playlists from './Playlists.jsx';

const PlaylistContainer = ({ songs, playlist, changeSong}) => {


  return (
    <div>
      <h3>Player: </h3>
    <SongsList changeSong={changeSong} playlist={playlist} songs={songs}/>
    <Playlists />
    </div>
  )
}


export default PlaylistContainer;