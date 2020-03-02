import React from 'react';
import styled from 'styled-components';

const PlaylistsStyling = styled.div`
  flex-grow: 4;
  margin: 5px;
`;

const Playlists = ({ playlists, changePlaylist }) => {

  return playlists ?
  (
    <PlaylistsStyling>

      {playlists.map((pl, i) => {
        const { playlistid, playlistname } = pl;

        return <div className='playlist' key={i} id={playlistid} onClick={changePlaylist}>{playlistname}</div>
      })}

    </PlaylistsStyling>
  )
  : null;
}


export default Playlists;