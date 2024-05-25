import React from "react";
import "./App.css";
import SongList from "./SongList";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>My Songs</h1>
      </header>
      <main>
        <SongList />
      </main>
    </div>
  );
}

export default App;
