'use client';

import { cn } from '@/lib/utils';
import {
    LayoutDashboard, FolderKanban, CalendarRange, Settings, LogOut, Users, Library, ListTodo, Backpack, Plus, ChevronLeft, ChevronRight, Tags
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
}

const navItems = [
    { name: 'Dashboard', href: '/portal/dashboard', icon: LayoutDashboard },
    { name: 'Portfolios', href: '/portal/portfolio', icon: FolderKanban },
    { name: 'Requirements', href: '/portal/requirements', icon: Library },
    { name: 'Maintenance', href: '/portal/maintenance', icon: Settings },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
    const pathname = usePathname();

    return (
        <div
            className={cn(
                "flex h-screen flex-col justify-between bg-[#0f1012] py-6 border-r border-[#1f2023] sticky top-0 transition-all duration-300 z-50",
                collapsed ? "w-[80px] px-3" : "w-[270px] px-5"
            )}
        >
            <div>
                {/* Logo Area Removed */}
                <div className="mb-4"></div>

                {/* FAB */}


                {/* Navigation */}
                <nav className="flex flex-col gap-2">
                    {navItems.map((item) => {
                        const isActive = pathname?.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center rounded-xl transition-all duration-300 group relative',
                                    collapsed
                                        ? "justify-center p-3"
                                        : "gap-4 px-4 py-3",
                                    isActive
                                        ? 'bg-zinc-800/50 text-white shadow-inner'
                                        : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50'
                                )}
                                title={collapsed ? item.name : undefined}
                            >
                                <item.icon className={cn(
                                    "transition-colors",
                                    isActive ? "text-white" : "text-zinc-600 group-hover:text-zinc-400",
                                    collapsed ? "h-6 w-6" : "h-[18px] w-[18px]"
                                )} />
                                {!collapsed && <span className="text-[14px] font-medium whitespace-nowrap overflow-hidden">{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Footer & Toggle */}
            <div className="flex flex-col gap-4">
                <button
                    onClick={onToggle}
                    className="flex items-center justify-center w-full py-4 text-zinc-600 hover:text-white transition-colors border-t border-zinc-900/50"
                >
                    {collapsed ? <ChevronRight className="h-4 w-4" /> : <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest"><ChevronLeft className="h-3 w-3" /> Collapse</div>}
                </button>

                {!collapsed && (
                    <div className="px-1 pb-4">
                        <div className="flex items-center gap-3 px-4 pt-4 border-t border-zinc-900/50">
                            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-600 p-[1px]">
                                <div className="h-full w-full rounded-full bg-black flex items-center justify-center text-xs font-bold text-white">
                                    JD
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-zinc-300">John Doe</span>
                                <span className="text-[10px] text-zinc-600 uppercase tracking-widest">Premium</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
