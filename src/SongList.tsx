import React, { useState, useRef, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";
import { Song } from "./Song"; // Import Song from ./Song
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
  const [songs, setSongs] = useState<Song[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);

  // Load songs from static JSON file on page load
  useEffect(() => {
    const loadSongs = async () => {
      try {
        const response = await fetch('/songs.json');
        const songsData = await response.json();
        
        // Map JSON data to Song interface (extract id, name, singers, ignore status)
        const songsArray: Song[] = songsData.map((song: any) => ({
          id: song.id,
          name: song.name,
          singers: song.singers
        }));

        // 计算字符串的"长度"（非ASCII字符算作2个字符）
        const getAdjustedLength = (str: string): number => {
          let length = 0;
          for (let i = 0; i < str.length; i++) {
            const charCode = str.charCodeAt(i);
            // 非ASCII字符（Unicode码点大于127）算作2个字符
            length += (charCode > 127) ? 2 : 1;
          }
          return length;
        };
        
        // 按照歌曲名称的调整后长度排序
        const sortedSongs = songsArray.sort((a, b) => {
          const lenA = getAdjustedLength(a.name);
          const lenB = getAdjustedLength(b.name);
          return lenA - lenB;
        });
        
        setSongs(sortedSongs);
      } catch (error) {
        console.error("Error loading songs:", error);
      }
    };

    loadSongs();
  }, []);

  // Filter songs based on the search query (by name or singers)
  const filteredSongs = songs.filter((song: Song) =>
    song.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.singers.some(singer => singer.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div>
      <SearchBox
        type="text"
        placeholder="Search for a song or singer..."
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <GridContainer isSearching={!!searchQuery}>
        <Grid ref={gridRef}>
            {filteredSongs.map((song: Song) => (
              <SongItem 
                key={song.id} 
                song={song} 
              />
            ))}
            {!searchQuery && songs.length > 0 && (
              <>
                <div style={{ gridColumnStart: "-1" }} />
                {songs.map((song: Song) => (
                  <SongItem 
                    key={song.id} 
                    song={song} 
                  />
                ))}
              </>
            )}
        </Grid>
      </GridContainer>
    </div>
  );
};

export default SongList;