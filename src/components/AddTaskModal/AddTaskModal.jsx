import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTask } from '../../store/tasksSlice';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import './AddTaskModal.css';

const AddTaskModal = ({ columnId, onClose }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Low');
  const [category, setCategory] = useState('Design');
  const [dueDate, setDueDate] = useState('');
  const [reminder, setReminder] = useState(false);
  const [subtasksText, setSubtasksText] = useState('');
  const [tagsText, setTagsText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask = {
      id: `task-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || 'No description provided.',
      priority,
      category,
      dueDate,
      reminder,
      subtasks: subtasksText.split('\n').filter(s => s.trim()).map(s => ({ id: Date.now() + Math.random(), text: s.trim(), completed: false })),
      tags: tagsText.split(',').filter(t => t.trim()).map(t => t.trim()),
      comments: 0,
      files: 0,
      assignees: ['avatar1', 'avatar2'],
    };

    dispatch(addTask({ columnId, task: newTask }));
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-title">
            <AddCircleOutlineIcon style={{ fontSize: 22, color: '#5030E5' }} />
            <h2>Add New Task</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <CloseIcon style={{ fontSize: 20 }} />
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Task Name *</label>
            <input
              type="text"
              placeholder="Enter task name..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              placeholder="Enter task description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="form-group">
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Design">Design</option>
                <option value="Development">Development</option>
                <option value="Research">Research</option>
                <option value="Planning">Planning</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Due Date</label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
            <div className="form-group checkbox-group" style={{ flexDirection: 'row', alignItems: 'center', marginTop: '24px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={reminder} onChange={(e) => setReminder(e.target.checked)} style={{ width: 'auto' }} />
                Set Reminder
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Subtasks (one per line)</label>
            <textarea
              placeholder="e.g. Design homepage&#10;Implement header"
              value={subtasksText}
              onChange={(e) => setSubtasksText(e.target.value)}
              style={{ minHeight: '60px' }}
            />
          </div>

          <div className="form-group">
            <label>Custom Tags (comma separated)</label>
            <input
              type="text"
              placeholder="e.g. frontend, bug, urgent"
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-submit" disabled={!title.trim()}>
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
