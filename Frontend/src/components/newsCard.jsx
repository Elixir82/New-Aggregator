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

    return () => clearInterval(intervalId);
  }, [query, setAPIStatus]);

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
    <div className="mb-12">
      <div className="flex items-center mb-6">
        <div className="h-1 w-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mr-4"></div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
          Breaking News
        </h2>
        <div className="h-1 flex-1 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full ml-4 opacity-20"></div>
      </div>
      
      {headlinesLoading ? (
        <div className="flex space-x-6 overflow-hidden">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="flex-shrink-0 w-96 group">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"></div>
                <div className="p-6">
                  <div className="h-5 bg-gray-300 rounded-lg mb-3 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded-lg mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-3/4 animate-pulse"></div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="h-3 bg-gray-200 rounded-full w-20 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded-full w-16 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-400 rounded-full mr-3"></div>
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        </div>
      ) : headlines.length > 0 ? (
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex space-x-6 pb-6" style={{ width: 'max-content' }}>
            {headlines.map((headline, index) => (
              <div
                key={headline.link || index}
                className="flex-shrink-0 w-96 group cursor-pointer transform hover:scale-[1.02] transition-all duration-300"
              >
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl hover:border-indigo-200 transition-all duration-300">
                  {headline.photo_url && (
                    <div className="relative overflow-hidden">
                      <img
                        src={headline.photo_url}
                        alt={headline.title || 'News'}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-2 mb-3 group-hover:text-indigo-700 transition-colors duration-300">
                      {headline.title}
                    </h3>
                    {headline.snippet && (
                      <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
                        {headline.snippet}
                      </p>
                    )}
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
                        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                          {headline.source || 'News Source'}
                        </span>
                      </div>
                      {headline.published_datetime_utc && (
                        <span className="text-xs text-gray-400 font-medium">
                          {new Date(headline.published_datetime_utc).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    {headline.link && (
                      <a
                        href={headline.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-800 group-hover:translate-x-1 transition-all duration-300"
                      >
                        Read Full Story
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">No headlines available at the moment</p>
        </div>
      )}
    </div>
  );

  if (!loading && articles.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <HeadlinesScroller />
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Results Found</h3>
            <p className="text-gray-600 text-lg">
              We couldn't find any articles for <span className="font-semibold text-indigo-600">{query}</span>.
            </p>
            <p className="text-gray-500 mt-2">Try searching with different keywords or check back later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <HeadlinesScroller />
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            {/* Modern loader with glassmorphism */}
            <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-12 border border-white/30 shadow-2xl">
              {/* Circular progress */}
              <div className="relative w-32 h-32 mx-auto mb-8">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 144 144">
                  <circle
                    cx="72"
                    cy="72"
                    r="64"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-200"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="64"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 64}`}
                    strokeDashoffset={`${2 * Math.PI * 64 * (1 - progress / 100)}`}
                    className="text-indigo-500 transition-all duration-500 ease-out"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {progress}%
                  </span>
                </div>
              </div>

              {/* Floating orbs animation */}
              <div className="relative flex justify-center mb-8">
                <div className="flex space-x-3">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-4 h-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.2}s`, animationDuration: '1.4s' }}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Status message */}
              <div className="text-center">
                <p className="text-xl font-semibold text-gray-700 mb-2">
                  {progress < 30 ? "🔍 Searching news sources..." :
                    progress < 60 ? "🧠 Analyzing content..." :
                      progress < 85 ? "✨ Finalizing results..." :
                        "🎯 Almost ready!"}
                </p>
                <p className="text-gray-500">Please wait while we fetch the latest news</p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Search Results for <span className="text-indigo-600">{query}</span>
              </h2>
              <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-full border border-gray-200">
                {articles.length} articles found
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {articles.map((article, index) => (
                <div
                  key={article.link}
                  className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl hover:border-indigo-200 transition-all duration-500 transform hover:-translate-y-2"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={article.photo_url}
                      alt={article.title || 'News'}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-4 text-gray-900 line-clamp-2 group-hover:text-indigo-700 transition-colors duration-300 leading-tight">
                      {article.title}
                    </h2>
                    <p className="text-gray-600 text-base line-clamp-3 mb-6 leading-relaxed">
                      {article.snippet}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <div className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></div>
                        <span className="font-medium">
                          {new Date(article.published_datetime_utc).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {new Date(article.published_datetime_utc).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-base font-semibold text-indigo-600 hover:text-indigo-800 group-hover:translate-x-1 transition-all duration-300"
                    >
                      Read Full Article
                      <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NewsCard;