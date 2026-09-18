import { format, isToday, parseISO } from 'date-fns';
import { useAppStore } from '../store';
import { cn, getRelativeDate, getCountdown, formatDuration } from '../utils/helpers';
import { Clock, BookOpen, Target, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';

export default function Overview() {
  const profile = useAppStore((state) => state.profile);
  const tasks = useAppStore((state) => state.tasks);
  const timetable = useAppStore((state) => state.timetable);
  const subjects = useAppStore((state) => state.subjects);
  const exams = useAppStore((state) => state.exams);
  const assessments = useAppStore((state) => state.assessments);
  const attendance = useAppStore((state) => state.attendance);
  const focusSessions = useAppStore((state) => state.focusSessions);
  const goals = useAppStore((state) => state.goals);

  // Get today's day of week (1-5 for Mon-Fri)
  const todayDayOfWeek = new Date().getDay();
  const todaysClasses = timetable.filter((c) => c.dayOfWeek === todayDayOfWeek).sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Upcoming tasks
  const upcomingTasks = tasks
    .filter((t) => t.status !== 'completed' && t.dueDate)
    .sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''))
    .slice(0, 4);

  // Calculate GPA/Average
  const subjectAverages = subjects.map((subject) => {
    const subjectAssessments = assessments.filter((a) => a.subjectId === subject.id);
    if (subjectAssessments.length === 0) return { subjectId: subject.id, average: 0 };
    const totalWeight = subjectAssessments.reduce((sum, a) => sum + a.weight, 0);
    const weightedSum = subjectAssessments.reduce((sum, a) => sum + (a.score / a.maxScore) * a.weight, 0);
    return { subjectId: subject.id, average: totalWeight > 0 ? (weightedSum / totalWeight) * 100 : 0 };
  });

  const overallAverage = subjectAverages.reduce((sum, s) => sum + s.average, 0) / subjectAverages.length || 0;

  // Calculate attendance percentage
  const attendanceStats = subjects.map((subject) => {
    const subjectAttendance = attendance.filter((a) => a.subjectId === subject.id);
    const present = subjectAttendance.filter((a) => a.status === 'present').length;
    const total = subjectAttendance.length;
    return { subjectId: subject.id, percentage: total > 0 ? (present / total) * 100 : 100 };
  });

  const overallAttendance = attendanceStats.reduce((sum, s) => sum + s.percentage, 0) / attendanceStats.length || 100;

  // Weekly study time
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weeklyStudyMinutes = focusSessions
    .filter((s) => new Date(s.startedAt) >= weekAgo && s.mode === 'focus')
    .reduce((sum, s) => sum + s.durationMinutes, 0);

  // Task completion stats
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const totalTasks = tasks.length;

  // Upcoming exams
  const upcomingExams = exams
    .filter((e) => getCountdown(e.date) <= 30)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);

  // Active goals
  const activeGoals = goals.filter((g) => g.status === 'active').slice(0, 3);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getSubjectById = (id: string | null) => subjects.find((s) => s.id === id);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
          {getGreeting()}, {profile.name.split(' ')[0]}
        </h1>
        <p className="text-[var(--text-secondary)] mt-1">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>
      </div>

      {/* Today's Schedule */}
      <section className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-5">
        <h2 className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-4">
          Today's Schedule
        </h2>
        {todaysClasses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {todaysClasses.map((cls) => {
              const subject = getSubjectById(cls.subjectId);
              return (
                <div
                  key={cls.id}
                  className="p-3 bg-[var(--surface-secondary)] rounded-md border border-[var(--border)]"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: subject?.color || '#9CA3AF' }}
                    />
                    <span className="font-medium text-[var(--text-primary)]">{subject?.name || 'Class'}</span>
                  </div>
                  <div className="text-sm text-[var(--text-secondary)]">
                    {cls.startTime} - {cls.endTime}
                  </div>
                  <div className="text-xs text-[var(--text-secondary)] mt-1">{cls.room}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-[var(--text-secondary)]">No classes scheduled for today.</p>
        )}
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Tasks */}
          <section className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                Upcoming Tasks
              </h2>
            </div>
            <div className="space-y-2">
              {upcomingTasks.map((task) => {
                const subject = getSubjectById(task.subjectId);
                return (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 bg-[var(--surface-secondary)] rounded-md border border-[var(--border)]"
                  >
                    <input
                      type="checkbox"
                      checked={false}
                      onChange={() => {}}
                      className="w-4 h-4 rounded border-[var(--border)]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-[var(--text-primary)] truncate">{task.title}</div>
                      <div className="text-sm text-[var(--text-secondary)] flex items-center gap-2">
                        {subject && (
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: subject.color }} />
                            {subject.name}
                          </span>
                        )}
                        <span>•</span>
                        <span className={cn(getRelativeDate(task.dueDate!).includes('overdue') ? 'text-red-500' : '')}>
                          {getRelativeDate(task.dueDate!)}
                        </span>
                      </div>
                    </div>
                    <span className={cn(
                      "px-2 py-0.5 rounded text-xs font-medium",
                      task.priority === 'high' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                    )}>
                      {task.priority}
                    </span>
                  </div>
                );
              })}
              {upcomingTasks.length === 0 && (
                <p className="text-[var(--text-secondary)] text-sm">No upcoming tasks. Great job!</p>
              )}
            </div>
          </section>

          {/* Study Activity Chart Placeholder */}
          <section className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-5">
            <h2 className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-4">
              Study Activity
            </h2>
            <div className="h-48 flex items-end gap-2">
              {Array.from({ length: 7 }).map((_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (6 - i));
                const daySessions = focusSessions.filter(
                  (s) => format(parseISO(s.startedAt), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') && s.mode === 'focus'
                );
                const minutes = daySessions.reduce((sum, s) => sum + s.durationMinutes, 0);
                const maxMinutes = 120;
                const heightPercent = Math.min((minutes / maxMinutes) * 100, 100);
                
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-[var(--accent)] rounded-t opacity-80 hover:opacity-100 transition-opacity"
                      style={{ height: `${heightPercent}%`, minHeight: heightPercent > 0 ? '8px' : '0' }}
                    />
                    <span className="text-xs text-[var(--text-secondary)]">
                      {format(date, 'EEE')}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Academic Snapshot */}
          <section className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-5">
            <h2 className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-4">
              Academic Snapshot
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-[var(--surface-secondary)] rounded-md">
                <div className="text-2xl font-semibold text-[var(--text-primary)]">
                  {overallAverage.toFixed(1)}%
                </div>
                <div className="text-xs text-[var(--text-secondary)] mt-1">Average</div>
              </div>
              <div className="p-3 bg-[var(--surface-secondary)] rounded-md">
                <div className="text-2xl font-semibold text-[var(--text-primary)]">
                  {overallAttendance.toFixed(1)}%
                </div>
                <div className="text-xs text-[var(--text-secondary)] mt-1">Attendance</div>
              </div>
              <div className="p-3 bg-[var(--surface-secondary)] rounded-md">
                <div className="text-2xl font-semibold text-[var(--text-primary)]">
                  {formatDuration(weeklyStudyMinutes)}
                </div>
                <div className="text-xs text-[var(--text-secondary)] mt-1">This Week</div>
              </div>
              <div className="p-3 bg-[var(--surface-secondary)] rounded-md">
                <div className="text-2xl font-semibold text-[var(--text-primary)]">
                  {completedTasks}/{totalTasks}
                </div>
                <div className="text-xs text-[var(--text-secondary)] mt-1">Tasks Done</div>
              </div>
            </div>
          </section>

          {/* Upcoming Exams */}
          <section className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-5">
            <h2 className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-4">
              Upcoming Exams
            </h2>
            <div className="space-y-3">
              {upcomingExams.map((exam) => {
                const subject = getSubjectById(exam.subjectId);
                const daysLeft = getCountdown(exam.date);
                return (
                  <div key={exam.id} className="p-3 bg-[var(--surface-secondary)] rounded-md border border-[var(--border)]">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium text-[var(--text-primary)]">{exam.name}</div>
                        {subject && (
                          <div className="text-sm text-[var(--text-secondary)] flex items-center gap-1 mt-1">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: subject.color }} />
                            {subject.name}
                          </div>
                        )}
                      </div>
                      <div className={cn(
                        "px-2 py-1 rounded text-xs font-medium",
                        daysLeft <= 3 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        daysLeft <= 7 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      )}>
                        {daysLeft}d left
                      </div>
                    </div>
                  </div>
                );
              })}
              {upcomingExams.length === 0 && (
                <p className="text-[var(--text-secondary)] text-sm">No upcoming exams.</p>
              )}
            </div>
          </section>

          {/* Goals */}
          <section className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-5">
            <h2 className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-4">
              Goals
            </h2>
            <div className="space-y-4">
              {activeGoals.map((goal) => (
                <div key={goal.id}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[var(--text-primary)]">{goal.title}</span>
                    <span className="text-xs text-[var(--text-secondary)]">
                      {goal.current}/{goal.target} {goal.unit}
                    </span>
                  </div>
                  <div className="h-2 bg-[var(--surface-secondary)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--accent)] rounded-full transition-all"
                      style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
              {activeGoals.length === 0 && (
                <p className="text-[var(--text-secondary)] text-sm">No active goals.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
