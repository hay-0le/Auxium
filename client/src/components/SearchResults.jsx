import React from 'react';
import SearchedResult from './SearchedResult';


const SearchResults = ({ playlist, addSong, results }) => {

  return (
    <div id="search-results">
      {results.map((song, i) => {
        return (<div key={i}>
          <SearchedResult key={i} title={song.name} artist={song.artists[0].name} album={song.album.name}/>

         </div>)
      })}

    </div>
  )
}


export default SearchResults;