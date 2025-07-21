"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Project = {
    _id: string;
    name: string;
    description: string;
    status: string;
};

function CreateBug() {
    const [form, setForm] = useState({
        name: '',
        description: '',
        projectId: '',
        testerEmail: '',
    });

    const [projects, setProjects] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    // Get tester email from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setForm((prev) => ({ ...prev, testerEmail: user.email }));
            fetchProjects(user.email);
        } else {
            router.push('/login'); // fallback if no user is found
        }
    }, []);

    const fetchProjects = async (email: string) => {
        try {
            const res = await fetch(`/api/projects?testerEmail=${email}`);
            const data = await res.json();
            if (data.success) {
                setProjects(data.projects);
            } else {
                setError('Could not load projects');
            }
        } catch (err) {
            setError('Error fetching projects');
        }
    };

    const validateForm = () => {
        const { name, description, projectId } = form;
        if (!name || !description || !projectId) {
            setError('Please fill in all fields');
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
            const res = await fetch('/api/bugs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, status: 'Open' }),
            });

            const data = await res.json();
            if (data.success) {
                setMessage('Bug created successfully!');
                setForm((prev) => ({ ...prev, name: '', description: '', projectId: '' }));
                router.back();
            } else {
                setError(data.message || 'Failed to create bug');
            }
        } catch (err) {
            setError('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-[#f8f9fa] text-[#53618a] min-h-screen flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-6 text-black">Report a Bug</h2>

            {error && <p className="text-red-500 mb-4">{error}</p>}
            {message && <p className="text-green-600 mb-4">{message}</p>}

            <div className="w-full max-w-lg">
                <input
                    className="block border p-3 mb-4 w-full rounded-lg bg-[#e5e7eb] border-[#53618a] text-black focus:outline-none"
                    placeholder="Bug Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <textarea
                    className="block border p-3 mb-4 w-full rounded-lg bg-[#e5e7eb] border-[#53618a] text-black focus:outline-none"
                    placeholder="Description"
                    rows={4}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                />

                <select
                    className="block border p-3 mb-4 w-full rounded-lg bg-[#e5e7eb] border-[#53618a] text-black focus:outline-none"
                    value={form.projectId}
                    onChange={(e) => setForm({ ...form, projectId: e.target.value })}
                >
                    <option value="">Select Project</option>
                    {projects.map((project: Project) => (
                        <option key={project._id} value={project._id}>
                            {project.name}
                        </option>
                    ))}
                </select>

                <input
                    disabled
                    className="block border p-3 mb-6 w-full rounded-lg bg-[#e5e7eb] border-[#53618a] text-black focus:outline-none"
                    value={form.testerEmail}
                />

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-[#84ec76] hover:bg-[#76da69] text-white font-bold px-6 py-3 rounded-lg w-full disabled:opacity-50"
                >
                    {loading ? 'Submitting...' : 'Submit Bug'}
                </button>
            </div>
        </div>
    );
}

export default CreateBug;
