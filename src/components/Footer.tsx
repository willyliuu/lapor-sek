import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-outline-variant py-8 px-margin-mobile md:px-margin-desktop mt-auto w-full">
      <div className="max-w-max-width-content mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-lg font-bold text-on-surface">
          LaporSek
        </div>
        <div className="text-xs text-on-surface-variant text-center md:text-left">
          © {new Date().getFullYear()} LaporSek Civic-Tech. All rights reserved.
        </div>
        <nav className="flex flex-wrap justify-center gap-6">
          <Link href="#" className="text-xs text-on-surface-variant hover:text-primary underline transition-all">
            Community Guidelines
          </Link>
          <Link href="#" className="text-xs text-on-surface-variant hover:text-primary underline transition-all">
            Legal
          </Link>
          <Link href="#" className="text-xs text-on-surface-variant hover:text-primary underline transition-all">
            Privacy Policy
          </Link>
          <Link href="#" className="text-xs text-on-surface-variant hover:text-primary underline transition-all">
            Flag Content
          </Link>
        </nav>
      </div>
    </footer>
  );
};
