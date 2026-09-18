// CampusOS Store - Zustand State Management with Persistence

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Subject, Task, CalendarEvent, TimetableClass, FocusSession, Note, FlashcardDeck, Flashcard, Assessment, AttendanceRecord, Exam, Project, ProjectTask, Resource, Goal, AppSettings, UserProfile, DashboardConfig, AppState, Notification, StudyPlan } from '../types';
import { format, addDays } from 'date-fns';

// Sample data for initial state
const sampleSubjects: Subject[] = [
  { id: '1', name: 'Mathematics', teacher: 'Ms. Chen', room: 'A101', color: '#3B82F6' },
  { id: '2', name: 'Physics', teacher: 'Mr. Williams', room: 'B204', color: '#8B5CF6' },
  { id: '3', name: 'Biology', teacher: 'Dr. Patel', room: 'C305', color: '#10B981' },
  { id: '4', name: 'English', teacher: 'Mrs. Davis', room: 'A102', color: '#F59E0B' },
  { id: '5', name: 'History', teacher: 'Mr. Thompson', room: 'D401', color: '#EF4444' },
  { id: '6', name: 'Computer Science', teacher: 'Ms. Rivera', room: 'B201', color: '#06B6D4' },
];

const generateSampleTasks = (): Task[] => {
  const now = new Date();
  return [
    {
      id: '1',
      title: 'Physics Lab Report',
      description: 'Complete the analysis section and attach graphs from the pendulum experiment.',
      subjectId: '2',
      dueDate: format(addDays(now, 1), "yyyy-MM-dd'T'23:59"),
      priority: 'high',
      status: 'in-progress',
      subtasks: [
        { id: '1a', title: 'Collect data', completed: true },
        { id: '1b', title: 'Create graph', completed: true },
        { id: '1c', title: 'Write analysis', completed: false },
        { id: '1d', title: 'Final review', completed: false },
      ],
      estimatedMinutes: 120,
      labels: ['lab', 'report'],
      createdAt: format(addDays(now, -3), 'yyyy-MM-dd'),
      updatedAt: format(now, 'yyyy-MM-dd'),
    },
    {
      id: '2',
      title: 'English Essay Draft',
      description: 'First draft of the comparative literature essay.',
      subjectId: '4',
      dueDate: format(addDays(now, 4), "yyyy-MM-dd'T'23:59"),
      priority: 'medium',
      status: 'todo',
      subtasks: [],
      estimatedMinutes: 180,
      labels: ['essay', 'draft'],
      createdAt: format(addDays(now, -2), 'yyyy-MM-dd'),
      updatedAt: format(addDays(now, -1), 'yyyy-MM-dd'),
    },
    {
      id: '3',
      title: 'Biology Worksheet',
      description: 'Chapter 6 cellular respiration problems.',
      subjectId: '3',
      dueDate: format(addDays(now, 6), "yyyy-MM-dd'T'23:59"),
      priority: 'low',
      status: 'todo',
      subtasks: [],
      estimatedMinutes: 45,
      labels: ['homework'],
      createdAt: format(now, 'yyyy-MM-dd'),
      updatedAt: format(now, 'yyyy-MM-dd'),
    },
    {
      id: '4',
      title: 'Mathematics Problem Set',
      description: 'Calculus derivatives and integrals practice.',
      subjectId: '1',
      dueDate: format(addDays(now, 7), "yyyy-MM-dd'T'23:59"),
      priority: 'high',
      status: 'todo',
      subtasks: [],
      estimatedMinutes: 90,
      labels: ['homework', 'calculus'],
      createdAt: format(now, 'yyyy-MM-dd'),
      updatedAt: format(now, 'yyyy-MM-dd'),
    },
  ];
};

const generateSampleEvents = (): CalendarEvent[] => {
  const now = new Date();
  return [
    {
      id: '1',
      title: 'Physics Midterm Exam',
      description: 'Chapters 1-5: Kinematics, Forces, Energy',
      startDate: format(addDays(now, 20), "yyyy-MM-dd'T'09:00"),
      endDate: format(addDays(now, 20), "yyyy-MM-dd'T'11:00"),
      allDay: false,
      categoryId: '2',
    },
    {
      id: '2',
      title: 'Mathematics Chapter Test',
      description: 'Derivatives and applications',
      startDate: format(addDays(now, 26), "yyyy-MM-dd'T'10:00"),
      endDate: format(addDays(now, 26), "yyyy-MM-dd'T'11:30"),
      allDay: false,
      categoryId: '1',
    },
    {
      id: '3',
      title: 'English Presentation',
      description: 'Literary analysis presentation',
      startDate: format(addDays(now, 30), "yyyy-MM-dd'T'14:00"),
      endDate: format(addDays(now, 30), "yyyy-MM-dd'T'15:00"),
      allDay: false,
      categoryId: '4',
    },
  ];
};

const generateSampleTimetable = (): TimetableClass[] => {
  // Monday to Friday schedule
  return [
    { id: '1', subjectId: '1', dayOfWeek: 1, startTime: '07:30', endTime: '08:45', room: 'A101', teacher: 'Ms. Chen' },
    { id: '2', subjectId: '2', dayOfWeek: 1, startTime: '09:00', endTime: '10:15', room: 'B204', teacher: 'Mr. Williams' },
    { id: '3', subjectId: '4', dayOfWeek: 1, startTime: '10:30', endTime: '11:45', room: 'A102', teacher: 'Mrs. Davis' },
    { id: '4', subjectId: '6', dayOfWeek: 1, startTime: '13:00', endTime: '14:15', room: 'B201', teacher: 'Ms. Rivera' },
    
    { id: '5', subjectId: '3', dayOfWeek: 2, startTime: '07:30', endTime: '08:45', room: 'C305', teacher: 'Dr. Patel' },
    { id: '6', subjectId: '1', dayOfWeek: 2, startTime: '09:00', endTime: '10:15', room: 'A101', teacher: 'Ms. Chen' },
    { id: '7', subjectId: '5', dayOfWeek: 2, startTime: '10:30', endTime: '11:45', room: 'D401', teacher: 'Mr. Thompson' },
    { id: '8', subjectId: '2', dayOfWeek: 2, startTime: '13:00', endTime: '14:15', room: 'B204', teacher: 'Mr. Williams' },
    
    { id: '9', subjectId: '4', dayOfWeek: 3, startTime: '07:30', endTime: '08:45', room: 'A102', teacher: 'Mrs. Davis' },
    { id: '10', subjectId: '6', dayOfWeek: 3, startTime: '09:00', endTime: '10:15', room: 'B201', teacher: 'Ms. Rivera' },
    { id: '11', subjectId: '1', dayOfWeek: 3, startTime: '10:30', endTime: '11:45', room: 'A101', teacher: 'Ms. Chen' },
    { id: '12', subjectId: '3', dayOfWeek: 3, startTime: '13:00', endTime: '14:15', room: 'C305', teacher: 'Dr. Patel' },
    
    { id: '13', subjectId: '2', dayOfWeek: 4, startTime: '07:30', endTime: '08:45', room: 'B204', teacher: 'Mr. Williams' },
    { id: '14', subjectId: '5', dayOfWeek: 4, startTime: '09:00', endTime: '10:15', room: 'D401', teacher: 'Mr. Thompson' },
    { id: '15', subjectId: '4', dayOfWeek: 4, startTime: '10:30', endTime: '11:45', room: 'A102', teacher: 'Mrs. Davis' },
    { id: '16', subjectId: '1', dayOfWeek: 4, startTime: '13:00', endTime: '14:15', room: 'A101', teacher: 'Ms. Chen' },
    
    { id: '17', subjectId: '6', dayOfWeek: 5, startTime: '07:30', endTime: '08:45', room: 'B201', teacher: 'Ms. Rivera' },
    { id: '18', subjectId: '3', dayOfWeek: 5, startTime: '09:00', endTime: '10:15', room: 'C305', teacher: 'Dr. Patel' },
    { id: '19', subjectId: '2', dayOfWeek: 5, startTime: '10:30', endTime: '11:45', room: 'B204', teacher: 'Mr. Williams' },
    { id: '20', subjectId: '5', dayOfWeek: 5, startTime: '13:00', endTime: '14:15', room: 'D401', teacher: 'Mr. Thompson' },
  ];
};

const generateSampleAssessments = (): Assessment[] => {
  const now = new Date();
  return [
    { id: '1', subjectId: '1', name: 'Calculus Quiz', score: 18, maxScore: 20, weight: 10, date: format(addDays(now, -5), 'yyyy-MM-dd') },
    { id: '2', subjectId: '1', name: 'Algebra Test', score: 42, maxScore: 50, weight: 15, date: format(addDays(now, -12), 'yyyy-MM-dd') },
    { id: '3', subjectId: '2', name: 'Physics Lab', score: 87, maxScore: 100, weight: 15, date: format(addDays(now, -7), 'yyyy-MM-dd') },
    { id: '4', subjectId: '2', name: 'Mechanics Quiz', score: 24, maxScore: 30, weight: 10, date: format(addDays(now, -14), 'yyyy-MM-dd') },
    { id: '5', subjectId: '3', name: 'Biology Chapter 5', score: 45, maxScore: 50, weight: 12, date: format(addDays(now, -10), 'yyyy-MM-dd') },
    { id: '6', subjectId: '4', name: 'Essay Assignment', score: 88, maxScore: 100, weight: 20, date: format(addDays(now, -8), 'yyyy-MM-dd') },
    { id: '7', subjectId: '5', name: 'History Midterm', score: 78, maxScore: 100, weight: 25, date: format(addDays(now, -20), 'yyyy-MM-dd') },
    { id: '8', subjectId: '6', name: 'Programming Project', score: 95, maxScore: 100, weight: 30, date: format(addDays(now, -6), 'yyyy-MM-dd') },
  ];
};

const generateSampleAttendance = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const now = new Date();
  const subjects = ['1', '2', '3', '4', '5', '6'];
  
  subjects.forEach(subjectId => {
    for (let i = 0; i < 40; i++) {
      const date = format(addDays(now, -i), 'yyyy-MM-dd');
      const rand = Math.random();
      let status: 'present' | 'late' | 'excused' | 'absent' = 'present';
      if (rand > 0.95) status = 'absent';
      else if (rand > 0.92) status = 'late';
      else if (rand > 0.90) status = 'excused';
      
      records.push({
        id: `${subjectId}-${i}`,
        subjectId,
        date,
        status,
      });
    }
  });
  
  return records;
};

const generateSampleExams = (): Exam[] => {
  const now = new Date();
  return [
    {
      id: '1',
      subjectId: '2',
      name: 'Physics Midterm',
      date: format(addDays(now, 20), 'yyyy-MM-dd'),
      time: '09:00',
      location: 'Room B204',
      topics: ['Kinematics', 'Forces', 'Energy', 'Momentum'],
      notes: 'Review all lab experiments and problem sets.',
      confidence: 3.4,
      preparationProgress: 45,
    },
    {
      id: '2',
      subjectId: '1',
      name: 'Mathematics Chapter Test',
      date: format(addDays(now, 26), 'yyyy-MM-dd'),
      time: '10:00',
      location: 'Room A101',
      topics: ['Derivatives', 'Applications of Derivatives', 'Related Rates'],
      notes: 'Focus on word problems and optimization.',
      confidence: 4.0,
      preparationProgress: 60,
    },
    {
      id: '3',
      subjectId: '4',
      name: 'English Presentation',
      date: format(addDays(now, 30), 'yyyy-MM-dd'),
      time: '14:00',
      location: 'Room A102',
      topics: ['Literary Analysis', 'Public Speaking'],
      notes: 'Prepare slides and practice timing.',
      confidence: 2.8,
      preparationProgress: 30,
    },
  ];
};

const generateSampleFlashcardDecks = (): FlashcardDeck[] => {
  return [
    { id: '1', name: 'Biology - Cell Structure', subjectId: '3', cardCount: 24, lastStudied: null, mastery: 65 },
    { id: '2', name: 'Physics - Mechanics', subjectId: '2', cardCount: 18, lastStudied: null, mastery: 45 },
    { id: '3', name: 'English - Vocabulary', subjectId: '4', cardCount: 50, lastStudied: null, mastery: 78 },
    { id: '4', name: 'Computer Science - Algorithms', subjectId: '6', cardCount: 32, lastStudied: null, mastery: 52 },
  ];
};

const generateSampleFlashcards = (): Flashcard[] => {
  const cards: Flashcard[] = [
    { id: '1', question: 'What is the powerhouse of the cell?', answer: 'Mitochondria', deckId: '1', mastery: 4, reviewCount: 5, nextReview: format(new Date(), 'yyyy-MM-dd'), createdAt: format(new Date(), 'yyyy-MM-dd') },
    { id: '2', question: 'What is Newton\'s First Law?', answer: 'An object at rest stays at rest unless acted upon by an external force.', deckId: '2', mastery: 3, reviewCount: 3, nextReview: format(new Date(), 'yyyy-MM-dd'), createdAt: format(new Date(), 'yyyy-MM-dd') },
    { id: '3', question: 'Define metaphor.', answer: 'A figure of speech that directly compares two unrelated things.', deckId: '3', mastery: 5, reviewCount: 8, nextReview: format(addDays(new Date(), 7), 'yyyy-MM-dd'), createdAt: format(new Date(), 'yyyy-MM-dd') },
    { id: '4', question: 'What is Big O notation?', answer: 'A mathematical notation that describes the limiting behavior of a function.', deckId: '4', mastery: 2, reviewCount: 2, nextReview: format(new Date(), 'yyyy-MM-dd'), createdAt: format(new Date(), 'yyyy-MM-dd') },
  ];
  return cards;
};

const generateSampleProjects = (): Project[] => {
  const now = new Date();
  return [
    {
      id: '1',
      name: 'Economics Presentation',
      description: 'Group presentation on supply and demand.',
      status: 'in-progress',
      deadline: format(addDays(now, 14), 'yyyy-MM-dd'),
      members: ['Alex', 'Sarah', 'Daniel', 'Maya'],
      progress: 62,
    },
  ];
};

const generateSampleProjectTasks = (): ProjectTask[] => {
  return [
    { id: '1', projectId: '1', title: 'Research supply curves', assignee: 'Alex', status: 'done', priority: 'high', dueDate: null, subtasks: [] },
    { id: '2', projectId: '1', title: 'Create slides', assignee: 'Sarah', status: 'doing', priority: 'high', dueDate: null, subtasks: [] },
    { id: '3', projectId: '1', title: 'Practice presentation', assignee: 'Daniel', status: 'todo', priority: 'medium', dueDate: null, subtasks: [] },
    { id: '4', projectId: '1', title: 'Final review', assignee: 'Maya', status: 'backlog', priority: 'low', dueDate: null, subtasks: [] },
  ];
};

const generateSampleResources = (): Resource[] => {
  return [
    { id: '1', title: 'Physics Formula Sheet', subjectId: '2', type: 'pdf', url: null, description: 'Comprehensive formula reference', tags: ['formulas', 'reference'], isFavorite: true },
    { id: '2', title: 'MIT Introduction to Algorithms', subjectId: '6', type: 'video', url: 'https://ocw.mit.edu', description: 'Lecture series on algorithms', tags: ['algorithms', 'video'], isFavorite: false },
    { id: '3', title: 'Biology Chapter 6 Slides', subjectId: '3', type: 'presentation', url: null, description: 'Cellular respiration lecture slides', tags: ['biology', 'slides'], isFavorite: false },
    { id: '4', title: 'Calculus Reference Sheet', subjectId: '1', type: 'document', url: null, description: 'Key calculus concepts and formulas', tags: ['calculus', 'reference'], isFavorite: true },
  ];
};

const generateSampleGoals = (): Goal[] => {
  const now = new Date();
  return [
    { id: '1', title: 'Reach 90% mathematics average', category: 'academic', target: 90, current: 85, unit: '%', deadline: format(addDays(now, 60), 'yyyy-MM-dd'), status: 'active' },
    { id: '2', title: 'Study 8 hours this week', category: 'study', target: 480, current: 320, unit: 'minutes', deadline: format(addDays(now, 7), 'yyyy-MM-dd'), status: 'active' },
    { id: '3', title: 'Maintain attendance above 95%', category: 'attendance', target: 95, current: 94.6, unit: '%', deadline: null, status: 'active' },
  ];
};

const generateSampleNotes = (): Note[] => {
  const now = new Date();
  return [
    {
      id: '1',
      title: 'Newton\'s Laws',
      content: '# Newton\'s Laws of Motion\n\n## First Law\nAn object at rest stays at rest and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an unbalanced force.\n\n## Second Law\nThe acceleration of an object depends on the mass of the object and the amount of force applied.\n\n**Formula:** F = ma\n\n## Third Law\nWhenever one object exerts a force on a second object, the second object exerts an equal and opposite force on the first.',
      subjectId: '2',
      tags: ['physics', 'mechanics'],
      isFavorite: true,
      isArchived: false,
      isPinned: true,
      folderId: null,
      createdAt: format(addDays(now, -10), 'yyyy-MM-dd'),
      updatedAt: format(addDays(now, -2), 'yyyy-MM-dd'),
    },
    {
      id: '2',
      title: 'Cellular Respiration',
      content: '# Cellular Respiration\n\n## Overview\nProcess by which cells break down glucose to produce ATP.\n\n## Stages\n1. **Glycolysis** - occurs in cytoplasm\n2. **Krebs Cycle** - occurs in mitochondria\n3. **Electron Transport Chain** - produces most ATP\n\n## Equation\nC₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP',
      subjectId: '3',
      tags: ['biology', 'cells'],
      isFavorite: false,
      isArchived: false,
      isPinned: false,
      folderId: null,
      createdAt: format(addDays(now, -5), 'yyyy-MM-dd'),
      updatedAt: format(addDays(now, -1), 'yyyy-MM-dd'),
    },
    {
      id: '3',
      title: 'JavaScript Arrays',
      content: '# JavaScript Array Methods\n\n## Higher Order Functions\n\n### map()\nCreates a new array with results of calling a function on every element.\n\n```javascript\nconst doubled = numbers.map(n => n * 2);\n```\n\n### filter()\nCreates a new array with elements that pass a test.\n\n```javascript\nconst evens = numbers.filter(n => n % 2 === 0);\n```\n\n### reduce()\nReduces array to single value.\n\n```javascript\nconst sum = numbers.reduce((acc, n) => acc + n, 0);\n```',
      subjectId: '6',
      tags: ['javascript', 'programming'],
      isFavorite: true,
      isArchived: false,
      isPinned: false,
      folderId: null,
      createdAt: format(addDays(now, -3), 'yyyy-MM-dd'),
      updatedAt: format(now, 'yyyy-MM-dd'),
    },
  ];
};

const defaultSettings: AppSettings = {
  theme: 'system',
  density: 'comfortable',
  accentColor: 'blue',
  sidebarCollapsed: false,
  semesterStart: format(new Date(new Date().getFullYear(), 0, 15), 'yyyy-MM-dd'),
  semesterEnd: format(new Date(new Date().getFullYear(), 5, 15), 'yyyy-MM-dd'),
  gradingScale: 'percentage',
  minAttendance: 80,
  schoolDays: [1, 2, 3, 4, 5],
  focusDuration: 25,
  shortBreak: 5,
  longBreak: 15,
  dailyStudyTarget: 120,
  notifications: {
    assignments: true,
    exams: true,
    study: true,
    flashcards: true,
  },
};

const defaultProfile: UserProfile = {
  name: 'Alex Morgan',
  school: 'Westbridge Academy',
  gradeLevel: 'Grade 10',
  timezone: 'America/New_York',
};

const defaultDashboardConfig: DashboardConfig = {
  widgets: [
    { schedule: true, assignments: true, snapshot: true, weeklyStudy: true, exams: true, goals: true, focus: true },
  ],
};

const getInitialState = (): AppState => {
  const saved = localStorage.getItem('campusos-state');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.initialized) {
        return { ...parsed, initialized: true };
      }
    } catch (e) {
      console.error('Failed to parse saved state:', e);
    }
  }
  
  // Return fresh state with sample data
  return {
    subjects: sampleSubjects,
    tasks: generateSampleTasks(),
    events: generateSampleEvents(),
    timetable: generateSampleTimetable(),
    focusSessions: [],
    notes: generateSampleNotes(),
    flashcardDecks: generateSampleFlashcardDecks(),
    flashcards: generateSampleFlashcards(),
    assessments: generateSampleAssessments(),
    attendance: generateSampleAttendance(),
    exams: generateSampleExams(),
    projects: generateSampleProjects(),
    projectTasks: generateSampleProjectTasks(),
    resources: generateSampleResources(),
    goals: generateSampleGoals(),
    studyPlans: [],
    profile: defaultProfile,
    settings: defaultSettings,
    dashboardConfig: defaultDashboardConfig,
    notifications: [
      { id: '1', title: 'Physics assignment due tomorrow', message: 'Don\'t forget to submit your lab report.', type: 'warning' as const, read: false, createdAt: format(new Date(), 'yyyy-MM-dd') },
      { id: '2', title: 'Calculus exam in 6 days', message: 'Start reviewing derivatives and applications.', type: 'info' as const, read: false, createdAt: format(new Date(), 'yyyy-MM-dd') },
    ],
    initialized: true,
  };
};

interface AppStore extends AppState {
  // Subjects
  addSubject: (subject: Omit<Subject, 'id'>) => void;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  
  // Tasks
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskSubtask: (taskId: string, subtaskId: string) => void;
  
  // Events
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  
  // Timetable
  addTimetableClass: (class_: Omit<TimetableClass, 'id'>) => void;
  updateTimetableClass: (id: string, updates: Partial<TimetableClass>) => void;
  deleteTimetableClass: (id: string) => void;
  
  // Focus Sessions
  addFocusSession: (session: Omit<FocusSession, 'id' | 'startedAt'>) => void;
  completeFocusSession: (id: string) => void;
  
  // Notes
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  
  // Flashcards
  addFlashcardDeck: (deck: Omit<FlashcardDeck, 'id' | 'cardCount' | 'lastStudied' | 'mastery'>) => void;
  updateFlashcardDeck: (id: string, updates: Partial<FlashcardDeck>) => void;
  deleteFlashcardDeck: (id: string) => void;
  addFlashcard: (card: Omit<Flashcard, 'id' | 'mastery' | 'reviewCount' | 'nextReview' | 'createdAt'>) => void;
  updateFlashcard: (id: string, updates: Partial<Flashcard>) => void;
  deleteFlashcard: (id: string) => void;
  updateFlashcardMastery: (id: string, rating: 'again' | 'hard' | 'good' | 'easy') => void;
  
  // Assessments
  addAssessment: (assessment: Omit<Assessment, 'id'>) => void;
  updateAssessment: (id: string, updates: Partial<Assessment>) => void;
  deleteAssessment: (id: string) => void;
  
  // Attendance
  addAttendanceRecord: (record: Omit<AttendanceRecord, 'id'>) => void;
  updateAttendanceRecord: (id: string, updates: Partial<AttendanceRecord>) => void;
  deleteAttendanceRecord: (id: string) => void;
  
  // Exams
  addExam: (exam: Omit<Exam, 'id'>) => void;
  updateExam: (id: string, updates: Partial<Exam>) => void;
  deleteExam: (id: string) => void;
  
  // Projects
  addProject: (project: Omit<Project, 'id' | 'progress'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  // Project Tasks
  addProjectTask: (task: Omit<ProjectTask, 'id'>) => void;
  updateProjectTask: (id: string, updates: Partial<ProjectTask>) => void;
  deleteProjectTask: (id: string) => void;
  
  // Resources
  addResource: (resource: Omit<Resource, 'id'>) => void;
  updateResource: (id: string, updates: Partial<Resource>) => void;
  deleteResource: (id: string) => void;
  
  // Goals
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  
  // Settings
  updateSettings: (settings: Partial<AppSettings>) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  updateDashboardConfig: (config: DashboardConfig) => void;
  
  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;
  
  // Data management
  resetData: () => void;
  exportData: () => string;
  importData: (data: string) => boolean;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...getInitialState(),
      
      // Subjects
      addSubject: (subject) => set((state) => ({
        subjects: [...state.subjects, { ...subject, id: crypto.randomUUID() }]
      })),
      updateSubject: (id, updates) => set((state) => ({
        subjects: state.subjects.map(s => s.id === id ? { ...s, ...updates } : s)
      })),
      deleteSubject: (id) => set((state) => ({
        subjects: state.subjects.filter(s => s.id !== id)
      })),
      
      // Tasks
      addTask: (task) => set((state) => ({
        tasks: [...state.tasks, { 
          ...task, 
          id: crypto.randomUUID(),
          createdAt: format(new Date(), 'yyyy-MM-dd'),
          updatedAt: format(new Date(), 'yyyy-MM-dd')
        }]
      })),
      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates, updatedAt: format(new Date(), 'yyyy-MM-dd') } : t)
      })),
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter(t => t.id !== id)
      })),
      toggleTaskSubtask: (taskId, subtaskId) => set((state) => ({
        tasks: state.tasks.map(t => t.id === taskId ? {
          ...t,
          subtasks: t.subtasks.map(s => s.id === subtaskId ? { ...s, completed: !s.completed } : s),
          updatedAt: format(new Date(), 'yyyy-MM-dd')
        } : t)
      })),
      
      // Events
      addEvent: (event) => set((state) => ({
        events: [...state.events, { ...event, id: crypto.randomUUID() }]
      })),
      updateEvent: (id, updates) => set((state) => ({
        events: state.events.map(e => e.id === id ? { ...e, ...updates } : e)
      })),
      deleteEvent: (id) => set((state) => ({
        events: state.events.filter(e => e.id !== id)
      })),
      
      // Timetable
      addTimetableClass: (class_) => set((state) => ({
        timetable: [...state.timetable, { ...class_, id: crypto.randomUUID() }]
      })),
      updateTimetableClass: (id, updates) => set((state) => ({
        timetable: state.timetable.map(t => t.id === id ? { ...t, ...updates } : t)
      })),
      deleteTimetableClass: (id) => set((state) => ({
        timetable: state.timetable.filter(t => t.id !== id)
      })),
      
      // Focus Sessions
      addFocusSession: (session) => set((state) => ({
        focusSessions: [...state.focusSessions, { 
          ...session, 
          id: crypto.randomUUID(),
          startedAt: format(new Date(), 'yyyy-MM-dd HH:mm')
        }]
      })),
      completeFocusSession: (id) => set((state) => ({
        focusSessions: state.focusSessions.map(s => s.id === id ? { ...s, completedAt: format(new Date(), 'yyyy-MM-dd HH:mm') } : s)
      })),
      
      // Notes
      addNote: (note) => set((state) => ({
        notes: [...state.notes, { 
          ...note, 
          id: crypto.randomUUID(),
          createdAt: format(new Date(), 'yyyy-MM-dd'),
          updatedAt: format(new Date(), 'yyyy-MM-dd')
        }]
      })),
      updateNote: (id, updates) => set((state) => ({
        notes: state.notes.map(n => n.id === id ? { ...n, ...updates, updatedAt: format(new Date(), 'yyyy-MM-dd') } : n)
      })),
      deleteNote: (id) => set((state) => ({
        notes: state.notes.filter(n => n.id !== id)
      })),
      
      // Flashcards
      addFlashcardDeck: (deck) => set((state) => ({
        flashcardDecks: [...state.flashcardDecks, { 
          ...deck, 
          id: crypto.randomUUID(),
          cardCount: 0,
          lastStudied: null,
          mastery: 0
        }]
      })),
      updateFlashcardDeck: (id, updates) => set((state) => ({
        flashcardDecks: state.flashcardDecks.map(d => d.id === id ? { ...d, ...updates } : d)
      })),
      deleteFlashcardDeck: (id) => set((state) => ({
        flashcardDecks: state.flashcardDecks.filter(d => d.id !== id),
        flashcards: state.flashcards.filter(c => c.deckId !== id)
      })),
      addFlashcard: (card) => set((state) => ({
        flashcards: [...state.flashcards, {
          ...card,
          id: crypto.randomUUID(),
          mastery: 0,
          reviewCount: 0,
          nextReview: format(new Date(), 'yyyy-MM-dd'),
          createdAt: format(new Date(), 'yyyy-MM-dd')
        }],
        flashcardDecks: state.flashcardDecks.map(d => 
          d.id === card.deckId ? { ...d, cardCount: d.cardCount + 1 } : d
        )
      })),
      updateFlashcard: (id, updates) => set((state) => ({
        flashcards: state.flashcards.map(c => c.id === id ? { ...c, ...updates } : c)
      })),
      deleteFlashcard: (id) => set((state) => {
        const card = state.flashcards.find(c => c.id === id);
        return {
          flashcards: state.flashcards.filter(c => c.id !== id),
          flashcardDecks: card ? state.flashcardDecks.map(d => 
            d.id === card.deckId ? { ...d, cardCount: d.cardCount - 1 } : d
          ) : state.flashcardDecks
        };
      }),
      updateFlashcardMastery: (id, rating) => set((state) => {
        const card = state.flashcards.find(c => c.id === id);
        if (!card) return state;
        
        const masteryChanges = { again: -1, hard: 0, good: 1, easy: 2 };
        const dayChanges = { again: 0, hard: 1, good: 3, easy: 7 };
        
        const newMastery = Math.max(0, Math.min(5, card.mastery + (masteryChanges[rating] || 0)));
        const nextReview = format(addDays(new Date(), dayChanges[rating] || 1), 'yyyy-MM-dd');
        
        return {
          flashcards: state.flashcards.map(c => c.id === id ? {
            ...c,
            mastery: newMastery,
            reviewCount: c.reviewCount + 1,
            nextReview
          } : c),
          flashcardDecks: state.flashcardDecks.map(d => 
            d.id === card.deckId ? { ...d, lastStudied: format(new Date(), 'yyyy-MM-dd') } : d
          )
        };
      }),
      
      // Assessments
      addAssessment: (assessment) => set((state) => ({
        assessments: [...state.assessments, { ...assessment, id: crypto.randomUUID() }]
      })),
      updateAssessment: (id, updates) => set((state) => ({
        assessments: state.assessments.map(a => a.id === id ? { ...a, ...updates } : a)
      })),
      deleteAssessment: (id) => set((state) => ({
        assessments: state.assessments.filter(a => a.id !== id)
      })),
      
      // Attendance
      addAttendanceRecord: (record) => set((state) => ({
        attendance: [...state.attendance, { ...record, id: crypto.randomUUID() }]
      })),
      updateAttendanceRecord: (id, updates) => set((state) => ({
        attendance: state.attendance.map(r => r.id === id ? { ...r, ...updates } : r)
      })),
      deleteAttendanceRecord: (id) => set((state) => ({
        attendance: state.attendance.filter(r => r.id !== id)
      })),
      
      // Exams
      addExam: (exam) => set((state) => ({
        exams: [...state.exams, { ...exam, id: crypto.randomUUID() }]
      })),
      updateExam: (id, updates) => set((state) => ({
        exams: state.exams.map(e => e.id === id ? { ...e, ...updates } : e)
      })),
      deleteExam: (id) => set((state) => ({
        exams: state.exams.filter(e => e.id !== id)
      })),
      
      // Projects
      addProject: (project) => set((state) => ({
        projects: [...state.projects, { ...project, id: crypto.randomUUID(), progress: 0 }]
      })),
      updateProject: (id, updates) => set((state) => ({
        projects: state.projects.map(p => p.id === id ? { ...p, ...updates } : p)
      })),
      deleteProject: (id) => set((state) => ({
        projects: state.projects.filter(p => p.id !== id),
        projectTasks: state.projectTasks.filter(t => t.projectId !== id)
      })),
      
      // Project Tasks
      addProjectTask: (task) => set((state) => ({
        projectTasks: [...state.projectTasks, { ...task, id: crypto.randomUUID() }]
      })),
      updateProjectTask: (id, updates) => set((state) => {
        const newTasks = state.projectTasks.map(t => t.id === id ? { ...t, ...updates } : t);
        const projectId = newTasks.find(t => t.id === id)?.projectId;
        const project = state.projects.find(p => p.id === projectId);
        
        if (project) {
          const projectTaskList = newTasks.filter(t => t.projectId === projectId);
          const total = projectTaskList.length;
          const done = projectTaskList.filter(t => t.status === 'done').length;
          const progress = total > 0 ? Math.round((done / total) * 100) : 0;
          
          return {
            projectTasks: newTasks,
            projects: state.projects.map(p => p.id === projectId ? { ...p, progress } : p)
          };
        }
        
        return { projectTasks: newTasks };
      }),
      deleteProjectTask: (id) => set((state) => {
        const task = state.projectTasks.find(t => t.id === id);
        if (!task) return state;
        
        const newTasks = state.projectTasks.filter(t => t.id !== id);
        const projectTaskList = newTasks.filter(t => t.projectId === task.projectId);
        const total = projectTaskList.length;
        const done = projectTaskList.filter(t => t.status === 'done').length;
        const progress = total > 0 ? Math.round((done / total) * 100) : 0;
        
        return {
          projectTasks: newTasks,
          projects: state.projects.map(p => p.id === task.projectId ? { ...p, progress } : p)
        };
      }),
      
      // Resources
      addResource: (resource) => set((state) => ({
        resources: [...state.resources, { ...resource, id: crypto.randomUUID() }]
      })),
      updateResource: (id, updates) => set((state) => ({
        resources: state.resources.map(r => r.id === id ? { ...r, ...updates } : r)
      })),
      deleteResource: (id) => set((state) => ({
        resources: state.resources.filter(r => r.id !== id)
      })),
      
      // Goals
      addGoal: (goal) => set((state) => ({
        goals: [...state.goals, { ...goal, id: crypto.randomUUID() }]
      })),
      updateGoal: (id, updates) => set((state) => ({
        goals: state.goals.map(g => g.id === id ? { ...g, ...updates } : g)
      })),
      deleteGoal: (id) => set((state) => ({
        goals: state.goals.filter(g => g.id !== id)
      })),
      
      // Settings
      updateSettings: (settings) => set((state) => ({
        settings: { ...state.settings, ...settings }
      })),
      updateProfile: (profile) => set((state) => ({
        profile: { ...state.profile, ...profile }
      })),
      updateDashboardConfig: (config) => set((state) => ({
        dashboardConfig: config
      })),
      
      // Notifications
      markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
      })),
      markAllNotificationsRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, read: true }))
      })),
      deleteNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      })),
      
      // Data management
      resetData: () => set(() => getInitialState()),
      exportData: () => {
        const state = get();
        return JSON.stringify(state, null, 2);
      },
      importData: (data: string) => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.initialized) {
            set(() => parsed);
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },
    }),
    {
      name: 'campusos-state',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => {
        // Only persist non-derived state
        const { initialized, ...rest } = state;
        return { ...rest, initialized: true };
      },
    }
  )
);
