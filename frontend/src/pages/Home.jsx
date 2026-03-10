import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, MapPin, Calendar, Users, ArrowRight, Share2, Users2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { tripService } from '../services/api';
import CreateTripModal from '../components/CreateTripModal';
import JoinTripModal from '../components/JoinTripModal';

const Home = () => {
    const [trips, setTrips] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTrips();
    }, []);

    const fetchTrips = async () => {
        try {
            const response = await tripService.getTrips();
            // In a real app with auth, we'd only get user's trips.
            // For this "setup", we filter based on IDs stored in localStorage
            const myTripIds = JSON.parse(localStorage.getItem('myTrips') || '[]');
            const joinedTripIds = JSON.parse(localStorage.getItem('joinedTrips') || '[]');
            const relevantIds = [...myTripIds, ...joinedTripIds];

            const filteredTrips = response.data.filter(t => relevantIds.includes(t._id));
            setTrips(filteredTrips);
        } catch (error) {
            console.error('Error fetching trips:', error);
        }
    };

    const handleCreateSuccess = (newTrip) => {
        setIsModalOpen(false);
        const myTrips = JSON.parse(localStorage.getItem('myTrips') || '[]');
        myTrips.push(newTrip._id);
        localStorage.setItem('myTrips', JSON.stringify(myTrips));
        fetchTrips();
        navigate(`/trips/${newTrip._id}`);
    };

    return (
        <div className="max-w-7xl mx-auto px-6">
            {/* Hero Section */}
            <section className="relative h-[600px] rounded-3xl overflow-hidden mb-16 group">
                <img
                    src="https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6?auto=format&fit=crop&q=80&w=2000"
                    alt="Luxury travel backdrop"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent flex items-center px-12 md:px-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-2xl text-white"
                    >
                        <h1 className="text-5xl md:text-7xl font-bold font-poppins mb-6 leading-tight">
                            Plan Beautiful <br />
                            <span className="text-primary">Trips Together</span>
                        </h1>
                        <p className="text-xl md:text-2xl opacity-90 mb-10 font-inter leading-relaxed">
                            Lên kế hoạch chuyến đi, lưu những nơi muốn đến và tính chi phí cho chuyến du lịch của hai bạn.
                            <br /><span className="text-primary font-bold">Connect with your partner from any device.</span>
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="px-8 py-4 bg-primary rounded-2xl font-bold text-lg hover:bg-accent transition-all flex items-center gap-2 shadow-xl shadow-primary/20 active:scale-95"
                            >
                                <Plus size={24} />
                                <span>Create New Trip</span>
                            </button>
                            <button
                                onClick={() => setIsJoinModalOpen(true)}
                                className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all flex items-center gap-2 active:scale-95"
                            >
                                <Share2 size={24} />
                                <span>Join with Code</span>
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Trips Row */}
            <section>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold font-poppins text-slate-800">Your Shared Adventures</h2>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setIsJoinModalOpen(true)}
                            className="flex items-center gap-2 text-slate-500 font-bold hover:text-primary transition-colors"
                        >
                            <ArrowRight size={18} className="rotate-180" /> Join via Code
                        </button>
                    </div>
                </div>

                {trips.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {trips.map((trip) => (
                            <motion.div
                                key={trip._id}
                                whileHover={{ y: -8 }}
                                onClick={() => navigate(`/trips/${trip._id}`)}
                                className="glass-card overflow-hidden cursor-pointer group hover:shadow-2xl transition-all"
                            >
                                <div className="h-48 bg-slate-200 relative">
                                    <img
                                        src={`https://source.unsplash.com/featured/?${trip.destination}`}
                                        alt={trip.destination}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl text-primary font-bold shadow-sm flex items-center gap-1.5">
                                        <Hash size={14} /> {trip.inviteCode}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-2 text-slate-800 group-hover:text-primary transition-colors">{trip.name}</h3>
                                    <div className="space-y-3 text-slate-500 font-medium">
                                        <div className="flex items-center gap-2">
                                            <MapPin size={18} className="text-primary" />
                                            <span>{trip.destination}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar size={18} className="text-primary" />
                                                <span>{new Date(trip.startDate).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Users2 size={18} className="text-primary" />
                                                <span>{trip.people} Participants</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="glass-card p-16 text-center border-dashed border-2 border-primary/20 bg-primary/5">
                        <div className="bg-white p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-soft">
                            <Users size={40} className="text-primary" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">No active journeys</h3>
                        <p className="text-slate-500 mb-8 max-w-sm mx-auto">Create a new trip or join one using a code shared by your partner.</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-accent transition-all active:scale-95 shadow-lg shadow-primary/20"
                            >
                                Start New Trip
                            </button>
                            <button
                                onClick={() => setIsJoinModalOpen(true)}
                                className="px-8 py-3 bg-white text-primary border border-primary/20 rounded-xl font-bold hover:bg-slate-50 transition-all active:scale-95"
                            >
                                Join with Code
                            </button>
                        </div>
                    </div>
                )}
            </section>

            {isModalOpen && (
                <CreateTripModal
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={handleCreateSuccess}
                />
            )}

            {isJoinModalOpen && (
                <JoinTripModal
                    onClose={() => setIsJoinModalOpen(false)}
                    onSuccess={(id) => {
                        setIsJoinModalOpen(false);
                        fetchTrips();
                        navigate(`/trips/${id}`);
                    }}
                />
            )}
        </div>
    );
};

export default Home;
