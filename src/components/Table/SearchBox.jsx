import { Search, X } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';

export function SearchBox() {
  const { searchQuery, setSearchQuery } = useDashboard();

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClear = () => {
    setSearchQuery('');
  };

  return (
    <div className="search-box">
      <Search className="search-icon" size={16} />
      <input 
        type="text" 
        id="search-input" 
        placeholder="Tìm kiếm mã cổ phiếu..." 
        value={searchQuery}
        onChange={handleInputChange}
      />
      {searchQuery && (
        <button 
          className="clear-search" 
          id="clear-search" 
          onClick={handleClear}
          title="Xóa tìm kiếm"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

export default SearchBox;
