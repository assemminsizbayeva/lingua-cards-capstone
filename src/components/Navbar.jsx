
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileUp, BookOpen, User, LogOut } from 'lucide-react';
import { authAPI } from '../api/auth';

const Navbar = () => {
    const location = useLocation();
    const isAuthenticated = authAPI.isAuthenticated();
    const user = authAPI.getCurrentUser();

    const navItems = [
        { path: '/', label: 'Dashboard', icon: <Home size={20} /> },
        { path: '/cards', label: 'My Cards', icon: <BookOpen size={20} /> },
        { path: '/review', label: 'Review', icon: <BookOpen size={20} /> },
        { path: '/upload', label: 'Upload', icon: <FileUp size={20} /> },
        { path: '/profile', label: 'Profile', icon: <User size={20} /> },
    ];

    const handleLogout = () => {
        authAPI.logout();
        window.location.href = '/login';
    };

    if (!isAuthenticated) {
        return (
            <nav className="navbar">
                <div className="navbar-brand">
                    <BookOpen size={24} />
                    <span>LinguaCards</span>
                </div>
                <div className="navbar-actions">
                    <Link to="/login" className="btn-outline">Login</Link>
                    <Link to="/register" className="btn-primary">Sign Up</Link>
                </div>
            </nav>
        );
    }

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <BookOpen size={24} />
                <span>LinguaCards</span>
            </div>

            <div className="navbar-menu">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </Link>
                ))}
            </div>

            <div className="navbar-user">
                <div className="user-info">
                    <div className="user-avatar">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="user-name">{user?.name || 'User'}</span>
                </div>
                <button onClick={handleLogout} className="logout-btn" title="Logout">
                    <LogOut size={18} />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
