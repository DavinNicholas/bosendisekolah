import { useAppStore } from '../store';

export default function Grades() {
  const subjects = useAppStore((state) => state.subjects);
  const assessments = useAppStore((state) => state.assessments);

  const getSubjectAverage = (subjectId: string) => {
    const subjectAssessments = assessments.filter((a) => a.subjectId === subjectId);
    if (subjectAssessments.length === 0) return null;
    const totalWeight = subjectAssessments.reduce((sum, a) => sum + a.weight, 0);
    const weightedSum = subjectAssessments.reduce((sum, a) => sum + (a.score / a.maxScore) * a.weight, 0);
    return totalWeight > 0 ? (weightedSum / totalWeight) * 100 : null;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-6">Grades</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {subjects.map((subject) => {
          const avg = getSubjectAverage(subject.id);
          return (
            <div key={subject.id} className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: subject.color }} />
                <span className="font-medium text-[var(--text-primary)] truncate">{subject.name}</span>
              </div>
              <div className="text-2xl font-semibold text-[var(--text-primary)]">
                {avg !== null ? `${avg.toFixed(1)}%` : '-'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Assessments Table */}
      <div className="bg-[var(--surface)] rounded-lg border border-[var(--border)] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[var(--surface-secondary)]">
            <tr>
              <th className="p-3 text-left text-sm font-medium text-[var(--text-secondary)]">Subject</th>
              <th className="p-3 text-left text-sm font-medium text-[var(--text-secondary)]">Assessment</th>
              <th className="p-3 text-left text-sm font-medium text-[var(--text-secondary)]">Date</th>
              <th className="p-3 text-left text-sm font-medium text-[var(--text-secondary)]">Score</th>
              <th className="p-3 text-left text-sm font-medium text-[var(--text-secondary)]">Weight</th>
            </tr>
          </thead>
          <tbody>
            {assessments.map((assessment) => {
              const subject = subjects.find((s) => s.id === assessment.subjectId);
              return (
                <tr key={assessment.id} className="border-t border-[var(--border)]">
                  <td className="p-3">
                    {subject && (
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: subject.color }} />
                        {subject.name}
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-[var(--text-primary)]">{assessment.name}</td>
                  <td className="p-3 text-[var(--text-secondary)]">{new Date(assessment.date).toLocaleDateString()}</td>
                  <td className="p-3 text-[var(--text-primary)]">{assessment.score}/{assessment.maxScore}</td>
                  <td className="p-3 text-[var(--text-secondary)]">{assessment.weight}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
