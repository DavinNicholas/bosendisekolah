import { useState, useEffect } from 'react';
import { useAppStore } from '../store';
import { Play, Pause, RotateCcw, Check } from 'lucide-react';
import { cn } from '../utils/helpers';

type Mode = 'focus' | 'short-break' | 'long-break';

export default function Focus() {
  const settings = useAppStore((state) => state.settings);
  const subjects = useAppStore((state) => state.subjects);
  const addFocusSession = useAppStore((state) => state.addFocusSession);

  const [mode, setMode] = useState<Mode>('focus');
  const [timeLeft, setTimeLeft] = useState(settings.focusDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const getDuration = (m: Mode) => {
    switch (m) {
      case 'focus': return settings.focusDuration * 60;
      case 'short-break': return settings.shortBreak * 60;
      case 'long-break': return settings.longBreak * 60;
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Session complete
      if (mode === 'focus') {
        addFocusSession({
          mode,
          durationMinutes: settings.focusDuration,
          subjectId: selectedSubject,
          taskId: null,
          startedAt: new Date().toISOString(),
          completedAt: new Date().toISOString(),
        });
      }
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode, settings.focusDuration, selectedSubject, addFocusSession]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setTimeLeft(getDuration(newMode));
    setIsRunning(false);
  };

  const handleReset = () => {
    setTimeLeft(getDuration(mode));
    setIsRunning(false);
  };

  const progress = ((getDuration(mode) - timeLeft) / getDuration(mode)) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-6">Focus Timer</h1>
      
      <div className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-8">
        {/* Mode Selection */}
        <div className="flex justify-center gap-2 mb-8">
          {[
            { id: 'focus', label: 'Focus' },
            { id: 'short-break', label: 'Short Break' },
            { id: 'long-break', label: 'Long Break' },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => handleModeChange(m.id as Mode)}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                mode === m.id
                  ? 'bg-[var(--accent)] text-white'
                  : 'bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              )}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Subject Selection */}
        {mode === 'focus' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Subject (optional)
            </label>
            <select
              value={selectedSubject || ''}
              onChange={(e) => setSelectedSubject(e.target.value || null)}
              className="w-full px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border)] rounded-md text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            >
              <option value="">No subject</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Timer Display */}
        <div className="relative w-64 h-64 mx-auto mb-8">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="var(--surface-secondary)"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="var(--accent)"
              strokeWidth="8"
              fill="none"
              strokeDasharray={2 * Math.PI * 120}
              strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl font-mono font-semibold text-[var(--text-primary)]">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center items-center gap-4">
          <button
            onClick={handleReset}
            className="p-3 rounded-full bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <RotateCcw size={24} />
          </button>
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={cn(
              "p-4 rounded-full transition-colors",
              isRunning
                ? 'bg-orange-500 text-white'
                : 'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]'
            )}
          >
            {isRunning ? <Pause size={32} /> : <Play size={32} />}
          </button>
          {timeLeft === 0 && (
            <button
              onClick={handleReset}
              className="p-3 rounded-full bg-green-500 text-white"
            >
              <Check size={24} />
            </button>
          )}
        </div>

        {/* Tips */}
        <div className="mt-8 p-4 bg-[var(--surface-secondary)] rounded-md">
          <h3 className="font-medium text-[var(--text-primary)] mb-2">Tips for effective focus sessions:</h3>
          <ul className="text-sm text-[var(--text-secondary)] space-y-1">
            <li>• Eliminate distractions before starting</li>
            <li>• Keep your phone away or on silent</li>
            <li>• Take regular breaks to stay fresh</li>
            <li>• Track your progress over time</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
