const fs = require("fs");
const https = require("https");
const path = require("path");

const FONT_URL =
  "https://mirrors.tuna.tsinghua.edu.cn/adobe-fonts/source-han-sans/OTF/SimplifiedChinese/SourceHanSansSC-Regular.otf";
const OUT_DIR = path.join(__dirname, "..", "public", "fonts");
const OUT_FILE = path.join(OUT_DIR, "SourceHanSansSC-Regular.otf");

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`Download failed with status ${res.statusCode}`));
          return;
        }

        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on("finish", () => file.close(resolve));
        file.on("error", reject);
      })
      .on("error", reject);
  });
}

async function main() {
  if (fs.existsSync(OUT_FILE)) {
    console.log("Font already present:", OUT_FILE);
    return;
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  console.log("Downloading Source Han Sans SC from Tsinghua mirror...");
  await download(FONT_URL, OUT_FILE);
  console.log("Saved to", OUT_FILE);
}

main().catch((err) => {
  console.error(err.message);
  if (fs.existsSync(OUT_FILE)) {
    fs.unlinkSync(OUT_FILE);
  }
  process.exit(1);
});
