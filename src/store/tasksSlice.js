import { createSlice } from '@reduxjs/toolkit';

const defaultColumns = {
    'todo': [
      {
        id: 't-1',
        title: 'Brainstorming',
        description: "Brainstorming brings team members' diverse experience into play.",
        priority: 'Low',
        category: 'Design',
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        reminder: true,
        tags: ['UX', 'Creative'],
        subtasks: [{ id: 1, text: 'Gather references', completed: true }, { id: 2, text: 'Discuss with team', completed: false }],
        comments: 12,
        files: 0,
        assignees: ['A', 'B', 'C']
      },
      {
        id: 't-2',
        title: 'Research',
        description: 'User research helps you to create an optimal product for users.',
        priority: 'High',
        category: 'Research',
        dueDate: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
        reminder: false,
        tags: ['Analytics', 'Urgent'],
        subtasks: [{ id: 3, text: 'Interview 5 users', completed: false }],
        comments: 10,
        files: 3,
        assignees: ['A', 'B']
      },
      {
        id: 't-3',
        title: 'Wireframes',
        description: 'Low fidelity wireframes include the most basic content and visuals.',
        priority: 'High',
        category: 'Design',
        tags: ['UI', 'Frontend'],
        subtasks: [],
        comments: 0,
        files: 0,
        assignees: ['A']
      }
    ],
    'inprogress': [
      {
        id: 'p-1',
        title: 'Brainstorming',
        description: "Brainstorming brings team members' diverse experience into play.",
        priority: 'Low',
        category: 'Design',
        comments: 12,
        files: 0,
        assignees: ['A', 'B', 'C']
      },
      {
        id: 'p-2',
        title: 'Brainstorming',
        description: "Brainstorming brings team members' diverse experience into play.",
        priority: 'Low',
        category: 'Design',
        comments: 12,
        files: 0,
        assignees: ['A', 'B', 'C']
      },
      {
        id: 'p-3',
        title: 'Brainstorming',
        description: "Brainstorming brings team members' diverse experience into play.",
        priority: 'Low',
        category: 'Design',
        comments: 12,
        files: 0,
        assignees: ['A', 'B', 'C']
      }
    ],
    'done': [
      {
        id: 'd-1',
        title: 'Brainstorming',
        description: "Brainstorming brings team members' diverse experience into play.",
        priority: 'Low',
        category: 'Design',
        comments: 12,
        files: 0,
        assignees: ['A', 'B', 'C']
      },
      {
        id: 'd-2',
        title: 'Brainstorming',
        description: "Brainstorming brings team members' diverse experience into play.",
        priority: 'Low',
        category: 'Design',
        comments: 12,
        files: 0,
        assignees: ['A', 'B', 'C']
      },
      {
        id: 'd-3',
        title: 'Design System',
        description: 'It just needs to adapt the UI from what you did before',
        priority: 'Completed',
        category: 'Design',
        comments: 0,
        files: 0,
        assignees: ['A', 'B']
      }
    ]
};

const initialState = {
  activeProjectId: 'proj-1',
  projects: [
    { id: 'proj-1', name: 'Mobile App', color: '#7AC555', columns: defaultColumns },
    { id: 'proj-2', name: 'Website Redesign', color: '#FFA500', columns: { todo: [], inprogress: [], done: [] } },
    { id: 'proj-3', name: 'Design System', color: '#E4CCFD', columns: { todo: [], inprogress: [], done: [] } },
    { id: 'proj-4', name: 'Wireframes', color: '#76A5EA', columns: { todo: [], inprogress: [], done: [] } },
  ],
  filterPriority: 'All',
  filterCategory: 'All',
  searchQuery: '',
  sortBy: 'none',
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addProject: (state, action) => {
      const newProject = {
        id: `proj-${Date.now()}`,
        name: action.payload.name,
        color: action.payload.color || '#7AC555',
        columns: { todo: [], inprogress: [], done: [] }
      };
      state.projects.push(newProject);
      state.activeProjectId = newProject.id;
    },
    setActiveProject: (state, action) => {
      state.activeProjectId = action.payload;
    },
    deleteProject: (state, action) => {
      const projectId = action.payload;
      state.projects = state.projects.filter(p => p.id !== projectId);
      if (state.activeProjectId === projectId) {
        state.activeProjectId = state.projects.length > 0 ? state.projects[0].id : null;
      }
    },
    addTask: (state, action) => {
      const { columnId, task } = action.payload;
      const activeProject = state.projects.find(p => p.id === state.activeProjectId);
      if (activeProject) activeProject.columns[columnId].unshift(task);
    },
    moveTask: (state, action) => {
      const { sourceCol, destCol, sourceIndex, destIndex } = action.payload;
      const activeProject = state.projects.find(p => p.id === state.activeProjectId);
      if (activeProject) {
        const [removed] = activeProject.columns[sourceCol].splice(sourceIndex, 1);
        activeProject.columns[destCol].splice(destIndex, 0, removed);
      }
    },
    deleteTask: (state, action) => {
      const { columnId, taskId } = action.payload;
      const activeProject = state.projects.find(p => p.id === state.activeProjectId);
      if (activeProject) {
        activeProject.columns[columnId] = activeProject.columns[columnId].filter(t => t.id !== taskId);
      }
    },
    editTask: (state, action) => {
      const { columnId, taskId, updates } = action.payload;
      const activeProject = state.projects.find(p => p.id === state.activeProjectId);
      if (activeProject) {
        const task = activeProject.columns[columnId].find(t => t.id === taskId);
        if (task) {
          Object.assign(task, updates);
        }
      }
    },
    setFilterPriority: (state, action) => {
      state.filterPriority = action.payload;
    },
    setFilterCategory: (state, action) => {
      state.filterCategory = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    reorderTask: (state, action) => {
      const { columnId, sourceIndex, destIndex } = action.payload;
      const activeProject = state.projects.find(p => p.id === state.activeProjectId);
      if (activeProject) {
        const [removed] = activeProject.columns[columnId].splice(sourceIndex, 1);
        activeProject.columns[columnId].splice(destIndex, 0, removed);
      }
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
  },
});

export const {
  addProject,
  setActiveProject,
  deleteProject,
  addTask,
  moveTask,
  deleteTask,
  editTask,
  setFilterPriority,
  setFilterCategory,
  setSearchQuery,
  reorderTask,
  setSortBy,
} = tasksSlice.actions;

export default tasksSlice.reducer;
