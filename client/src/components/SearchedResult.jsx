import React from 'react';

const SearchedResult = ({ id, title, artist, album, addSong }) => {

  return (
    <div id={id} onClick={addSong}>
      {`Song: ${title}
      Artist: ${artist}
      Album: ${album}`}

    </div>
  )
}


export default SearchedResult;