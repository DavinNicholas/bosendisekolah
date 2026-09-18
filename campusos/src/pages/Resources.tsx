import { useAppStore } from '../store';
import { FileText, Link as LinkIcon, Video, Presentation } from 'lucide-react';

export default function Resources() {
  const resources = useAppStore((state) => state.resources);
  const subjects = useAppStore((state) => state.subjects);

  const getSubjectById = (id: string | null) => subjects.find((s) => s.id === id);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText size={18} />;
      case 'video': return <Video size={18} />;
      case 'presentation': return <Presentation size={18} />;
      default: return <LinkIcon size={18} />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-6">Resources</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((resource) => {
          const subject = getSubjectById(resource.subjectId);
          return (
            <div key={resource.id} className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 bg-[var(--surface-secondary)] rounded-md text-[var(--text-secondary)]">
                  {getTypeIcon(resource.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-[var(--text-primary)] truncate">{resource.title}</h3>
                  {subject && (
                    <div className="flex items-center gap-1 text-sm text-[var(--text-secondary)] mt-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: subject.color }} />
                      {subject.name}
                    </div>
                  )}
                </div>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mb-3 line-clamp-2">{resource.description}</p>
              {resource.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {resource.tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-[var(--surface-secondary)] rounded text-xs text-[var(--text-secondary)]">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
