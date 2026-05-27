import { DashboardProvider } from './context/DashboardContext';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import KPICardsGrid from './components/KPI/KPICardsGrid';
import ChartSection from './components/Charts/ChartSection';
import TableSection from './components/Table/TableSection';
import ContactSection from './components/Contact/ContactSection';
import TickerModal from './components/Modal/TickerModal';

function AppContent() {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Header />
        <div className="dashboard-body">
          <KPICardsGrid />
          <ChartSection />
          <TableSection />
          <ContactSection />
        </div>
        <Footer />
      </main>
      <TickerModal />
    </div>
  );
}

export default function App() {
  return (
    <DashboardProvider>
      <AppContent />
    </DashboardProvider>
  );
}
