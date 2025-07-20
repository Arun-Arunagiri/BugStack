"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, UserCircle2 } from "lucide-react";

function SignUp() {
    const [user, setUser] = useState({ name: "", email: "", password: "", role: "tester" });
    const [message, setMessage] = useState("");
    const [validationError, setValidationError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const validateForm = () => {
        const { name, email, password } = user;
        if (!name || !email || !password) {
            setValidationError("All fields are required.");
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setValidationError("Invalid email format.");
            return false;
        }
        if (password.length < 6) {
            setValidationError("Password must be at least 6 characters.");
            return false;
        }
        setValidationError("");
        return true;
    };

    const handleSignUp = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const res = await fetch("/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user),
            });

            const data = await res.json();
            if (data.success) {
                setMessage("User created successfully!");
                setTimeout(() => router.push("/login"), 1500);
            } else {
                setMessage(data.message || "Error creating user");
            }
        } catch (err) {
            setMessage("Something went wrong");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col-reverse h-screen lg:flex-row bg-[#f8f9fa] justify-center gap-5 items-center">
            <div className="flex flex-col items-center justify-center lg:min-h-screen w-full lg:w-[60vw] py-2 text-[#53618a]">
                <h1 className="text-center text-3xl mb-6 text-black font-bold">Sign Up</h1>

                {(validationError || message) && (
                    <p className="text-red-500 mb-4">{validationError || message}</p>
                )}

                {/* Name */}
                <div className="flex p-2 gap-2 items-center lg:w-2/4 border bg-[#e5e7eb] border-[#53618a] rounded-lg mb-4">
                    <User className="h-5" />
                    <input
                        className="text-black w-full focus:outline-none"
                        type="text"
                        value={user.name}
                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                        placeholder="Name"
                    />
                </div>

                {/* Email */}
                <div className="flex p-2 gap-2 items-center lg:w-2/4 border bg-[#e5e7eb] border-[#53618a] rounded-lg mb-4">
                    <Mail className="h-5" />
                    <input
                        className="text-black w-full focus:outline-none"
                        type="email"
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        placeholder="Email"
                    />
                </div>

                {/* Password */}
                <div className="flex p-2 gap-2 items-center lg:w-2/4 border bg-[#e5e7eb] border-[#53618a] rounded-lg mb-4">
                    <Lock className="h-5" />
                    <input
                        className="text-black w-full focus:outline-none"
                        type="password"
                        value={user.password}
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                        placeholder="Password"
                    />
                </div>

                {/* Role */}
                <div className="flex p-2 gap-2 items-center lg:w-2/4 border bg-[#e5e7eb] border-[#53618a] rounded-lg mb-4">
                    <UserCircle2 className="h-5" />
                    <select
                        className="text-black w-full bg-[#e5e7eb] focus:outline-none"
                        value={user.role}
                        onChange={(e) => setUser({ ...user, role: e.target.value })}
                    >
                        <option value="tester">Tester</option>
                        <option value="developer">Developer</option>
                    </select>
                </div>

                <button
                    className="p-2 rounded-lg mb-4 w-[250px] lg:w-2/4 bg-[#84ec76] text-white font-bold hover:bg-[#76da69]"
                    onClick={handleSignUp}
                    disabled={loading}
                >
                    {loading ? "Creating..." : "Create User"}
                </button>

                <Link href="/login" className="text-blue-500 underline">
                    Already have an account? Login
                </Link>
            </div>

            <div className="flex items-center lg:mr-10 lg:w-[40vw]">
                <img className="w-[200] lg:w-[40vw]" src={"/Images/login.png"} alt="signup" />
            </div>
        </div>
    );
}

export default SignUp;
