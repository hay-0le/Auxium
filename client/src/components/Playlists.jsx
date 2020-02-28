import React from 'react';

const Playlists = ({ playlists, changePlaylist }) => {
  // console.log("PPPPP", playlists)
return playlists ?
  (
    <div>
      <br/>
      <h3>Your Playlists: </h3>
      {playlists.map((pl, i) => {
        const { playlistid, playlistname } = pl;

        return <div className='playlist' key={i} id={playlistid} onClick={changePlaylist}>{playlistname}</div>
      })}

    </div>
  )
  : null;
}


export default Playlists;