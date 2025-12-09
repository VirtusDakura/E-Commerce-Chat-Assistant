import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    React.useEffect(() => {
        document.title = "Forgot Password | ShopSmart";
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate password reset email
        setTimeout(() => {
            setMessage("If an account exists with this email, you will receive a password reset link.");
            setLoading(false);
        }, 1500);
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 16px' }}>
            <div style={{ width: '100%', maxWidth: '480px' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                    <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#000000', margin: '0' }}>
                        Forgot Password
                    </h1>
                </div>

                {/* Subtext */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
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
                            placeholder=""
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
                            {loading ? "Sending..." : "Send Reset Code"}
                        </button>
                    </div>
                </form>

                {/* Success Message */}
                {message && (
                    <div style={{ marginTop: '24px', padding: '12px', backgroundColor: '#d1fae5', borderRadius: '8px', textAlign: 'center' }}>
                        <p style={{ fontSize: '14px', color: '#065f46', margin: '0' }}>
                            {message}
                        </p>
                    </div>
                )}

                {/* Sign In Link */}
                <div style={{ marginTop: '32px', textAlign: 'center' }}>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>
                        Remember your password?{" "}
                        <Link
                            to="/login"
                            style={{ fontWeight: '500', color: '#6b7280', textDecoration: 'none' }}
                        >
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
