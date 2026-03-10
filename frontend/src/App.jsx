import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import TripDashboard from './pages/TripDashboard';

function App() {
    return (
        <div className="min-h-screen bg-background font-inter">
            <Navbar />
            <main className="pt-24 pb-12">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/trips/:id" element={<TripDashboard />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;
