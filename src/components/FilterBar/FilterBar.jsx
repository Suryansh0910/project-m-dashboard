import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilterPriority, setFilterCategory, setSortBy } from '../../store/tasksSlice';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import SortOutlinedIcon from '@mui/icons-material/SortOutlined';
import ViewStreamIcon from '@mui/icons-material/ViewStream';
import GridViewIcon from '@mui/icons-material/GridView';
import './FilterBar.css';

const FilterBar = () => {
  const dispatch = useDispatch();
  const { filterPriority, filterCategory, sortBy } = useSelector((state) => state.tasks);
  const [showPriority, setShowPriority] = useState(false);
  const [showCategory, setShowCategory] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const priRef = useRef(null);
  const catRef = useRef(null);
  const sortRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (priRef.current && !priRef.current.contains(e.target)) setShowPriority(false);
      if (catRef.current && !catRef.current.contains(e.target)) setShowCategory(false);
      if (sortRef.current && !sortRef.current.contains(e.target)) setShowSort(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const priorities = ['All', 'Low', 'Medium', 'High', 'Completed'];
  const categories = ['All', 'Design', 'Development', 'Research', 'Planning'];
  const sortOptions = [
    { value: 'none', label: 'Default' },
    { value: 'due-asc', label: 'Due Date (Earliest First)' },
    { value: 'due-desc', label: 'Due Date (Latest First)' },
  ];

  const closeAll = () => { setShowPriority(false); setShowCategory(false); setShowSort(false); };

  return (
    <div className="filter-bar">
      <div className="filter-left">
        {/* Priority filter */}
        <div ref={priRef} style={{ position: 'relative' }}>
          <button
            className={`filter-btn ${filterPriority !== 'All' ? 'active' : ''}`}
            onClick={() => { setShowPriority(!showPriority); setShowCategory(false); setShowSort(false); }}
          >
            <FilterAltOutlinedIcon style={{ fontSize: 16 }} />
            Filter{filterPriority !== 'All' ? `: ${filterPriority}` : ''}
            <KeyboardArrowDownOutlinedIcon style={{ fontSize: 16, color: '#787486' }} />
          </button>
          {showPriority && (
            <div className="filter-dropdown">
              {priorities.map((p) => (
                <button
                  key={p}
                  className={`filter-dropdown-item ${filterPriority === p ? 'selected' : ''}`}
                  onClick={() => { dispatch(setFilterPriority(p)); setShowPriority(false); }}
                >
                  {p === 'All' ? 'All Priorities' : p}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Category filter */}
        <div ref={catRef} style={{ position: 'relative' }}>
          <button
            className={`filter-btn ${filterCategory !== 'All' ? 'active' : ''}`}
            onClick={() => { setShowCategory(!showCategory); setShowPriority(false); setShowSort(false); }}
          >
            <CalendarTodayOutlinedIcon style={{ fontSize: 16 }} />
            {filterCategory !== 'All' ? filterCategory : 'Today'}
            <KeyboardArrowDownOutlinedIcon style={{ fontSize: 16, color: '#787486' }} />
          </button>
          {showCategory && (
            <div className="filter-dropdown">
              {categories.map((c) => (
                <button
                  key={c}
                  className={`filter-dropdown-item ${filterCategory === c ? 'selected' : ''}`}
                  onClick={() => { dispatch(setFilterCategory(c)); setShowCategory(false); }}
                >
                  {c === 'All' ? 'All Categories' : c}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sort */}
        <div ref={sortRef} style={{ position: 'relative' }}>
          <button
            className={`filter-btn ${sortBy !== 'none' ? 'active' : ''}`}
            onClick={() => { setShowSort(!showSort); setShowPriority(false); setShowCategory(false); }}
          >
            <SortOutlinedIcon style={{ fontSize: 16 }} />
            Sort{sortBy !== 'none' ? `: ${sortOptions.find(s => s.value === sortBy)?.label}` : ''}
            <KeyboardArrowDownOutlinedIcon style={{ fontSize: 16, color: '#787486' }} />
          </button>
          {showSort && (
            <div className="filter-dropdown">
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  className={`filter-dropdown-item ${sortBy === opt.value ? 'selected' : ''}`}
                  onClick={() => { dispatch(setSortBy(opt.value)); setShowSort(false); }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="filter-right">
        <button className="share-btn">
          <PeopleAltOutlinedIcon style={{ fontSize: 16 }} /> Share
        </button>
        <div className="divider-pipe">|</div>
        <div className="view-toggle">
          <button className="view-toggle-btn active" title="Board View">
            <ViewStreamIcon style={{ fontSize: 20 }} />
          </button>
          <button className="view-toggle-btn" title="Grid View">
            <GridViewIcon style={{ fontSize: 20 }} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
