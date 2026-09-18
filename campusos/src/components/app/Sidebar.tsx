import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar as CalendarIcon,
  Clock,
  Zap,
  BookOpen,
  Brain,
  BookMarked,
  GraduationCap,
  UserCheck,
  FileText,
  FolderOpen,
  BarChart3,
  Target,
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '../../utils/helpers';

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: '',
    items: [
      { icon: LayoutDashboard, label: 'Overview', path: '/' },
    ],
  },
  {
    title: 'Planning',
    items: [
      { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
      { icon: CalendarIcon, label: 'Calendar', path: '/calendar' },
      { icon: Clock, label: 'Timetable', path: '/timetable' },
    ],
  },
  {
    title: 'Study',
    items: [
      { icon: Zap, label: 'Focus', path: '/focus' },
      { icon: BookOpen, label: 'Notes', path: '/notes' },
      { icon: Brain, label: 'Flashcards', path: '/flashcards' },
      { icon: BookMarked, label: 'Study Planner', path: '/planner' },
    ],
  },
  {
    title: 'Academics',
    items: [
      { icon: GraduationCap, label: 'Grades', path: '/grades' },
      { icon: UserCheck, label: 'Attendance', path: '/attendance' },
      { icon: FileText, label: 'Exams', path: '/exams' },
      { icon: FolderOpen, label: 'Projects', path: '/projects' },
    ],
  },
  {
    title: 'Resources',
    items: [
      { icon: BookOpen, label: 'Files & Links', path: '/resources' },
    ],
  },
  {
    title: 'Insights',
    items: [
      { icon: BarChart3, label: 'Analytics', path: '/analytics' },
      { icon: Target, label: 'Goals', path: '/goals' },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={cn(
        'flex flex-col bg-[var(--surface)] border-r border-[var(--border)] transition-all duration-200',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-[var(--border)]">
        {!collapsed && (
          <span className="font-semibold text-lg text-[var(--text-primary)]">CampusOS</span>
        )}
        {collapsed && (
          <span className="font-semibold text-lg text-[var(--text-primary)] mx-auto">C</span>
        )}
        <button
          onClick={onToggle}
          className="p-1.5 rounded-md hover:bg-[var(--surface-secondary)] text-[var(--text-secondary)]"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {navSections.map((section, idx) => (
          <div key={idx} className="mb-4">
            {!collapsed && section.title && (
              <h3 className="px-4 text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                {section.title}
              </h3>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-4 py-2 mx-2 rounded-md transition-colors',
                        isActive
                          ? 'bg-[var(--accent)] text-white'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)]',
                        collapsed && 'justify-center px-2'
                      )
                    }
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon size={18} />
                    {!collapsed && <span>{item.label}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[var(--border)]">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-4 py-2 rounded-md transition-colors',
              isActive
                ? 'bg-[var(--accent)] text-white'
                : 'text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)]',
              collapsed && 'justify-center px-2'
            )
          }
          title={collapsed ? 'Settings' : undefined}
        >
          <SettingsIcon size={18} />
          {!collapsed && <span>Settings</span>}
        </NavLink>
      </div>
    </aside>
  );
}
