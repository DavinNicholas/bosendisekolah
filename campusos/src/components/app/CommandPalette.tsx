import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Search, Command } from 'lucide-react';
import { cn } from '../../utils/helpers';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandItem {
  id: string;
  label: string;
  icon?: React.ElementType;
  action: () => void;
  shortcut?: string;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: CommandItem[] = [
    { id: 'overview', label: 'Go to Overview', action: () => { navigate('/'); onClose(); } },
    { id: 'tasks', label: 'Go to Tasks', action: () => { navigate('/tasks'); onClose(); } },
    { id: 'calendar', label: 'Go to Calendar', action: () => { navigate('/calendar'); onClose(); } },
    { id: 'timetable', label: 'Go to Timetable', action: () => { navigate('/timetable'); onClose(); } },
    { id: 'focus', label: 'Start Focus Session', action: () => { navigate('/focus'); onClose(); } },
    { id: 'notes', label: 'Go to Notes', action: () => { navigate('/notes'); onClose(); } },
    { id: 'flashcards', label: 'Go to Flashcards', action: () => { navigate('/flashcards'); onClose(); } },
    { id: 'grades', label: 'Go to Grades', action: () => { navigate('/grades'); onClose(); } },
    { id: 'attendance', label: 'Go to Attendance', action: () => { navigate('/attendance'); onClose(); } },
    { id: 'exams', label: 'Go to Exams', action: () => { navigate('/exams'); onClose(); } },
    { id: 'projects', label: 'Go to Projects', action: () => { navigate('/projects'); onClose(); } },
    { id: 'resources', label: 'Go to Resources', action: () => { navigate('/resources'); onClose(); } },
    { id: 'analytics', label: 'Go to Analytics', action: () => { navigate('/analytics'); onClose(); } },
    { id: 'goals', label: 'Go to Goals', action: () => { navigate('/goals'); onClose(); } },
    { id: 'settings', label: 'Go to Settings', action: () => { navigate('/settings'); onClose(); } },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        filteredCommands[selectedIndex]?.action();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-[var(--surface)] rounded-lg shadow-xl border border-[var(--border)] overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
          <Search className="text-[var(--text-secondary)]" size={20} />
          <input
            type="text"
            placeholder="Type a command or search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-[var(--text-primary)] placeholder-[var(--text-secondary)]"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[var(--surface-secondary)] text-[var(--text-secondary)]"
          >
            <X size={18} />
          </button>
        </div>
        <ul className="max-h-80 overflow-y-auto py-2">
          {filteredCommands.map((cmd, idx) => (
            <li key={cmd.id}>
              <button
                onClick={cmd.action}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2.5 text-left',
                  idx === selectedIndex
                    ? 'bg-[var(--accent)] text-white'
                    : 'text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]'
                )}
              >
                <Command size={16} />
                <span>{cmd.label}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="px-4 py-2 border-t border-[var(--border)] text-xs text-[var(--text-secondary)] flex items-center justify-between">
          <span>Navigate with ↑↓</span>
          <span>Press Enter to select</span>
        </div>
      </div>
    </div>
  );
}
