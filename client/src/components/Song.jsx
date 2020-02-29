import React from 'react';

const Song = ({ song, id, changeSong}) => {
// console.log("TTTT", song)
  let title = song.title;
  // let artists = song.artists.map(artist => artist.name);
  let artists = song.artists;
  let length = song.duration / 600;
  // console.log("length", length)
  //TODO: fix duration
  let coverArt = song.coverArt;

  return (
    <div id={song.songid} onClick={changeSong}>
      {`${id + 1}: ${title} by ${artists} - (${length} minutes)`}
    </div>
  )
}

export default Song;