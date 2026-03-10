import React, { useState, useEffect } from 'react';
import { DollarSign, PieChart, Info } from 'lucide-react';
import { expenseService } from '../../services/api';

const CostSummary = ({ tripId }) => {
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        fetchSummary();
    }, [tripId]);

    const fetchSummary = async () => {
        try {
            const response = await expenseService.getExpenses(tripId);
            setExpenses(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const total = expenses.reduce((a, b) => a + (b.price * b.quantity), 0);

    const categories = [
        { name: 'Transport', color: 'bg-blue-400' },
        { name: 'Accommodation', color: 'bg-purple-400' },
        { name: 'Food', color: 'bg-orange-400' },
        { name: 'Tickets', color: 'bg-emerald-400' },
        { name: 'Other', color: 'bg-slate-400' },
    ];

    return (
        <div className="glass-card p-6 bg-white overflow-hidden relative">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-800 font-poppins">Cost Summary</h3>
                <PieChart size={20} className="text-primary" />
            </div>

            <div className="space-y-4 mb-6">
                {categories.map(cat => {
                    const amount = expenses.filter(e => e.category === cat.name).reduce((a, b) => a + (b.price * b.quantity), 0);
                    const perc = total > 0 ? (amount / total) * 100 : 0;
                    if (amount === 0) return null;
                    return (
                        <div key={cat.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${cat.color}`} />
                                <span className="text-sm font-medium text-slate-500">{cat.name}</span>
                            </div>
                            <span className="text-sm font-bold text-slate-700">{amount.toLocaleString()}đ</span>
                        </div>
                    )
                })}
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <span className="text-slate-400 font-bold text-sm uppercase">Total Trip</span>
                <span className="text-xl font-bold text-primary">{total.toLocaleString()} VNĐ</span>
            </div>

            <div className="mt-4 p-3 bg-primary/5 rounded-xl flex gap-3">
                <Info size={18} className="text-primary shrink-0" />
                <p className="text-xs text-primary/80 leading-relaxed font-medium">
                    Split costs easily and track your budget in real-time.
                </p>
            </div>
        </div>
    );
};

export default CostSummary;
