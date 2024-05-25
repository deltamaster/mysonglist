import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { mockSongs } from "./mockSongs";
import SongItem from "./SongItem";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(30px, max-content));
  gap: 10px;
  overflow-y: hidden; /* Enable vertical scrolling */
  max-height: 90vh; /* Adjust based on your screen size */
`;

const SongList: React.FC = () => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = gridRef.current;

    // Function to start the automatic scrolling
    const startScrolling = () => {
      if (scrollContainer) {
        // Set the speed of scrolling (smaller numbers = faster scrolling)
        const speed = 2;
        let topPosition = scrollContainer.scrollTop;

        // Scroll function
        const scroll = () => {
          topPosition += speed;
          scrollContainer.scrollTop = topPosition;

          // Reset scroll position to top when it reaches the bottom
          if (
            topPosition >=
            scrollContainer.scrollHeight - scrollContainer.clientHeight
          ) {
            topPosition = 0;
          }
        };

        // Start the interval for scrolling
        const intervalId = setInterval(scroll, 100);

        // Clear the interval when component unmounts
        return () => clearInterval(intervalId);
      }
    };

    // Start scrolling
    startScrolling();
  }, []);

  return (
    <Grid ref={gridRef}>
      {mockSongs.map((song) => (
        <SongItem key={song.id} song={song} />
      ))}
      <div style={{ gridColumnStart: "-1" }} />
      {mockSongs.map((song) => (
        <SongItem key={song.id} song={song} />
      ))}
    </Grid>
  );
};

export default SongList;
