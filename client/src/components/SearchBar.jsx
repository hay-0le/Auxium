import React from 'react';



const SearchBar = ({ searchHandler }) => {


  return (
    <div id="search">
      <div id="search-bar">
        <div id="search-bar">
          <h4>Add a song to this playlist </h4>
          <form className="form" id="addItemForm">
            <input
              type="text"
              className="input"
              id="addSong"
              placeholder="Search the title of a song"
            />
            <button className="button is-info" onClick={searchHandler}>
              Search
            </button>
          </form>
        </div>
      </div>

    </div>
  )
}

export default SearchBar;
