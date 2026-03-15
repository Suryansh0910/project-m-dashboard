import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext } from '@hello-pangea/dnd';
import { moveTask, reorderTask } from '../../store/tasksSlice';
import toast from 'react-hot-toast';
import TaskColumn from '../../components/TaskColumn/TaskColumn';
import FilterBar from '../../components/FilterBar/FilterBar';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import InsertLinkOutlinedIcon from '@mui/icons-material/InsertLinkOutlined';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import CloseIcon from '@mui/icons-material/Close';
import addSquareIcon from '../../assets/vuesax/add-square.svg';
import './Home.css';

const avatarColors = ['#6173E9', '#F4696A', '#45BE6B', '#F38C40']; // 4 colors for A, B, C, D

const Home = () => {
  const dispatch = useDispatch();
  const { projects, activeProjectId, filterPriority, filterCategory, searchQuery, sortBy } = useSelector(
    (state) => state.tasks
  );

  const activeProject = projects.find(p => p.id === activeProjectId);

  useEffect(() => {
    if (!activeProject) return;
    
    // Check all tasks across columns to find ones near/overdue with reminders
    const now = new Date();
    const nearDueTasks = [];
    ['todo', 'inprogress'].forEach(col => {
      activeProject.columns[col].forEach(task => {
        if (task.dueDate && task.reminder) {
          const diff = new Date(task.dueDate) - now;
          if (diff < 48 * 60 * 60 * 1000) {
            nearDueTasks.push(task.title);
          }
        }
      });
    });

    if (nearDueTasks.length > 0) {
      toast.custom((t) => (
        <div style={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          gap: '12px', 
          width: '100%',
          background: '#FFF',
          border: '1px solid #E5E7EB',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          maxWidth: '400px',
          opacity: t.visible ? 1 : 0,
          transition: 'opacity 0.2s ease-in-out'
        }}>
          <NotificationsActiveOutlinedIcon style={{ color: '#F59E0B', marginTop: '2px' }} />
          <div style={{ flex: 1 }}>
            <span style={{ fontWeight: 600, color: '#111827', display: 'block', marginBottom: '4px' }}>Reminders</span>
            <span style={{ color: '#4B5563', fontSize: '13px', lineHeight: 1.4, display: 'block' }}>
              You have {nearDueTasks.length} task(s) due soon! ({nearDueTasks.join(', ')})
            </span>
          </div>
          <button 
            type="button"
            onClick={() => toast.dismiss(t.id)}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              cursor: 'pointer', 
              padding: '4px', 
              color: '#9CA3AF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <CloseIcon style={{ fontSize: '16px' }} />
          </button>
        </div>
      ), {
        id: 'due-date-reminder',
        duration: 20000, 
        position: 'top-right'
      });
    }
  }, [activeProject?.id]); // Only run on project switch to avoid toast spam

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      if (source.index !== destination.index) {
        dispatch(reorderTask({
          columnId: source.droppableId,
          sourceIndex: source.index,
          destIndex: destination.index,
        }));
      }
    } else {
      dispatch(moveTask({
        sourceCol: source.droppableId,
        destCol: destination.droppableId,
        sourceIndex: source.index,
        destIndex: destination.index,
      }));
    }
  };

  const filterTasks = (tasks) => {
    return tasks.filter((task) => {
      const matchPriority = filterPriority === 'All' || task.priority === filterPriority;
      const matchCategory = filterCategory === 'All' || task.category === filterCategory;
      const matchSearch = searchQuery === '' ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchPriority && matchCategory && matchSearch;
    });
  };

  const sortTasks = (tasks) => {
    if (sortBy === 'none') return tasks;
    return [...tasks].sort((a, b) => {
      const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      return sortBy === 'due-asc' ? dateA - dateB : dateB - dateA;
    });
  };

  if (!activeProject) {
    return (
      <div className="home-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <div style={{ textAlign: 'center', color: '#787486' }}>
          <h2>No Project Selected</h2>
          <p>Please select or create a project from the sidebar.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="home-page-header">
        <div className="home-title-area">
          <h1>{activeProject.name}</h1>
          <div className="title-actions">
            <button className="title-action-btn">
              <EditOutlinedIcon style={{ fontSize: 16 }} />
            </button>
            <button className="title-action-btn">
              <InsertLinkOutlinedIcon style={{ fontSize: 16 }} />
            </button>
          </div>
        </div>
        <div className="invite-area">
          <button className="invite-btn">
            <img src={addSquareIcon} alt="Invite" style={{ width: 18, height: 18 }} /> <span>Invite</span>
          </button>
          <div className="member-avatars">
            {avatarColors.map((color, i) => (
              <div key={i} className="member-avatar" style={{ background: color, zIndex: 5 - i }}>
                {String.fromCharCode(65 + i)}
              </div>
            ))}
            <div className="member-avatar extra" style={{ zIndex: 0 }}>+2</div>
          </div>
        </div>
      </div>

      <FilterBar />

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="board-container">
          {['todo', 'inprogress', 'done'].map((colId) => (
            <TaskColumn
              key={colId}
              columnId={colId}
              tasks={sortTasks(filterTasks(activeProject.columns[colId]))}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Home;
