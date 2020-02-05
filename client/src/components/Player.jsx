import React from 'react';
import defaultImg from "../../dist/musicPlayerImg.png";

const Player = ({currentSong}) => {
  if (currentSong === null) {
    return (
      <div id="player">
        <h2>Currently Playing:</h2>
          <img src={defaultImg} id='currentSong' height="300px" width="500px"/>
          <h3>- (No song currently playing) -</h3>
          <h4>{"____"}  by {"____"}</h4>
      </div>
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