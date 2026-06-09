import dynamic from 'next/dynamic';

export const DynamicLocationPicker = dynamic(() => import('./LocationPicker'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-surface-variant/40 flex items-center justify-center text-on-surface-variant font-medium animate-pulse" style={{ minHeight: '300px' }}>
      <span className="flex items-center gap-2">
        <svg className="animate-spin h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        Loading location picker...
      </span>
    </div>
  ),
});
