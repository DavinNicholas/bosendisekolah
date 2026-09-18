import { useAppStore } from '../store';

export default function Goals() {
  const goals = useAppStore((state) => state.goals);
  const updateGoal = useAppStore((state) => state.updateGoal);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-6">Goals</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => {
          const progress = Math.min((goal.current / goal.target) * 100, 100);
          return (
            <div key={goal.id} className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-[var(--text-primary)]">{goal.title}</h3>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${
                    goal.category === 'academic' ? 'bg-blue-100 text-blue-700' :
                    goal.category === 'study' ? 'bg-green-100 text-green-700' :
                    goal.category === 'attendance' ? 'bg-purple-100 text-purple-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {goal.category}
                  </span>
                </div>
                {goal.deadline && (
                  <span className="text-xs text-[var(--text-secondary)]">
                    Due: {new Date(goal.deadline).toLocaleDateString()}
                  </span>
                )}
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-[var(--text-secondary)]">Progress</span>
                  <span className="text-[var(--text-primary)]">{goal.current}/{goal.target} {goal.unit}</span>
                </div>
                <div className="h-3 bg-[var(--surface-secondary)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--accent)] rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={goal.current}
                  onChange={(e) => updateGoal(goal.id, { current: Number(e.target.value) })}
                  className="w-24 px-2 py-1 bg-[var(--surface-secondary)] border border-[var(--border)] rounded text-sm text-[var(--text-primary)]"
                />
                <span className="text-sm text-[var(--text-secondary)]">of {goal.target} {goal.unit}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
