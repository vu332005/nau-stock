import { PhoneCall, User, ShieldCheck, Phone } from 'lucide-react';

export function ContactSection() {
  return (
    <section className="contact-section glass-panel" id="contact-section">
      <div className="contact-watermark"></div>
      <div className="contact-header">
        <PhoneCall className="contact-icon" />
        <h3>THÔNG TIN LIÊN HỆ</h3>
        <p>Liên hệ tư vấn đầu tư và mở tài khoản chứng khoán</p>
      </div>
      <div className="contact-grid">
        {/* Contact Card 1 */}
        <div className="contact-member-card">
          <div className="member-avatar">
            <User />
          </div>
          <div className="member-details">
            <span className="member-name">Trần Thúy Hạnh (Mrs)</span>
            <span className="member-id">
              <ShieldCheck /> 
              <span>ID 5689 &bull; Chứng khoán VPS</span>
            </span>
            <a href="tel:0384500562" className="member-phone">
              <Phone /> 
              <span>Phone / Zalo: 0384.500.562</span>
            </a>
          </div>
        </div>

        {/* Contact Card 2 */}
        <div className="contact-member-card">
          <div className="member-avatar">
            <User />
          </div>
          <div className="member-details">
            <span className="member-name">Đinh Hoàng Phong (Mr.)</span>
            <span className="member-id">
              <ShieldCheck /> 
              <span>ID 3159 &bull; Chứng khoán SSI</span>
            </span>
            <a href="tel:0376562969" className="member-phone">
              <Phone /> 
              <span>Phone / Zalo: 037.6562.969</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
