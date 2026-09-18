import { useAppStore } from '../store';

export default function Attendance() {
  const subjects = useAppStore((state) => state.subjects);
  const attendance = useAppStore((state) => state.attendance);

  const getAttendanceStats = (subjectId: string) => {
    const records = attendance.filter((a) => a.subjectId === subjectId);
    const present = records.filter((r) => r.status === 'present').length;
    const late = records.filter((r) => r.status === 'late').length;
    const excused = records.filter((r) => r.status === 'excused').length;
    const absent = records.filter((r) => r.status === 'absent').length;
    const total = records.length;
    const percentage = total > 0 ? ((present + late * 0.5) / total) * 100 : 100;
    return { present, late, excused, absent, total, percentage };
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-6">Attendance</h1>
      
      <div className="grid grid-cols-1 gap-4">
        {subjects.map((subject) => {
          const stats = getAttendanceStats(subject.id);
          return (
            <div key={subject.id} className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: subject.color }} />
                  <span className="font-medium text-[var(--text-primary)]">{subject.name}</span>
                </div>
                <span className={`text-lg font-semibold ${stats.percentage >= 80 ? 'text-green-600' : stats.percentage >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {stats.percentage.toFixed(1)}%
                </span>
              </div>
              <div className="h-2 bg-[var(--surface-secondary)] rounded-full overflow-hidden mb-4">
                <div className="h-full bg-green-500" style={{ width: `${(stats.present / stats.total) * 100}%` }} />
              </div>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-semibold text-green-600">{stats.present}</div>
                  <div className="text-xs text-[var(--text-secondary)]">Present</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-yellow-600">{stats.late}</div>
                  <div className="text-xs text-[var(--text-secondary)]">Late</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-blue-600">{stats.excused}</div>
                  <div className="text-xs text-[var(--text-secondary)]">Excused</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-red-600">{stats.absent}</div>
                  <div className="text-xs text-[var(--text-secondary)]">Absent</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
