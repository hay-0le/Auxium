import React from 'react';

const Playlists = ({ playlists }) => {

  return (
    <div>
      <br/>
      <h3>Your Playlists: </h3>
      {playlists.map((pl, i) => {
        return <div className='playlist' key={i}>{pl}</div>
      })}

    </div>
  )
}


export default Playlists;