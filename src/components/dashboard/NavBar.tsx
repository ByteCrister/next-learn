'use client';

import { FC, useState, useRef, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import ProfilePopover from '../popovers/ProfilePopover';
import { EventModal } from '../events/EventModal';
import SearchBar from './SearchBar';
import { SidebarToggle } from './SidebarToggle';
import { motion, AnimatePresence } from 'framer-motion';
import { User, PlusCircle } from 'lucide-react';

interface NavBarProps {
  onToggle: () => void;
  isOpen: boolean;
}

const NavBar: FC<NavBarProps> = ({ onToggle, isOpen }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  return (
    <header className="flex items-center justify-between p-3 sm:p-4 bg-white border-b border-gray-200 relative">
      {/* Sidebar toggle */}
      <SidebarToggle isOpen={isOpen} onToggle={onToggle} />

      {/* Search bar */}
      <SearchBar />

      {/* Right section desktop */}
      <div className="hidden sm:flex items-center gap-4">
        <ProfilePopover isOpen={isProfileOpen} setIsOpen={setIsProfileOpen} />
        <EventModal isOpen={isModalOpen} onClose={setIsModalOpen} />
      </div>

      {/* Mobile right hamburger */}
      <div className="sm:hidden relative" ref={menuRef}>
        <button
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-label="Toggle user menu"
          className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile dropdown menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 z-40 overflow-hidden"
            >
              {/* small caret arrow without border */}
              <div className="absolute top-[-6px] right-4 w-3 h-3 bg-white dark:bg-gray-800 rotate-45" />

              <div className="flex flex-col divide-y divide-gray-100 dark:divide-gray-700">
                <button
                  onClick={() => {
                    setIsProfileOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-3 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700 transition"
                  type="button"
                >
                  <User className="w-5 h-5" />
                  Profile
                </button>
                <button
                  onClick={() => {
                    setIsModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-3 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700 transition"
                  type="button"
                >
                  <PlusCircle className="w-5 h-5" />
                  New Event
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default NavBar;
