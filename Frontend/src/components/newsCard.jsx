import React from 'react';
import axios from 'axios';
import { useQuery } from '../context/queryContext';
import { useAPIcontext } from '../context/apiContext';

function NewsCard() {
  const [articles, setArticles] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
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
