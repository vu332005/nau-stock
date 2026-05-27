import SearchBox from './SearchBox';
import FilterChips from './FilterChips';
import DataTable from './DataTable';
import Pagination from './Pagination';

export function TableSection() {
  return (
    <section className="table-section glass-panel">
      <div className="table-header-bar">
        <div className="table-title-area">
          <h3>Bảng Thống Kê Tổng Hợp</h3>
          <p>Dữ liệu biến động chi tiết của Top 100 mã cổ phiếu lớn nhất thị trường.</p>
        </div>
        <div className="table-controls-wrapper">
          <SearchBox />
          <FilterChips />
        </div>
      </div>
      <DataTable />
      <Pagination />
    </section>
  );
}

export default TableSection;
