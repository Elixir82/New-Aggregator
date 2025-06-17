import React, { useEffect } from 'react';
import { useQuery } from '../context/queryContext';

function SearchBar() {
  const [search, setSearch] = React.useState('');
  const { setQuery } = useQuery();
  const inputRef = React.useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      setQuery(search);
    }
  };

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto mt-10 flex items-center justify-center px-4"
    >
      <input
        ref={inputRef}
        type="text"
        placeholder="Search for news (e.g. AI, Elon Musk)..."
        className="flex-grow px-5 py-3 rounded-l-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 backdrop-blur-md shadow-md placeholder-gray-400 text-gray-800"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button
        type="submit"
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-r-full hover:bg-blue-700 transition shadow-md cursor-pointer"
      >
        Search
      </button>
    </form>
  );
}

export default SearchBar;
