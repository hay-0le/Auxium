import React from 'react';

import DeleteIcon from '@material-ui/icons/Delete';
import { IconButton } from '@material-ui/core';
import styled from 'styled-components';

const SongDiv = styled.div`
`;

const Song = ({ song, id, changeSong, deleteSong}) => {

  let title = song.title;
  let artists = song.artists;
  let coverArt = song.coverArt;

  function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  };

  let length = millisToMinutesAndSeconds(song.duration);


  return (

    <SongDiv id={song.songid} onClick={changeSong} onClick={deleteSong}>
        {`${id + 1}: ${title} by ${artists} - (${length} minutes)`}

      <IconButton id={song.songid} variant="outlined" >
        <DeleteIcon/>
      </IconButton>
      </SongDiv>
  )
}

export default Song;