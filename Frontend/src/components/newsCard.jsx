import React from 'react';
import axios from 'axios';
import { useQuery } from '../context/queryContext';
import { useAPIcontext } from '../context/apiContext';

function NewsCard() {
  const [articles, setArticles] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [headlines, setHeadlines] = React.useState([]);
  const [headlinesLoading, setHeadlinesLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  let { query } = useQuery();
  let { setAPIStatus } = useAPIcontext();

  React.useEffect(() => {
    let intervalId;

    const startLoader = () => {
      setProgress(0);
      intervalId = setInterval(() => {
        setProgress(prev => {
          if (prev >= 85) {
            return prev;
          }
          return prev + Math.floor(Math.random() * 7 + 1);
        });
      }, 1200);
    };

    const fetchNews = async () => {
      setLoading(true);
      startLoader();

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/search?q=${query}`
        );
        if (res) {
          setArticles(res.data.articles);
        }
      } catch (error) {
        if (error.response?.status === 429) {
          setAPIStatus(true);
        }
        console.log('Error in fetching articles for frontend:', error);
      } finally {
        clearInterval(intervalId);
        setProgress(100);
        setTimeout(() => {
          setLoading(false);
        }, 400);
      }
    };

    fetchNews();

    // cleanup on unmount
    return () => clearInterval(intervalId);
  }, [query, setAPIStatus]);

  // Fetch headlines on component mount
  React.useEffect(() => {
    const fetchHeadlines = async () => {
      try {
        setHeadlinesLoading(true);
        setError(null);

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/headlines`
        );

        if (response.data && response.data.data && response.data.data.data) {
          setHeadlines(response.data.data.data);
        } else {
          throw new Error('Invalid response structure');
        }

      } catch (error) {
        console.error('Failed to fetch headlines:', error);
        setError(
          error.response?.data?.message ||
          error.message ||
          'Failed to load headlines. Please try again later.'
        );
        setHeadlines([]);
      } finally {
        setHeadlinesLoading(false);
      }
    };

    fetchHeadlines();
  }, []);

  const HeadlinesScroller = () => (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Top Headlines</h2>
      
      {headlinesLoading ? (
        <div className="flex space-x-4 overflow-hidden">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex-shrink-0 w-80 bg-gray-200 rounded-lg animate-pulse">
              <div className="h-40 bg-gray-300 rounded-t-lg"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      ) : headlines.length > 0 ? (
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex space-x-4 pb-4" style={{ width: 'max-content' }}>
            {headlines.map((headline, index) => (
              <div
                key={headline.link || index}
                className="flex-shrink-0 w-80 bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-200"
              >
                {headline.photo_url && (
                  <img
                    src={headline.photo_url}
                    alt={headline.title || 'News'}
                    className="w-full h-40 object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-sm text-gray-800 line-clamp-2 mb-2">
                    {headline.title}
                  </h3>
                  {headline.snippet && (
                    <p className="text-gray-600 text-xs line-clamp-2 mb-2">
                      {headline.snippet}
                    </p>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {headline.source || 'News Source'}
                    </span>
                    {headline.published_datetime_utc && (
                      <span className="text-xs text-gray-400">
                        {new Date(headline.published_datetime_utc).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  {headline.link && (
                    <a
                      href={headline.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 text-xs font-medium text-blue-600 hover:underline"
                    >
                      Read more →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-gray-500 text-sm">No headlines available</div>
      )}
    </div>
  );

  if (!loading && articles.length === 0) {
    return (
      <>
        <HeadlinesScroller />
        <div className="text-center text-gray-500 mt-10">
          No articles found for <span className="font-semibold">{query}</span>.
        </div>
      </>
    );
  }

  return (
    <>
      <HeadlinesScroller />
      
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 space-y-6">
          {/* Animated progress bar with gradient */}
          <div className="w-72 bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-blue-500 to-purple-600"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Progress percentage with animation */}
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {progress}%
            </span>
          </div>

          {/* Animated dots */}
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></div>
          </div>

          {/* Status message that changes based on progress */}
          <p className="text-gray-500 text-sm">
            {progress < 30 ? "Searching news sources..." :
              progress < 60 ? "Analyzing content..." :
                progress < 85 ? "Finalizing results..." :
                  "Almost ready!"}
          </p>
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
                {new Date(article.published_datetime_utc).toLocaleString(
                  'en-US',
                  {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  }
                )}
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
