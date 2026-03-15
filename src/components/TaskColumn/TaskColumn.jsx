import { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import TaskCard from '../TaskCard/TaskCard';
import AddTaskModal from '../AddTaskModal/AddTaskModal';
import addSquareIcon from '../../assets/vuesax/add-square.svg';
import './TaskColumn.css';

const columnConfig = {
  todo: { title: 'To Do', color: '#5030E5', accent: '#5030E5' },
  inprogress: { title: 'On Progress', color: '#FFA500', accent: '#FFA500' },
  done: { title: 'Done', color: '#76A5EA', accent: '#8BC48A' },
};

const TaskColumn = ({ columnId, tasks }) => {
  const [showModal, setShowModal] = useState(false);
  const config = columnConfig[columnId];

  return (
    <div className="task-column">
      <div className="column-header">
        <div className="column-header-left">
          <div className="column-dot" style={{ background: config.color }}></div>
          <span className="column-title">{config.title}</span>
          <span className="column-count">{tasks.length}</span>
        </div>
        {columnId === 'todo' && (
          <button className="column-add-btn" onClick={() => setShowModal(true)}>
            <img src={addSquareIcon} alt="Add Task" style={{ width: 16, height: 16 }} />
          </button>
        )}
      </div>
      <div className="column-accent" style={{ background: config.color }}></div>

      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            className={`task-list ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                columnId={columnId}
              />
            ))}
            {provided.placeholder}
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="drop-placeholder">Drop tasks here</div>
            )}
          </div>
        )}
      </Droppable>

      {showModal && (
        <AddTaskModal
          columnId={columnId}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default TaskColumn;
