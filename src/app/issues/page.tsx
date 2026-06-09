'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { MapPin, ThumbsUp, Calendar, Filter, Search, RotateCcw, AlertTriangle, Trash2, Lightbulb, HelpCircle, Eye } from 'lucide-react';
import { useApp, Issue, IssueCategory, IssueStatus } from '@/context/AppContext';

const CATEGORY_LABELS: Record<IssueCategory, string> = {
  road_damage: 'Road Damage',
  flooding: 'Flooding',
  waste: 'Waste Management',
  lighting: 'Street Lighting',
  facility: 'Public Facility',
  other: 'Other',
};

const CATEGORY_COLORS: Record<IssueCategory, string> = {
  road_damage: 'bg-cat-road text-white',
  flooding: 'bg-cat-flood text-white',
  waste: 'bg-cat-waste text-white',
  lighting: 'bg-cat-light text-on-tertiary-fixed',
  facility: 'bg-cat-facility text-white',
  other: 'bg-cat-other text-white',
};

const CATEGORY_DOT_COLORS: Record<IssueCategory, string> = {
  road_damage: 'bg-cat-road',
  flooding: 'bg-cat-flood',
  waste: 'bg-cat-waste',
  lighting: 'bg-cat-light',
  facility: 'bg-cat-facility',
  other: 'bg-cat-other',
};

const STATUS_LABELS: Record<IssueStatus, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
};

const STATUS_CLASSES: Record<IssueStatus, string> = {
  open: 'bg-status-open/10 border-status-open/30 text-status-open',
  in_progress: 'bg-status-progress/10 border-status-progress/30 text-status-progress',
  resolved: 'bg-status-resolved/10 border-status-resolved/30 text-status-resolved',
};

export default function IssuesListPage() {
  const { issues, upvoteIssue, hasUpvoted } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<IssueCategory | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<IssueStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'upvotes'>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Filter & Sort
  const filteredAndSortedIssues = useMemo(() => {
    let result = issues.filter((issue) => {
      const matchCategory = selectedCategory === 'all' || issue.category === selectedCategory;
      const matchStatus = selectedStatus === 'all' || issue.status === selectedStatus;
      const matchSearch =
        issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.address.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchCategory && matchStatus && matchSearch;
    });

    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else {
      result.sort((a, b) => b.upvote_count - a.upvote_count);
    }

    return result;
  }, [issues, selectedCategory, selectedStatus, sortBy, searchQuery]);

  const hasActiveFilters = selectedCategory !== 'all' || selectedStatus !== 'all' || searchQuery !== '';

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedStatus('all');
    setSearchQuery('');
    setShowSearch(false);
  };

  // Helper to format date
  const formatTimeAgo = (dateStr: string) => {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHrs < 1) return 'Just now';
    if (diffHrs < 24) return `${diffHrs} hours ago`;
    const diffDays = Math.floor(diffHrs / 24);
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  };

  return (
    <main className="flex-grow w-full max-w-max-width-content mx-auto px-margin-mobile md:px-margin-desktop py-8 flex flex-col gap-6">
      
      {/* Search / Filter Controls Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border border-outline-variant shadow-sm">
        
        {/* Left: Category and Status Filters */}
        <div className="w-full md:w-auto overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-3 min-w-max">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-on-surface mr-2">
              <Filter className="w-3.5 h-3.5 text-outline" />
              <span>Filter Issues:</span>
            </div>

            {/* Category selection */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as IssueCategory | 'all')}
              className="px-3 py-1 bg-white border border-outline-variant rounded-full text-xs font-semibold text-on-surface-variant focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="all">All Categories</option>
              {(Object.keys(CATEGORY_LABELS) as IssueCategory[]).map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_LABELS[cat]}
                </option>
              ))}
            </select>

            {/* Status selection */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as IssueStatus | 'all')}
              className="px-3 py-1 bg-white border border-outline-variant rounded-full text-xs font-semibold text-on-surface-variant focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="all">All Statuses</option>
              {(Object.keys(STATUS_LABELS) as IssueStatus[]).map((status) => (
                <option key={status} value={status}>
                  {STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: Search Input & Sorting */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          
          {/* Sorting */}
          <div className="flex items-center gap-1.5 bg-surface-variant/30 rounded-lg p-1">
            <button
              onClick={() => setSortBy('newest')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                sortBy === 'newest'
                  ? 'bg-white text-on-surface shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Newest
            </button>
            <button
              onClick={() => setSortBy('upvotes')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                sortBy === 'upvotes'
                  ? 'bg-white text-on-surface shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Most Upvoted
            </button>
          </div>

          {/* Search Trigger */}
          <div className="relative">
            {showSearch ? (
              <div className="flex items-center gap-1 border border-outline-variant rounded-lg px-2 py-1 bg-white">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search issues..."
                  className="bg-transparent text-xs text-on-surface focus:outline-none placeholder:text-outline w-32"
                  autoFocus
                />
                <button 
                  onClick={() => {
                    setShowSearch(false);
                    setSearchQuery('');
                  }}
                  className="text-[10px] font-bold text-on-surface-variant"
                >
                  Close
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSearch(true)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-variant/40 hover:text-primary transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Reset Filter Banner */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between bg-primary-fixed/10 border border-primary/20 px-4 py-2.5 rounded-xl">
          <span className="text-xs text-on-surface-variant font-medium">
            Active filters: <strong>{filteredAndSortedIssues.length}</strong> matching issues found.
          </span>
          <button
            onClick={handleResetFilters}
            className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset all filters
          </button>
        </div>
      )}

      {/* Issues Grid */}
      {filteredAndSortedIssues.length > 0 ? (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedIssues.map((issue) => {
            const hasVoted = hasUpvoted(issue.id);
            return (
              <article
                key={issue.id}
                className="bg-white rounded-xl border border-outline-variant overflow-hidden hover:shadow-md transition-all group flex flex-col h-full"
              >
                {/* Image block */}
                <div className="h-48 w-full bg-surface-variant/35 relative overflow-hidden flex items-center justify-center">
                  {issue.photo_url ? (
                    <img
                      src={issue.photo_url}
                      alt={issue.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-1 text-outline-variant">
                      <HelpCircle className="w-10 h-10" />
                      <span className="text-[10px]">No Photo Provided</span>
                    </div>
                  )}

                  {/* Top floating chips */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 shadow-sm backdrop-blur-sm ${CATEGORY_COLORS[issue.category]}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      {CATEGORY_LABELS[issue.category]}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border shadow-sm backdrop-blur-md ${STATUS_CLASSES[issue.status]}`}>
                      {STATUS_LABELS[issue.status].toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Content Block */}
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-semibold text-base text-on-surface line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                    {issue.title}
                  </h3>

                  <div className="flex items-start gap-1.5 text-on-surface-variant mt-3 mb-4 flex-grow">
                    <MapPin className="w-4 h-4 shrink-0 text-outline-variant mt-0.5" />
                    <p className="text-xs line-clamp-2">{issue.address}</p>
                  </div>

                  {/* Footer details */}
                  <div className="flex items-center justify-between pt-4 border-t border-outline-variant/40">
                    <div className="flex items-center gap-1 text-on-surface-variant text-xs">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatTimeAgo(issue.created_at)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link 
                        href={`/issues/${issue.id}`}
                        className="p-2 border border-outline-variant rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-all"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      
                      <button
                        onClick={() => upvoteIssue(issue.id)}
                        disabled={hasVoted}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                          hasVoted
                            ? 'bg-primary-container border-primary text-primary-fixed shadow-sm'
                            : 'border-outline-variant hover:bg-surface-variant/50 text-on-surface'
                        }`}
                        title={hasVoted ? 'You have upvoted this' : 'Upvote this issue'}
                      >
                        <ThumbsUp className={`w-4 h-4 ${hasVoted ? 'fill-current' : ''}`} />
                        <span className="text-xs font-semibold">{issue.upvote_count}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        <section className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-outline-variant py-20">
          <AlertTriangle className="w-12 h-12 text-outline-variant mb-3" />
          <h3 className="font-semibold text-lg text-on-surface">No Issues Found</h3>
          <p className="text-xs text-on-surface-variant mt-1 max-w-sm">
            Try adjusting your search query, selecting different filter categories/statuses, or report a new issue!
          </p>
        </section>
      )}

      {/* Load More Button */}
      {filteredAndSortedIssues.length > 0 && (
        <div className="flex justify-center mt-6">
          <button className="px-6 h-touch-target rounded-full border border-outline-variant bg-white text-on-surface font-semibold text-xs hover:bg-surface-variant/40 transition-colors shadow-sm">
            Load More Issues
          </button>
        </div>
      )}
    </main>
  );
}
