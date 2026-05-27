import { useRef } from 'react';
import { FileDown, FileSpreadsheet, RotateCcw } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useDashboard } from '../../hooks/useDashboard';

export function Header() {
  const { updateDataFromExcel, resetToDefault } = useDashboard();
  const fileInputRef = useRef(null);

  const handleExport = () => {
    alert("Tính năng xuất báo cáo PDF/Excel sẽ được tích hợp cùng hệ thống lưu trữ doanh nghiệp.");
  };

  const handleTriggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleReset = () => {
    if (window.confirm("Bạn có chắc chắn muốn khôi phục dữ liệu mặc định của Naustock (Xóa bộ nhớ lưu trữ tạm thời)?")) {
      resetToDefault();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet);
        
        if (rows.length === 0) {
          alert("Lỗi: Tệp Excel này không có dòng dữ liệu nào.");
          return;
        }

        const success = updateDataFromExcel(rows);
        if (success) {
          alert(`Đã nhập dữ liệu thành công từ tệp Excel! Nạp thành công ${rows.length} cổ phiếu.`);
        } else {
          alert("Lỗi: Không tìm thấy cột thông tin hợp lệ (Ví dụ: Ticker/Mã CP, 3M, 6M) trong tệp Excel.");
        }
      } catch (err) {
        console.error(err);
        alert("Lỗi: Có lỗi xảy ra trong quá trình đọc tệp Excel. Vui lòng kiểm tra định dạng tệp.");
      }
    };
    reader.readAsArrayBuffer(file);
    
    // Reset file input value to allow uploading same file again
    e.target.value = '';
  };

  return (
    <header className="app-header">
      <div className="header-title-area">
        <h1>BIẾN ĐỘNG TOP 100 VỐN HÓA</h1>
        <span className="header-subtitle">Mô hình phân tích dữ liệu tự động từ tệp Excel định kỳ 2026.</span>
      </div>
      
      <div className="header-actions">
        <div className="status-indicator">
          <span className="pulse-dot"></span>
          <span className="status-text">VPS/SSI Feed Live</span>
        </div>

        <button className="btn btn-outline" onClick={handleTriggerFileInput} title="Tải tệp dữ liệu Excel lên">
          <FileSpreadsheet size={16} />
          <span>Nhập Excel</span>
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept=".xlsx, .xls"
          onChange={handleFileChange}
        />

        <button className="btn btn-outline" onClick={handleReset} title="Khôi phục danh sách 100 cổ phiếu mặc định">
          <RotateCcw size={16} />
          <span>Mặc định</span>
        </button>
        
        <button className="btn btn-primary" onClick={handleExport}>
          <FileDown size={16} />
          <span>Xuất Báo Cáo</span>
        </button>
      </div>
    </header>
  );
}

export default Header;
