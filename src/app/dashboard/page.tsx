// src/app/dashboard/page.tsx

'use client';
import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Code,
  Home,
  Users,
  Bell,
  Menu,
  Sun,
  Moon,
  ChevronDown,
} from "lucide-react";
import PostCard from "@/components/PostCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CreateIssueModal from "@/app/dashboard/CreateIssueModal";
import { supabase } from "@/utils/auth";
import { Database } from "@/types/database.types";

type Issue = Database['public']['Tables']['issues']['Row'];

const NavBar: React.FC<{ theme: string; toggleTheme: () => void }> = ({ theme, toggleTheme }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <span className="text-blue-500 font-bold text-xl">AIOverflow</span>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <a
                href="#"
                className="text-gray-300 hover:text-white flex items-center gap-2"
              >
                <Home className="w-4 h-4" /> Home
              </a>

              {/* Quick Actions Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="text-gray-300 hover:text-white flex items-center gap-2">
                  <Code className="w-4 h-4" /> Quick Actions{" "}
                  <ChevronDown className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-800 border-gray-700">
                  <DropdownMenuItem className="text-gray-200 hover:bg-gray-700">
                    Browse Boilerplates
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-200 hover:bg-gray-700">
                    Prompting Guide
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-200 hover:bg-gray-700">
                    Share Knowledge
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <a
                href="#"
                className="text-gray-300 hover:text-white flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" /> Guides
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white flex items-center gap-2"
              >
                <Users className="w-4 h-4" /> Community
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <Bell className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
            <div className="w-8 h-8 bg-gray-700 rounded-full"></div>

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
          <div className="md:hidden py-4 border-t border-gray-800">
            <a href="#" className="block py-2 text-gray-300 hover:text-white">
              Home
            </a>
            <a href="#" className="block py-2 text-gray-300 hover:text-white">
              Browse Boilerplates
            </a>
            <a href="#" className="block py-2 text-gray-300 hover:text-white">
              Prompting Guide
            </a>
            <a href="#" className="block py-2 text-gray-300 hover:text-white">
              Share Knowledge
            </a>
            <a href="#" className="block py-2 text-gray-300 hover:text-white">
              Guides
            </a>
            <a href="#" className="block py-2 text-gray-300 hover:text-white">
              Community
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

const Dashboard = () => {
  const [theme, setTheme] = useState("dark");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [issues, setIssues] = useState<Issue[]>([]);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const { data, error } = await supabase
          .from('issues')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) {
          console.error('Error fetching issues:', error);
        } else {
          setIssues(data || []);
        }
      } catch (error) {
        console.error('Error fetching issues:', error);
      }
    };

    fetchIssues();
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div
      className={`min-h-screen ${
        theme === "dark"
          ? "bg-gray-950 text-gray-100"
          : "bg-white text-gray-900"
      }`}
    >
      <NavBar theme={theme} toggleTheme={toggleTheme} />

      {/* Create Issue Modal */}
      {isCreateModalOpen && (
        <CreateIssueModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      )}

      {/* Rest of your existing JSX */}
      {/* ... */}

    {/* Display list of issues */}
    <div className="p-6">
      {issues.map((issue) => (
        <PostCard key={issue.id} issue={issue} />
      ))}
    </div>

      {/* Update the Post Issue button to open modal */}
      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Post Issue
      </button>

      {/* ... rest of the dashboard content ... */}
    </div>
  );
};

export default Dashboard;
