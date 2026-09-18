import { useAppStore } from '../store';

export default function StudyPlanner() {
  const exams = useAppStore((state) => state.exams);
  const subjects = useAppStore((state) => state.subjects);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-6">Study Planner</h1>
      
      <div className="space-y-6">
        {exams.map((exam) => {
          const subject = subjects.find((s) => s.id === exam.subjectId);
          return (
            <div key={exam.id} className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-medium text-[var(--text-primary)]">{exam.name}</h3>
                  {subject && (
                    <div className="flex items-center gap-1 text-sm text-[var(--text-secondary)] mt-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: subject.color }} />
                      {subject.name}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-[var(--text-primary)]">
                    {new Date(exam.date).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-[var(--text-secondary)]">{exam.time}</div>
                </div>
              </div>

              {/* Topics to study */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-[var(--text-secondary)] mb-2">Topics to cover:</h4>
                <div className="flex flex-wrap gap-2">
                  {exam.topics.map((topic, idx) => (
                    <span key={idx} className="px-3 py-1 bg-[var(--surface-secondary)] rounded-full text-sm text-[var(--text-primary)]">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Preparation progress */}
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-[var(--text-secondary)]">Preparation Progress</span>
                  <span className="text-[var(--text-primary)]">{exam.preparationProgress}%</span>
                </div>
                <div className="h-3 bg-[var(--surface-secondary)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--accent)] rounded-full transition-all"
                    style={{ width: `${exam.preparationProgress}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
