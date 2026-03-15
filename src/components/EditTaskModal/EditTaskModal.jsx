import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { editTask } from '../../store/tasksSlice';
import CloseIcon from '@mui/icons-material/Close';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import '../AddTaskModal/AddTaskModal.css';

const EditTaskModal = ({ task, columnId, onClose }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [priority, setPriority] = useState(task.priority);
  const [category, setCategory] = useState(task.category);
  const [dueDate, setDueDate] = useState(task.dueDate || '');
  const [reminder, setReminder] = useState(task.reminder || false);
  const [tagsText, setTagsText] = useState((task.tags || []).join(', '));
  const [subtasks, setSubtasks] = useState(task.subtasks || []);
  const [newSubtask, setNewSubtask] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    dispatch(editTask({
      columnId,
      taskId: task.id,
      updates: {
        title: title.trim(),
        description: description.trim(),
        priority,
        category,
        dueDate,
        reminder,
        tags: tagsText.split(',').filter(t => t.trim()).map(t => t.trim()),
        subtasks,
      },
    }));
    onClose();
  };

  const handleSubtaskToggle = (subtaskId) => {
    setSubtasks(subtasks.map(st => st.id === subtaskId ? { ...st, completed: !st.completed } : st));
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks([...subtasks, { id: Date.now() + Math.random(), text: newSubtask.trim(), completed: false }]);
      setNewSubtask('');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-title">
            <EditOutlinedIcon style={{ fontSize: 22, color: '#5030E5' }} />
            <h2>Edit Task</h2>
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
                <option value="Completed">Completed</option>
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
            <label>Subtasks</label>
            {subtasks.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '8px' }}>
                {subtasks.map(st => (
                  <label key={st.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#0D062D' }}>
                    <input
                      type="checkbox"
                      checked={st.completed}
                      onChange={() => handleSubtaskToggle(st.id)}
                      style={{ width: 'auto' }}
                    />
                    <span style={{ textDecoration: st.completed ? 'line-through' : 'none', color: st.completed ? '#787486' : 'inherit' }}>
                      {st.text}
                    </span>
                  </label>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Add new subtask..."
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                style={{ flex: 1 }}
              />
              <button
                type="button"
                className="btn-submit"
                style={{ flex: 'none', padding: '11px 16px', borderRadius: '10px' }}
                onClick={handleAddSubtask}
              >
                Add
              </button>
            </div>
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
