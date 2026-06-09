'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Filter, Search, Plus, RotateCcw } from 'lucide-react';
import { useApp, IssueCategory } from '@/context/AppContext';
import { DynamicMap } from '@/components/DynamicMap';

const CATEGORY_LABELS: Record<IssueCategory, string> = {
  road_damage: 'Road Damage',
  flooding: 'Flooding',
  waste: 'Waste Management',
  lighting: 'Street Lighting',
  facility: 'Public Facility',
  other: 'Other',
};

const CATEGORY_DOT_COLORS: Record<IssueCategory, string> = {
  road_damage: 'bg-cat-road',
  flooding: 'bg-cat-flood',
  waste: 'bg-cat-waste',
  lighting: 'bg-cat-light',
  facility: 'bg-cat-facility',
  other: 'bg-cat-other',
};

export default function Home() {
  const { issues } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<IssueCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);

  // Filter issues based on criteria
  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const matchCategory = selectedCategory === 'all' || issue.category === selectedCategory;
      const matchSearch =
        issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [issues, selectedCategory, searchQuery]);

  const hasActiveFilters = selectedCategory !== 'all' || searchQuery !== '';

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setShowSearchInput(false);
  };

  return (
    <main className="relative flex-1 w-full bg-surface-dim h-[calc(100vh-64px)] overflow-hidden flex flex-col">
      {/* Map Container */}
      <div className="absolute inset-0 w-full h-full">
        <DynamicMap issues={filteredIssues} interactive={true} />
      </div>

      {/* Floating Header / Floating Filter Bar - Level 2 Elevation */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 w-[90%] sm:w-auto max-w-2xl">
        <div className="flex items-center gap-3 px-4 py-2 w-full bg-white/95 backdrop-blur-md rounded-full shadow-md elevation-2 border border-outline-variant/30 transition-all duration-300">
          <div className="flex items-center gap-2 pl-1 border-r border-outline-variant/50 pr-3 shrink-0">
            <Filter className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold text-on-surface hidden sm:block">Filter Issues</span>
          </div>

          {/* Horizontal Category Scroll (Tailwind v4 flex-1 overflow-x-auto) */}
          <div className="flex-1 flex gap-1.5 items-center overflow-x-auto no-scrollbar py-0.5 select-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedCategory === 'all'
                  ? 'bg-primary-container border-primary text-primary-fixed'
                  : 'bg-white border-outline-variant text-on-surface-variant hover:bg-surface-variant/30'
              }`}
            >
              All
            </button>
            {(Object.keys(CATEGORY_LABELS) as IssueCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all border ${
                  selectedCategory === cat
                    ? 'bg-primary-container border-primary text-primary-fixed'
                    : 'bg-white border-outline-variant text-on-surface-variant hover:bg-surface-variant/30'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${CATEGORY_DOT_COLORS[cat]}`} />
                <span>{CATEGORY_LABELS[cat]}</span>
              </button>
            ))}
          </div>

          {/* Search Trigger */}
          <div className="flex items-center shrink-0 border-l border-outline-variant/50 pl-3">
            <button
              onClick={() => setShowSearchInput(!showSearchInput)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                showSearchInput || searchQuery 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-on-surface-variant hover:bg-surface-variant/40'
              }`}
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Expandable Search Input */}
        {showSearchInput && (
          <div className="w-full max-w-sm bg-white/95 backdrop-blur-md rounded-full shadow-md border border-outline-variant/30 px-4 py-1.5 flex items-center transition-all duration-300">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search issue title/desc..."
              className="w-full bg-transparent text-xs text-on-surface focus:outline-none placeholder:text-outline"
              autoFocus
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="text-[10px] text-on-surface-variant font-bold hover:text-primary px-1"
              >
                Clear
              </button>
            )}
          </div>
        )}

        {/* Reset Filters Prompt */}
        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1 bg-white/90 backdrop-blur px-3 py-1 rounded-full border border-outline-variant shadow-sm text-[10px] font-bold text-primary hover:bg-primary/5 transition-all"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset filters ({filteredIssues.length} issues found)</span>
          </button>
        )}
      </div>

      {/* Floating Action Button (FAB) - Mobile only */}
      <div className="md:hidden absolute bottom-6 right-6 z-30">
        <Link
          href="?submit=true"
          scroll={false}
          className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-on-primary-fixed-variant transition-colors hover:scale-105 active:scale-95 elevation-2"
        >
          <Plus className="w-6 h-6" />
        </Link>
      </div>
    </main>
  );
}
