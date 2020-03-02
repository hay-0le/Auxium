import React from 'react';
import Player from './Player.jsx';
import SearchBar from './SearchBar.jsx';
import SearchResults from './SearchResults';

const SearchPlayerContainer = ({ currentSong, playlist, addSong, results, searchHandler }) => {

  return (
    <div>
      <Player currentSong={currentSong} />
      <SearchBar searchHandler={searchHandler} />

      <SearchResults playlist={playlist} addSong={addSong} results={results} />
    </div>

  )
}

export default SearchPlayerContainer;