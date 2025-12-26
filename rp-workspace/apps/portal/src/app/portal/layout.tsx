'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { RightSidebar } from '@/components/layout/right-sidebar';
import { Bell, Search, Command, HelpCircle, ChevronRight, LayoutGrid, Sidebar as SidebarIcon, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export default function PortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [leftCollapsed, setLeftCollapsed] = useState(false);
    const [rightOpen, setRightOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    // Close mobile menu on route change
    useEffect(() => {
        // Use setTimeout to avoid cascading renders
        const timer = setTimeout(() => {
            setMobileMenuOpen(false);
        }, 0);
        return () => clearTimeout(timer);
    }, [pathname]);

    // Handle responsive collapse
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setLeftCollapsed(true);
            }
        };
        // Initial check
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="flex h-screen w-screen bg-[#0f1012] font-sans selection:bg-zinc-800 selection:text-white overflow-hidden">

            {/* Left Sidebar - Desktop */}
            <div className="hidden md:block h-full relative z-30">
                <Sidebar
                    collapsed={leftCollapsed}
                    onToggle={() => setLeftCollapsed(!leftCollapsed)}
                />
            </div>

            {/* Mobile Sidebar Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 bg-black/80 md:hidden" onClick={() => setMobileMenuOpen(false)}>
                    <div className="h-full w-[280px]" onClick={e => e.stopPropagation()}>
                        <Sidebar collapsed={false} onToggle={() => setMobileMenuOpen(false)} />
                    </div>
                </div>
            )}

            {/* Main Content Area - 100% Width & Height */}
            <div className="flex-1 flex flex-col h-full relative bg-white transition-all duration-300 ease-in-out z-10 w-full">

                {/* Header */}
                <header className="h-14 lg:h-16 flex items-center justify-between px-4 lg:px-6 border-b border-zinc-100 bg-white sticky top-0 z-20 shrink-0">
                    <div className="flex items-center gap-4">
                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 -ml-2 text-zinc-500 hover:text-black"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <Menu className="h-6 w-6" />
                        </button>

                        {/* Breadcrumbs */}
                        <div className="flex items-center gap-2 lg:gap-4 text-sm">
                            <div className="hidden md:flex items-center gap-2 text-zinc-400 font-medium">
                                <LayoutGrid className="h-4 w-4" />
                                <span>Portal</span>
                            </div>
                            <ChevronRight className="hidden md:block h-4 w-4 text-zinc-300" />
                            <div className="flex items-center gap-2 text-black font-semibold">
                                Backlog
                            </div>
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2 lg:gap-4">
                        {/* Search */}
                        <div className="relative group hidden lg:block">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                            <input
                                type="text"
                                placeholder="Search (⌘K)"
                                className="pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm w-48 focus:w-64 focus:border-zinc-400 transition-all outline-none"
                            />
                        </div>

                        <div className="h-6 w-px bg-zinc-200 mx-2 hidden lg:block" />

                        <button className="p-2 text-zinc-400 hover:text-black rounded-lg hover:bg-zinc-50 transition-colors">
                            <Bell className="h-5 w-5" />
                        </button>

                        {/* Right Sidebar Toggle */}
                        <button
                            onClick={() => setRightOpen(!rightOpen)}
                            className={cn(
                                "p-2 rounded-lg transition-colors border",
                                rightOpen ? "bg-black text-white border-black" : "text-zinc-400 hover:text-black hover:bg-zinc-50 border-transparent"
                            )}
                        >
                            <SidebarIcon className="h-5 w-5 transform scale-x-[-1]" />
                        </button>
                    </div>
                </header>

                {/* Content Scroll - 100% AVAILABLE SPACE */}
                <main className="flex-1 overflow-auto bg-zinc-50/30 w-full relative">
                    {/* NO CONTAINER - Full Width Content */}
                    <div className="w-full h-full p-4 lg:p-6">
                        {children}
                    </div>
                </main>

                {/* Footer */}
                <footer className="h-8 bg-white border-t border-zinc-200 flex items-center justify-between px-4 lg:px-6 text-[10px] font-bold text-zinc-400 uppercase tracking-widest z-20 shrink-0">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5 opacity-80 animate-pulse">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                            Online
                        </span>
                        <span className="hidden sm:inline">v3.0.0</span>
                    </div>
                    <div className="hidden sm:block">
                        Synced 2m ago
                    </div>
                </footer>
            </div>

            {/* Right Sidebar - Overlay on tiny screens, squeeze on large? Overlay best for now */}
            <RightSidebar isOpen={rightOpen} onClose={() => setRightOpen(false)} />
        </div>
    );
}
