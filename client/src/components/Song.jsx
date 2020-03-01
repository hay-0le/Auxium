import React from 'react';
import { IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

const Song = ({ song, id, changeSong, deleteSong}) => {
// console.log("TTTT", song)
  let title = song.title;
  // let artists = song.artists.map(artist => artist.name);
  let artists = song.artists;
  let length = song.duration / 600;
  // console.log("length", length)
  //TODO: fix duration
  let coverArt = song.coverArt;

  return (
    <div class="song">

    < div id={song.songid} onClick={changeSong}>
        {`${id + 1}: ${title} by ${artists} - (${length} minutes)`}
      <IconButton onClick={deleteSong}>
        <DeleteIcon/>
      </IconButton>
      </div>
    </div>
  )
}

export default Song;