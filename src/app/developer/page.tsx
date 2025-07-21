"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Seymour_One, Inter } from 'next/font/google';
import { UserRound, LogOut, Plus } from "lucide-react";
import LoadingSkeleton from "@/components/skeleton";

const seymourOne = Seymour_One({
    weight: '400',
    subsets: ['latin'],
    display: 'swap',
});
const inter = Inter({
    subsets: ['latin'],
    display: 'swap'
});

type Project = {
    _id: string;
    name: string;
    description: string;
    status: "Pending" | "In Progress" | "Completed"; // adjust if needed
};


function DeveloperDashboard() {
    const [user, setUser] = useState({ name: "", email: "" });
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (!userStr) {
            router.push("/login");
            return;
        }

        const parsedUser = JSON.parse(userStr);
        setUser(parsedUser);

        const fetchProjects = async () => {
            try {
                const res = await fetch(`/api/projects?developerEmail=${parsedUser.email}`);
                const data = await res.json();
                if (data.success) {
                    setProjects(data.projects);
                } else {
                    console.error("Failed to load projects");
                }
            } catch (err) {
                console.error("Error loading projects:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [router]);

    // close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        router.push("/login");
    };

    if (loading) return <LoadingSkeleton />;

    return (
        <div className="min-h-screen bg-[#f8f9fa] text-[#53618a] lg:px-6 px-2 py-2">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 relative">
                <p className={`text-blue-500 lg:text-4xl text-2xl ${seymourOne.className}`}>BugStack</p>

                <div className="relative" ref={dropdownRef}>
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => setShowDropdown(!showDropdown)}
                    >
                        <div className="flex flex-col text-right">
                            <p className={`${inter.className} text-black lg:text-2xl font-bold`}>{user.name}</p>
                            <p className={`${inter.className} text-blue-400`}>Developer</p>
                        </div>
                        <UserRound className="bg-white rounded-2xl size-9 border-2 lg:mx-4" />
                    </div>

                    {showDropdown && (
                        <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border z-50">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg w-full text-left"
                            >
                                <LogOut className="size-4 text-red-500" />
                                <span className="text-sm text-red-600">Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Project Button */}
            <div className="mb-6">
                <button
                    onClick={() => router.push("/developer/createproject")}
                    className="fixed bottom-6 right-6 bg-[#84ec76] text-white font-bold px-2 py-2 rounded-full shadow hover:cursor-pointer hover:bg-[#76da69] transition-colors duration-200"
                >
                    <Plus className="size-8" />
                </button>
            </div>

            {/* Projects List */}
            <div>
                <h2 className="text-2xl font-semibold mb-4 text-black">Your Projects</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.length === 0 ? (
                        <p className="text-gray-600">No projects assigned.</p>
                    ) : (
                        projects.map((project) => (
                            <div
                                key={project._id}
                                onClick={() => router.push(`/developer/${encodeURIComponent(project.name)}`)}
                                className="border border-[#53618a] rounded-lg p-4 bg-[#e5e7eb] shadow-sm hover:cursor-pointer hover:scale-95 transform duration-200"
                            >
                                <h3 className="text-lg font-bold text-black">{project.name}</h3>
                                <p className="text-sm">Status: <span className={`${project.status === 'Completed' ? 'text-green-500' : project.status === 'Pending' ? 'text-red-500' : 'text-blue-500'}`}>{project.status}</span></p>
                                <p className="text-sm text-gray-700 mt-1">{project.description}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default DeveloperDashboard;
