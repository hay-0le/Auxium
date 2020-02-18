import React from 'react';

const Playlists = ({ playlists, changePlaylist }) => {
return playlists ?
  (
    <div>
      <br/>
      <h3>Your Playlists: </h3>
      {playlists.map((pl, i) => {
        return <div className='playlist' key={i} onClick={changePlaylist}>{pl}</div>
      })}

    </div>
  )
  : null;
}


export default Playlists;