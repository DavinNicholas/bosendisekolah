import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useAppStore } from './store';
import Sidebar from './components/app/Sidebar';
import TopBar from './components/app/TopBar';
import Overview from './pages/Overview';
import Tasks from './pages/Tasks';
import Calendar from './pages/Calendar';
import Timetable from './pages/Timetable';
import Focus from './pages/Focus';
import Notes from './pages/Notes';
import Flashcards from './pages/Flashcards';
import StudyPlanner from './pages/StudyPlanner';
import Grades from './pages/Grades';
import Attendance from './pages/Attendance';
import Exams from './pages/Exams';
import Projects from './pages/Projects';
import Resources from './pages/Resources';
import Analytics from './pages/Analytics';
import Goals from './pages/Goals';
import Settings from './pages/Settings';
import CommandPalette from './components/app/CommandPalette';
import { cn } from './utils/helpers';

function App() {
  const location = useLocation();
  const settings = useAppStore((state) => state.settings);
  const updateSettings = useAppStore((state) => state.updateSettings);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(settings.sidebarCollapsed);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Apply theme
  useEffect(() => {
    const applyTheme = () => {
      let newTheme = settings.theme;
      if (newTheme === 'system') {
        newTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      setTheme(newTheme as 'light' | 'dark');
      document.documentElement.setAttribute('data-theme', newTheme);
    };

    applyTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (settings.theme === 'system') {
        applyTheme();
      }
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [settings.theme]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput) searchInput.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    updateSettings({ sidebarCollapsed: !sidebarCollapsed });
  };

  const isLoginPage = location.pathname === '/login';

  return (
    <div className={cn(
      "min-h-screen bg-[var(--background)] text-[var(--text-primary)]",
      settings.density === 'compact' ? 'text-sm' : 'text-base'
    )}>
      {isLoginPage ? (
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      ) : (
        <div className="flex h-screen overflow-hidden">
          <Sidebar 
            collapsed={sidebarCollapsed} 
            onToggle={toggleSidebar}
          />
          <div className="flex-1 flex flex-col min-w-0">
            <TopBar 
              onOpenCommandPalette={() => setCommandPaletteOpen(true)}
              sidebarCollapsed={sidebarCollapsed}
            />
            <main className="flex-1 overflow-auto p-6">
              <Routes>
                <Route path="/" element={<Overview />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/timetable" element={<Timetable />} />
                <Route path="/focus" element={<Focus />} />
                <Route path="/notes" element={<Notes />} />
                <Route path="/flashcards" element={<Flashcards />} />
                <Route path="/planner" element={<StudyPlanner />} />
                <Route path="/grades" element={<Grades />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/exams" element={<Exams />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/goals" element={<Goals />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </main>
          </div>
        </div>
      )}
      <CommandPalette 
        isOpen={commandPaletteOpen} 
        onClose={() => setCommandPaletteOpen(false)} 
      />
    </div>
  );
}

export default App;
