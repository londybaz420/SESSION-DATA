const express = require("express");
const path = require("path");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/tiktok", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "tiktok.html"));
});

app.get("/facebook", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "fb.html"));
});
app.get("/instagram", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "insta.html"));
});

app.get("/twitter", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "twit.html"));
});

app.get("/youtube", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "yt.html"));
});

app.get("/capcut", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "capcut.html"));
});

app.get("/snapchat", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "snapchat.html"));
});

app.get("/pinterest", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pint.html"));
});


// TikTok Downloader API Route
app.get("/api/tiktok", async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.json({
        status: false,
        message: "❌ Please provide a valid TikTok URL!"
      });
    }

    const apiUrl = `https://sarkar-shaban.koyeb.app/download/tiktokdl?url=${encodeURIComponent(url)}`;
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (!data.status) {
      return res.json({
        status: false,
        message: "❌ Failed to fetch video! Please try again."
      });
    }

    res.json({
      status: true,
      creator: data.creator,
      video_info: {
        title: data.result.title,
        caption: data.result.caption,
        thumbnail: data.result.thumbnail
      },
      download_links: {
        video_no_watermark: data.result.nowm,
        audio_mp3: data.result.mp3
      }
    });

  } catch (error) {
    res.json({
      status: false,
      message: "❌ Internal Server Error! Please try again later.",
      error: error.message
    });
  }
});

// Facebook Video Downloader API Route
app.get("/api/facebook", async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.json({
        status: false,
        message: "❌ Please provide a valid Facebook video URL!"
      });
    }

    const apiUrl = `https://sarkar-shaban.koyeb.app/download/fbdown?url=${encodeURIComponent(url)}`;
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (!data.status) {
      return res.json({
        status: false,
        message: "❌ Failed to fetch video! Try again."
      });
    }

    res.json({
      status: true,
      creator: "@Bandaheali & Shaban-MD",
      video: {
        thumbnail: data.result.thumb,
        title: data.result.title || "No title",
        description: data.result.desc || "No description",
        sd: data.result.sd,
        hd: data.result.hd
      }
    });

  } catch (error) {
    res.json({
      status: false,
      message: "🚨 Server error! Please try again later.",
      error: error.message
    });
  }
});


// Twitter Video Downloader API Route
app.get("/api/twitter", async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.json({
        status: false,
        message: "❌ Please provide a valid Twitter video URL!"
      });
    }

    const apiUrl = `https://sarkar-shaban.koyeb.app/download/twitter?url=${encodeURIComponent(url)}`;
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (!data.status) {
      return res.json({
        status: false,
        message: "❌ Failed to fetch video! Please try again."
      });
    }

    res.json({
      status: true,
      creator: "@Bandaheali & Shaban-MD",
      video_info: {
        description: data.result.desc,
        thumbnail: data.result.thumb
      },
      download_links: {
        video_hd: data.result.video_hd || "HD link not available",
        video_sd: data.result.video_sd || "SD link not available",
        audio: data.result.audio || "Audio link not available"
      }
    });

  } catch (error) {
    res.json({
      status: false,
      message: "🚨 Internal Server Error! Please try again later.",
      error: error.message
    });
  }
});

app.get("/api/insta", async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.json({
        status: false,
        message: "🤣 Please provide a valid Instagram URL!"
      });
    }

    const apiUrl = `https://bk9.fun/download/instagram?url=${encodeURIComponent(url)}`;
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (!data.status || !data.BK9 || !Array.isArray(data.BK9) || data.BK9.length === 0) {
      return res.json({
        status: false,
        message: "🤣 Failed to fetch media! Please try again."
      });
    }

    // Filtering video URLs from BK9 array
    const videos = data.BK9.filter(item => item.type === "video").map(item => item.url);
    const images = data.BK9.filter(item => item.type === "image").map(item => item.url);

    res.json({
      status: true,
      author: "Bandaheali && Shaban-MD",
      download: {
        videos: videos.length > 0 ? videos : "No videos found",
        images: images.length > 0 ? images : "No images found"
      },
      result: data
    });

  } catch (error) {
    res.json({
      status: false,
      message: "🚨 Internal Server Error! Please try again later.",
      error: error.message
    });
  }
}); // Added missing closing curly brace for the /api/insta route


app.get("/api/youtube/video", async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.json({
        status: false,
        message: "❌ Please provide a valid YouTube URL!"
      });
    }

    const apiUrl = `https://bandahealimaree-api-ytdl.hf.space/api/ytmp4?url=${encodeURIComponent(url)}`;
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (!data.status || !data.download) {
      return res.json({
        status: false,
        message: "❌ Failed to fetch video! Please try again."
      });
    }

    res.json({
      status: true,
      author: data.author,
      download: {
        title: data.download.title,
        downloadUrl: data.download.downloadUrl,
        expiresIn: data.download.expiresIn
      },
      result: data.result // Include the full result object if needed
    });

  } catch (error) {
    res.json({
      status: false,
      message: "🚨 Internal Server Error! Please try again later.",
      error: error.message
    });
  }
});

app.get("/api/youtube/audio", async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.json({
        status: false,
        message: "❌ Please provide a valid YouTube URL!"
      });
    }

    const apiUrl = `https://bandahealimaree-api-ytdl.hf.space/api/ytmp3?url=${encodeURIComponent(url)}`;
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (!data.status || !data.download) {
      return res.json({
        status: false,
        message: "❌ Failed to fetch audio! Please try again."
      });
    }

    res.json({
      status: true,
      author: data.author,
      download: {
        title: data.download.title,
        downloadUrl: data.download.downloadUrl,
        expiresIn: data.download.expiresIn
      },
      result: data.result // Include the full result object if needed
    });

  } catch (error) {
    res.json({
      status: false,
      message: "🚨 Internal Server Error! Please try again later.",
      error: error.message
    });
  }
});


// CapCut Video Downloader API Route
app.get("/api/capcut", async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.json({
        status: false,
        message: "❌ Please provide a valid CapCut video URL!"
      });
    }

    const apiUrl = `https://api.diioffc.web.id/api/download/capcut?url=${encodeURIComponent(url)}`;
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (!data.status) {
      return res.json({
        status: false,
        message: "❌ Failed to fetch video! Try again."
      });
    }

    res.json({
      status: true,
      creator: data.creator || "@DiiOffc",
      video: {
        title: data.result.title || "No title",
        size: data.result.size || "Unknown size",
        url: data.result.url || "No URL available"
      }
    });

  } catch (error) {
    res.json({
      status: false,
      message: "🚨 Server error! Please try again later.",
      error: error.message
    });
  }
});

// Pinterest Video Downloader API Route
app.get("/api/pinterest", async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.json({
        status: false,
        message: "❌ Please provide a valid Pinterest video URL!"
      });
    }

    const apiUrl = `https://bk9.fun/download/pinterest?url=${encodeURIComponent(url)}`;
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (!data.status) {
      return res.json({
        status: false,
        message: "❌ Failed to fetch video! Try again."
      });
    }

    res.json({
      status: true,
      owner: "@BK9dev",
      video: {
        mp4: data.BK9[0].url || "No video URL",
        image: data.BK9[1].url || "No image URL"
      }
    });

  } catch (error) {
    res.json({
      status: false,
      message: "🚨 Server error! Please try again later.",
      error: error.message
    });
  }
});


// Snapchat Video Downloader API Route
app.get("/api/snapchat", async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.json({
        status: false,
        message: "❌ Please provide a valid Snapchat video URL!"
      });
    }

    const apiUrl = `https://api.nexoracle.com/downloader/snapchat?apikey=2f9b02060a600d6c88&url=${encodeURIComponent(url)}`;
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (data.status !== 200) {
      return res.json({
        status: false,
        message: "❌ Failed to fetch video! Try again."
      });
    }

    res.json({
      status: true,
      owner: data.owner,
      video: {
        title: data.result.title || "No title",
        thumbnail: data.result.thumb || "No thumbnail",
        size: data.result.size || "Unknown size",
        videoUrl: data.result.url || "No video URL"
      }
    });

  } catch (error) {
    res.json({
      status: false,
      message: "🚨 Server error! Please try again later.",
      error: error.message
    });
  }
});


// Server Start
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

// POWERED BY BANDAHEALI


