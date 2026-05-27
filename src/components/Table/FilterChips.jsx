import { useDashboard } from '../../hooks/useDashboard';

const chips = [
  { id: 'all', label: 'Tất cả' },
  { id: 'up3m', label: '3M Tăng' },
  { id: 'down3m', label: '3M Giảm' },
  { id: 'up6m', label: '6M Tăng' },
  { id: 'down6m', label: '6M Giảm' }
];

export function FilterChips() {
  const { filterType, setFilterType, setCurrentPage } = useDashboard();

  const handleChipClick = (id) => {
    setFilterType(id);
    setCurrentPage(1); // Reset page to 1 on filter change
  };

  return (
    <div className="filter-chips" id="filter-chips">
      {chips.map(chip => (
        <button
          key={chip.id}
          className={`chip ${filterType === chip.id ? 'active' : ''}`}
          onClick={() => handleChipClick(chip.id)}
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
}

export default FilterChips;
