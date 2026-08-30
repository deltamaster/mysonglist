const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const SONGS_PATH = path.join(__dirname, "..", "public", "songs.json");
const ID_CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function usage() {
  console.error(`Usage:
  node scripts/add-songs.js --name "妥协" --singer "en" [--id rxxxxx]
  node scripts/add-songs.js --name "A" --singer "X" --name "B" --singer "Y"
  node scripts/add-songs.js --json "[{\\"name\\":\\"妥协\\",\\"singers\\":[\\"en\\"],\\"id\\":\\"rxxxxx\\"}]"
`);
  process.exit(1);
}

function parseArgs(argv) {
  const songs = [];
  let jsonArg = null;
  let current = {};

  const flush = () => {
    if (current.name || current.singer || current.id) {
      songs.push(current);
      current = {};
    }
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const next = argv[i + 1];
    if (arg === "--json") {
      if (!next) usage();
      jsonArg = next;
      i++;
    } else if (arg === "--name") {
      if (current.name) flush();
      if (!next) usage();
      current.name = next;
      i++;
    } else if (arg === "--singer" || arg === "--singers") {
      if (!next) usage();
      current.singer = next;
      i++;
    } else if (arg === "--id") {
      if (!next) usage();
      current.id = next;
      i++;
    } else {
      usage();
    }
  }
  flush();

  if (jsonArg) {
    const parsed = JSON.parse(jsonArg);
    return (Array.isArray(parsed) ? parsed : [parsed]).map(normalizeInput);
  }

  if (!songs.length) usage();
  return songs.map(normalizeInput);
}

function normalizeInput(song) {
  const name = (song.name || "").trim();
  const singers = Array.isArray(song.singers)
    ? song.singers.map((s) => String(s).trim()).filter(Boolean)
    : String(song.singer || "")
        .split(/[、,/]/)
        .map((s) => s.trim())
        .filter(Boolean);
  const id = song.id ? String(song.id).trim() : "";

  if (!name || !singers.length) {
    throw new Error(`Each song needs a name and singer. Got: ${JSON.stringify(song)}`);
  }

  return { id, name, singers };
}

function generateId(existing) {
  let id;
  do {
    id = "r";
    const bytes = crypto.randomBytes(5);
    for (let i = 0; i < 5; i++) {
      id += ID_CHARS[bytes[i] % ID_CHARS.length];
    }
  } while (existing.has(id));
  existing.add(id);
  return id;
}

function formatSong(song) {
  return `  { "id": ${JSON.stringify(song.id)}, "status":"OK","name": ${JSON.stringify(song.name)}, "singers": ${JSON.stringify(song.singers)} }`;
}

function sameSingers(a, b) {
  return a.length === b.length && a.every((singer, i) => singer === b[i]);
}

function main() {
  const incoming = parseArgs(process.argv.slice(2));
  const songs = JSON.parse(fs.readFileSync(SONGS_PATH, "utf8"));
  const existingIds = new Set(songs.map((song) => song.id));
  const added = [];
  const skipped = [];

  for (const song of incoming) {
    const duplicate = songs.find(
      (existing) => existing.name === song.name && sameSingers(existing.singers, song.singers)
    );
    if (duplicate) {
      skipped.push({ ...song, id: duplicate.id, reason: "duplicate name+singers" });
      continue;
    }

    if (song.id && existingIds.has(song.id)) {
      throw new Error(`Song id already exists: ${song.id}`);
    }

    const id = song.id || generateId(existingIds);
    const entry = { id, status: "OK", name: song.name, singers: song.singers };
    songs.push(entry);
    added.push(entry);
  }

  if (added.length) {
    let text = fs.readFileSync(SONGS_PATH, "utf8").replace(/\s*\]\s*$/, "");
    if (!text.trimEnd().endsWith(",")) {
      text = text.trimEnd() + ",";
    }
    text += "\n" + added.map(formatSong).join(",\n") + "\n]\n";
    fs.writeFileSync(SONGS_PATH, text, "utf8");
  }

  console.log(JSON.stringify({ added, skipped, file: "public/songs.json" }, null, 2));
}

main();
