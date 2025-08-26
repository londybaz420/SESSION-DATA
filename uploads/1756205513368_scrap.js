import fetch from 'node-fetch';
import config from '../../config.js';
import DY_SCRAP from '@dark-yasiya/scrap';
const dy_scrap = new DY_SCRAP;

function replaceYouTubeID(url) {
  const regex = /(?:youtube\.com\/(?:.*v=|.*\/)|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

const simCmd = async (m, sock) => {
  try {
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix)
      ? m.body.slice(prefix.length).split(' ')[0].toLowerCase()
      : '';

    if (cmd === 'dark') {
      const query = m.body.slice(prefix.length + cmd.length).trim();
      if (!query) return m.reply("❌ Please provide a search term or YouTube URL.");

      let id, title, thumbnail;

      if (query.startsWith("https://")) {
        id = replaceYouTubeID(query);
        if (!id) return m.reply("❌ Invalid YouTube URL");
        title = "Audio from YouTube Link";
        thumbnail = `https://i.ytimg.com/vi/${id}/hq720.jpg`;
      } else {
        const searchResults = await dy_scrap.ytsearch(query);
        if (!searchResults?.results?.length) return m.reply("❌ No results found!");

        id = searchResults.results[0].videoId;
        title = searchResults.results[0].title || "No title";
        thumbnail = searchResults.results[0].thumbnail || `https://i.ytimg.com/vi/${id}/hq720.jpg`;
      }
const { image, timestamp, ago, views, author } = searchResults.results[0];
      const url = `https://youtube.com/watch?v=${id}`;
      const dl = await dy_scrap.ytmp3(url);
      const downloadUrl = dl?.result?.download?.url;
      if (!downloadUrl) return m.reply("❌ Download link not found or failed to fetch.");

      let replyMsg = `✅ You searched: ${query}\n📎 Link: ${url}\n🎧 Title: ${title}`;

    //  await sock.sendMessage(m.from, { text: replyMsg }, { quoted: m });
    await sock.sendMessage(m.from, { image: { url: thumbnail }, caption: replyMsg }, { quoted: m });

      await sock.sendMessage(
        m.from,
        {
          audio: { url: downloadUrl },
          mimetype: "audio/mpeg",
          ptt: false,
          fileName: `${title}.mp3`,
          caption: `🎵 *Title:* ${title}\n📥 *Downloaded via Sarkar-MD*`,
          contextInfo: {
            externalAdReply: {
              title: "✨ Sarkar-MD Audio Downloader ✨",
              body: "Powered by Sarkar-MD",
              thumbnailUrl: thumbnail,
              sourceUrl: url,
              mediaType: 1
            }
          }
        },
        { quoted: m }
      );
    }

  } catch (err) {
    console.error('SIM Command Error:', err);
    m.reply(`❌ *Error:* ${err.message}\n\nPlease try again later.`);
  }
};

export default simCmd;