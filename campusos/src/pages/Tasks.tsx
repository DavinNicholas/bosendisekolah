import { useState } from 'react';
import { useAppStore } from '../store';
import { cn, getRelativeDate, getPriorityColor } from '../utils/helpers';
import { Plus, Filter, MoreVertical, Check, Trash2, Edit } from 'lucide-react';

type ViewMode = 'list' | 'board';
type FilterStatus = 'all' | 'today' | 'upcoming' | 'completed';

export default function Tasks() {
  const tasks = useAppStore((state) => state.tasks);
  const subjects = useAppStore((state) => state.subjects);
  const addTask = useAppStore((state) => state.addTask);
  const updateTask = useAppStore((state) => state.updateTask);
  const deleteTask = useAppStore((state) => state.deleteTask);
  const toggleTaskSubtask = useAppStore((state) => state.toggleTaskSubtask);

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);

  const getSubjectById = (id: string | null) => subjects.find((s) => s.id === id);

  const filteredTasks = tasks.filter((task) => {
    if (filterStatus === 'completed') return task.status === 'completed';
    if (filterStatus === 'today') {
      const today = new Date().toISOString().split('T')[0];
      return task.dueDate?.startsWith(today) && task.status !== 'completed';
    }
    if (filterStatus === 'upcoming') {
      const today = new Date();
      return task.dueDate && new Date(task.dueDate) > today && task.status !== 'completed';
    }
    return true;
  });

  const handleToggleTask = (taskId: string, currentStatus: string) => {
    updateTask(taskId, { status: currentStatus === 'completed' ? 'todo' : 'completed' });
  };

  const boardColumns: { id: string; label: string }[] = [
    { id: 'todo', label: 'To Do' },
    { id: 'in-progress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Tasks</h1>
          <p className="text-[var(--text-secondary)] mt-1">{tasks.length} total tasks</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNewTaskForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-md hover:bg-[var(--accent-hover)]"
          >
            <Plus size={18} />
            Add Task
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6">
        {(['all', 'today', 'upcoming', 'completed'] as FilterStatus[]).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={cn(
              "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
              filterStatus === status
                ? 'bg-[var(--accent)] text-white'
                : 'bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            )}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-1 bg-[var(--surface-secondary)] rounded-md p-1">
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              "px-3 py-1.5 rounded text-sm",
              viewMode === 'list' ? 'bg-[var(--surface)] shadow' : 'text-[var(--text-secondary)]'
            )}
          >
            List
          </button>
          <button
            onClick={() => setViewMode('board')}
            className={cn(
              "px-3 py-1.5 rounded text-sm",
              viewMode === 'board' ? 'bg-[var(--surface)] shadow' : 'text-[var(--text-secondary)]'
            )}
          >
            Board
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="space-y-2">
          {filteredTasks.map((task) => {
            const subject = getSubjectById(task.subjectId);
            return (
              <div
                key={task.id}
                className={cn(
                  "flex items-center gap-3 p-4 bg-[var(--surface)] rounded-lg border border-[var(--border)]",
                  task.status === 'completed' && 'opacity-60'
                )}
              >
                <button
                  onClick={() => handleToggleTask(task.id, task.status)}
                  className={cn(
                    "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                    task.status === 'completed'
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-[var(--border)] hover:border-[var(--accent)]'
                  )}
                >
                  {task.status === 'completed' && <Check size={14} />}
                </button>
                <div className="flex-1 min-w-0">
                  <div className={cn(
                    "font-medium truncate",
                    task.status === 'completed' && 'line-through text-[var(--text-secondary)]'
                  )}>
                    {task.title}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mt-1">
                    {subject && (
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: subject.color }} />
                        {subject.name}
                      </span>
                    )}
                    {task.dueDate && (
                      <>
                        <span>•</span>
                        <span className={cn(
                          getRelativeDate(task.dueDate).includes('overdue') && 'text-red-500'
                        )}>
                          {getRelativeDate(task.dueDate)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <span className={cn("px-2 py-1 rounded text-xs font-medium", getPriorityColor(task.priority))}>
                  {task.priority}
                </span>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 rounded hover:bg-[var(--surface-secondary)] text-[var(--text-secondary)]">
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => deleteTask(task.id)}
                    className="p-1.5 rounded hover:bg-red-50 text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
          {filteredTasks.length === 0 && (
            <div className="text-center py-12 text-[var(--text-secondary)]">
              No tasks found. Click "Add Task" to create one.
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {boardColumns.map((column) => (
            <div key={column.id} className="bg-[var(--surface-secondary)] rounded-lg p-4">
              <h3 className="font-medium text-[var(--text-primary)] mb-3">
                {column.label}
                <span className="ml-2 text-sm text-[var(--text-secondary)]">
                  {filteredTasks.filter((t) => t.status === column.id).length}
                </span>
              </h3>
              <div className="space-y-2">
                {filteredTasks
                  .filter((task) => task.status === column.id)
                  .map((task) => {
                    const subject = getSubjectById(task.subjectId);
                    return (
                      <div
                        key={task.id}
                        className="bg-[var(--surface)] rounded-md p-3 border border-[var(--border)]"
                      >
                        <div className="font-medium text-[var(--text-primary)] mb-2">{task.title}</div>
                        <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                          {subject && (
                            <span className="flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: subject.color }} />
                              {subject.name}
                            </span>
                          )}
                          {task.dueDate && (
                            <span>{getRelativeDate(task.dueDate)}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
