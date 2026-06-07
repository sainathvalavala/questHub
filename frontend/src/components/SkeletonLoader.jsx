import React from 'react';

const SkeletonLoader = ({ count = 3 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="glass-card rounded-xl p-5 animate-pulse flex flex-col justify-between h-56">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="h-5 bg-slate-800 rounded-full w-20" />
              <div className="h-5 bg-slate-800 rounded-full w-16" />
            </div>
            <div className="h-6 bg-slate-800 rounded w-3/4 mb-3" />
            <div className="space-y-2">
              <div className="h-4 bg-slate-800 rounded w-full" />
              <div className="h-4 bg-slate-800 rounded w-5/6" />
            </div>
          </div>
          <div className="border-t border-white/5 pt-4 mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-slate-800" />
              <div className="space-y-1">
                <div className="h-3 bg-slate-800 rounded w-16" />
                <div className="h-2 bg-slate-800 rounded w-10" />
              </div>
            </div>
            <div className="h-7 bg-slate-800 rounded w-20" />
          </div>
        </div>
      ))}
    </>
  );
};

export default SkeletonLoader;
