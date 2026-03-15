import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addProject, setActiveProject, deleteProject } from '../../store/tasksSlice';
import CreateProjectModal from '../CreateProjectModal/CreateProjectModal';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import './Sidebar.css';

import logoIcon from '../../assets/vuesax/mainLogo.svg';
import homeIcon from '../../assets/vuesax/category.svg';
import messagesIcon from '../../assets/vuesax/message.svg';
import tasksIcon from '../../assets/vuesax/task-square.svg';
import membersIcon from '../../assets/vuesax/Members.svg';
import settingsIcon from '../../assets/vuesax/setting-2.svg';
import addIcon from '../../assets/vuesax/add-square.svg';
import lampIcon from '../../assets/vuesax/lamp-on.svg';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const dispatch = useDispatch();
  const { projects, activeProjectId } = useSelector(state => state.tasks);

  const navItems = [
    { path: '/', label: 'Home', icon: homeIcon },
    { path: '/messages', label: 'Messages', icon: messagesIcon },
    { path: '/tasks', label: 'Tasks', icon: tasksIcon },
    { path: '/members', label: 'Members', icon: membersIcon },
    { path: '/settings', label: 'Settings', icon: settingsIcon },
  ];

  const handleAddProject = () => {
    setShowCreateModal(true);
  };

  const handleDeleteProject = (e, projectId) => {
    e.stopPropagation();
    if (confirmDeleteId === projectId) {
      dispatch(deleteProject(projectId));
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(projectId);
      // Auto-reset after 3 seconds
      setTimeout(() => setConfirmDeleteId(null), 3000);
    }
  };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <img src={logoIcon} alt="Project M. Logo" className="sidebar-logo-img" />
          <h1>Project M.</h1>
        </div>
        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.5 17L9.5 12L14.5 7" stroke="#787486" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19.5 17L14.5 12L19.5 7" stroke="#787486" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            end={item.path === '/'}
          >
            <img src={item.icon} alt={item.label} className="nav-icon" />
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-divider"></div>

      <div className="projects-section">
        <div className="projects-header">
          <h3>MY PROJECTS</h3>
          <button className="add-project-btn" onClick={handleAddProject}>
            <img src={addIcon} alt="Add Project" />
          </button>
        </div>
        {projects.map((project) => {
          const isActive = project.id === activeProjectId;
          return (
            <div 
              key={project.id} 
              className={`project-item ${isActive ? 'active' : ''}`}
              onClick={() => dispatch(setActiveProject(project.id))}
              style={{ cursor: 'pointer' }}
            >
              <div className="project-left">
                <div className="project-dot" style={{ background: project.color }}></div>
                <span className="project-name">{project.name}</span>
              </div>
              <button 
                className={`project-delete-btn ${confirmDeleteId === project.id ? 'confirm' : ''}`}
                onClick={(e) => handleDeleteProject(e, project.id)}
                title={confirmDeleteId === project.id ? 'Click again to confirm' : 'Delete project'}
              >
                <DeleteOutlineOutlinedIcon style={{ fontSize: 14 }} />
              </button>
            </div>
          );
        })}
      </div>

      <div className="thoughts-box-container">
        <div className="thoughts-box">
          <div className="thoughts-icon-wrapper">
            <div className="thoughts-icon-glow"></div>
            <img src={lampIcon} alt="Thoughts" className="thoughts-icon" />
          </div>
          <h4>Thoughts Time</h4>
          <p>We don't have any notice for you, till then you can share your thoughts with your peers.</p>
          <button className="thoughts-btn">Write a message</button>
        </div>
      </div>

      {showCreateModal && (
        <CreateProjectModal onClose={() => setShowCreateModal(false)} />
      )}
    </aside>
  );
};

export default Sidebar;
