import React from "react";
import styled from "styled-components";
import { mockSongs } from "./mockSongs";
import SongItem from "./SongItem";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(30px, max-content));
  gap: 10px;
`;

const SongList: React.FC = () => {
  return (
    <Grid>
      {mockSongs.map((song) => (
        <SongItem key={song.id} song={song} />
      ))}
    </Grid>
  );
};

export default SongList;
