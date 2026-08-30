---
name: add-songs
description: Add songs to public/songs.json, generate unique ids when missing, then commit and push. Use when the user adds songs, 添加新歌, 加歌, 新歌, or edits the song list.
---

# Add songs

Default project workflow for adding songs. Read this skill and run the script; do not hand-edit `public/songs.json`.

## Parse the request

Accept any of these shapes:

- `添加新歌：妥协，歌手en`
- `还有事情可庆祝，杨千嬅`
- `{ "id": "rHtidJ", "name": "不将就", "singer": "李荣浩" }`

Map `singer` / `歌手` to `singers: [name]`. Split multiple singers on `、`, `,`, or `/`.

## Add

Run from the repo root, repeating `--name` / `--singer` (and `--id` when given):

```bash
node scripts/add-songs.js --name "妥协" --singer "en" --name "还有事情可庆祝" --singer "杨千嬅"
```

If the user provided ids:

```bash
node scripts/add-songs.js --name "不将就" --singer "李荣浩" --id rHtidJ
```

Rules:

- Use the provided id when present.
- Otherwise let the script generate a unique `r` + 5 alphanumeric id.
- Do not invent an id that you claim came from an accompaniment platform.
- Skip exact `name` + `singers` duplicates; keep going with the rest.
- After the script runs, report added vs skipped.

## Commit and push

After a successful add, commit only `public/songs.json` and push `main`, unless the user says not to.

Commit message: `add N songs` (match existing style). Do not include downloaded fonts or unrelated files.
