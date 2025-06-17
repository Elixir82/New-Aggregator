const axios = require('axios');
require('dotenv').config();

const fetchNewsFromAPI = async (query = 'India',type='search') => {

  const options = {
    method: 'GET',
    url: `https://real-time-news-data.p.rapidapi.com/search?query=${query}`,
    params: {
      query: query,
      limit: '20',
      time_published: '7d', 
      country: 'US',
      lang: 'en',
    },
    headers: {
      'X-RapidAPI-Key': process.env.BING_NEWS_KEY,
      'X-RapidAPI-Host': 'real-time-news-data.p.rapidapi.com',
    },
  };

  console.log('Request Options:', JSON.stringify(options, null, 2));

try {
    const { data } = await axios.request(options);
    console.log('API returned', JSON.stringify(data, null, 2));
    return data.data;
  } catch (err) {
    console.error('fetchNews error:', err.response?.data || err.message);
    return [];
  }
}

module.exports = fetchNewsFromAPI;