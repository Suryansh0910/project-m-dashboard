import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Draggable } from '@hello-pangea/dnd';
import {
  deleteTask,
  moveTask,
  editTask,
} from '../../store/tasksSlice';
import EditTaskModal from '../EditTaskModal/EditTaskModal';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DriveFileMoveOutlinedIcon from '@mui/icons-material/DriveFileMoveOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import './TaskCard.css';

const avatarColors = [
  '#667eea', '#f56565', '#48bb78', '#ed8936', '#9f7aea',
  '#38b2ac', '#e53e3e', '#dd6b20', '#3182ce', '#d53f8c'
];

const columnLabels = { todo: 'To Do', inprogress: 'On Progress', done: 'Done' };

const TaskCard = ({ task, index, columnId }) => {
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [showAddSubtask, setShowAddSubtask] = useState(false);
  const [newSubtaskText, setNewSubtaskText] = useState('');
  const [showAddTag, setShowAddTag] = useState(false);
  const [newTagText, setNewTagText] = useState('');
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const isNearOrOverdue = () => {
    if (!task.dueDate || !task.reminder || task.priority === 'Completed' || columnId === 'done') return false;
    const due = new Date(task.dueDate);
    const now = new Date();
    const diff = due - now;
    return diff < 48 * 60 * 60 * 1000;
  };

  const handleDelete = () => {
    dispatch(deleteTask({ columnId, taskId: task.id }));
    setMenuOpen(false);
  };

  const handleMoveTo = (destCol) => {
    if (destCol !== columnId) {
      dispatch(moveTask({
        sourceCol: columnId,
        destCol,
        sourceIndex: index,
        destIndex: 0,
      }));
    }
    setMenuOpen(false);
  };

  const handleSubtaskToggle = (subtaskId) => {
    const updatedSubtasks = task.subtasks.map(st =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    dispatch(editTask({
      columnId,
      taskId: task.id,
      updates: { subtasks: updatedSubtasks }
    }));
  };

  const handleRemoveSubtask = (subtaskId) => {
    const updatedSubtasks = task.subtasks.filter(st => st.id !== subtaskId);
    dispatch(editTask({
      columnId,
      taskId: task.id,
      updates: { subtasks: updatedSubtasks }
    }));
  };

  const handleAddSubtask = () => {
    if (!newSubtaskText.trim()) return;
    const updatedSubtasks = [
      ...(task.subtasks || []),
      { id: Date.now() + Math.random(), text: newSubtaskText.trim(), completed: false }
    ];
    dispatch(editTask({
      columnId,
      taskId: task.id,
      updates: { subtasks: updatedSubtasks }
    }));
    setNewSubtaskText('');
    setShowAddSubtask(false);
  };

  const handleAddTag = () => {
    if (!newTagText.trim()) return;
    const updatedTags = [...(task.tags || []), newTagText.trim()];
    dispatch(editTask({
      columnId,
      taskId: task.id,
      updates: { tags: updatedTags }
    }));
    setNewTagText('');
    setShowAddTag(false);
  };

  const handleRemoveTag = (tagIndex) => {
    const updatedTags = (task.tags || []).filter((_, i) => i !== tagIndex);
    dispatch(editTask({
      columnId,
      taskId: task.id,
      updates: { tags: updatedTags }
    }));
  };

  const cancelAddSubtask = () => {
    setShowAddSubtask(false);
    setNewSubtaskText('');
  };

  const cancelAddTag = () => {
    setShowAddTag(false);
    setNewTagText('');
  };

  const completedCount = (task.subtasks || []).filter(s => s.completed).length;
  const totalCount = (task.subtasks || []).length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <>
      <Draggable draggableId={task.id} index={index}>
        {(provided, snapshot) => (
          <div
            className={`task-card ${snapshot.isDragging ? 'dragging' : ''}`}
            ref={provided.innerRef}
            {...provided.draggableProps}
          >
            {/* Only the header is the drag handle */}
            <div className="task-card-header" {...provided.dragHandleProps}>
              <span className={`priority-badge ${task.priority.toLowerCase()}`}>
                {task.priority}
              </span>
              <div className="task-card-menu-wrapper" ref={menuRef}>
                <button className="task-card-menu" onClick={() => setMenuOpen(!menuOpen)}>
                  <MoreHorizIcon />
                </button>
                {menuOpen && (
                  <div className="task-context-menu">
                    <button
                      className="context-menu-item"
                      onClick={() => { setEditOpen(true); setMenuOpen(false); }}
                    >
                      <EditOutlinedIcon style={{ fontSize: 16 }} /> Edit Task
                    </button>
                    <div className="context-menu-divider" />
                    {Object.keys(columnLabels).filter(c => c !== columnId).map(col => (
                      <button
                        key={col}
                        className="context-menu-item"
                        onClick={() => handleMoveTo(col)}
                      >
                        <DriveFileMoveOutlinedIcon style={{ fontSize: 16 }} /> Move to {columnLabels[col]}
                      </button>
                    ))}
                    <div className="context-menu-divider" />
                    <button className="context-menu-item danger" onClick={handleDelete}>
                      <DeleteOutlineOutlinedIcon style={{ fontSize: 16 }} /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            <h4>{task.title}</h4>
            <p className="task-card-desc">{task.description}</p>



            {/* Tags with remove */}
            <div className="task-card-tags-section">
              {(task.tags || []).map((tag, i) => (
                <span key={i} className="task-card-tag">
                  #{tag}
                  <button className="tag-remove-btn" onClick={() => handleRemoveTag(i)}>
                    <CloseIcon style={{ fontSize: 10 }} />
                  </button>
                </span>
              ))}
              {!showAddTag ? (
                <button className="task-card-add-inline-btn" onClick={() => setShowAddTag(true)}>
                  <LocalOfferOutlinedIcon style={{ fontSize: 13 }} /> Tag
                </button>
              ) : (
                <div className="task-card-inline-input-row">
                  <input
                    type="text"
                    value={newTagText}
                    onChange={(e) => setNewTagText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddTag();
                      if (e.key === 'Escape') cancelAddTag();
                    }}
                    placeholder="Tag name"
                    autoFocus
                    className="task-card-inline-input"
                  />
                  <button className="task-card-inline-save" onClick={handleAddTag}>
                    <AddIcon style={{ fontSize: 14 }} />
                  </button>
                  <button className="task-card-inline-cancel" onClick={cancelAddTag}>
                    <CloseIcon style={{ fontSize: 14 }} />
                  </button>
                </div>
              )}
            </div>

            {/* Subtasks Section */}
            {totalCount > 0 && (
              <div className="task-card-subtasks-section">
                <div className="task-card-progress-row">
                  <div className="task-card-progress-bar">
                    <div
                      className="task-card-progress-fill"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <span className="task-card-progress-label">{completedCount}/{totalCount}</span>
                </div>

                <div className="task-card-subtask-list">
                  {task.subtasks.map(st => (
                    <div
                      key={st.id}
                      className="task-card-subtask-item"
                    >
                      <div className="subtask-left" onClick={() => handleSubtaskToggle(st.id)}>
                        {st.completed
                          ? <CheckBoxIcon className="subtask-check-icon checked" />
                          : <CheckBoxOutlineBlankIcon className="subtask-check-icon" />
                        }
                        <span className={`subtask-text ${st.completed ? 'done' : ''}`}>
                          {st.text}
                        </span>
                      </div>
                      <button className="subtask-remove-btn" onClick={() => handleRemoveSubtask(st.id)}>
                        <CloseIcon style={{ fontSize: 12 }} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add subtask inline */}
            <div className="task-card-add-subtask-area">
              {!showAddSubtask ? (
                <button className="task-card-add-inline-btn" onClick={() => setShowAddSubtask(true)}>
                  <AddIcon style={{ fontSize: 13 }} /> Subtask
                </button>
              ) : (
                <div className="task-card-inline-input-row">
                  <input
                    type="text"
                    value={newSubtaskText}
                    onChange={(e) => setNewSubtaskText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddSubtask();
                      if (e.key === 'Escape') cancelAddSubtask();
                    }}
                    placeholder="Subtask name"
                    autoFocus
                    className="task-card-inline-input"
                  />
                  <button className="task-card-inline-save" onClick={handleAddSubtask}>
                    <AddIcon style={{ fontSize: 14 }} />
                  </button>
                  <button className="task-card-inline-cancel" onClick={cancelAddSubtask}>
                    <CloseIcon style={{ fontSize: 14 }} />
                  </button>
                </div>
              )}
            </div>

            {/* Due date display - above footer */}
            {task.dueDate && (
              <div className={`task-card-due-badge ${isNearOrOverdue() ? 'urgent' : ''}`}>
                <CalendarTodayOutlinedIcon style={{ fontSize: '13px' }} />
                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                {isNearOrOverdue() && <ReportProblemOutlinedIcon style={{ fontSize: '13px' }} />}
              </div>
            )}

            {/* Footer */}
            <div className="task-card-footer">
              <div className="task-assignees">
                {(task.assignees || []).map((a, i) => (
                  <div
                    key={i}
                    className="assignee-avatar"
                    style={{ background: avatarColors[i % avatarColors.length], zIndex: (task.assignees || []).length - i }}
                  >
                    {a.charAt(0).toUpperCase()}
                  </div>
                ))}
              </div>
              <div className="task-stats">
                <span className="task-stat">
                  <span className="task-stat-icon">
                    <ChatBubbleOutlineOutlinedIcon style={{ fontSize: 16 }} />
                  </span>
                  {task.comments || 0} comments
                </span>
                <span className="task-stat">
                  <span className="task-stat-icon">
                    <FolderOutlinedIcon style={{ fontSize: 16 }} />
                  </span>
                  {task.files || 0} files
                </span>
              </div>
            </div>
          </div>
        )}
      </Draggable>

      {editOpen && (
        <EditTaskModal
          task={task}
          columnId={columnId}
          onClose={() => setEditOpen(false)}
        />
      )}
    </>
  );
};

export default TaskCard;
