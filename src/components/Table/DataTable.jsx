import { useMemo } from 'react';
import { Eye, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';
import { formatPercent, getTrendDetails } from '../../utils/format';

export function DataTable() {
  const { 
    filteredData, 
    sortColumn, 
    setSortColumn, 
    sortDirection, 
    setSortDirection,
    currentPage,
    itemsPerPage,
    openTickerModal
  } = useDashboard();

  // Paginate items
  const pageItems = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = itemsPerPage === 'all' ? filteredData.length : Math.min(startIdx + itemsPerPage, filteredData.length);
    return itemsPerPage === 'all' ? filteredData : filteredData.slice(startIdx, endIdx);
  }, [filteredData, currentPage, itemsPerPage]);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc'); // Default to descending for numbers
    }
  };

  const renderSortIcon = (column) => {
    if (sortColumn !== column) return <ArrowUpDown className="sort-icon" size={13} />;
    return sortDirection === 'asc' 
      ? <ArrowUp className="sort-icon text-up" size={13} /> 
      : <ArrowDown className="sort-icon text-down" size={13} />;
  };

  return (
    <div className="table-responsive">
      <table className="data-table">
        <thead>
          <tr>
            <th 
              className={`sortable ${sortColumn === 'ticker' ? `sorted-${sortDirection}` : 'sorted-none'}`}
              onClick={() => handleSort('ticker')}
            >
              Mã CP {renderSortIcon('ticker')}
            </th>
            <th 
              className={`sortable ${sortColumn === 'return_3m' ? `sorted-${sortDirection}` : 'sorted-none'}`}
              onClick={() => handleSort('return_3m')}
            >
              Biến động 3M {renderSortIcon('return_3m')}
            </th>
            <th 
              className={`sortable ${sortColumn === 'return_6m' ? `sorted-${sortDirection}` : 'sorted-none'}`}
              onClick={() => handleSort('return_6m')}
            >
              Biến động 6M {renderSortIcon('return_6m')}
            </th>
            <th>Trạng thái</th>
            <th className="text-center">Hành động</th>
          </tr>
        </thead>
        <tbody id="table-body">
          {pageItems.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center" style={{ color: 'var(--text-muted)', padding: '30px' }}>
                Không tìm thấy mã cổ phiếu nào phù hợp
              </td>
            </tr>
          ) : (
            pageItems.map(item => {
              const trend = getTrendDetails(item);
              const r3mClass = item.return_3m > 0 ? "text-up" : item.return_3m < 0 ? "text-down" : "";
              const r6mClass = item.return_6m > 0 ? "text-up" : item.return_6m < 0 ? "text-down" : "";

              return (
                <tr key={item.ticker}>
                  <td className="ticker-name-cell">{item.ticker}</td>
                  <td className={`return-cell ${r3mClass}`}>
                    {formatPercent(item.return_3m, true)}
                  </td>
                  <td className={`return-cell ${r6mClass}`}>
                    {formatPercent(item.return_6m, true)}
                  </td>
                  <td>
                    <span className={`badge ${trend.badgeClass}`}>
                      {trend.badgeText}
                    </span>
                  </td>
                  <td className="text-center">
                    <button 
                      className="btn btn-outline btn-sm btn-view-ticker"
                      onClick={() => openTickerModal(item.ticker)}
                    >
                      <Eye size={14} style={{ marginRight: '4px' }} />
                      <span>Xem</span>
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
