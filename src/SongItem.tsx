import React from "react";
import styled from "styled-components";
import { Song } from "./Song";

const SongContainer = styled.div`
  padding: 0px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-shadow: 0px 0px 3px #c7b38b;
  color: #fff;
  font-size: 20px;
`;

interface SongItemProps {
  song: Song;
}

const SongItem: React.FC<SongItemProps> = ({ song }) => {
  return <SongContainer>{song.name}</SongContainer>;
};

export default SongItem;
