import { useState } from 'react';
import { LayoutDashboard, BarChart3, PhoneCall } from 'lucide-react';

export function Sidebar() {
  const [activeItem, setActiveItem] = useState('overview');

  const scrollToSection = (id, itemName) => {
    setActiveItem(itemName);
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img 
          src="/logo.png" 
          className="brand-logo-img" 
          alt="Naustock Logo" 
          style={{ objectFit: 'contain', maxHeight: '70px', width: 'auto' }}
        />
      </div>
      
      <nav className="sidebar-menu">
        <button 
          onClick={() => scrollToSection('top', 'overview')} 
          className={`menu-item ${activeItem === 'overview' ? 'active' : ''}`}
        >
          <LayoutDashboard />
          <span>Tổng quan</span>
        </button>
        <button 
          onClick={() => scrollToSection('charts-section', 'charts')} 
          className={`menu-item ${activeItem === 'charts' ? 'active' : ''}`}
        >
          <BarChart3 />
          <span>Mô hình dự báo</span>
        </button>
        <button 
          onClick={() => scrollToSection('contact-section', 'contact')} 
          className={`menu-item ${activeItem === 'contact' ? 'active' : ''}`}
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
