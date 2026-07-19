import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ initialValue = '', onSearch }) => {
  const [query, setQuery] = useState(initialValue);

  // Debounce logic: wait 300ms after last keystroke before firing search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search size={16} className="text-gray-500" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search employees by name, email, or ID..."
        className="input pl-10 bg-surface-2 border-edge focus:bg-surface focus:border-amber-400"
      />
    </div>
  );
};

export default SearchBar;