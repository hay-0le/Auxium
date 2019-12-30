import React from 'react';

const Song = ({ song, id, changeSong}) => {

  let title = song.song;
  let artist = song.artist;
  let length = song.length;
  let coverArt = song.coverArt;

  return (
    <div id={id} onClick={changeSong}>
      {`${id}: ${title} by ${artist} - (${length} minutes)`}
    </div>
  )
}

export default Song;