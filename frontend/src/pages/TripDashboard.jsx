import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Map as MapIcon,
    DollarSign,
    Clock,
    Trash2,
    ChevronLeft,
    Calendar,
    MapPin,
    Download,
    Copy,
    Hash
} from 'lucide-react';
import { jsPDF } from "jspdf";
import { tripService } from '../services/api';
import PlacesList from '../components/dashboard/PlacesList';
import ExpensesTracker from '../components/dashboard/ExpensesTracker';
import ItineraryTimeline from '../components/dashboard/ItineraryTimeline';
import CostSummary from '../components/dashboard/CostSummary';
import TripMap from '../components/dashboard/TripMap';

const TripDashboard = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const [activeTab, setActiveTab] = useState('places');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTripData();
    }, [id]);

    const fetchTripData = async () => {
        try {
            const response = await tripService.getTrip(id);
            setTrip(response.data);
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu chuyến đi:', error);
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.setTextColor(126, 200, 227); // Primary color
        doc.text(`Kế hoạch Chuyến đi: ${trip.name}`, 20, 20);

        doc.setFontSize(14);
        doc.setTextColor(100);
        doc.text(`Điểm đến: ${trip.destination}`, 20, 30);
        doc.text(`Ngày: ${new Date(trip.startDate).toLocaleDateString('vi-VN')} - ${new Date(trip.endDate).toLocaleDateString('vi-VN')}`, 20, 40);

        doc.setTextColor(0);
        doc.text("Tóm tắt lịch trình:", 20, 60);
        doc.setFontSize(10);
        doc.text("Được tạo bởi TripPlanner cho Cặp đôi", 20, 280);

        doc.save(`${trip.name.replace(/\s+/g, '_')}_kehoach.pdf`);
    };

    const copyInviteCode = () => {
        navigator.clipboard.writeText(trip.inviteCode);
        alert('Đã sao chép mã mời vào bộ nhớ tạm!');
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    const deleteTrip = async () => {
        if (window.confirm('Bạn có chắc muốn xóa toàn bộ chuyến đi này?')) {
            try {
                await tripService.deleteTrip(id);
                navigate('/');
            } catch (error) {
                console.error('Lỗi khi xóa chuyến đi:', error);
            }
        }
    };

    const tabs = [
        { id: 'places', label: 'Địa điểm', icon: MapPin },
        { id: 'expenses', label: 'Chi phí', icon: DollarSign },
        { id: 'timeline', label: 'Lịch trình', icon: Clock },
        { id: 'map', label: 'Bản đồ', icon: MapIcon },
    ];

    return (
        <div className="max-w-7xl mx-auto px-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-4 group"
                    >
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Quay lại</span>
                    </button>
                    <div className="flex items-center gap-4 mb-2">
                        <h1 className="text-4xl font-bold font-poppins text-slate-800">{trip?.name}</h1>
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm font-bold">
                            {trip?.transport}
                        </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-6 text-slate-500 font-medium">
                        <div className="flex items-center gap-2">
                            <MapPin size={18} className="text-primary" />
                            <span>{trip?.destination}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={18} className="text-primary" />
                            <span>{new Date(trip?.startDate).toLocaleDateString('vi-VN')} - {new Date(trip?.endDate).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div
                            onClick={copyInviteCode}
                            className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-primary/20 text-primary cursor-pointer hover:bg-primary hover:text-white transition-all shadow-sm"
                            title="Nhấn để sao chép mã mời"
                        >
                            <Hash size={16} />
                            <span className="font-bold tracking-wider">{trip?.inviteCode}</span>
                            <Copy size={14} />
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handleExportPDF}
                        className="p-3 bg-white shadow-soft rounded-xl text-slate-600 hover:text-primary transition-all active:scale-95 flex items-center gap-2"
                    >
                        <Download size={22} />
                        <span className="hidden md:inline font-bold text-sm">Xuất PDF</span>
                    </button>
                    <button
                        onClick={deleteTrip}
                        className="p-3 bg-white shadow-soft rounded-xl text-red-400 hover:text-red-500 transition-all active:scale-95"
                    >
                        <Trash2 size={22} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Sidebar Tabs */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="glass-card p-4 space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl font-bold transition-all ${activeTab === tab.id
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                                    }`}
                            >
                                <tab.icon size={20} />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    <CostSummary tripId={id} />
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-9">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab === 'places' && <PlacesList tripId={id} />}
                            {activeTab === 'expenses' && <ExpensesTracker tripId={id} peopleCount={trip?.people} />}
                            {activeTab === 'timeline' && <ItineraryTimeline tripId={id} />}
                            {activeTab === 'map' && <TripMap tripId={id} />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default TripDashboard;
