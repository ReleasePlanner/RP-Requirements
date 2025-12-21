'use client';

import { X, MoreHorizontal, Calendar, Tag, User, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RightSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function RightSidebar({ isOpen, onClose }: RightSidebarProps) {
    return (
        <aside
            className={cn(
                "fixed inset-y-0 right-0 z-40 w-80 bg-[#121214] border-l border-zinc-800/50 transform transition-transform duration-300 ease-in-out shadow-2xl",
                isOpen ? "translate-x-0" : "translate-x-full"
            )}
        >
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-800/50">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Details</span>
                <div className="flex items-center gap-2">
                    <button className="text-zinc-500 hover:text-white transition-colors">
                        <MoreHorizontal className="h-4 w-4" />
                    </button>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Content Scroll */}
            <div className="p-6 h-[calc(100vh-64px)] overflow-y-auto">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-300 uppercase tracking-wider border border-zinc-700">REQ-102</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-black uppercase tracking-wider">High</span>
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2 leading-tight">Implement OAUTH2 Authentication Flow</h3>
                    <p className="text-sm text-zinc-500 leading-relaxed">
                        User needs to be able to login using Google and Microsoft accounts. This requires setting up the Identity Provider in AWS Cognito.
                    </p>
                </div>

                {/* Properties Grid */}
                <div className="space-y-6">
                    <div>
                        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest block mb-3">Properties</span>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between group">
                                <div className="flex items-center gap-3 text-zinc-400">
                                    <User className="h-3.5 w-3.5" />
                                    <span className="text-xs">Assignee</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-5 w-5 rounded-full bg-zinc-700 flex items-center justify-center text-[9px] text-white font-bold">JD</div>
                                    <span className="text-xs text-zinc-300 group-hover:text-white transition-colors cursor-pointer">John Doe</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between group">
                                <div className="flex items-center gap-3 text-zinc-400">
                                    <Tag className="h-3.5 w-3.5" />
                                    <span className="text-xs">Status</span>
                                </div>
                                <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-sm">In Progress</span>
                            </div>

                            <div className="flex items-center justify-between group">
                                <div className="flex items-center gap-3 text-zinc-400">
                                    <AlertCircle className="h-3.5 w-3.5" />
                                    <span className="text-xs">Story Points</span>
                                </div>
                                <span className="text-xs font-mono text-white">8 pts</span>
                            </div>

                            <div className="flex items-center justify-between group">
                                <div className="flex items-center gap-3 text-zinc-400">
                                    <Calendar className="h-3.5 w-3.5" />
                                    <span className="text-xs">Due Date</span>
                                </div>
                                <span className="text-xs text-zinc-300">Oct 24, 2025</span>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-zinc-800/50 pt-6">
                        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest block mb-3">Links</span>
                        <div className="flex items-center gap-2 text-indigo-400 bg-indigo-500/5 p-2 rounded border border-indigo-500/20 hover:border-indigo-500/40 transition-colors cursor-pointer">
                            <LinkIcon className="h-3 w-3" />
                            <span className="text-xs truncate">figma.com/design/auth-flow...</span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
