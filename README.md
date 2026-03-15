# Project M. - Task Management Dashboard

A modern, feature-rich task management dashboard built with React and Vite. This application provides a Kanban-style board for organizing tasks across projects, with drag-and-drop functionality, real-time notifications, authentication, and a polished UI.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Feature Details](#feature-details)
- [Environment Variables](#environment-variables)

---

## Features

### Core Features

- **Kanban Board** - Drag-and-drop task management across three columns: To Do, On Progress, and Done.
- **Task CRUD** - Create, read, update, and delete tasks with a rich modal interface.
- **Multi-Project Support** - Create, switch between, and delete multiple projects. Each project has its own independent task board.
- **State Persistence** - All data is saved to localStorage so nothing is lost on refresh.

### Authentication

- **Clerk Integration** - Full authentication flow using Clerk with support for Username, Google, and GitHub login methods.
- **Protected Routes** - The dashboard is only accessible to signed-in users. Unauthenticated users are redirected to the sign-in page.
- **User Profile** - The header displays the authenticated user with Clerk's UserButton component for account management.

### Task Management

- **Priority Levels** - Tasks can be assigned Low, Medium, High, or Completed priority, each with a distinct color-coded badge.
- **Category Tagging** - Assign categories (Design, Development, Research, Planning) to tasks for organized filtering.
- **Due Dates and Reminders** - Set due dates on tasks and enable reminders. Tasks nearing or past their due date display a warning badge on the card.
- **Subtasks** - Add, toggle (mark complete/incomplete), and remove subtasks directly from the task card. A progress bar shows completion at a glance.
- **Custom Tags** - Add and remove custom tags on any task. Tags appear as colored pills on the card.
- **Inline Editing** - Add subtasks and tags directly on the card without opening a modal. Each input has both a save and cancel button, and supports Enter/Escape keyboard shortcuts.
- **Assignees** - Assign team members to tasks, displayed as colored avatar initials on the card.

### Filtering and Sorting

- **Filter by Priority** - Filter the entire board to show only tasks matching a selected priority level.
- **Filter by Category** - Filter tasks by their assigned category.
- **Search** - Real-time search across task titles and descriptions from the header search bar.
- **Sort by Due Date** - Sort tasks within each column by due date, with options for earliest-first or latest-first ordering. Tasks without a due date are pushed to the bottom.

### Notifications

- **Due Date Reminders** - When a project is loaded, a styled notification toast appears if any tasks in the To Do or On Progress columns are due within 48 hours.
- **Custom Toast UI** - Notifications use a custom-rendered toast component with a bell icon, message body, and a dismiss (X) button. No browser alerts are used.
- **Duplicate Prevention** - Toast notifications are de-duplicated using unique IDs to prevent multiple popups in React strict mode.

### Project Management

- **Create Projects** - Click the "+" icon in the sidebar to open a dedicated project creation modal with name and color selection.
- **Switch Projects** - Click any project in the sidebar to switch the active board view.
- **Delete Projects** - Hover over a project in the sidebar to reveal a trash icon. Click once to arm the delete (icon turns red), click again to confirm. Auto-resets after 3 seconds if not confirmed.
- **Empty State** - If no project is selected, a clean "No Project Selected" message is displayed.

### UI and Design

- **Material-UI Icons** - All interactive icons use @mui/icons-material for a consistent, professional look.
- **Drag and Drop** - Powered by @hello-pangea/dnd. The drag handle is restricted to the card header, so interactive elements (checkboxes, inputs, buttons) in the card body work without interference.
- **Responsive Animations** - Hover effects, card lift animations, drag shadows, menu fade-ins, and progress bar transitions provide a smooth user experience.
- **Context Menus** - Each task card has a three-dot menu with options to edit, move to another column, or delete.
- **Collapsible Sidebar** - The sidebar can be collapsed to save screen space.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite 7 | Build tool and dev server |
| Redux Toolkit | Global state management |
| @hello-pangea/dnd | Drag-and-drop for Kanban board |
| @clerk/clerk-react | Authentication |
| @mui/icons-material | Icon library |
| react-hot-toast | Toast notifications |
| react-router-dom | Client-side routing |

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Suryansh0910/project-m-dashboard.git
   cd project-m-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the project root with your Clerk publishable key:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:5173 in your browser.

### Build for Production

```bash
npm run build
```

The output will be in the `dist/` directory.

---

## Project Structure

```
project-m-dashboard/
  src/
    assets/              -- SVG icons and images
    components/
      AddTaskModal/      -- Modal for creating new tasks
      CreateProjectModal/-- Modal for creating new projects
      EditTaskModal/     -- Modal for editing existing tasks
      FilterBar/         -- Priority, category, and sort controls
      Header/            -- Top bar with search and user profile
      Sidebar/           -- Navigation and project list
      TaskCard/          -- Individual task card with subtasks, tags, due date
      TaskColumn/        -- Kanban column wrapper
    pages/
      Home/              -- Main dashboard page
    store/
      index.js           -- Redux store configuration with localStorage persistence
      tasksSlice.js      -- All reducers: projects, tasks, filters, sorting
    App.jsx              -- Route definitions and Clerk auth guards
    main.jsx             -- Entry point with providers
```

---

## Feature Details

### Subtask Interaction

Subtasks are rendered directly on each task card with MUI checkbox icons. Clicking a subtask toggles its completion state (strikethrough text, filled checkbox, progress bar update). The drag-and-drop library does not interfere because the drag handle is scoped to only the card header row.

### Inline Add

Each card has small dashed "Tag" and "Subtask" buttons. Clicking them reveals an inline text input with a purple save button and a gray cancel button. Press Enter to save or Escape to cancel.

### Sort Behavior

When "Sort by Due Date" is active, tasks are re-ordered within each column independently. The sort is applied after filtering, so filtered and sorted views work together. Tasks without a due date are sorted to the bottom.

### State Migration

The Redux store includes a migration check in loadState(). If the localStorage contains an older state shape (before multi-project support was added), it is automatically cleared to prevent crashes.

---

## Environment Variables

| Variable | Description |
|---|---|
| VITE_CLERK_PUBLISHABLE_KEY | Clerk publishable key for authentication |

---

## License

This project is for educational and portfolio purposes.
