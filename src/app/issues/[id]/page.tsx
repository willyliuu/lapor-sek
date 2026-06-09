'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, ThumbsUp, Share2, Flag, HelpCircle, Eye } from 'lucide-react';
import { useApp, IssueCategory, IssueStatus } from '@/context/AppContext';
import { DynamicMap } from '@/components/DynamicMap';

const CATEGORY_LABELS: Record<IssueCategory, string> = {
  road_damage: 'Road Damage',
  flooding: 'Flooding',
  waste: 'Waste Management',
  lighting: 'Street Lighting',
  facility: 'Public Facility',
  other: 'Other',
};

const CATEGORY_COLORS: Record<IssueCategory, string> = {
  road_damage: 'bg-cat-road text-white border-cat-road/20',
  flooding: 'bg-cat-flood text-white border-cat-flood/20',
  waste: 'bg-cat-waste text-white border-cat-waste/20',
  lighting: 'bg-cat-light text-on-tertiary-fixed border-cat-light/20',
  facility: 'bg-cat-facility text-white border-cat-facility/20',
  other: 'bg-cat-other text-white border-cat-other/20',
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
  open: 'bg-status-open/10 border-status-open/20 text-status-open',
  in_progress: 'bg-status-progress/10 border-status-progress/20 text-status-progress',
  resolved: 'bg-status-resolved/10 border-status-resolved/20 text-status-resolved',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function IssueDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { issues, upvoteIssue, hasUpvoted } = useApp();
  const [copied, setCopied] = useState(false);

  const issue = issues.find((i) => i.id === resolvedParams.id);
  const hasVoted = issue ? hasUpvoted(issue.id) : false;

  if (!issue) {
    return (
      <main className="flex-grow w-full max-w-max-width-content mx-auto px-margin-mobile md:px-margin-desktop py-12 flex flex-col items-center justify-center text-center">
        <h2 className="text-xl font-bold text-on-surface">Issue Not Found</h2>
        <p className="text-sm text-on-surface-variant mt-2">The issue you are looking for does not exist or has been removed.</p>
        <Link href="/issues" className="mt-4 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/95 transition-all shadow-sm">
          Back to Issues
        </Link>
      </main>
    );
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTimeAgo = (dateStr: string) => {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHrs < 1) return 'Just now';
    if (diffHrs < 24) return `${diffHrs} hours ago`;
    const diffDays = Math.floor(diffHrs / 24);
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  };

  return (
    <main className="flex-grow w-full max-w-max-width-content mx-auto px-margin-mobile md:px-margin-desktop py-6">
      
      {/* Back navigation */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/issues"
          className="flex items-center justify-center rounded-full hover:bg-surface-variant transition-all p-2 h-10 w-10 border border-outline-variant/30 text-on-surface-variant hover:text-primary bg-white shadow-sm"
          aria-label="Go Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <span className="text-xs font-bold text-on-surface-variant">Back to list</span>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
        
        {/* Left Column: Image & Details */}
        <div className="md:col-span-8 flex flex-col gap-6">
          {/* Hero Image */}
          <div className="w-full h-64 md:h-96 rounded-xl overflow-hidden shadow-sm relative group bg-surface-variant/35 flex items-center justify-center">
            {issue.photo_url ? (
              <img
                src={issue.photo_url}
                alt={issue.title}
                className="w-full h-full object-cover transition-transform duration-500"
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 text-outline-variant">
                <HelpCircle className="w-16 h-16" />
                <span className="text-sm font-semibold">No Image Uploaded</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
          </div>

          {/* Header Info */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border ${CATEGORY_COLORS[issue.category]}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                {CATEGORY_LABELS[issue.category]}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${STATUS_CLASSES[issue.status]}`}>
                {STATUS_LABELS[issue.status]}
              </span>
              <span className="text-on-surface-variant text-xs ml-auto flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Reported {formatTimeAgo(issue.created_at)}</span>
              </span>
            </div>
            <h1 className="text-xl md:text-3xl font-bold text-on-surface tracking-tight leading-snug">
              {issue.title}
            </h1>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl p-6 border border-outline-variant/50 shadow-sm">
            <h2 className="text-lg font-bold text-on-surface mb-3">Description</h2>
            <p className="text-sm md:text-base text-on-surface-variant leading-relaxed whitespace-pre-line">
              {issue.description || 'No detailed description provided for this report.'}
            </p>
          </div>
        </div>

        {/* Right Column: Actions & Map */}
        <div className="md:col-span-4 flex flex-col gap-6">
          {/* Action Panel (Glassmorphism style) */}
          <div className="bg-white/80 backdrop-blur-md border border-outline-variant/60 rounded-xl p-6 shadow-md flex flex-col gap-5 sticky top-24">
            
            {/* Upvote */}
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
              <div className="flex flex-col">
                <span className="font-bold text-sm text-on-surface">Support this report</span>
                <span className="text-[10px] text-on-surface-variant mt-0.5">Higher votes prioritize fixes</span>
              </div>
              <button
                onClick={() => upvoteIssue(issue.id)}
                disabled={hasVoted}
                className={`flex items-center gap-1.5 px-4 h-touch-target rounded-lg transition-all border ${
                  hasVoted
                    ? 'bg-primary-container border-primary text-primary-fixed shadow-sm'
                    : 'border-outline-variant hover:bg-surface-variant/50 text-on-surface'
                }`}
                title={hasVoted ? 'You have upvoted this' : 'Upvote this issue'}
              >
                <ThumbsUp className={`w-4 h-4 ${hasVoted ? 'fill-current' : ''}`} />
                <span className="text-sm font-semibold">{issue.upvote_count}</span>
              </button>
            </div>

            {/* Mini Map */}
            <div className="flex flex-col gap-3">
              <h3 className="font-bold text-sm text-on-surface flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Location Pinned</span>
              </h3>
              
              <div className="w-full h-44 rounded-lg overflow-hidden border border-outline-variant/50 relative">
                <DynamicMap
                  issues={[issue]}
                  center={[issue.latitude, issue.longitude]}
                  zoom={15}
                  interactive={false}
                />
              </div>
              
              <div className="bg-surface-variant/20 p-3 rounded-lg border border-outline-variant/30">
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {issue.address}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2.5 pt-2">
              <button
                onClick={handleShare}
                className="w-full border border-primary text-primary hover:bg-primary/5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 h-touch-target"
              >
                <Share2 className="w-4 h-4" />
                <span>{copied ? 'Link Copied!' : 'Share Report'}</span>
              </button>
              
              <div className="flex justify-center mt-1">
                <button className="text-error hover:text-error/80 text-xs font-semibold flex items-center gap-1 transition-colors">
                  <Flag className="w-3.5 h-3.5" />
                  <span>Report inappropriate content</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
