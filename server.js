
const express = require("express");
const cors = require("cors");
const { execFile } = require("child_process");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/download", (req, res) => {
  const { url, format } = req.query;

  if (!url) return res.status(400).json({ error: "URL required" });

  const args = [
    "-f",
    format === "mp3" ? "bestaudio" : "best",
    "-J",
    url
  ];

  execFile("yt-dlp", args, (err, stdout) => {
    if (err) return res.status(500).json({ error: err.message });

    const info = JSON.parse(stdout);
    const best = info.formats
      .filter((f) => f.ext === (format || "mp4"))
      .sort((a, b) => (b.filesize || 0) - (a.filesize || 0))[0];

    res.json({ title: info.title, downloadUrl: best?.url });
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
