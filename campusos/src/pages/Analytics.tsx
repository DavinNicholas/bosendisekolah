import { format, parseISO, subDays } from 'date-fns';
import { useAppStore } from '../store';

export default function Analytics() {
  const focusSessions = useAppStore((state) => state.focusSessions);
  const subjects = useAppStore((state) => state.subjects);
  const assessments = useAppStore((state) => state.assessments);
  const attendance = useAppStore((state) => state.attendance);
  const tasks = useAppStore((state) => state.tasks);

  // Study time by subject (last 7 days)
  const studyTimeBySubject = subjects.map((subject) => {
    const weekAgo = subDays(new Date(), 7);
    const subjectSessions = focusSessions.filter(
      (s) => s.subjectId === subject.id && new Date(s.startedAt) >= weekAgo && s.mode === 'focus'
    );
    const totalMinutes = subjectSessions.reduce((sum, s) => sum + s.durationMinutes, 0);
    return { ...subject, minutes: totalMinutes };
  });

  // Daily study time (last 7 days)
  const dailyStudyTime = Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const daySessions = focusSessions.filter(
      (s) => format(parseISO(s.startedAt), 'yyyy-MM-dd') === dateStr && s.mode === 'focus'
    );
    return {
      date: format(date, 'EEE'),
      minutes: daySessions.reduce((sum, s) => sum + s.durationMinutes, 0),
    };
  });

  // Task completion rate
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const taskCompletionRate = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  // Subject averages
  const subjectAverages = subjects.map((subject) => {
    const subjectAssessments = assessments.filter((a) => a.subjectId === subject.id);
    if (subjectAssessments.length === 0) return { ...subject, average: 0 };
    const totalWeight = subjectAssessments.reduce((sum, a) => sum + a.weight, 0);
    const weightedSum = subjectAssessments.reduce((sum, a) => sum + (a.score / a.maxScore) * a.weight, 0);
    return { ...subject, average: totalWeight > 0 ? (weightedSum / totalWeight) * 100 : 0 };
  });

  // Attendance by subject
  const attendanceBySubject = subjects.map((subject) => {
    const records = attendance.filter((a) => a.subjectId === subject.id);
    const present = records.filter((r) => r.status === 'present').length;
    const total = records.length;
    return { ...subject, percentage: total > 0 ? (present / total) * 100 : 100 };
  });

  const maxStudyMinutes = Math.max(...dailyStudyTime.map((d) => d.minutes), 60);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-6">Analytics</h1>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-4">
          <div className="text-2xl font-semibold text-[var(--text-primary)]">
            {focusSessions.filter((s) => s.mode === 'focus').reduce((sum, s) => sum + s.durationMinutes, 0) / 60}h
          </div>
          <div className="text-sm text-[var(--text-secondary)] mt-1">Total Study Time</div>
        </div>
        <div className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-4">
          <div className="text-2xl font-semibold text-[var(--text-primary)]">{focusSessions.length}</div>
          <div className="text-sm text-[var(--text-secondary)] mt-1">Focus Sessions</div>
        </div>
        <div className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-4">
          <div className="text-2xl font-semibold text-[var(--text-primary)]">{taskCompletionRate.toFixed(0)}%</div>
          <div className="text-sm text-[var(--text-secondary)] mt-1">Task Completion</div>
        </div>
        <div className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-4">
          <div className="text-2xl font-semibold text-[var(--text-primary)]">
            {attendance.reduce((sum, r) => sum + (r.status === 'present' ? 1 : 0), 0)}
          </div>
          <div className="text-sm text-[var(--text-secondary)] mt-1">Classes Attended</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Study Time */}
        <div className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-5">
          <h3 className="font-medium text-[var(--text-primary)] mb-4">Daily Study Time</h3>
          <div className="h-48 flex items-end gap-2">
            {dailyStudyTime.map((day, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-[var(--accent)] rounded-t opacity-80"
                  style={{ height: `${(day.minutes / maxStudyMinutes) * 100}%`, minHeight: day.minutes > 0 ? '8px' : '0' }}
                />
                <span className="text-xs text-[var(--text-secondary)]">{day.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Study Time by Subject */}
        <div className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-5">
          <h3 className="font-medium text-[var(--text-primary)] mb-4">Study Time by Subject</h3>
          <div className="space-y-3">
            {studyTimeBySubject.map((subject) => (
              <div key={subject.id} className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: subject.color }} />
                <span className="text-sm text-[var(--text-primary)] flex-1">{subject.name}</span>
                <span className="text-sm text-[var(--text-secondary)] w-16 text-right">{subject.minutes}m</span>
              </div>
            ))}
          </div>
        </div>

        {/* Subject Averages */}
        <div className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-5">
          <h3 className="font-medium text-[var(--text-primary)] mb-4">Grade Averages</h3>
          <div className="space-y-3">
            {subjectAverages.map((subject) => (
              <div key={subject.id} className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: subject.color }} />
                <span className="text-sm text-[var(--text-primary)] flex-1">{subject.name}</span>
                <span className={`text-sm font-medium w-16 text-right ${
                  subject.average >= 80 ? 'text-green-600' : subject.average >= 70 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {subject.average.toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance */}
        <div className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-5">
          <h3 className="font-medium text-[var(--text-primary)] mb-4">Attendance Rate</h3>
          <div className="space-y-3">
            {attendanceBySubject.map((subject) => (
              <div key={subject.id} className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: subject.color }} />
                <span className="text-sm text-[var(--text-primary)] flex-1">{subject.name}</span>
                <span className={`text-sm font-medium w-16 text-right ${
                  subject.percentage >= 90 ? 'text-green-600' : subject.percentage >= 80 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {subject.percentage.toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
