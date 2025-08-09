'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Clock, PenLine } from 'lucide-react';
import LogoutButton from '../auth/LogoutButton';


const links = [
    { href: '/dashboard', label: 'Overview', icon: Home },
    { href: '/subjects', label: 'Subjects', icon: BookOpen },
    { href: '/routines', label: 'Routines', icon: Clock },
    { href: '/exams', label: 'Exams', icon: PenLine },
];

const Sidebar = () => {
    const pathname = usePathname();

    return (
        <nav className="flex flex-col h-full w-64 z-50 bg-gradient-to-b from-slate-900/90 to-slate-800/90 backdrop-blur-lg border-r border-white/10 shadow-xl">
            {/* Brand */}
            <div className="px-6 py-8 flex items-center gap-3 border-b border-white/10">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                    <Home size={26} className="text-white" />
                </div>
                <span className="text-white text-2xl font-extrabold tracking-wide">
                    NextLearn
                </span>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 px-4 py-6 space-y-2">
                {links.map(({ href, label, icon: Icon }) => {
                    const active = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`
                group flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200
                ${active
                                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                                }
              `}
                        >
                            <Icon
                                size={20}
                                className={`transition-colors duration-200 ${active
                                    ? 'text-white'
                                    : 'text-slate-400 group-hover:text-white'
                                    }`}
                            />
                            <span>{label}</span>
                        </Link>
                    );
                })}
            </div>

            {/* Log out Button */}
            <LogoutButton />
        </nav>
    );
};

export default Sidebar;
