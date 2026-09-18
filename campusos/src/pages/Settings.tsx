import { useAppStore } from '../store';

export default function Settings() {
  const settings = useAppStore((state) => state.settings);
  const profile = useAppStore((state) => state.profile);
  const updateSettings = useAppStore((state) => state.updateSettings);
  const updateProfile = useAppStore((state) => state.updateProfile);
  const exportData = useAppStore((state) => state.exportData);
  const resetData = useAppStore((state) => state.resetData);

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'campusos-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Settings</h1>

      {/* Appearance */}
      <section className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-5">
        <h2 className="font-medium text-[var(--text-primary)] mb-4">Appearance</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Theme</label>
            <select
              value={settings.theme}
              onChange={(e) => updateSettings({ theme: e.target.value as 'light' | 'dark' | 'system' })}
              className="w-full px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border)] rounded-md text-[var(--text-primary)]"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Density</label>
            <select
              value={settings.density}
              onChange={(e) => updateSettings({ density: e.target.value as 'comfortable' | 'compact' })}
              className="w-full px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border)] rounded-md text-[var(--text-primary)]"
            >
              <option value="comfortable">Comfortable</option>
              <option value="compact">Compact</option>
            </select>
          </div>
        </div>
      </section>

      {/* Focus Timer */}
      <section className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-5">
        <h2 className="font-medium text-[var(--text-primary)] mb-4">Focus Timer</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Focus (min)</label>
            <input
              type="number"
              value={settings.focusDuration}
              onChange={(e) => updateSettings({ focusDuration: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border)] rounded-md text-[var(--text-primary)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Short Break</label>
            <input
              type="number"
              value={settings.shortBreak}
              onChange={(e) => updateSettings({ shortBreak: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border)] rounded-md text-[var(--text-primary)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Long Break</label>
            <input
              type="number"
              value={settings.longBreak}
              onChange={(e) => updateSettings({ longBreak: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border)] rounded-md text-[var(--text-primary)]"
            />
          </div>
        </div>
      </section>

      {/* Data Management */}
      <section className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-5">
        <h2 className="font-medium text-[var(--text-primary)] mb-4">Data Management</h2>
        <div className="space-y-3">
          <button
            onClick={handleExport}
            className="w-full px-4 py-2 bg-[var(--surface-secondary)] text-[var(--text-primary)] rounded-md hover:bg-[var(--accent)] hover:text-white transition-colors"
          >
            Export Data (JSON)
          </button>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
                resetData();
              }
            }}
            className="w-full px-4 py-2 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-md hover:bg-red-200 transition-colors"
          >
            Reset All Data
          </button>
        </div>
      </section>

      {/* Profile */}
      <section className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-5">
        <h2 className="font-medium text-[var(--text-primary)] mb-4">Profile</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => updateProfile({ name: e.target.value })}
              className="w-full px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border)] rounded-md text-[var(--text-primary)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">School</label>
            <input
              type="text"
              value={profile.school}
              onChange={(e) => updateProfile({ school: e.target.value })}
              className="w-full px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border)] rounded-md text-[var(--text-primary)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Grade Level</label>
            <input
              type="text"
              value={profile.gradeLevel}
              onChange={(e) => updateProfile({ gradeLevel: e.target.value })}
              className="w-full px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border)] rounded-md text-[var(--text-primary)]"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
