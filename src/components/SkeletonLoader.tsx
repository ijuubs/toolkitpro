import * as React from 'react';

interface SkeletonProps {
  className?: string;
}

/**
 * Basic Neu-brutalist shimmering box primitive
 */
export function SkeletonBox({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`skeleton-shimmer border-2 border-black/30 dark:border-white/30 ${className}`}
      aria-hidden="true"
    />
  );
}

/**
 * Skeleton loading state for individual interactive tool components
 * Matches the Neu-Brutalist design language with hard borders, metric cards, and inputs.
 */
export function ToolSkeleton() {
  return (
    <div className="w-full space-y-6 animate-fadeIn" aria-busy="true" aria-label="Loading tool interface">
      {/* Top status indicator bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b-2 border-black/20 dark:border-white/20">
        <div className="flex items-center gap-3">
          <SkeletonBox className="h-6 w-28 bg-yellow-300/40" />
          <SkeletonBox className="h-6 w-36" />
        </div>
        <SkeletonBox className="h-6 w-24" />
      </div>

      {/* Main input mock grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <SkeletonBox className="h-4 w-32" />
            <SkeletonBox className="h-12 w-full border-4 border-black/40" />
          </div>
          <div className="space-y-2">
            <SkeletonBox className="h-4 w-44" />
            <SkeletonBox className="h-12 w-full border-4 border-black/40" />
          </div>
          <div className="space-y-2">
            <SkeletonBox className="h-4 w-24" />
            <div className="grid grid-cols-3 gap-2">
              <SkeletonBox className="h-10 w-full border-2 border-black/40" />
              <SkeletonBox className="h-10 w-full border-2 border-black/40" />
              <SkeletonBox className="h-10 w-full border-2 border-black/40" />
            </div>
          </div>
        </div>

        {/* Secondary controls / options */}
        <div className="space-y-4">
          <div className="space-y-2">
            <SkeletonBox className="h-4 w-40" />
            <SkeletonBox className="h-28 w-full border-4 border-black/40" />
          </div>
          <div className="flex gap-3 pt-2">
            <SkeletonBox className="h-12 flex-1 border-4 border-black/60 bg-yellow-300/50" />
            <SkeletonBox className="h-12 w-28 border-4 border-black/40" />
          </div>
        </div>
      </div>

      {/* Results / output mock section */}
      <div className="mt-8 pt-6 border-t-4 border-black/30 dark:border-white/30 space-y-4">
        <div className="flex justify-between items-center">
          <SkeletonBox className="h-6 w-48" />
          <SkeletonBox className="h-6 w-20" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 border-4 border-black/40 bg-white/50 dark:bg-black/20 space-y-2">
            <SkeletonBox className="h-4 w-20" />
            <SkeletonBox className="h-8 w-32" />
          </div>
          <div className="p-4 border-4 border-black/40 bg-white/50 dark:bg-black/20 space-y-2">
            <SkeletonBox className="h-4 w-28" />
            <SkeletonBox className="h-8 w-24" />
          </div>
          <div className="p-4 border-4 border-black/60 bg-yellow-300/30 space-y-2">
            <SkeletonBox className="h-4 w-24" />
            <SkeletonBox className="h-8 w-36" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Full page skeleton state for top-level routes (Dashboard, Tools, Analytics, etc.)
 */
export function PageSkeleton() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-10" aria-busy="true" aria-label="Loading page content">
      {/* Top Header Banner Skeleton */}
      <div className="border-4 border-black bg-white dark:bg-[#181922] p-6 sm:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-4">
        <div className="flex items-center gap-3">
          <SkeletonBox className="h-6 w-32 bg-yellow-300/50 border-2 border-black" />
          <SkeletonBox className="h-6 w-24 border-2 border-black/40" />
        </div>
        <SkeletonBox className="h-10 sm:h-14 w-3/4 border-4 border-black" />
        <SkeletonBox className="h-5 w-full max-w-2xl" />
        <SkeletonBox className="h-5 w-2/3 max-w-xl" />
      </div>

      {/* Grid of Content / Tools / Articles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div
            key={idx}
            className="border-4 border-black bg-white dark:bg-[#181922] p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4"
          >
            <div className="flex justify-between items-center">
              <SkeletonBox className="h-5 w-24" />
              <SkeletonBox className="h-6 w-6 rounded-full border-2 border-black" />
            </div>
            <SkeletonBox className="h-7 w-4/5 border-2 border-black" />
            <SkeletonBox className="h-4 w-full" />
            <SkeletonBox className="h-4 w-3/4" />
            <div className="pt-4 border-t-2 border-black flex justify-between items-center">
              <SkeletonBox className="h-6 w-24 bg-yellow-300/50 border-2 border-black" />
              <SkeletonBox className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton specifically designed for Blog posts and rich editorial content
 */
export function BlogSkeleton() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8" aria-busy="true" aria-label="Loading article">
      <SkeletonBox className="h-8 w-32 border-2 border-black" />
      <div className="space-y-4">
        <div className="flex gap-3">
          <SkeletonBox className="h-6 w-24 bg-yellow-300/50" />
          <SkeletonBox className="h-6 w-28" />
          <SkeletonBox className="h-6 w-20" />
        </div>
        <SkeletonBox className="h-14 w-full border-4 border-black" />
        <SkeletonBox className="h-14 w-4/5 border-4 border-black" />
        <div className="flex items-center gap-4 pt-4 border-t-4 border-black">
          <SkeletonBox className="w-12 h-12 rounded-full border-2 border-black" />
          <div className="space-y-1">
            <SkeletonBox className="h-3 w-16" />
            <SkeletonBox className="h-4 w-32" />
          </div>
        </div>
      </div>

      <div className="border-4 border-black p-8 md:p-12 bg-white dark:bg-[#181922] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] space-y-6">
        <SkeletonBox className="h-16 w-full border-l-8 border-yellow-400 pl-4" />
        <SkeletonBox className="h-4 w-full" />
        <SkeletonBox className="h-4 w-11/12" />
        <SkeletonBox className="h-4 w-full" />
        <SkeletonBox className="h-4 w-4/5" />
        <SkeletonBox className="h-8 w-1/2 border-2 border-black mt-8" />
        <SkeletonBox className="h-4 w-full" />
        <SkeletonBox className="h-4 w-5/6" />
      </div>
    </div>
  );
}

export default ToolSkeleton;
