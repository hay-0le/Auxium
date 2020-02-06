import React from 'react';
import SongsList from './SongsList.jsx';
import Playlists from './Playlists.jsx';

const PlaylistContainer = ({ songs, playlist, playlists, changeSong, addPlaylist}) => {


  return (
    <div id="playlistcontainer">
      <h3>Playlist: </h3>
      <div id="create-playlist">
        <form className="form" id="add-playlist-form">
          <input
            type="text"
            className="input"
            id="add-playlist"
            placeholder="Playlist Name"
          />
          <button className="button is-info" onClick={addPlaylist}>
            Create New Playlist
          </button>
        </form>
      </div>
    <Playlists playlists={playlists}/>
    <SongsList changeSong={changeSong} playlist={playlist} songs={songs}/>
    </div>
  )
}


export default PlaylistContainer;