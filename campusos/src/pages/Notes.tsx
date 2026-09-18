import { useState } from 'react';
import { useAppStore } from '../store';
import { Plus, Search, Star, Pin, Trash2, Edit } from 'lucide-react';
import { cn } from '../utils/helpers';

export default function Notes() {
  const notes = useAppStore((state) => state.notes);
  const subjects = useAppStore((state) => state.subjects);
  const addNote = useAppStore((state) => state.addNote);
  const updateNote = useAppStore((state) => state.updateNote);
  const deleteNote = useAppStore((state) => state.deleteNote);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNote, setSelectedNote] = useState<string | null>(null);

  const getSubjectById = (id: string | null) => subjects.find((s) => s.id === id);

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedNotes = filteredNotes.filter((n) => n.isPinned);
  const otherNotes = filteredNotes.filter((n) => !n.isPinned);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Notes</h1>
          <p className="text-[var(--text-secondary)] mt-1">{notes.length} notes</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-md hover:bg-[var(--accent-hover)]">
          <Plus size={18} />
          New Note
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={18} />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
        </div>
      </div>

      {/* Pinned Notes */}
      {pinnedNotes.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-3">Pinned</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pinnedNotes.map((note) => {
              const subject = getSubjectById(note.subjectId);
              return (
                <div
                  key={note.id}
                  onClick={() => setSelectedNote(note.id)}
                  className={cn(
                    "p-4 bg-[var(--surface)] rounded-lg border border-[var(--border)] cursor-pointer hover:border-[var(--accent)] transition-colors",
                    selectedNote === note.id && 'ring-2 ring-[var(--accent)]'
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-[var(--text-primary)] truncate flex-1">{note.title}</h3>
                    <Pin size={14} className="text-[var(--accent)] flex-shrink-0 ml-2" />
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-3">{note.content}</p>
                  <div className="flex items-center justify-between">
                    {subject && (
                      <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: subject.color }} />
                        {subject.name}
                      </span>
                    )}
                    <span className="text-xs text-[var(--text-secondary)]">
                      {new Date(note.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* All Notes */}
      <div>
        <h2 className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-3">
          {pinnedNotes.length > 0 ? 'Other Notes' : 'All Notes'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {otherNotes.map((note) => {
            const subject = getSubjectById(note.subjectId);
            return (
              <div
                key={note.id}
                onClick={() => setSelectedNote(note.id)}
                className={cn(
                  "p-4 bg-[var(--surface)] rounded-lg border border-[var(--border)] cursor-pointer hover:border-[var(--accent)] transition-colors",
                  selectedNote === note.id && 'ring-2 ring-[var(--accent)]'
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-[var(--text-primary)] truncate flex-1">{note.title}</h3>
                  {note.isFavorite && <Star size={14} className="text-yellow-500 flex-shrink-0 ml-2" />}
                </div>
                <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-3">{note.content}</p>
                <div className="flex items-center justify-between">
                  {subject && (
                    <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: subject.color }} />
                      {subject.name}
                    </span>
                  )}
                  <span className="text-xs text-[var(--text-secondary)]">
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            );
          })}
          {otherNotes.length === 0 && pinnedNotes.length === 0 && (
            <div className="col-span-full text-center py-12 text-[var(--text-secondary)]">
              No notes found. Create your first note!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
