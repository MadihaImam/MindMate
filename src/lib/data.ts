export type UserProfile = {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'professional' | 'enterprise';
  createdAt: string;
}

export type SavedItem = {
  id: string;
  userId: string;
  type: 'summary' | 'rewrite' | 'keywords' | 'humanize' | 'generate';
  title: string;
  content: string;
  createdAt: string; // Should be ISO string
  favorite: boolean;
};

export type Feedback = {
  id: string;
  userId: string;
  email: string;
  feedback: string;
  createdAt: string;
}

// This mock data is now only for reference and will not be displayed in the app.
// The dashboard now fetches live data from Firestore.
export const savedItems: SavedItem[] = [
  {
    id: '1',
    userId: 'mock-user-1',
    type: 'summary',
    title: 'The Future of AI',
    content: 'Artificial intelligence is rapidly evolving, with new breakthroughs in machine learning and neural networks that promise to reshape industries and daily life. Key areas of development include natural language processing, computer vision, and autonomous systems.',
    createdAt: '2024-07-29T10:00:00Z',
    favorite: true,
  },
  {
    id: '2',
    userId: 'mock-user-1',
    type: 'rewrite',
    title: 'Marketing Email - Casual',
    content: 'Hey team, just wanted to give you a heads-up about the new campaign. It\'s looking awesome and I can\'t wait for everyone to see the hard work we\'ve put in. Let\'s make this launch a huge success!',
    createdAt: '2024-07-28T11:00:00Z',
    favorite: false,
  },
];