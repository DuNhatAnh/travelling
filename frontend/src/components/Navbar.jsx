import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, Plane, Heart } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between glass-card px-8 py-3">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="bg-primary p-2 rounded-xl text-white group-hover:rotate-12 transition-transform">
                        <Plane size={24} />
                    </div>
                    <span className="text-xl font-bold font-poppins bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        TripPlanner
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8 font-inter font-medium text-slate-600">
                    <Link to="/" className={`hover:text-primary transition-colors ${location.pathname === '/' ? 'text-primary' : ''}`}>
                        Home
                    </Link>
                    <Link to="/trips" className={`hover:text-primary transition-colors ${location.pathname.includes('/trips') ? 'text-primary' : ''}`}>
                        My Trips
                    </Link>
                    <a href="#" className="hover:text-primary transition-colors">Explore</a>
                </div>

                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-accent transition-all hover:shadow-lg shadow-primary/20 active:scale-95">
                        <Heart size={18} fill="currentColor" />
                        <span>Couple Mode</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
