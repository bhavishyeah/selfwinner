import React, { useState, useEffect } from 'react';

interface SearchBarProps {
  onSearch: (term: string) => void;
  placeholder?: string;
  initialValue?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = 'Search for notes, subjects, or colleges...', 
  initialValue = '' 
}) => {
  const [q, setQ] = useState(initialValue);

  // Sync internal state if external initialValue changes (e.g. clear filters)
  useEffect(() => {
    setQ(initialValue);
  }, [initialValue]);

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(q);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [q]); // Intentionally omitting onSearch to avoid re-running if parent passes a new function

  return (
    <div className="flex items-center bg-white shadow-sm border border-gray-200 rounded-full px-5 py-3 w-full transition-all duration-300 focus-within:shadow-lg focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-blue-50/50">
      <i className="fas fa-search text-gray-400 mr-3 text-xl"></i>
      <input
        type="text"
        className="flex-1 focus:outline-none text-gray-700 text-lg placeholder-gray-400 bg-transparent"
        placeholder={placeholder}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        aria-label="Search notes"
      />
      {q && (
        <button 
            className="ml-3 text-gray-300 hover:text-gray-500 transition-colors focus:outline-none p-1" 
            onClick={() => setQ('')}
            title="Clear search"
        >
          <i className="fas fa-times-circle text-lg"></i>
        </button>
      )}
    </div>
  );
};

export default SearchBar;