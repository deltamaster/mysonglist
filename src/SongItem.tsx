import React from "react";
import styled from "styled-components";
import { Song } from "./Song";

const SongContainer = styled.div`
  padding: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

interface SongItemProps {
  song: Song;
}

const SongItem: React.FC<SongItemProps> = ({ song }) => {
  return <SongContainer>{song.name}</SongContainer>;
};

export default SongItem;
