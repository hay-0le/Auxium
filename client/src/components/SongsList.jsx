import React from 'react';
import Song from './Song.jsx';

const SongsList = ({ songs, playlist, changeSong}) => {

  return (

     <div>

       {songs.map((song, i) => {
         return <Song changeSong={changeSong} key={i} id={i} song={song} playlist={playlist} />
       })}
     </div>

  )
}

export default SongsList;