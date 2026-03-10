import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, MapPin, Calendar, Users, Train, Plane, Car, Ship } from 'lucide-react';
import { tripService } from '../services/api';

const CreateTripModal = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        destination: '',
        startDate: '',
        endDate: '',
        people: 2,
        transport: 'Máy bay'
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await tripService.createTrip(formData);
            onSuccess(response.data);
        } catch (error) {
            console.error('Lỗi khi tạo chuyến đi:', error);
        } finally {
            setLoading(false);
        }
    };

    const transportOptions = [
        { name: 'Máy bay', icon: Plane },
        { name: 'Tàu hỏa', icon: Train },
        { name: 'Xe khách/Ô tô', icon: Car },
        { name: 'Tàu thủy', icon: Ship },
    ];

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
                className="relative w-full max-w-xl glass-card bg-white p-8 overflow-hidden shadow-2xl"
            >
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 transition-colors"
                >
                    <X size={20} className="text-slate-400" />
                </button>

                <h2 className="text-3xl font-bold font-poppins mb-2 text-slate-800">Hành trình Mới</h2>
                <p className="text-slate-500 mb-8">Hãy kể cho chúng mình nghe về điểm đến mơ ước tiếp theo của hai bạn.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Tên Chuyến đi</label>
                        <input
                            required
                            name="name"
                            placeholder="v.d. Đà Lạt Chill 3 ngày"
                            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Điểm đến</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                required
                                name="destination"
                                placeholder="Bạn muốn đi đâu?"
                                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg"
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Ngày đi</label>
                            <input
                                required
                                type="date"
                                name="startDate"
                                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-inter"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Ngày về</label>
                            <input
                                required
                                type="date"
                                name="endDate"
                                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-inter"
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Số người</label>
                            <div className="relative">
                                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="number"
                                    name="people"
                                    defaultValue={2}
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Phương tiện</label>
                            <select
                                name="transport"
                                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none bg-white"
                                onChange={handleChange}
                            >
                                {transportOptions.map(opt => (
                                    <option key={opt.name} value={opt.name}>{opt.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-accent transition-all active:scale-[0.98] shadow-lg shadow-primary/20 disabled:opacity-50 mt-4"
                    >
                        {loading ? 'Đang tạo...' : 'Tạo Chuyến đi'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default CreateTripModal;
