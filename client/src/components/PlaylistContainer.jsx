import React from 'react';
import SongsList from './SongsList.jsx';
import Playlists from './Playlists.jsx';

const PlaylistContainer = ({ songs, playlist, playlists, changeSong, addPlaylist, currentPlaylist, changePlaylist, deleteSong}) => {

console.log("Playlist.....", currentPlaylist)
  return (
    <div id="playlistcontainer">
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
    <Playlists playlists={playlists} changePlaylist={changePlaylist} />
  <h2>Songs from playlist: {currentPlaylist}</h2>
    <SongsList changeSong={changeSong} deleteSong={deleteSong} songs={songs}/>
    </div>
  )
}


export default PlaylistContainer;