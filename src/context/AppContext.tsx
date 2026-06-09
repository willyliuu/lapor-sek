'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type IssueCategory = 'road_damage' | 'flooding' | 'lighting' | 'waste' | 'facility' | 'other';
export type IssueStatus = 'open' | 'in_progress' | 'resolved';

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  created_at: string;
  latitude: number;
  longitude: number;
  address: string;
  upvote_count: number;
  photo_url?: string;
  is_flagged?: boolean;
}

interface AppContextType {
  issues: Issue[];
  addIssue: (issue: Omit<Issue, 'id' | 'created_at' | 'upvote_count' | 'status'>) => void;
  upvoteIssue: (id: string) => void;
  hasUpvoted: (id: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_MOCK_ISSUES: Issue[] = [
  {
    id: '1',
    title: 'Severe flooding on Jl. Sudirman near intersection',
    description: "There is a severe flooding in the right lane going northbound on Main Street/Jl. Sudirman, just past the intersection with 4th Avenue. It's approximately 2 feet deep. Several cars have hit it and I've seen at least one driver pull over to check their tires.",
    category: 'flooding',
    status: 'open',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    latitude: -6.2088,
    longitude: 106.8456,
    address: 'Jl. Jend. Sudirman No.21, RT.10/RW.11, Kuningan, Jakarta Selatan',
    upvote_count: 24,
    photo_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxyYr5SdM2Wy9dSFIpmt8ZrMKD67VFLsOF1UOhSlxfiBWD8gbklX9goILB2IFg6mIuoA2z9jmSH7avUwoX_POY3z6EECf_GonTV7uTBP9oBvkVOUoT-4D81AMkQTr56mJoP86T7nQBOK_ykoPpTkspD7vi6oa-4QKslNWQak4PTB6rCgs75sHmdOBggvYiNv6n-csO8RNcKyc4LdrpjkU2VR_Ue7tY0FMzp0DpjKyfgOdDWVwKpvRmgBWseTrj1FvBKsEeKJYTNXG3',
  },
  {
    id: '2',
    title: 'Overflowing dumpster spreading debris onto sidewalk',
    description: 'A photograph showing a heavily overflowing green public garbage bin on a busy urban sidewalk. Trash bags and loose debris are piled high and spilling onto the concrete pavement.',
    category: 'waste',
    status: 'open',
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    latitude: -6.2120,
    longitude: 106.8500,
    address: 'Jl. HR Rasuna Said, Kuningan Timur, Jakarta Selatan',
    upvote_count: 42,
    photo_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVv7kB1u2q5MtmLcIQSdTcy32ZwYDrDlVQuK5FQ9cuZ87mCM6ZIAOUJZNEDIH7KbnFpbjHhFpmtHIHCVvEin8KZilEY-nIbwVd9nn8HB7bjRVdGc1OzxuqIPlnDQ7Oa_NkGGrd1SgQUo1hoFYgORFnKcVEOXPhsbKYvt2ADhUQj5qt0_TlPtZqg8g5SajSA-5C25GODw8tbln9-6MJZv0Dsi1rT0_QvY8IowIHWQW5T_bOJTihgFtAIuZ8nL8JgwdAiVHf2qsZU5y8',
  },
  {
    id: '3',
    title: 'Severe pothole causing traffic hazard',
    description: 'A significant, deep pothole in a cracked asphalt road surface. The edges of the pothole are jagged, and the interior shows loose gravel and dirt.',
    category: 'road_damage',
    status: 'in_progress',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    latitude: -6.2050,
    longitude: 106.8380,
    address: 'Jl. Gatot Subroto, Menteng Dalam, Tebet, Jakarta Selatan',
    upvote_count: 128,
    photo_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNospir87ZDV1l6SNWURU7Vl5bzVQWfWBn2EDH5wBIb5y1BHSfQ5y2d7fo5q_23adHpmhFj1ulczym3AHFLg3tELATORQxvu6BQyZ7HmfRtv6SKCBrFwKTHH6jUXEr3FIQbRgd2GNDL3GVAqSaAvtaTm1xxTZB4qbCfE8GYq5TphgHAxEY4pOIF2X3hCT7GAUAXX0rlUnKEfj_lhmUnhdj53AF71mJHHdbTwuxGeD-K4g3n1IuB2FbgmkFDs_EWzdlUy0wMqBNpMEA',
  },
  {
    id: '4',
    title: 'Streetlight out for three consecutive nights',
    description: 'The street lamp is completely dead. This street section is very dark and dangerous for pedestrians at night.',
    category: 'lighting',
    status: 'open',
    created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2 days ago
    latitude: -6.2180,
    longitude: 106.8410,
    address: 'Jl. Satrio, Karet Semanggi, Setiabudi, Jakarta Selatan',
    upvote_count: 15,
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [upvotedIssues, setUpvotedIssues] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load issues
    const stored = localStorage.getItem('laporsek_issues');
    if (stored) {
      setIssues(JSON.parse(stored));
    } else {
      setIssues(INITIAL_MOCK_ISSUES);
      localStorage.setItem('laporsek_issues', JSON.stringify(INITIAL_MOCK_ISSUES));
    }

    // Load upvoted tracking
    const storedVotes = localStorage.getItem('laporsek_votes');
    if (storedVotes) {
      setUpvotedIssues(JSON.parse(storedVotes));
    }

    setIsLoaded(true);
  }, []);

  const addIssue = (newIssue: Omit<Issue, 'id' | 'created_at' | 'upvote_count' | 'status'>) => {
    const issueToCreate: Issue = {
      ...newIssue,
      id: Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString(),
      upvote_count: 0,
      status: 'open',
    };

    const updated = [issueToCreate, ...issues];
    setIssues(updated);
    localStorage.setItem('laporsek_issues', JSON.stringify(updated));
  };

  const upvoteIssue = (id: string) => {
    if (upvotedIssues.includes(id)) return; // prevent duplicate votes in session

    const updatedIssues = issues.map((issue) => {
      if (issue.id === id) {
        return { ...issue, upvote_count: issue.upvote_count + 1 };
      }
      return issue;
    });

    setIssues(updatedIssues);
    localStorage.setItem('laporsek_issues', JSON.stringify(updatedIssues));

    const updatedVotes = [...upvotedIssues, id];
    setUpvotedIssues(updatedVotes);
    localStorage.setItem('laporsek_votes', JSON.stringify(updatedVotes));
  };

  const hasUpvoted = (id: string) => upvotedIssues.includes(id);

  if (!isLoaded) {
    return null; // Prevent hydration mismatch by wait loading
  }

  return (
    <AppContext.Provider value={{ issues, addIssue, upvoteIssue, hasUpvoted }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
