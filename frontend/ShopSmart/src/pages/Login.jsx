import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { mockApi } from "../utils/api";
import { useUserStore } from "../store/userStore";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const setUser = useUserStore(state => state.setUser);

    React.useEffect(() => {
        document.title = "Login | ShopSmart";
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await mockApi.login(email, password);
            if (result.success) {
                setUser(result.user);
                navigate("/");
            }
        } catch (error) {
            console.error("Login error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 16px' }}>
            <div style={{ width: '100%', maxWidth: '480px' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#000000', margin: '0' }}>
                        Welcome back
                    </h1>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    {/* Email Field */}
                    <div style={{ marginBottom: '20px' }}>
                        <label htmlFor="email" style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                backgroundColor: '#ffffff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                fontSize: '15px',
                                color: '#374151',
                                outline: 'none'
                            }}
                        />
                    </div>

                    {/* Password Field */}
                    <div style={{ marginBottom: '20px' }}>
                        <label htmlFor="password" style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            minLength={6}
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                backgroundColor: '#ffffff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                fontSize: '15px',
                                color: '#374151',
                                outline: 'none'
                            }}
                        />
                    </div>

                    {/* Forgot Password Link */}
                    <div style={{ textAlign: 'right', marginTop: '8px', marginBottom: '16px' }}>
                        <Link
                            to="/forgot-password"
                            style={{ fontSize: '14px', color: '#2563eb', textDecoration: 'none', fontWeight: '500' }}
                        >
                            Forgot password?
                        </Link>
                    </div>

                    {/* Submit Button */}
                    <div style={{ marginTop: '32px' }}>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                backgroundColor: '#2563eb',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '15px',
                                fontWeight: '600',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.5 : 1
                            }}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </div>
                </form>

                {/* Sign up Link */}
                <div style={{ marginTop: '32px', textAlign: 'center' }}>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>
                        Don't have an account?{" "}
                        <Link
                            to="/create-account"
                            style={{ fontWeight: '500', color: '#6b7280', textDecoration: 'none' }}
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
