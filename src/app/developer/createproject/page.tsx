"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function CreateProject() {
    const [form, setForm] = useState({
        name: '',
        description: '',
        status: 'In Progress',
        testerEmail: '',
    });

    const [developerEmail, setDeveloperEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (!userStr) {
            router.push("/login");
            return;
        }

        const user = JSON.parse(userStr);
        setDeveloperEmail(user.email);
    }, []);

    const validateForm = () => {
        const { name, description, testerEmail } = form;
        if (!name || !description || !testerEmail) {
            setError("Please fill in all fields");
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testerEmail)) {
            setError("Enter a valid email");
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        setError('');
        setMessage('');

        if (!validateForm()) return;

        setLoading(true);
        try {
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, developerEmail }),
            });

            const data = await res.json();
            if (data.success) {
                setMessage("✅ Project created successfully!");
                setForm({ name: '', description: '', status: 'In Progress', testerEmail: '' });
                router.back();
            } else {
                setError(data.message || 'Failed to create project');
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-[#f8f9fa] text-[#53618a] min-h-screen flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-6 text-black">Create a New Project</h2>

            {error && <p className="text-red-500 mb-4">{error}</p>}
            {message && <p className="text-green-600 mb-4">{message}</p>}

            <div className="w-full max-w-lg">
                <input
                    className="block border p-3 mb-4 w-full rounded-lg bg-[#e5e7eb] border-[#53618a] text-black focus:outline-none"
                    placeholder="Project Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <textarea
                    className="block border p-3 mb-4 w-full rounded-lg bg-[#e5e7eb] border-[#53618a] text-black focus:outline-none"
                    placeholder="Project Description"
                    rows={4}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                />

                <select
                    className="block border p-3 mb-4 w-full rounded-lg bg-[#e5e7eb] border-[#53618a] text-black focus:outline-none"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                </select>

                <input
                    className="block border p-3 mb-6 w-full rounded-lg bg-[#e5e7eb] border-[#53618a] text-black focus:outline-none"
                    placeholder="Assign to Tester (Email)"
                    value={form.testerEmail}
                    onChange={(e) => setForm({ ...form, testerEmail: e.target.value })}
                />

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-[#84ec76] hover:bg-[#76da69] text-white font-bold px-6 py-3 rounded-lg w-full disabled:opacity-50"
                >
                    {loading ? 'Creating...' : 'Create Project'}
                </button>
            </div>
        </div>
    );
}

export default CreateProject;