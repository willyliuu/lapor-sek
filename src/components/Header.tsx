'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { MapPin, Map as MapIcon, List, PlusCircle } from 'lucide-react';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Helper to maintain query parameters except 'submit' when switching views if needed,
  // or just clean routing.
  const isMapView = pathname === '/';
  const isListView = pathname === '/issues';

  return (
    <header className="bg-white border-b border-outline-variant z-50 sticky top-0">
      <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop w-full h-16 max-w-max-width-content mx-auto">
        {/* Brand */}
        <Link href="/" className="font-sans text-xl md:text-2xl font-bold text-primary flex items-center gap-2">
          <MapPin className="w-6 h-6 fill-current text-primary" />
          <span>LaporSek</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 h-full">
          <Link
            href="/"
            className={`flex items-center gap-2 h-full border-b-2 font-semibold text-sm transition-colors ${
              isMapView
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-primary'
            }`}
          >
            <MapIcon className="w-4 h-4" />
            <span>Map View</span>
          </Link>
          <Link
            href="/issues"
            className={`flex items-center gap-2 h-full border-b-2 font-semibold text-sm transition-colors ${
              isListView
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-primary'
            }`}
          >
            <List className="w-4 h-4" />
            <span>List View</span>
          </Link>
        </nav>

        {/* Action Button */}
        <div>
          <Link
            href="?submit=true"
            scroll={false}
            className="bg-primary text-white font-semibold text-sm px-5 h-touch-target rounded-lg flex items-center gap-2 hover:bg-on-primary-fixed-variant transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report an Issue</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
