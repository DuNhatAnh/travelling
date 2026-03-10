import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Clock, MapPin, Trash2, Calendar } from 'lucide-react';
import { timelineService } from '../../services/api';

const ItineraryTimeline = ({ tripId }) => {
    const [timeline, setTimeline] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newItem, setNewItem] = useState({
        day: 1,
        time: '08:00',
        activity: ''
    });

    useEffect(() => {
        fetchTimeline();
    }, [tripId]);

    const fetchTimeline = async () => {
        try {
            const response = await timelineService.getTimeline(tripId);
            setTimeline(response.data);
        } catch (error) {
            console.error('Lỗi khi tải lịch trình:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await timelineService.createTimeline({ ...newItem, tripId, day: Number(newItem.day) });
            setIsAdding(false);
            setNewItem({ ...newItem, activity: '' });
            fetchTimeline();
        } catch (error) {
            console.error('Lỗi khi thêm sự kiện:', error);
        }
    };

    const deleteItem = async (id) => {
        try {
            await timelineService.deleteTimeline(id);
            fetchTimeline();
        } catch (error) {
            console.error('Lỗi khi xóa sự kiện:', error);
        }
    };

    // Group timeline by day
    const groupedTimeline = timeline.reduce((acc, item) => {
        if (!acc[item.day]) acc[item.day] = [];
        acc[item.day].push(item);
        return acc;
    }, {});

    const days = Object.keys(groupedTimeline).sort((a, b) => a - b);

    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold font-poppins text-slate-800">Lịch trình Chuyến đi</h2>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-bold hover:bg-accent transition-all active:scale-95"
                >
                    <Plus size={20} />
                    <span>Thêm Sự kiện</span>
                </button>
            </div>

            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="glass-card p-6 bg-white border-2 border-primary/10 shadow-xl"
                    >
                        <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase">Ngày</label>
                                <input
                                    type="number" min="1"
                                    className="w-20 px-4 py-2.5 rounded-xl border border-slate-200"
                                    value={newItem.day} onChange={e => setNewItem({ ...newItem, day: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase">Giờ</label>
                                <input
                                    type="time"
                                    className="w-32 px-4 py-2.5 rounded-xl border border-slate-200"
                                    value={newItem.time} onChange={e => setNewItem({ ...newItem, time: e.target.value })}
                                />
                            </div>
                            <div className="flex-1 space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase">Hoạt động</label>
                                <input
                                    required placeholder="Bạn dự định làm gì? (v.d. Ăn trưa tại hồ)"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
                                    value={newItem.activity} onChange={e => setNewItem({ ...newItem, activity: e.target.value })}
                                />
                            </div>
                            <button className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-accent transition-all">
                                Lưu
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-12">
                {days.length > 0 ? days.map((day) => (
                    <div key={day} className="relative">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-primary/20">
                                {day}
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800">Ngày {day}</h3>
                        </div>

                        <div className="ml-6 space-y-6 relative border-l-2 border-primary/20 pl-10">
                            {groupedTimeline[day].map((item, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    key={item._id}
                                    className="relative group"
                                >
                                    {/* Dot */}
                                    <div className="absolute -left-[51px] top-6 w-5 h-5 rounded-full bg-white border-4 border-primary shadow-sm z-10" />

                                    <div className="glass-card p-6 bg-white hover:shadow-lg transition-all flex items-center justify-between group">
                                        <div className="flex gap-6 items-start">
                                            <div className="flex items-center gap-2 text-primary font-bold whitespace-nowrap pt-1">
                                                <Clock size={16} />
                                                <span>{item.time}</span>
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="text-lg font-bold text-slate-800">{item.activity}</h4>
                                                <div className="flex items-center gap-1 text-slate-400 text-sm">
                                                    <MapPin size={14} />
                                                    <span>Địa điểm tùy chọn</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => deleteItem(item._id)}
                                            className="p-2 text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-20 text-slate-400 font-medium">
                        Lịch trình của bạn đang trống. Hãy bắt đầu thêm các hoạt động!
                    </div>
                )}
            </div>
        </div>
    );
};

export default ItineraryTimeline;
