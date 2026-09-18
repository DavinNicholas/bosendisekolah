import { useAppStore } from '../store';
import { getCountdown } from '../utils/helpers';

export default function Exams() {
  const exams = useAppStore((state) => state.exams);
  const subjects = useAppStore((state) => state.subjects);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-6">Exams</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exams.map((exam) => {
          const subject = subjects.find((s) => s.id === exam.subjectId);
          const daysLeft = getCountdown(exam.date);
          return (
            <div key={exam.id} className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-[var(--text-primary)]">{exam.name}</h3>
                  {subject && (
                    <div className="flex items-center gap-1 text-sm text-[var(--text-secondary)] mt-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: subject.color }} />
                      {subject.name}
                    </div>
                  )}
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  daysLeft <= 3 ? 'bg-red-100 text-red-700 dark:bg-red-900/30' :
                  daysLeft <= 7 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30' :
                  'bg-blue-100 text-blue-700 dark:bg-blue-900/30'
                }`}>
                  {daysLeft} days left
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <span className="text-[var(--text-secondary)]">Date:</span>
                  <span className="ml-2 text-[var(--text-primary)]">{new Date(exam.date).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-[var(--text-secondary)]">Time:</span>
                  <span className="ml-2 text-[var(--text-primary)]">{exam.time}</span>
                </div>
                <div>
                  <span className="text-[var(--text-secondary)]">Location:</span>
                  <span className="ml-2 text-[var(--text-primary)]">{exam.location}</span>
                </div>
                <div>
                  <span className="text-[var(--text-secondary)]">Progress:</span>
                  <span className="ml-2 text-[var(--text-primary)]">{exam.preparationProgress}%</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2 bg-[var(--surface-secondary)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--accent)] rounded-full"
                  style={{ width: `${exam.preparationProgress}%` }}
                />
              </div>

              {/* Topics */}
              {exam.topics.length > 0 && (
                <div className="mt-4">
                  <span className="text-xs text-[var(--text-secondary)]">Topics to cover:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {exam.topics.map((topic, idx) => (
                      <span key={idx} className="px-2 py-1 bg-[var(--surface-secondary)] rounded text-xs text-[var(--text-secondary)]">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
