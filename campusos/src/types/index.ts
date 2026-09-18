// Core Types for CampusOS

export type Theme = 'light' | 'dark' | 'system';
export type Density = 'comfortable' | 'compact';
export type AccentColor = 'blue' | 'indigo' | 'teal' | 'emerald' | 'violet' | 'rose';

export interface Subject {
  id: string;
  name: string;
  teacher: string;
  room: string;
  color: string;
  icon?: string;
}

export type Priority = 'urgent' | 'high' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'in-progress' | 'completed';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  subjectId: string | null;
  dueDate: string | null;
  priority: Priority;
  status: TaskStatus;
  subtasks: Subtask[];
  estimatedMinutes: number | null;
  labels: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  allDay: boolean;
  categoryId: string | null;
  recurring?: 'daily' | 'weekly' | 'monthly';
}

export interface TimetableClass {
  id: string;
  subjectId: string;
  dayOfWeek: number; // 0-6, 0=Sunday
  startTime: string; // HH:mm format
  endTime: string;
  room: string;
  teacher: string;
}

export type FocusMode = 'focus' | 'short-break' | 'long-break';

export interface FocusSession {
  id: string;
  mode: FocusMode;
  durationMinutes: number;
  subjectId: string | null;
  taskId: string | null;
  startedAt: string;
  completedAt: string | null;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  subjectId: string | null;
  tags: string[];
  isFavorite: boolean;
  isArchived: boolean;
  isPinned: boolean;
  folderId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  deckId: string;
  mastery: number; // 0-5
  reviewCount: number;
  nextReview: string;
  createdAt: string;
}

export interface FlashcardDeck {
  id: string;
  name: string;
  subjectId: string | null;
  cardCount: number;
  lastStudied: string | null;
  mastery: number; // 0-100
}

export interface Assessment {
  id: string;
  subjectId: string;
  name: string;
  score: number;
  maxScore: number;
  weight: number; // percentage
  date: string;
}

export interface AttendanceRecord {
  id: string;
  subjectId: string;
  date: string;
  status: 'present' | 'late' | 'excused' | 'absent';
}

export interface Exam {
  id: string;
  subjectId: string;
  name: string;
  date: string;
  time: string;
  location: string;
  topics: string[];
  notes: string;
  confidence: number; // 1-5
  preparationProgress: number; // 0-100
}

export interface ProjectTask {
  id: string;
  projectId: string;
  title: string;
  assignee: string | null;
  status: 'backlog' | 'todo' | 'doing' | 'review' | 'done';
  priority: Priority;
  dueDate: string | null;
  subtasks: Subtask[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'on-hold';
  deadline: string;
  members: string[];
  progress: number; // 0-100
}

export interface Resource {
  id: string;
  title: string;
  subjectId: string | null;
  type: 'pdf' | 'presentation' | 'document' | 'link' | 'video' | 'website';
  url: string | null;
  description: string;
  tags: string[];
  isFavorite: boolean;
}

export interface Goal {
  id: string;
  title: string;
  category: 'academic' | 'study' | 'attendance' | 'other';
  target: number;
  current: number;
  unit: string;
  deadline: string | null;
  status: 'active' | 'completed' | 'archived';
}

export interface StudyPlan {
  id: string;
  examId: string;
  sessions: StudySession[];
  progress: number;
}

export interface StudySession {
  id: string;
  date: string;
  topic: string;
  durationMinutes: number;
  completed: boolean;
}

export interface UserProfile {
  name: string;
  school: string;
  gradeLevel: string;
  timezone: string;
}

export interface AppSettings {
  theme: Theme;
  density: Density;
  accentColor: AccentColor;
  sidebarCollapsed: boolean;
  semesterStart: string;
  semesterEnd: string;
  gradingScale: 'percentage' | 'gpa4' | 'gpa5';
  minAttendance: number;
  schoolDays: number[]; // [1,2,3,4,5] for Mon-Fri
  focusDuration: number;
  shortBreak: number;
  longBreak: number;
  dailyStudyTarget: number;
  notifications: {
    assignments: boolean;
    exams: boolean;
    study: boolean;
    flashcards: boolean;
  };
}

export interface DashboardConfig {
  widgets: {
    schedule: boolean;
    assignments: boolean;
    snapshot: boolean;
    weeklyStudy: boolean;
    exams: boolean;
    goals: boolean;
    focus: boolean;
  }[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface AppState {
  subjects: Subject[];
  tasks: Task[];
  events: CalendarEvent[];
  timetable: TimetableClass[];
  focusSessions: FocusSession[];
  notes: Note[];
  flashcardDecks: FlashcardDeck[];
  flashcards: Flashcard[];
  assessments: Assessment[];
  attendance: AttendanceRecord[];
  exams: Exam[];
  projects: Project[];
  projectTasks: ProjectTask[];
  resources: Resource[];
  goals: Goal[];
  studyPlans: StudyPlan[];
  profile: UserProfile;
  settings: AppSettings;
  dashboardConfig: DashboardConfig;
  notifications: Notification[];
  initialized: boolean;
}
