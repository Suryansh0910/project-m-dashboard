import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery } from '../../store/tasksSlice';
import { UserButton, useUser } from '@clerk/clerk-react';
import searchIcon from '../../assets/vuesax/search-normal.svg';
import calendarIcon from '../../assets/vuesax/calendar-2.svg';
import messageQuestionIcon from '../../assets/vuesax/message-question.svg';
import notificationIcon from '../../assets/vuesax/notification.svg';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import './Header.css';

const Header = () => {
  const dispatch = useDispatch();
  const searchQuery = useSelector((state) => state.tasks.searchQuery);
  const { user } = useUser();

  const displayName = 'Palak Jain';

  return (
    <header className="header">
      <div className="search-bar">
        <img src={searchIcon} alt="search" className="search-icon-img" />
        <input
          type="text"
          placeholder="Search for anything..."
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        />
      </div>

      <div className="header-right">
        <div className="header-actions">
          <button className="header-icon-btn" title="Calendar">
            <img src={calendarIcon} alt="calendar" />
          </button>
          <button className="header-icon-btn" title="Help">
            <img src={messageQuestionIcon} alt="help" />
          </button>
          <button className="header-icon-btn" title="Notifications">
            <img src={notificationIcon} alt="notifications" />
            <span className="notif-dot"></span>
          </button>
        </div>

        <div className="header-profile">
          <div className="header-profile-info">
            <div className="name">{user?.fullName || displayName}</div>
            <div className="location">Rajasthan, India</div>
          </div>
          <UserButton />
          <KeyboardArrowDownIcon className="profile-dropdown-icon" />
        </div>
      </div>
    </header>
  );
};

export default Header;
