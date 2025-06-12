const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());

app.get('/api/download', (req, res) => {
    const url = req.query.url;
    const format = req.query.format || 'mp4';

    if (!url) {
        return res.status(400).json({ error: 'No URL provided' });
    }

    const command = `/usr/local/bin/yt-dlp -f ${format} -g "${url}"`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error('Error:', error.message);
            return res.status(500).json({ error: error.message });
        }

        if (stderr) {
            console.error('stderr:', stderr);
        }

        const downloadUrl = stdout.trim();
        res.json({ url: downloadUrl });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
