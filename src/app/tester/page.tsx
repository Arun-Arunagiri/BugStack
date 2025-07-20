"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Seymour_One, Inter } from 'next/font/google';
import { UserRound, LogOut, Plus } from "lucide-react";

const seymourOne = Seymour_One({
    weight: '400',
    subsets: ['latin'],
    display: 'swap',
});
const inter = Inter({
    subsets: ['latin'],
    display: 'swap'
})

function TesterDashboard() {
    const [user, setUser] = useState({ name: "", email: "" });
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
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
                const res = await fetch(`/api/projects?testerEmail=${parsedUser.email}`);
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
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !(dropdownRef.current as any).contains(e.target)) {
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

    if (loading) return <div className="p-6 text-[#53618a]">Loading...</div>;

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
                            <p className={`${inter.className} text-blue-400`}>Tester</p>
                        </div>
                        <UserRound className="bg-white rounded-2xl size-9 border-2 lg:mx-4" />
                    </div>

                    {/* Dropdown */}
                    {showDropdown && (
                        <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border z-50">
                            <button
                                onClick={handleLogout}
                                className="flex items-center rounded-lg gap-2 px-4 py-2 hover:bg-gray-100 w-full text-left"
                            >
                                <LogOut className="size-4 text-red-500" />
                                <span className="text-sm text-red-600">Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Button */}
            <div className="mb-6">
                <button
                    onClick={() => router.push("/tester/createbug")}
                    className="fixed bottom-6 right-6 bg-[#84ec76] text-white font-bold px-2 py-2 rounded-full shadow hover:cursor-pointer hover:bg-[#76da69] transition-colors duration-200"
                >
                    <Plus className="size-8"/>
                </button>
            </div>

            {/* Projects */}
            <div>
                <h2 className="text-2xl font-semibold mb-4 text-black">Projects</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map((project: any) => (
                        <div
                            key={project._id}
                            onClick={() => router.push(`/tester/${encodeURIComponent(project.name)}`)}
                            className="border border-[#53618a] rounded-lg p-4 bg-[#e5e7eb] shadow-sm hover:cursor-pointer hover:bg-[#dfe1e5] hover:scale-95 transition duration-200"
                        >
                            <h3 className="text-lg font-bold text-black">{project.name}</h3>
                            <p className="text-sm">Status: <span className={`${project.status === 'In Progress'? 'text-green-500':'text-red-500'}`}>{project.status}</span></p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TesterDashboard;
