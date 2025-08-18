'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { AlertTriangle, LogOut } from 'lucide-react';

// ShadCN/UI imports
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

export default function LogoutButton() {
    const [open, setOpen] = useState(false);

    const handleLogOut = async () => {
        try {
            const res = await signOut({ redirect: false, callbackUrl: '/' });
            if (res?.url) {
                toast.success('Successfully logged out!');
                window.location.href = '/'
            } else {
                toast.error('Unexpected logout response.');
            }
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Something went wrong during logout.');
        }
        setOpen(false); // ensure popover closes
    };

    return (
        <div className="px-4 pb-6 mt-auto">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <motion.button
                        onClick={() => setOpen(true)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="
              group flex items-center justify-center gap-2 w-full border-0
              px-4 py-3 rounded-lg
              bg-gradient-to-r from-slate-700 to-slate-600
              text-white font-medium
              shadow-md hover:from-slate-600 hover:to-slate-500 hover:shadow-lg
              transition duration-200
              focus:outline-none
            "
                    >
                        <LogOut size={20} />
                        <span>Log Out</span>
                    </motion.button>
                </PopoverTrigger>

                <PopoverContent
                    align="end"
                    className="
    w-72 
    bg-slate-800 
    border border-slate-700 
    rounded-lg 
    shadow-xl 
    overflow-hidden
  "
                >
                    {/* Header */}
                    <header className="flex items-center gap-2 px-4 py-3 border-b border-slate-700">
                        <AlertTriangle className="h-5 w-5 text-yellow-400" />
                        <h4 className="text-sm font-semibold text-white">
                            Confirm Logout
                        </h4>
                    </header>

                    {/* Body */}
                    <div className="px-4 py-3">
                        <p className="text-sm leading-relaxed text-slate-300">
                            You&apos;re about to end your session. Any unsaved changes will be lost.
                            Do you want to continue?
                        </p>
                    </div>

                    {/* Footer */}
                    <footer className="flex justify-end gap-2 px-4 py-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setOpen(false)}
                            className='text-white'
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleLogOut}
                            className="flex items-center gap-1"
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </Button>
                    </footer>
                </PopoverContent>
            </Popover>
        </div>
    );
}
