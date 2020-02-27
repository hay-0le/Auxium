import React from 'react';
import Song from './Song.jsx';

const SongsList = ({ songs, playlist, changeSong}) => {
// console.log("SINGS", songs)

  return (
    <div id='songslist'>

      {songs ?

      <div>
          {songs.map((song, i) => {
            return <Song changeSong={changeSong} key={i} id={i} song={song} playlist={playlist} />
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

export default SongsList;