import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, MapPin, Tag, Upload, X } from 'lucide-react';
import { placeService } from '../../services/api';
import { storage } from '../../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const PlacesList = ({ tripId }) => {
    const [places, setPlaces] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newPlace, setNewPlace] = useState({
        name: '',
        ticketPrice: '',
        description: '',
        location: '',
        image: null
    });
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        fetchPlaces();
    }, [tripId]);

    const fetchPlaces = async () => {
        try {
            const response = await placeService.getPlaces(tripId);
            setPlaces(response.data);
        } catch (error) {
            console.error('Lỗi khi tải địa điểm:', error);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewPlace({ ...newPlace, image: file });
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl = '';

            // Upload to Firebase if image exists
            if (newPlace.image) {
                const storageRef = ref(storage, `places/${Date.now()}_${newPlace.image.name}`);
                const snapshot = await uploadBytes(storageRef, newPlace.image);
                imageUrl = await getDownloadURL(snapshot.ref);
            }

            // Prepare data
            const placeData = {
                tripId,
                name: newPlace.name,
                ticketPrice: Number(newPlace.ticketPrice),
                description: newPlace.description,
                location: newPlace.location,
                image: imageUrl
            };

            await placeService.createPlace(placeData);
            setIsAdding(false);
            setNewPlace({ name: '', ticketPrice: '', description: '', location: '', image: null });
            setPreview(null);
            fetchPlaces();
        } catch (error) {
            console.error('Lỗi khi thêm địa điểm:', error);
        } finally {
            setLoading(false);
        }
    };

    const deletePlace = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa địa điểm này?')) {
            try {
                await placeService.deletePlace(id);
                fetchPlaces();
            } catch (error) {
                console.error('Lỗi khi xóa địa điểm:', error);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold font-poppins text-slate-800">Địa điểm Phải đến</h2>
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-bold hover:bg-accent transition-all active:scale-95"
                >
                    <Plus size={20} />
                    <span>Thêm Địa điểm</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence>
                    {isAdding && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="glass-card bg-white p-6 relative col-span-1 md:col-span-2 shadow-2xl border-2 border-primary/20"
                        >
                            <button
                                onClick={() => setIsAdding(false)}
                                className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full"
                            >
                                <X size={20} className="text-slate-400" />
                            </button>
                            <h3 className="text-xl font-bold mb-6 font-poppins text-slate-800">Điểm đến Mới</h3>
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <input
                                        required placeholder="Tên địa điểm"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20"
                                        value={newPlace.name}
                                        onChange={(e) => setNewPlace({ ...newPlace, name: e.target.value })}
                                    />
                                    <input
                                        placeholder="Vị trí / Địa chỉ"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20"
                                        value={newPlace.location}
                                        onChange={(e) => setNewPlace({ ...newPlace, location: e.target.value })}
                                    />
                                    <input
                                        type="number" placeholder="Giá vé (VNĐ)"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20"
                                        value={newPlace.ticketPrice}
                                        onChange={(e) => setNewPlace({ ...newPlace, ticketPrice: e.target.value })}
                                    />
                                    <textarea
                                        placeholder="Mô tả ngắn..."
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 h-24"
                                        value={newPlace.description}
                                        onChange={(e) => setNewPlace({ ...newPlace, description: e.target.value })}
                                    />
                                </div>
                                <div className="flex flex-col gap-4">
                                    <div className="relative h-full flex-1 border-2 border-dashed border-slate-200 rounded-2xl flex flex-center transition-all hover:bg-slate-50 overflow-hidden min-h-[150px]">
                                        {preview ? (
                                            <img src={preview} className="absolute inset-0 w-full h-full object-cover" alt="Preview" />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center w-full h-full text-slate-400 p-8">
                                                <Upload size={32} className="mb-2" />
                                                <span className="text-center font-medium">Nhấn để tải ảnh lên</span>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-accent transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                                    >
                                        {loading ? 'Đang lưu...' : 'Lưu Địa điểm'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {places.map((place) => (
                    <motion.div
                        layout
                        key={place._id}
                        className="glass-card overflow-hidden group hover:shadow-xl transition-all"
                    >
                        <div className="h-56 relative overflow-hidden bg-slate-100">
                            {place.image ? (
                                <img src={place.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={place.name} />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                    <MapPin size={48} />
                                </div>
                            )}
                            <div className="absolute top-4 right-4 flex gap-2">
                                <button
                                    onClick={() => deletePlace(place._id)}
                                    className="p-2 bg-white/90 backdrop-blur rounded-full text-red-400 hover:text-red-500 hover:scale-110 transition-all shadow-sm"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                                <h3 className="text-xl font-bold text-white mb-1">{place.name}</h3>
                                <div className="flex items-center gap-2 text-white/80 text-sm">
                                    <MapPin size={14} />
                                    <span>{place.location || 'Vị trí chưa xác định'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <p className="text-slate-600 mb-6 font-inter leading-relaxed line-clamp-3">
                                {place.description || 'Chưa có mô tả cho địa điểm này.'}
                            </p>
                            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-2 text-primary">
                                    <Tag size={18} />
                                    <span className="font-bold">{place.ticketPrice ? place.ticketPrice.toLocaleString() + ' VNĐ' : 'Miễn phí'}</span>
                                </div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    Giá vé tham khảo
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default PlacesList;
