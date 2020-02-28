import React from 'react';
import SearchedResult from './SearchedResult';


const SearchResults = ({ playlist, addSong, results }) => {

 return results ?
    (
    <div id="search-results">
      {results.map((song, i) => {
        return (<div key={i}>
          <SearchedResult id={i} title={song.name} artist={song.artists[0].name} album={song.album.name} addSong={addSong}/>

         </div>)
      })}
    </div>
    ) : null;

}


export default SearchResults;