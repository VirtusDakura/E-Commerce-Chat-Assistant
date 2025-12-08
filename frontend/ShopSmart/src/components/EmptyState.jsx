import React from "react";
import { Link } from "react-router-dom";
import Button from "./Button";

export default function EmptyState({
    icon = "cart",
    title,
    message,
    actionText = "Continue Shopping",
    actionLink = "/"
}) {
    const renderIcon = () => {
        if (icon === "cart") {
            return (
                <div style={{
                    width: '160px',
                    height: '160px',
                    borderRadius: '50%',
                    backgroundColor: '#FFD4C4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto'
                }}>
                    <svg
                        style={{ width: '80px', height: '80px', color: '#DC6B4A' }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                    </svg>
                </div>
            );
        } else if (icon === "heart") {
            return (
                <div style={{
                    width: '160px',
                    height: '160px',
                    borderRadius: '50%',
                    backgroundColor: '#FFE0E0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto'
                }}>
                    <svg
                        style={{ width: '80px', height: '80px', color: '#DC6B6B' }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                    </svg>
                </div>
            );
        }
        return null;
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '64px 16px',
            minHeight: '400px'
        }}>
            {/* Icon */}
            <div style={{ marginBottom: '32px' }}>
                {renderIcon()}
            </div>

            {/* Title */}
            <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '12px',
                textAlign: 'center'
            }}>
                {title}
            </h2>

            {/* Message */}
            {message && (
                <p style={{
                    color: '#6b7280',
                    textAlign: 'center',
                    marginBottom: '32px',
                    maxWidth: '400px',
                    fontSize: '15px'
                }}>
                    {message}
                </p>
            )}

            {/* Action Button */}
            <Button
                to={actionLink}
                className="shadow-lg shadow-blue-200"
                size="lg"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                {actionText}
            </Button>
        </div>
    );
}
