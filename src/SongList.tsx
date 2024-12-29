import React, { useState, useRef } from "react";
import styled, { keyframes, css } from "styled-components";
import { mockSongs } from "./mockSongs";
import { Song } from "./Song";
import SongItem from "./SongItem";

// Define a keyframe animation for vertical scrolling
const scrollAnimation = keyframes`
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-50%);
  }
`;

// Styled component for the container with overflow handling and conditional animation setup
const GridContainer = styled.div<{ isSearching: boolean }>`
  overflow-y: hidden; /* Disable vertical scrolling */
  max-height: 95vh; /* Adjust to fit your screen size */

  &::before,
  &::after {
    content: "";
    height: 50%; /* Match the animation's translateY value */
  }

  & > div:first-of-type {
    color: black;
    ${({ isSearching }) =>
      !isSearching &&
      css`
        animation: ${scrollAnimation} 100s linear infinite; /* Infinite scrolling with animation */
      `}
  }
`;

// Styled component for the grid layout
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(30px, max-content));
  gap: 10px;
`;

// Styled component for the search box
const SearchBox = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  font-size: 16px;
`;

const SongList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const gridRef = useRef<HTMLDivElement>(null);

  // Filter songs based on the search query (by name or singer)
  const filteredSongs = mockSongs.filter(
    (song: Song) =>
      song.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.singer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <SearchBox
        type="text"
        placeholder="Search for a song or singer..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <GridContainer isSearching={!!searchQuery}>
        <Grid ref={gridRef}>
          {filteredSongs.map((song: Song) => (
            <SongItem key={song.id} song={song} />
          ))}
          {!searchQuery && (
            <>
              <div style={{ gridColumnStart: "-1" }} />
              {mockSongs.map((song: Song) => (
                <SongItem key={song.id} song={song} />
              ))}
            </>
          )}
        </Grid>
      </GridContainer>
    </div>
  );
};

export default SongList;
