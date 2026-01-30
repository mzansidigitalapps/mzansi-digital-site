const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

exports.handler = async function () {
  console.log("🇿🇦 Mzansi Auto Update Running");

  try {
    // ================= YOUTUBE =================
    const ytRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=5&playlistId=${process.env.YT_PLAYLIST_ID}&key=${process.env.YT_API_KEY}`
    );
    const ytData = await ytRes.json();

    const videos = ytData.items.map(v => ({
      title: v.snippet.title,
      url: `https://www.youtube.com/watch?v=${v.snippet.resourceId.videoId}`,
      thumbnail: v.snippet.thumbnails.medium.url
    }));

    fs.writeFileSync("./videos.json", JSON.stringify(videos));

    // ================= NEWS =================
    const newsRes = await fetch(
      `https://newsapi.org/v2/everything?q=South Africa technology apps&apiKey=${process.env.NEWS_API_KEY}`
    );
    const newsData = await newsRes.json();

    const news = newsData.articles.slice(0,5).map(a => ({
      title: a.title,
      url: a.url,
      source: a.source.name
    }));

    fs.writeFileSync("./news.json", JSON.stringify(news));

    // ================= MOTIVATION =================
    const quoteRes = await fetch("https://api.quotable.io/random");
    const quoteData = await quoteRes.json();

    const motivation = {
      quote: quoteData.content,
      author: quoteData.author
    };

    fs.writeFileSync("./motivation.json", JSON.stringify(motivation));

    // ================= FEATURED APP ROTATION =================
    const apps = [
      "Mzansi Township Runner",
      "Kasi Speed Legends",
      "Mzansi Doctors Connect",
      "Mzansi Mall VR",
      "Mzansi Tutors Connect"
    ];

    const featured = apps[Math.floor(Math.random() * apps.length)];
    fs.writeFileSync("./featured.json", JSON.stringify({ featured }));

    console.log("✅ Mzansi update complete");

    return {
      statusCode: 200,
      body: "Update success"
    };

  } catch (err) {
    console.error("❌ Update failed", err);
    return { statusCode: 500, body: "Error" };
  }
};
