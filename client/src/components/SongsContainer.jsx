import React from 'react';
import Song from './Song.jsx';

const SongsContainer = ({ songs, playlist, changeSong, deleteSong, currentPlaylist }) => {
// console.log("SINGS", songs)

  return (
    <div id='songslist'>

      {songs ?

      <div>
        <h2>Songs from playlist: {currentPlaylist}</h2>
          {songs.map((song, i) => {
            return <Song changeSong={changeSong} key={i} id={i} song={song} playlist={playlist} deleteSong={deleteSong}/>
          })}
        </div>
        :
        <div>
          <p>This playlist does not have any songs yet</p>
        </div>
      }
  </div>

  )
}

export default SongsContainer;