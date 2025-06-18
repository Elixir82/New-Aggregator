import React from 'react';
import axios from 'axios';
import { useQuery } from '../context/queryContext';

function NewsCard() {
  const [articles, setArticles] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  let { query } = useQuery();

  React.useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/search?q=${query}`);
        if (res) {
          setArticles(res.data.articles);
        }
      } catch (error) {
        console.log('Error in fetching articles for frontend:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [query]);

  if (!loading && articles.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-10">
        No articles found for <span className="font-semibold">{query}</span>.
      </div>
    );
  }

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((article) => (
            <div
              key={article.link}
              className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200 transition hover:shadow-xl"
            >
              <img
                src={article.photo_url}
                alt={article.title || 'News'}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-2 text-gray-800 line-clamp-2">
                  {article.title}
                </h2>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {article.snippet}
                </p>
              </div>
              <div className="text-xs text-gray-400 px-4 pb-2">
                {new Date(article.published_datetime_utc).toLocaleString('en-US', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </div>
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 text-sm font-medium text-blue-600 hover:underline self-start px-4 pb-4"
              >
                Read more →
              </a>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default NewsCard;
