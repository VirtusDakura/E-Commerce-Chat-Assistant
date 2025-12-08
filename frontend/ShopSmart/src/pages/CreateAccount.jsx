import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { mockApi } from "../utils/api";
import { useUserStore } from "../store/userStore";

export default function CreateAccount() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const setUser = useUserStore(state => state.setUser);

    React.useEffect(() => {
        document.title = "Create Account | ShopSmart";
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const result = await mockApi.createAccount(name, email, password);
            if (result.success) {
                setUser(result.user);
                navigate("/");
            }
        } catch (error) {
            console.error("Create account error:", error);
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
                        Create your account
                    </h1>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    {/* Name Field */}
                    <div style={{ marginBottom: '20px' }}>
                        <input
                            id="name"
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Full Name"
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                backgroundColor: '#EEF0F8',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '15px',
                                color: '#374151',
                                outline: 'none'
                            }}
                        />
                    </div>

                    {/* Email Field */}
                    <div style={{ marginBottom: '20px' }}>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                backgroundColor: '#EEF0F8',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '15px',
                                color: '#374151',
                                outline: 'none'
                            }}
                        />
                    </div>

                    {/* Password Field */}
                    <div style={{ marginBottom: '20px' }}>
                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            minLength={6}
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                backgroundColor: '#EEF0F8',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '15px',
                                color: '#374151',
                                outline: 'none'
                            }}
                        />
                    </div>

                    {/* Confirm Password Field */}
                    <div style={{ marginBottom: '20px' }}>
                        <input
                            id="confirmPassword"
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm Password"
                            minLength={6}
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                backgroundColor: '#EEF0F8',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '15px',
                                color: '#374151',
                                outline: 'none'
                            }}
                        />
                    </div>

                    {/* Forgot Password Link */}
                    <div style={{ textAlign: 'right', marginTop: '8px', marginBottom: '8px' }}>
                        <Link
                            to="/forgot-password"
                            style={{ fontSize: '13px', color: '#6b7280', textDecoration: 'none' }}
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
                            {loading ? "Signing up..." : "Sign Up"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
