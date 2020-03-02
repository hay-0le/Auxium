import React from 'react';
import styled from 'styled-components';
import {Form, Input, Title, Button, Header} from '../componentStyling.js';

import Playlists from './Playlists.jsx';

const PlaylistContainerStyling = styled.div`
  padding: 20px;
  height: 500px;
  border: solid;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const PlaylistContainer = ({ songs, playlist, playlists, changeSong, addPlaylist, currentPlaylist, changePlaylist, deleteSong}) => {
console.log(addPlaylist)

  return (
    <PlaylistContainerStyling>
      <Header>Your Playlists: </Header>
      <Playlists playlists={playlists} changePlaylist={changePlaylist} />

      <Form>
          <Input type="text" id="add-playlist" placeholder="Playlist Name"  />
          <Button type="submit" onClick={addPlaylist}>Submit</Button>
      </Form>

    </PlaylistContainerStyling>


  )
}


export default PlaylistContainer;