import { LayoutDashboard, BarChart3, PhoneCall } from 'lucide-react';

export function Sidebar() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img 
          src="https://images.squarespace-cdn.com/content/v1/5c98696ec0970076a084ef70/1553504780540-P6M6D7N28H8G1U9K93YV/Naustock+Logo.png" 
          className="brand-logo-img" 
          alt="Naustock Logo" 
        />
      </div>
      
      <nav className="sidebar-menu">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
          className="menu-item active"
        >
          <LayoutDashboard />
          <span>Tổng quan</span>
        </button>
        <button 
          onClick={() => scrollToSection('charts-section')} 
          className="menu-item"
        >
          <BarChart3 />
          <span>Mô hình dự báo</span>
        </button>
        <button 
          onClick={() => scrollToSection('contact-section')} 
          className="menu-item"
        >
          <PhoneCall />
          <span>Hỗ trợ khách hàng</span>
        </button>
      </nav>
      
      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="avatar">NP</div>
          <div className="user-info">
            <span className="user-name">Đinh Hoàng Phong</span>
            <span className="user-role">Lab Director</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
