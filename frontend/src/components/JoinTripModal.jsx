import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Hash, ArrowRight } from 'lucide-react';
import { tripService } from '../services/api';

const JoinTripModal = ({ onClose, onSuccess }) => {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await tripService.joinTrip(code);
            // Store in local storage to track joined trips
            const joinedTrips = JSON.parse(localStorage.getItem('joinedTrips') || '[]');
            if (!joinedTrips.includes(response.data._id)) {
                joinedTrips.push(response.data._id);
                localStorage.setItem('joinedTrips', JSON.stringify(joinedTrips));
            }
            onSuccess(response.data._id);
        } catch (err) {
            setError('Invalid invite code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative w-full max-w-md glass-card bg-white p-8 overflow-hidden shadow-2xl"
            >
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 transition-colors"
                >
                    <X size={20} className="text-slate-400" />
                </button>

                <h2 className="text-3xl font-bold font-poppins mb-2 text-slate-800">Join a Trip</h2>
                <p className="text-slate-500 mb-8">Enter the 6-character code shared by your partner.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">Invite Code</label>
                        <div className="relative">
                            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
                            <input
                                required
                                maxLength={6}
                                value={code}
                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                                placeholder="ABCDEF"
                                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-100 focus:outline-none focus:border-primary transition-all text-2xl font-bold tracking-[0.5em] uppercase text-center"
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm font-medium ml-1">{error}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading || code.length < 6}
                        className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-accent transition-all active:scale-[0.98] shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? 'Searching...' : 'Join Adventurers'}
                        {!loading && <ArrowRight size={20} />}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default JoinTripModal;
