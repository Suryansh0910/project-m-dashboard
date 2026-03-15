import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addProject } from '../../store/tasksSlice';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import '../AddTaskModal/AddTaskModal.css';

const CreateProjectModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const colors = ['#7AC555', '#FFA500', '#E4CCFD', '#76A5EA', '#D58D49', '#D8727D', '#68B266'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    dispatch(addProject({ name: name.trim(), color: randomColor }));
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-title">
            <AddCircleOutlineIcon style={{ fontSize: 22, color: '#5030E5' }} />
            <h2>Create New Project</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <CloseIcon style={{ fontSize: 20 }} />
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Project Name *</label>
            <input
              type="text"
              placeholder="Enter project name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="modal-actions" style={{ marginTop: '24px' }}>
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-submit" disabled={!name.trim()}>
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;
