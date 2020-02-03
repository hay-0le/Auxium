import React from 'react';

const Player = ({currentSong}) => {
  if (currentSong === null) {
    return (
      <div></div>
      )
    } else {
      let coverArt = currentSong.coverArt;
      let title = currentSong.song;
      let artist = currentSong.artist;

    return (
      <div id="player">
      <img src={coverArt} id='currentSong' />
      <h3>Now playing: </h3>
      <h4>{title}  by {artist}</h4>
    </div>
    )
  }
}

export default Player;