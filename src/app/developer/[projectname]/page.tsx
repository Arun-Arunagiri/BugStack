"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Trash2, Bug, UserRound, ChevronLeft } from "lucide-react";
import { Seymour_One, Inter } from "next/font/google";

const seymourOne = Seymour_One({ weight: "400", subsets: ["latin"], display: "swap" });
const inter = Inter({ weight: "400", subsets: ["latin"], display: "swap" });
type Project = {
    name: string;
    description: string;
    status: string;
};

interface Bug {
    _id: string;
    name: string;
    description: string;
    status: 'pending' | 'in progress' | 'completed'; // adjust as needed
    createdAt: string;
    updatedAt: string;
    // Add any other fields you expect
}



function ProjectDetails() {
    const { projectname } = useParams();
    const [user, setUser] = useState({ name: "", email: "", role: "" });
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

    const deleteProject = async () => {
        const confirm = window.confirm("Are you sure you want to delete this project?");
        if (!confirm) return;

        try {
            const res = await fetch(`/api/projects/delete?name=${projectname}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (data.success) {
                alert("Project deleted successfully.");
                router.push("/developer");
            }
        } catch (err) {
            console.error("Error deleting project:", err);
        }
    };

    if (loading) return <div className="p-6">Loading...</div>;
    if (!project) return <div className="p-6">Project not found</div>;

    return (
        <div className="min-h-screen bg-[#f8f9fa] text-[#53618a] lg:px-6 px-2 py-2">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center lg:gap-8">
                    <ChevronLeft
                        onClick={() => router.back()}
                        className="size-8 text-black rounded-2xl hover:cursor-pointer active:scale-90"
                    />
                    <p className={`text-blue-500 lg:text-4xl text-2xl ${seymourOne.className}`}>BugStack</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex flex-col text-right">
                        <p className={`${inter.className} text-black lg:text-2xl font-bold line-clamp-1`}>{user.name}</p>
                        <p className={`${inter.className} text-blue-400`}>Developer</p>
                    </div>
                    <UserRound className="bg-white rounded-2xl size-10 border-2 lg:mx-4" />
                </div>
            </div>

            {/* Project Info + Delete */}
            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-black mb-2">{project.name}</h1>
                    <p className="text-black mb-1">Description: {project.description}</p>
                    <div className="flex items-center gap-3">
                        <label htmlFor="statusSelect" className="text-black font-medium">Status:</label>
                        <select
                            id="statusSelect"
                            className="border rounded px-3 py-1 text-black bg-white"
                            value={project.status}
                            onChange={async (e) => {
                                const newStatus = e.target.value;
                                try {
                                    const res = await fetch(`/api/projects/updateStatus`, {
                                        method: "PUT",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ name: project.name, status: newStatus }),
                                    });
                                    const data = await res.json();
                                    if (data.success) {
                                        setProject((prev) => {
                                            if (!prev) return prev; // or return null

                                            return {
                                                ...prev,
                                                status: newStatus
                                            };
                                        });
                                    } else {
                                        alert("Failed to update project status");
                                    }
                                } catch (error) {
                                    console.error("Error updating project status:", error);
                                    alert("Error updating status");
                                }
                            }}
                        >
                            <option value="In Progress">In Progress</option>
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                </div>

                <button
                    onClick={deleteProject}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                    Delete Project
                </button>
            </div>


            {/* Bug Filter */}
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

            {/* Bug List */}
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
                                    <p className="text-sm text-gray-600 mt-1">
                                        Status: <span className="font-semibold">{bug.status}</span>
                                    </p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ProjectDetails;
