import { useRef, useState } from 'react';
import { FileDown, FileSpreadsheet, RotateCcw, Lock, Unlock, Key } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useDashboard } from '../../hooks/useDashboard';
import { supabase } from '../../utils/supabase';
import { hashPassword } from '../../utils/auth';

export function Header() {
  const { updateDataFromExcel, resetToDefault } = useDashboard();
  const fileInputRef = useRef(null);
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleExport = () => {
    alert("Tính năng xuất báo cáo PDF/Excel sẽ được tích hợp cùng hệ thống lưu trữ doanh nghiệp.");
  };

  const handleTriggerFileInput = () => {
    if (!isAdmin) {
      alert("Vui lòng đăng nhập quyền Admin để tải dữ liệu lên Server.");
      setShowAdminModal(true);
      return;
    }
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleReset = () => {
    if (!isAdmin) {
      alert("Vui lòng đăng nhập quyền Admin để khôi phục dữ liệu Server.");
      setShowAdminModal(true);
      return;
    }
    if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ dữ liệu trên Database và khôi phục mặc định?")) {
      resetToDefault();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
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

        setIsUploading(true);
        const success = await updateDataFromExcel(rows);
        setIsUploading(false);
        
        if (success) {
          alert(`Đã đồng bộ lên Database thành công! Nạp ${rows.length} cổ phiếu.`);
        } else {
          alert("Lỗi: Không tìm thấy cột thông tin hợp lệ (Ví dụ: Ticker/Mã CP, 3M, 6M) trong tệp Excel.");
        }
      } catch (err) {
        console.error(err);
        setIsUploading(false);
        alert("Lỗi: Có lỗi xảy ra trong quá trình xử lý tệp Excel.");
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = '';
  };

  const loginAdmin = async () => {
    if (!passwordInput) return;
    const hash = await hashPassword(passwordInput);
    const { data, error } = await supabase.from('settings').select('value').eq('key', 'admin_password').single();
    
    if (error || !data) {
       // Allow first login if no password is set
       setIsAdmin(true);
       setShowAdminModal(false);
       alert("Chưa có mật khẩu được thiết lập trên Server. Vui lòng đổi mật khẩu mới để bảo mật!");
    } else if (data.value === hash) {
       setIsAdmin(true);
       setShowAdminModal(false);
       setPasswordInput('');
    } else {
       alert("Mật khẩu không đúng!");
    }
  };

  const changePassword = async () => {
    if (!newPasswordInput) return;
    const hash = await hashPassword(newPasswordInput);
    const { error } = await supabase.from('settings').upsert({ key: 'admin_password', value: hash });
    if (error) {
      alert("Có lỗi xảy ra khi lưu mật khẩu lên Server.");
    } else {
      alert("Đổi mật khẩu thành công!");
      setIsChangingPassword(false);
      setNewPasswordInput('');
    }
  };

  return (
    <>
      <header className="app-header">
        <div className="header-title-area">
          <h1>BIẾN ĐỘNG TOP 100 VỐN HÓA</h1>
          <span className="header-subtitle">Dữ liệu được đồng bộ trực tuyến thời gian thực.</span>
        </div>
        
        <div className="header-actions">
          <div className="status-indicator">
            <span className="pulse-dot"></span>
            <span className="status-text">{isUploading ? "Đang đẩy lên DB..." : "Database Live"}</span>
          </div>
          
          <button 
            className={`btn ${isAdmin ? 'btn-outline' : 'btn-outline'}`} 
            onClick={() => isAdmin ? setIsAdmin(false) : setShowAdminModal(true)}
            title={isAdmin ? "Đăng xuất" : "Đăng nhập Admin"}
            style={{ borderColor: isAdmin ? 'var(--color-up)' : '', color: isAdmin ? 'var(--color-up)' : '' }}
          >
            {isAdmin ? <Unlock size={16} /> : <Lock size={16} />}
            <span>{isAdmin ? "Admin" : "Đăng nhập"}</span>
          </button>

          {isAdmin && (
            <button className="btn btn-outline" onClick={() => {setShowAdminModal(true); setIsChangingPassword(true);}} title="Đổi mật khẩu">
              <Key size={16} />
            </button>
          )}

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

          <button className="btn btn-outline" onClick={handleReset} title="Khôi phục danh sách mặc định">
            <RotateCcw size={16} />
            <span>Mặc định</span>
          </button>
          
          <button className="btn btn-primary" onClick={handleExport}>
            <FileDown size={16} />
            <span>Xuất Báo Cáo</span>
          </button>
        </div>
      </header>

      {/* Admin Auth Modal */}
      <div className={`modal ${showAdminModal ? 'open' : ''}`} onClick={(e) => e.target === e.currentTarget && setShowAdminModal(false)}>
        <div className="modal-content glass-panel animated-scale" style={{ maxWidth: '400px' }}>
          <div className="modal-header">
            <h3>{isChangingPassword ? "Đổi mật khẩu Admin" : "Đăng nhập Quản trị"}</h3>
          </div>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {!isChangingPassword ? (
              <>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Vui lòng nhập mật khẩu để có quyền ghi đè dữ liệu lên Database.</p>
                <input 
                  type="password" 
                  className="search-input" 
                  placeholder="Nhập mật khẩu..." 
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                />
              </>
            ) : (
              <>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Nhập mật khẩu mới cho tài khoản Admin.</p>
                <input 
                  type="password" 
                  className="search-input" 
                  placeholder="Mật khẩu mới..." 
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                />
              </>
            )}
          </div>
          <div className="modal-footer" style={{ marginTop: '20px' }}>
            <button className="btn btn-outline" onClick={() => {setShowAdminModal(false); setIsChangingPassword(false);}}>
              Hủy bỏ
            </button>
            <button className="btn btn-primary" onClick={isChangingPassword ? changePassword : loginAdmin}>
              {isChangingPassword ? "Lưu mật khẩu" : "Đăng nhập"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
