const fetchNewsFromAPI = require('../services/fetchNews');
const Article = require('../models/article');

const searchNews = async (req, res) => {
  console.log(req.query,"yoyo");
  const topic = req.query.q || 'India';
  let saved = 0;

  try {
    const articles = await fetchNewsFromAPI(topic);

    for (const article of articles) {
      try {
        await Article.updateOne(
          { link: article.link },
          {
            $setOnInsert: {
              title: article.title,
              photo_url: article.photo_url,
              snippet: article.snippet,
              published_datetime_utc: article.published_datetime_utc,
              source_name: article.source_name,
              link: article.link,
              topic,
            },
          },
          { upsert: true }
        );
        saved++;
      } catch (err) {
        console.error('Error saving article:', err.message);
      }
    }

    const dbArticles = await Article.find({ topic })
      .sort({ published_datetime_utc: -1 })
      .limit(30);

    res.json({ count: dbArticles.length, saved, articles: dbArticles });

  } catch (error) {
    console.error('Error in searchNews:', error.message);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
};

module.exports = { searchNews };
