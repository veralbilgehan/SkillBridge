"use client";

import { Bell, Coins } from "lucide-react";

const DashboardTopbar = () => {
  return (
    <header className="h-14 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-6 sticky top-0 z-10">
      <div />
      <div className="flex items-center gap-4">
        {/* Credit counter */}
        <div className="flex items-center gap-2 bg-zinc-800 px-3 py-1.5 rounded-lg text-sm">
          <Coins className="w-4 h-4 text-indigo-400" />
          <span className="text-white font-semibold">50</span>
          <span className="text-zinc-500">kontör</span>
        </div>
        {/* Notifications */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full" />
        </button>
        {/* User avatar */}
        <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 text-xs font-bold">
          U
        </div>
      </div>
    </header>
  );
};

export { DashboardTopbar };
