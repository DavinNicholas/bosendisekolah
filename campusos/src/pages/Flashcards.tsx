import { useState } from 'react';
import { useAppStore } from '../store';
import { Plus, Brain, ChevronRight, RotateCcw } from 'lucide-react';
import { cn } from '../utils/helpers';

export default function Flashcards() {
  const decks = useAppStore((state) => state.flashcardDecks);
  const cards = useAppStore((state) => state.flashcards);
  const subjects = useAppStore((state) => state.subjects);
  const [studyingDeckId, setStudyingDeckId] = useState<string | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const getSubjectById = (id: string | null) => subjects.find((s) => s.id === id);

  if (studyingDeckId) {
    const deckCards = cards.filter((c) => c.deckId === studyingDeckId);
    const currentCard = deckCards[currentCardIndex];

    if (!currentCard) {
      return (
        <div className="max-w-2xl mx-auto text-center py-12">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">All done!</h2>
          <p className="text-[var(--text-secondary)] mb-4">You've reviewed all cards in this deck.</p>
          <button
            onClick={() => { setStudyingDeckId(null); setCurrentCardIndex(0); }}
            className="px-4 py-2 bg-[var(--accent)] text-white rounded-md"
          >
            Back to Decks
          </button>
        </div>
      );
    }

    return (
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => { setStudyingDeckId(null); setCurrentCardIndex(0); setShowAnswer(false); }}
          className="mb-4 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          ← Back to Decks
        </button>
        
        <div className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-[var(--text-secondary)]">
              Card {currentCardIndex + 1} of {deckCards.length}
            </span>
          </div>

          <div
            onClick={() => setShowAnswer(!showAnswer)}
            className="min-h-[300px] flex flex-col items-center justify-center p-8 bg-[var(--surface-secondary)] rounded-lg border border-[var(--border)] cursor-pointer mb-6"
          >
            <div className="text-center">
              <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mb-4">
                {showAnswer ? 'Answer' : 'Question'}
              </div>
              <div className="text-2xl text-[var(--text-primary)]">
                {showAnswer ? currentCard.answer : currentCard.question}
              </div>
              <div className="mt-4 text-sm text-[var(--text-secondary)]">
                Click to {showAnswer ? 'hide' : 'reveal'} answer
              </div>
            </div>
          </div>

          {showAnswer && (
            <div className="grid grid-cols-4 gap-2">
              {['Again', 'Hard', 'Good', 'Easy'].map((rating) => (
                <button
                  key={rating}
                  onClick={() => {
                    setShowAnswer(false);
                    setCurrentCardIndex((prev) => Math.min(prev + 1, deckCards.length));
                  }}
                  className={cn(
                    "py-3 rounded-md text-sm font-medium transition-colors",
                    rating === 'Again' ? 'bg-red-100 text-red-700 dark:bg-red-900/30' :
                    rating === 'Hard' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30' :
                    rating === 'Good' ? 'bg-green-100 text-green-700 dark:bg-green-900/30' :
                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30'
                  )}
                >
                  {rating}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Flashcards</h1>
          <p className="text-[var(--text-secondary)] mt-1">{decks.length} decks</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-md hover:bg-[var(--accent-hover)]">
          <Plus size={18} />
          New Deck
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {decks.map((deck) => {
          const subject = getSubjectById(deck.subjectId);
          return (
            <div
              key={deck.id}
              className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Brain className="text-[var(--accent)]" size={20} />
                  <h3 className="font-medium text-[var(--text-primary)]">{deck.name}</h3>
                </div>
              </div>
              
              {subject && (
                <div className="flex items-center gap-1 text-sm text-[var(--text-secondary)] mb-3">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: subject.color }} />
                  {subject.name}
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-secondary)]">{deck.cardCount} cards</span>
                <span className="text-[var(--text-secondary)]">{deck.mastery}% mastery</span>
              </div>

              <div className="mt-3 h-2 bg-[var(--surface-secondary)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--accent)] rounded-full"
                  style={{ width: `${deck.mastery}%` }}
                />
              </div>

              <button
                onClick={() => setStudyingDeckId(deck.id)}
                className="w-full mt-4 py-2 bg-[var(--surface-secondary)] text-[var(--text-primary)] rounded-md hover:bg-[var(--accent)] hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                Study
                <ChevronRight size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
