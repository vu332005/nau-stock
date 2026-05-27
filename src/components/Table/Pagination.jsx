import { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';

export function Pagination() {
  const { 
    filteredData, 
    currentPage, 
    setCurrentPage, 
    itemsPerPage, 
    setItemsPerPage 
  } = useDashboard();

  const total = filteredData.length;

  const paginationStats = useMemo(() => {
    if (total === 0) return { start: 0, end: 0, totalPages: 0 };
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = itemsPerPage === 'all' ? total : Math.min(start + itemsPerPage - 1, total);
    const totalPages = itemsPerPage === 'all' ? 1 : Math.ceil(total / itemsPerPage);
    return { start, end, totalPages };
  }, [total, currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    const val = e.target.value;
    setItemsPerPage(val === 'all' ? 'all' : parseInt(val));
    setCurrentPage(1);
  };

  const renderPageNumbers = () => {
    const { totalPages } = paginationStats;
    if (itemsPerPage === 'all' || totalPages <= 1) return null;

    const pageButtons = [];
    let prevWasEllipsis = false;

    for (let i = 1; i <= totalPages; i++) {
      // Display first, last, current, and adjacent pages
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        pageButtons.push(
          <button
            key={i}
            className={`pag-btn ${i === currentPage ? 'active' : ''}`}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        );
        prevWasEllipsis = false;
      } else if (i === 2 || i === totalPages - 1) {
        if (!prevWasEllipsis) {
          pageButtons.push(
            <span key={`dots-${i}`} style={{ padding: '0 8px', alignSelf: 'center' }}>
              ...
            </span>
          );
          prevWasEllipsis = true;
        }
      }
    }

    return pageButtons;
  };

  return (
    <div className="table-footer">
      <div className="table-footer-info">
        Hiển thị từ <span id="pag-start">{paginationStats.start}</span> đến{' '}
        <span id="pag-end">{paginationStats.end}</span> trên tổng số{' '}
        <span id="pag-total">{total}</span> mã.
        <select 
          className="select-sm" 
          id="items-per-page"
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
        >
          <option value={10}>10 dòng / trang</option>
          <option value={25}>25 dòng / trang</option>
          <option value={50}>50 dòng / trang</option>
          <option value="all">Hiển thị tất cả</option>
        </select>
      </div>

      {itemsPerPage !== 'all' && paginationStats.totalPages > 1 && (
        <div className="pagination-controls" id="pagination-controls">
          <button 
            className="pag-btn"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <ChevronLeft size={16} />
          </button>
          
          {renderPageNumbers()}

          <button 
            className="pag-btn"
            disabled={currentPage === paginationStats.totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

export default Pagination;
