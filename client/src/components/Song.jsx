import React from 'react';

const Song = ({ song, id, changeSong}) => {

  let title = song.title;
  // let artists = song.artists.map(artist => artist.name);
  let artists = song.artists;
  let length = String(song.duration / 60000).slice(0, 3);
  let coverArt = song.coverArt;

  return (
    <div id={id} onClick={changeSong}>
      {`${id + 1}: ${title} by ${artists} - (${length} minutes)`}
    </div>
  )
}

export default Song;