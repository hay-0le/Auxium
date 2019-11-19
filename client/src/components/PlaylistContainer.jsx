import React from 'react';
import Songs from './Songs.jsx';
import Playlists from './Playlists.jsx';

const PlaylistContainer = (props) => {
  let currentSong = props.song;

  return (
    <div>
      <h3>Player: </h3>
      {currentSong}
    <Songs />
    <Playlists />
    </div>
  )
}


export default PlaylistContainer;