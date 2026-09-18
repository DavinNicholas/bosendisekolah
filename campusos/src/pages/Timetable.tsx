import { useAppStore } from '../store';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const timeSlots = ['07:30', '09:00', '10:30', '13:00', '14:30'];

export default function Timetable() {
  const timetable = useAppStore((state) => state.timetable);
  const subjects = useAppStore((state) => state.subjects);

  const getSubjectById = (id: string) => subjects.find((s) => s.id === id);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-6">Timetable</h1>
      <div className="bg-[var(--surface)] rounded-lg border border-[var(--border)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="p-3 text-left text-sm font-medium text-[var(--text-secondary)]">Time</th>
              {[1, 2, 3, 4, 5].map((day) => (
                <th key={day} className="p-3 text-left text-sm font-medium text-[var(--text-secondary)]">
                  {days[day]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((time) => (
              <tr key={time} className="border-b border-[var(--border)] last:border-0">
                <td className="p-3 text-sm text-[var(--text-secondary)] border-r border-[var(--border)]">
                  {time}
                </td>
                {[1, 2, 3, 4, 5].map((day) => {
                  const cls = timetable.find((t) => t.dayOfWeek === day && t.startTime === time);
                  const subject = cls ? getSubjectById(cls.subjectId) : null;
                  return (
                    <td key={day} className="p-2">
                      {subject && (
                        <div
                          className="p-2 rounded text-sm"
                          style={{ backgroundColor: `${subject.color}20`, borderLeft: `3px solid ${subject.color}` }}
                        >
                          <div className="font-medium text-[var(--text-primary)]">{subject.name}</div>
                          <div className="text-xs text-[var(--text-secondary)]">{cls?.room}</div>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
