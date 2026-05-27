/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useMemo, useEffect } from 'react';
import * as XLSX from 'xlsx';

export const DashboardContext = createContext();

const DEFAULT_TICKERS = [
  { "ticker": "VIC", "return_3m": 0.2256, "return_6m": 0.7208 },
  { "ticker": "BAB", "return_3m": -0.0583, "return_6m": -0.0208 },
  { "ticker": "BAF", "return_3m": -0.0809, "return_6m": 0.1017 }
];

// Helper to parse Excel row data intelligently
const parseExcelRows = (rows) => {
  if (!Array.isArray(rows) || rows.length === 0) return [];

  return rows.map(row => {
    const keys = Object.keys(row);
    if (keys.length === 0) return null;

    // Find Ticker key
    let tickerKey = keys.find(k => {
      const l = k.toLowerCase().trim();
      return l === 'ticker' || l === 'symbol' || l === 'mã cp' || l === 'mã' || l === 'cổ phiếu' || l === 'stock' || l === 'code' || l === 'mã chứng khoán' || l === 'mc';
    });

    // Find 3M Key
    let return3mKey = keys.find(k => {
      const l = k.toLowerCase().trim();
      return l === 'return_3m' || l === '3m' || l === '3 tháng' || l === 'hiệu suất 3m' || l === 'biến động 3m' || l === 'lợi nhuận 3m' || l === 'tăng trưởng 3m' || l === '3 tháng (%)' || l === '3m (%)';
    });

    // Find 6M Key
    let return6mKey = keys.find(k => {
      const l = k.toLowerCase().trim();
      return l === 'return_6m' || l === '6m' || l === '6 tháng' || l === 'hiệu suất 6m' || l === 'biến động 6m' || l === 'lợi nhuận 6m' || l === 'tăng trưởng 6m' || l === '6 tháng (%)' || l === '6m (%)';
    });

    let tickerVal = null;
    let return3mVal = null;
    let return6mVal = null;

    if (tickerKey) {
      tickerVal = row[tickerKey];
    } else {
      const fallbackTickerKey = keys.find(k => {
        const val = String(row[k]).trim();
        return /^[A-Za-z]{3,6}$/.test(val) && isNaN(Number(val));
      });
      if (fallbackTickerKey) {
        tickerVal = row[fallbackTickerKey];
        tickerKey = fallbackTickerKey;
      }
    }

    const parseVal = (val) => {
      if (val === undefined || val === null || val === '') return 0;
      if (typeof val === 'string') {
        const isPercent = val.includes('%');
        let cleaned = parseFloat(val.replace(/[^\d.-]/g, ''));
        if (isNaN(cleaned)) return 0;
        return isPercent ? cleaned / 100 : (Math.abs(cleaned) > 2.5 ? cleaned / 100 : cleaned);
      }
      return Math.abs(val) > 2.5 ? val / 100 : val;
    };

    if (return3mKey) return3mVal = parseVal(row[return3mKey]);
    if (return6mKey) return6mVal = parseVal(row[return6mKey]);

    const remainingKeys = keys.filter(k => k !== tickerKey);
    const numericKeys = remainingKeys.filter(k => {
      const val = row[k];
      return val !== null && val !== undefined && val !== '' && !isNaN(parseFloat(String(val).replace(/[^\d.-]/g, '')));
    });

    if (return3mVal === null || return3mVal === undefined) {
      if (numericKeys.length > 0) return3mVal = parseVal(row[numericKeys[0]]);
    }
    if (return6mVal === null || return6mVal === undefined) {
      if (numericKeys.length > 1) {
        return6mVal = parseVal(row[numericKeys[1]]);
      } else if (numericKeys.length === 1 && return3mVal !== null) {
        return6mVal = parseVal(row[numericKeys[0]]);
      }
    }

    if (!tickerVal) return null;

    return {
      ticker: String(tickerVal).toUpperCase().trim(),
      return_3m: return3mVal !== null ? return3mVal : 0,
      return_6m: return6mVal !== null ? return6mVal : 0
    };
  }).filter(item => item !== null && item.ticker !== "");
};

export const DashboardProvider = ({ children }) => {
  const [rawData, setRawData] = useState(() => {
    const saved = localStorage.getItem('naustock_raw_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing local storage raw data:", e);
      }
    }
    return DEFAULT_TICKERS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortColumn, setSortColumn] = useState('return_3m');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedTicker, setSelectedTicker] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Auto-fetch data.xlsx if it exists in public folder of deployed web server
  useEffect(() => {
    const loadDefaultPublicExcel = async () => {
      // Only auto-fetch if the user has not uploaded any custom Excel file yet
      if (localStorage.getItem('naustock_raw_data')) return;

      try {
        const response = await fetch('/data.xlsx');
        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          const workbook = XLSX.read(arrayBuffer, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const rows = XLSX.utils.sheet_to_json(sheet);

          if (rows.length > 0) {
            const parsed = parseExcelRows(rows);
            if (parsed.length > 0) {
              setRawData(parsed);
              console.log(`Auto-loaded ${parsed.length} tickers from public/data.xlsx`);
            }
          }
        }
      } catch {
        console.log("No static data.xlsx found in public/, using DEFAULT_TICKERS fallback.");
      }
    };

    loadDefaultPublicExcel();
  }, []);

  // Update data from imported Excel rows
  const updateDataFromExcel = (rows) => {
    if (!Array.isArray(rows) || rows.length === 0) return false;

    console.log("Dòng dữ liệu Excel thô mẫu:", rows[0]);
    console.log("Tất cả cột tìm thấy:", Object.keys(rows[0]));

    const parsed = parseExcelRows(rows);

    if (parsed.length > 0) {
      setRawData(parsed);
      localStorage.setItem('naustock_raw_data', JSON.stringify(parsed));
      setSearchQuery('');
      setFilterType('all');
      setCurrentPage(1);
      return true;
    }
    return false;
  };

  // Reset context rawData to original defaults
  const resetToDefault = () => {
    localStorage.removeItem('naustock_raw_data');
    setRawData(DEFAULT_TICKERS);
    setSearchQuery('');
    setFilterType('all');
    setCurrentPage(1);
  };

  // Apply filtering and sorting
  const filteredData = useMemo(() => {
    let result = [...rawData];

    // Search
    if (searchQuery) {
      const q = searchQuery.toUpperCase();
      result = result.filter(item => item.ticker.includes(q));
    }

    // Filter Chips
    if (filterType === 'up3m') {
      result = result.filter(item => item.return_3m > 0);
    } else if (filterType === 'down3m') {
      result = result.filter(item => item.return_3m < 0);
    } else if (filterType === 'up6m') {
      result = result.filter(item => item.return_6m > 0);
    } else if (filterType === 'down6m') {
      result = result.filter(item => item.return_6m < 0);
    }

    // Sorting
    const col = sortColumn;
    const dir = sortDirection === 'asc' ? 1 : -1;

    result.sort((a, b) => {
      const valA = a[col];
      const valB = b[col];

      if (col === 'ticker') {
        return valA.localeCompare(valB) * dir;
      }

      // Null handling
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;

      return (valA - valB) * dir;
    });

    return result;
  }, [rawData, searchQuery, filterType, sortColumn, sortDirection]);

  // Open / Close Modal Actions
  const openTickerModal = (symbol) => {
    setSelectedTicker(symbol);
    setIsModalOpen(true);
  };

  const closeTickerModal = () => {
    setIsModalOpen(false);
    setSelectedTicker(null);
  };

  return (
    <DashboardContext.Provider value={{
      rawData,
      filteredData,
      searchQuery,
      setSearchQuery,
      filterType,
      setFilterType,
      sortColumn,
      setSortColumn,
      sortDirection,
      setSortDirection,
      currentPage,
      setCurrentPage,
      itemsPerPage,
      setItemsPerPage,
      selectedTicker,
      isModalOpen,
      openTickerModal,
      closeTickerModal,
      updateDataFromExcel,
      resetToDefault
    }}>
      {children}
    </DashboardContext.Provider>
  );
};
