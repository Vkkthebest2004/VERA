'use client';

import React, { useState } from 'react';

export interface VeraActionToolbarProps {
  onUpload?: () => void;
  onUploadClick?: () => void;
  onArchive?: () => void;
  onArchiveClick?: () => void;
  onScan?: () => void;
  onScanClick?: () => void;
  activeItem?: 'upload' | 'archive' | 'scan' | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const VeraActionToolbar: React.FC<VeraActionToolbarProps> = ({
  onUpload,
  onUploadClick,
  onArchive,
  onArchiveClick,
  onScan,
  onScanClick,
  activeItem,
  size = 'md',
  className = '',
}) => {
  const [internalActive, setInternalActive] = useState<'upload' | 'archive' | 'scan' | null>(null);
  const currentActive = activeItem !== undefined ? activeItem : internalActive;

  const handleUpload = onUpload || onUploadClick;
  const handleArchive = onArchive || onArchiveClick;
  const handleScan = onScan || onScanClick;

  const btnPadding =
    size === 'sm'
      ? 'px-2.5 py-1 sm:px-3'
      : size === 'lg'
      ? 'px-5 py-2.5 sm:px-7'
      : 'px-4 py-2 sm:px-6';

  const svgSize =
    size === 'sm'
      ? 'w-4 h-4 sm:w-4.5 sm:h-4.5'
      : size === 'lg'
      ? 'w-6 h-6 sm:w-7 sm:h-7'
      : 'w-5 h-5 sm:w-6 sm:h-6';

  return (
    <div
      className={`flex overflow-hidden bg-white border divide-x rounded-lg rtl:flex-row-reverse dark:bg-gray-900 dark:border-gray-700 dark:divide-gray-700 shadow-2xs ${className}`}
    >
      {/* 1. Cloud Upload Action */}
      <button
        type="button"
        onClick={() => {
          setInternalActive('upload');
          if (handleUpload) handleUpload();
        }}
        title="Upload & Ingest Filings, Statements or Media"
        className={`${btnPadding} font-medium transition-colors duration-200 cursor-pointer ${
          currentActive === 'upload'
            ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
        }`}
      >
        <svg
          className={svgSize}
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* 2. Regulatory Archive & Disclosure Drawer */}
      <button
        type="button"
        onClick={() => {
          setInternalActive('archive');
          if (handleArchive) handleArchive();
        }}
        title="Statutory Evidence & BSE/NSE Disclosures"
        className={`${btnPadding} font-medium transition-colors duration-200 cursor-pointer ${
          currentActive === 'archive'
            ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
        }`}
      >
        <svg
          className={svgSize}
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* 3. Deep Scan & Visualizer Viewfinder */}
      <button
        type="button"
        onClick={() => {
          setInternalActive('scan');
          if (handleScan) handleScan();
        }}
        title="Interactive Multi-Dimensional Deep Scan & Visualizer"
        className={`${btnPadding} font-medium transition-colors duration-200 cursor-pointer ${
          currentActive === 'scan'
            ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
        }`}
      >
        <svg
          className={svgSize}
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
};
