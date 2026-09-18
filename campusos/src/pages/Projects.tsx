import { useAppStore } from '../store';

export default function Projects() {
  const projects = useAppStore((state) => state.projects);
  const projectTasks = useAppStore((state) => state.projectTasks);

  const getProjectTaskCount = (projectId: string, status?: string) => {
    const tasks = projectTasks.filter((t) => t.projectId === projectId);
    if (status) return tasks.filter((t) => t.status === status).length;
    return tasks.length;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-6">Projects</h1>
      
      <div className="space-y-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-medium text-[var(--text-primary)]">{project.name}</h3>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{project.description}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                project.status === 'completed' ? 'bg-green-100 text-green-700' :
                project.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {project.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <span className="text-xs text-[var(--text-secondary)]">Deadline</span>
                <div className="text-sm text-[var(--text-primary)]">{new Date(project.deadline).toLocaleDateString()}</div>
              </div>
              <div>
                <span className="text-xs text-[var(--text-secondary)]">Members</span>
                <div className="text-sm text-[var(--text-primary)]">{project.members.join(', ')}</div>
              </div>
              <div>
                <span className="text-xs text-[var(--text-secondary)]">Tasks</span>
                <div className="text-sm text-[var(--text-primary)]">{getProjectTaskCount(project.id, 'done')}/{getProjectTaskCount(project.id)}</div>
              </div>
            </div>

            {/* Progress */}
            <div className="h-2 bg-[var(--surface-secondary)] rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-[var(--accent)] rounded-full transition-all"
                style={{ width: `${project.progress}%` }}
              />
            </div>

            {/* Task columns */}
            <div className="grid grid-cols-4 gap-4 mt-4">
              {['backlog', 'todo', 'doing', 'done'].map((status) => (
                <div key={status} className="bg-[var(--surface-secondary)] rounded p-3">
                  <div className="text-xs font-medium text-[var(--text-secondary)] uppercase mb-2">{status}</div>
                  <div className="space-y-2">
                    {projectTasks
                      .filter((t) => t.projectId === project.id && t.status === status)
                      .map((task) => (
                        <div key={task.id} className="bg-[var(--surface)] rounded p-2 text-sm">
                          {task.title}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
