import React from "react";
import styled from "styled-components";
import { Song } from "./Song";

interface SongItemProps {
  song: Song;
}

const SongContainer = styled.div<SongItemProps>`
  padding: 0px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-shadow: 0px 0px 3px #c7b38b;
  color: #fff;
  font-size: 20px;
  font-family: 'Courier New', Consolas, Monaco, monospace;
  /* Dynamic grid column span based on song name length */
  grid-column-end: span
    ${(props) => Math.min(2 + Math.floor(props.song.name.length / 2.5), 8)};
  /* Initial transition */
  transition: transform 0.3s ease;
  
  /* Hover effect - double the size */
  &:hover {
    transform: scale(2);
    z-index: 10;
  }
`;

const SongItem: React.FC<SongItemProps> = ({ song }) => {
  // Format tooltip text with song name and singers list
  const tooltipText = `${song.name}\nSingers: ${song.singers.join(', ')}`;
  
  return (
    <SongContainer song={song} title={tooltipText}>
      {song.name}
    </SongContainer>
  );
};

export default SongItem;
