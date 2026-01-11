import { Note, Bundle } from '../types';

// Helper to generate mock notes
const generateMockNotes = (count: number): Note[] => {
  const subjects = ['Computer Science', 'Mathematics', 'Physics', 'Electronics', 'Economics'];
  const colleges = ['IIT Delhi', 'BITS Pilani', 'IIT Bombay', 'NIT Trichy', 'Anna University'];
  const tagsList = [['Popular'], ['New'], ['Verified'], ['Best Seller'], []];
  
  return Array.from({ length: count }).map((_, i) => ({
    id: `mock-${i}`,
    title: `${subjects[i % subjects.length]} - Chapter ${i + 1} Complete Notes`,
    description: `Comprehensive handwritten notes covering unit ${i + 1} with solved examples and previous year questions.`,
    college: colleges[i % colleges.length],
    course: 'B.Tech',
    semester: String((i % 8) + 1),
    subject: subjects[i % subjects.length],
    price: i % 3 === 0 ? 0 : (i + 1) * 50,
    isFree: i % 3 === 0,
    fileUrl: 'placeholder',
    tags: tagsList[i % tagsList.length],
    // Simulating a document preview with a placeholder image service
    previewUrl: `https://placehold.co/400x300/e2e8f0/1e293b?text=Preview+Page+1&font=roboto`
  }));
};

// Initial Mock Data to seed LocalStorage if empty
const INITIAL_NOTES: Note[] = [
  ...generateMockNotes(24) // Generate 24 notes for scrolling
];

const INITIAL_BUNDLES: Bundle[] = [
  {
    id: 'b1',
    title: 'CS Semester 3 Complete Pack',
    description: 'All notes for semester 3 including DSA and Architecture.',
    price: 999,
    noteIds: ['mock-0', 'mock-5']
  }
];

export const getLS = <T>(key: string, initial: T): T => {
  const saved = localStorage.getItem(key);
  if (saved) return JSON.parse(saved);
  localStorage.setItem(key, JSON.stringify(initial));
  return initial;
};

// Seeding data initially
getLS('notes', INITIAL_NOTES);
getLS('bundles', INITIAL_BUNDLES);
