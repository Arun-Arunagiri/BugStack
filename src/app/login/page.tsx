"use client";

import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";

function Login() {
    const [user, setUser] = React.useState({ email: "", password: "" });
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");
    const [validationError, setValidationError] = React.useState("");
    const router = useRouter();

    const validateForm = () => {
        if (!user.email || !user.password) {
            setValidationError("All fields are required.");
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(user.email)) {
            setValidationError("Invalid email format.");
            return false;
        }
        setValidationError("");
        return true;
    };

    const onLogin = async () => {
        if (!validateForm()) return;

        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user),
            });

            if (!res.ok) throw new Error("Failed to login");
            const data = await res.json();

            if (data.success) {
                localStorage.setItem("user", JSON.stringify(data.user));
                const role = data.user.role;
                if (role === "tester") router.push("/tester");
                else if (role === "developer") router.push("/developer");
                else setError("Unknown role");
            } else {
                setError("Invalid credentials");
            }
        } catch (err) {
            setError("Something went wrong");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col-reverse h-screen lg:flex-row bg-[#f8f9fa] justify-center gap-5 items-center">
            <div className="flex flex-col items-center justify-center lg:min-h-screen w-full lg:w-[60vw] py-2 text-[#53618a]">
                <h1 className="text-center text-3xl mb-6 text-black font-bold">Login</h1>

                {(error || validationError) && (
                    <p className="text-red-500 mb-4">{validationError || error}</p>
                )}

                {/* Email */}
                <div className="flex p-2 gap-2 items-center lg:w-2/4 border bg-[#e5e7eb] border-[#53618a] rounded-lg mb-4">
                    <Mail className="h-5" />
                    <input
                        className="text-black w-full focus:outline-none"
                        type="text"
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

                <button
                    className="p-2 rounded-lg mb-4 w-[250px] lg:w-2/4 bg-[#84ec76] text-white font-bold hover:bg-[#76da69]"
                    onClick={onLogin}
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login here"}
                </button>

                <Link href="/signup">Visit Sign up</Link>
            </div>

            <div className="flex items-center lg:mr-10 lg:w-[40vw]">
                <img className="w-[200] lg:w-[40vw]" src={"/Images/login.png"} alt="login" />
            </div>
        </div>
    );
}

export default Login;
