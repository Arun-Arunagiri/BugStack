"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Trash2, Bug, UserRound, ChevronLeft } from "lucide-react";
import { Seymour_One, Inter } from "next/font/google";

const seymourOne = Seymour_One({ weight: "400", subsets: ["latin"], display: "swap" });
const inter = Inter({ weight: "400", subsets: ["latin"], display: "swap" });

type Project = {
    _id: string;
    name: string;
    description: string;
    status: "Pending" | "In Progress" | "Completed";
};


interface Bug {
    _id: string;
    name: string;
    description: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}


function ProjectDetails() {
    const { projectname } = useParams();
    const [user, setUser] = useState({ name: "", email: "" });
    const [project, setProject] = useState<Project | null>(null);
    const [bugs, setBugs] = useState<Bug[]>([]);
    const [filteredBugs, setFilteredBugs] = useState<Bug[]>([]);
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (userStr) setUser(JSON.parse(userStr));

        const fetchDetails = async () => {
            try {
                const res = await fetch(`/api/projects/details?name=${projectname}`);
                const data = await res.json();
                if (data.success) {
                    setProject(data.project);
                    setBugs(data.bugs);
                }
            } catch (err) {
                console.error("Error fetching project details", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [projectname]);

    useEffect(() => {
        if (filter === "all") {
            setFilteredBugs(bugs);
        } else {
            setFilteredBugs(bugs.filter((bug: Bug) => bug.status.toLowerCase() === filter));
        }
    }, [bugs, filter]);

    const deleteBug = async (id: string) => {
        try {
            const res = await fetch(`/api/bugs/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (data.success) {
                setBugs((prev) => prev.filter((bug: Bug) => bug._id !== id));
            }
        } catch (err) {
            console.error("Error deleting bug:", err);
        }
    };

    const updateBugStatus = async (bugId: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/bugs/${bugId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            const data = await res.json();
            if (data.success) {
                setBugs((prev) =>
                    prev.map((bug: Bug) => (bug._id === bugId ? { ...bug, status: newStatus } : bug))
                );
            }
        } catch (err) {
            console.error("Failed to update bug:", err);
        }
    };

    if (loading) return <div className="p-6">Loading...</div>;
    if (!project) return <div className="p-6">Project not found</div>;

    return (
        <div className="min-h-screen bg-[#f8f9fa] text-[#53618a] lg:px-6 px-2 py-2">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center lg:gap-8">
                    <ChevronLeft onClick={() => router.back()}
                        className="size-8 text-black rounded-2xl hover:cursor-pointer active:scale-90" />
                    <p className={`text-blue-500 lg:text-4xl ${seymourOne.className}`}>BugStack</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex flex-col text-right">
                        <p className={`${inter.className} text-black lg:text-2xl font-bold`}>{user.name}</p>
                        <p className={`${inter.className} text-blue-400`}>Tester</p>
                    </div>
                    <UserRound className="bg-white rounded-2xl size-10 border-2 lg:mx-4" />
                </div>
            </div>

            <h1 className="text-3xl font-bold mb-2 text-black">{project.name}</h1>
            <p className="mb-2 text-black">Description: {project.description}</p>
            <p className="mb-4 text-black">Status: {project.status}</p>

            {/* Filter */}
            <div className="mb-4">
                <label className="text-black font-semibold mr-2">Filter Bugs:</label>
                <select
                    className="border px-3 py-1 rounded"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="all">All</option>
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                </select>
            </div>

            <h2 className="text-2xl font-semibold mb-3 text-black">Bugs</h2>
            {filteredBugs.length === 0 ? (
                <p>No bugs found for this filter.</p>
            ) : (
                <ul className="space-y-3">
                    {filteredBugs.map((bug) => (
                        <li
                            key={bug._id}
                            className="flex bg-[#e5e7eb] p-3 justify-between items-center rounded border"
                        >
                            <div className="flex items-center gap-5">
                                <Bug className="text-green-500 size-10" />
                                <div>
                                    <p className="font-bold text-black">{bug.name}</p>
                                    <p className="text-sm">{bug.description}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-sm text-gray-600">Status:</p>
                                        <select
                                            value={bug.status}
                                            onChange={(e) => updateBugStatus(bug._id, e.target.value)}
                                            className="border rounded px-2 py-1 text-sm"
                                        >
                                            <option value="open">Open</option>
                                            <option value="closed">Closed</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <Trash2
                                className="text-red-500 size-8 cursor-pointer hover:opacity-70"
                                onClick={() => deleteBug(bug._id)}
                            />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ProjectDetails;
