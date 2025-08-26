const axios = require('axios');

let cachedHeadlines = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; 

const fetchHeadlines = async (req, res) => {
  try {
    
    const currentTime = Date.now();
    if (cachedHeadlines && (currentTime - lastFetchTime) < CACHE_DURATION) {
      return res.status(200).json({
        message: "Headlines fetched from cache",
        data: cachedHeadlines,
        cached: true
      });
    }

    
    const response = await axios.get('https://real-time-news-data.p.rapidapi.com/top-headlines', {
      params: {
        limit: '20',
        country: 'IN',
        lang: 'en'
      },
      headers: {
        'X-RapidAPI-Key': process.env.BING_NEWS_KEY,
        'X-RapidAPI-Host': 'real-time-news-data.p.rapidapi.com',
      }
    });

    cachedHeadlines = response.data;
    lastFetchTime = currentTime;

    res.status(200).json({
      message: "Headlines fetched from API",
      data: response.data,
      cached: false
    });

  } catch (error) {
    console.error('Headlines fetch error:', error.message);
    if (cachedHeadlines) {
      return res.status(200).json({
        message: "Headlines fetched from cache",
        data: cachedHeadlines,
        cached: true,
        error: "API request failed, serving cached data"
      });
    }

    res.status(500).json({ 
      message: "Unable to fetch headlines",
      error: error.response?.data?.message || error.message 
    });
  }
};

module.exports =  fetchHeadlines ;