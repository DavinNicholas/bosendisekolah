import { format, parseISO } from 'date-fns';
import { useAppStore } from '../store';

export default function Calendar() {
  const events = useAppStore((state) => state.events);
  const subjects = useAppStore((state) => state.subjects);

  const getSubjectById = (id: string | null) => subjects.find((s) => s.id === id);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-6">Calendar</h1>
      <div className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-6">
        <p className="text-[var(--text-secondary)]">Calendar view with monthly, weekly, and daily views.</p>
        <div className="mt-4 space-y-2">
          {events.map((event) => {
            const subject = getSubjectById(event.categoryId);
            return (
              <div key={event.id} className="p-3 bg-[var(--surface-secondary)] rounded-md border border-[var(--border)]">
                <div className="font-medium text-[var(--text-primary)]">{event.title}</div>
                <div className="text-sm text-[var(--text-secondary)]">
                  {format(parseISO(event.startDate), event.allDay ? 'MMM d, yyyy' : 'MMM d, yyyy h:mm a')}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
