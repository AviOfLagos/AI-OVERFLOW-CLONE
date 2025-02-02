// src/components/Header.tsx

'use client';

import React, { useState, useEffect } from 'react';
import {
  Sun,
  Moon,
  Bell,
  Menu,
  ChevronDown,
} from 'lucide-react';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import CreateIssueModal from '@/app/dashboard/CreateIssueModal';
import LoginButton from '@/components/LoginButton';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { getSession, signOut } from '@/utils/auth';
import { User } from '@/types/user';

const Header: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => setMounted(true), []);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await getSession();
        if (session && session.user && session.user.email) {
          setIsAuthenticated(true);
          const currentUser: User = {
            id: session.user.id,
            name: session.user.user_metadata?.name || '',
            email: session.user.email,
            username: session.user.user_metadata?.username || '',
            profilePicture: session.user.user_metadata?.avatar_url || '/default-avatar.png',
            techStack: [],
            shortBio: '',
            tools: [],
            techInterests: [],
          };
          setUser(currentUser);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching session:', error);
      }
    };

    fetchSession();
  }, []);

  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!mounted) {
    return null;
  }
  return (
    <>
      <nav
        className={`border-b ${
          theme === 'dark'
            ? 'bg-gray-900 text-gray-100 border-gray-800'
            : 'bg-white text-gray-900 border-gray-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-blue-500 font-bold text-xl">
                AIOverflow
              </Link>

              {/* Navigation links */}
              <div className="hidden md:flex items-center gap-6">
                <Link
                  href="/"
                  className="hover:text-blue-500 transition-colors duration-300"
                >
                  Home
                </Link>
                <Link
                  href="/browse-boilerplates"
                  className="hover:text-blue-500 transition-colors duration-300"
                >
                  Browse Boilerplates
                </Link>
                <Link
                  href="/prompting-guide"
                  className="hover:text-blue-500 transition-colors duration-300"
                >
                  Prompting Guide
                </Link>
                <Link
                  href="/share-knowledge"
                  className="hover:text-blue-500 transition-colors duration-300"
                >
                  Share Knowledge
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-400 hover:text-blue-500 rounded-full hover:bg-gray-200 transition-colors duration-300"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
              <Bell className="w-5 h-5 text-gray-400 hover:text-blue-500 cursor-pointer transition-colors duration-300" />

              {isAuthenticated ? (
                <>
                  {/* Post Issue Button */}
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className={`px-4 py-2 text-white rounded-lg hover:bg-blue-700 transition-transform duration-300 transform hover:scale-105 ${
                      theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'
                    }`}
                  >
                    Post Issue
                  </button>

                  {/* User Profile Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-2 group">
                        <Image
                          src={user?.profilePicture || '/default-avatar.png'}
                          alt="Profile"
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full"
                        />
                        <span>{user?.name}</span>
                        <ChevronDown
                          className="w-4 h-4 text-gray-400 transition-transform duration-300 transform group-hover:rotate-180"
                        />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className={`border ${
                        theme === 'dark'
                          ? 'bg-gray-800 border-gray-700'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <DropdownMenuItem>
                        <Link href="/profile">My Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="/settings">Settings</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="/notifications">Notifications</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="/terms">Terms of Use</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout}>
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <LoginButton />
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-gray-400 hover:text-white"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div
              className={`md:hidden py-4 border-t ${
                theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
              }`}
            >
              <Link
                href="/"
                className="py-2 hover:text-blue-500 transition-colors duration-300"
              >
                Home
              </Link>
              <Link
                href="/browse-boilerplates"
                className="py-2 hover:text-blue-500 transition-colors duration-300"
              >
                Browse Boilerplates
              </Link>
              <Link
                href="/prompting-guide"
                className="py-2 hover:text-blue-500 transition-colors duration-300"
              >
                Prompting Guide
              </Link>
              <Link
                href="/share-knowledge"
                className="py-2 hover:text-blue-500 transition-colors duration-300"
              >
                Share Knowledge
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Create Issue Modal */}
      {isCreateModalOpen && (
        <CreateIssueModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}
    </>
  );
};

export default Header;