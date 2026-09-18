import { Search, Bell, Plus, Sun, Moon, Monitor } from 'lucide-react';
import { useAppStore } from '../../store';
import { cn } from '../../utils/helpers';
import { format } from 'date-fns';

interface TopBarProps {
  onOpenCommandPalette: () => void;
  sidebarCollapsed: boolean;
}

export default function TopBar({ onOpenCommandPalette, sidebarCollapsed }: TopBarProps) {
  const profile = useAppStore((state) => state.profile);
  const settings = useAppStore((state) => state.settings);
  const updateSettings = useAppStore((state) => state.updateSettings);
  const notifications = useAppStore((state) => state.notifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const toggleTheme = () => {
    const themes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(settings.theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    updateSettings({ theme: nextTheme });
  };

  const getThemeIcon = () => {
    if (settings.theme === 'dark') return Moon;
    if (settings.theme === 'light') return Sun;
    return Monitor;
  };

  const ThemeIcon = getThemeIcon();

  return (
    <header className="h-14 bg-[var(--surface)] border-b border-[var(--border)] flex items-center justify-between px-4">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-64 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={18} />
          <input
            type="text"
            placeholder="Search... (Press /)"
            className="w-full pl-10 pr-4 py-2 bg-[var(--surface-secondary)] border border-[var(--border)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
        </div>
        <button
          onClick={onOpenCommandPalette}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[var(--surface-secondary)] border border-[var(--border)] rounded-md text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          <span>Search...</span>
          <kbd className="px-1.5 py-0.5 bg-[var(--background)] rounded text-xs">⌘K</kbd>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md hover:bg-[var(--surface-secondary)] text-[var(--text-secondary)]"
          aria-label="Toggle theme"
        >
          <ThemeIcon size={18} />
        </button>

        <div className="relative">
          <button className="p-2 rounded-md hover:bg-[var(--surface-secondary)] text-[var(--text-secondary)] relative">
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>
        </div>

        <button className="flex items-center gap-2 px-3 py-1.5 bg-[var(--accent)] text-white rounded-md text-sm font-medium hover:bg-[var(--accent-hover)]">
          <Plus size={16} />
          <span className="hidden sm:inline">Add</span>
        </button>

        <div className="ml-2 w-8 h-8 bg-[var(--accent)] rounded-full flex items-center justify-center text-white text-sm font-medium">
          {profile.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
        </div>
      </div>
    </header>
  );
}
