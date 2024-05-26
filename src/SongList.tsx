import React, { useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { mockSongs } from "./mockSongs";
import SongItem from "./SongItem";

const scrollAnimation = keyframes`
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-50%);
  }
`;

const GridContainer = styled.div`
  overflow-y: hidden; /* Enable vertical scrolling */
  max-height: 90vh; /* Adjust based on your screen size */

  &::before,
  &::after {
    content: "";
    height: 50%; /* Same as the translateY value in the animation */
  }

  & > div:first-of-type {
    color: black;
    animation: ${scrollAnimation} 100s linear infinite; /* Adjust timing as needed */
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(30px, max-content));
  gap: 10px;
`;

const SongList: React.FC = () => {
  const gridRef = useRef<HTMLDivElement>(null);

  return (
    <GridContainer>
      <Grid ref={gridRef}>
        {mockSongs.map((song) => (
          <SongItem key={song.id} song={song} />
        ))}
        <div style={{ gridColumnStart: "-1" }} />
        {mockSongs.map((song) => (
          <SongItem key={song.id} song={song} />
        ))}
      </Grid>
    </GridContainer>
  );
};

export default SongList;
