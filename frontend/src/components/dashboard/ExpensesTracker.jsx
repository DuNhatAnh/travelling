import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, CreditCard, Tag, TrendingUp, Filter, Users } from 'lucide-react';
import { expenseService } from '../../services/api';

const ExpensesTracker = ({ tripId, peopleCount = 2 }) => {
    const [expenses, setExpenses] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newExpense, setNewExpense] = useState({
        name: '',
        category: 'Ăn uống',
        price: '',
        quantity: 1
    });

    const categories = ['Di chuyển', 'Chỗ ở', 'Ăn uống', 'Vé tham quan', 'Giải trí', 'Khác'];

    useEffect(() => {
        fetchExpenses();
    }, [tripId]);

    const fetchExpenses = async () => {
        try {
            const response = await expenseService.getExpenses(tripId);
            setExpenses(response.data);
        } catch (error) {
            console.error('Lỗi khi tải chi phí:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await expenseService.createExpense({ ...newExpense, tripId, price: Number(newExpense.price) });
            setIsAdding(false);
            setNewExpense({ name: '', category: 'Ăn uống', price: '', quantity: 1 });
            fetchExpenses();
        } catch (error) {
            console.error('Lỗi khi thêm chi phí:', error);
        }
    };

    const deleteExpense = async (id) => {
        try {
            await expenseService.deleteExpense(id);
            fetchExpenses();
        } catch (error) {
            console.error('Lỗi khi xóa chi phí:', error);
        }
    };

    const totalCost = expenses.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold font-poppins text-slate-800">Chi phí Chuyến đi</h2>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-bold hover:bg-accent transition-all active:scale-95"
                >
                    <Plus size={20} />
                    <span>Thêm Chi phí</span>
                </button>
            </div>

            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <form onSubmit={handleSubmit} className="glass-card p-6 bg-white border-2 border-primary/10 grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div className="md:col-span-1">
                                <input
                                    required placeholder="Tên khoản chi"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20"
                                    value={newExpense.name}
                                    onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <select
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 bg-white"
                                    value={newExpense.category}
                                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                                >
                                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <input
                                    required type="number" placeholder="Giá"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20"
                                    value={newExpense.price}
                                    onChange={(e) => setNewExpense({ ...newExpense, price: e.target.value })}
                                />
                                <input
                                    type="number" placeholder="SL"
                                    className="w-32 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20"
                                    value={newExpense.quantity}
                                    onChange={(e) => setNewExpense({ ...newExpense, quantity: e.target.value })}
                                />
                            </div>
                            <button className="bg-primary text-white rounded-xl font-bold hover:bg-accent transition-all">
                                Thêm Mục
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="glass-card overflow-hidden bg-white">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 font-bold text-sm uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Khoản chi</th>
                            <th className="px-6 py-4">Danh mục</th>
                            <th className="px-6 py-4">Giá</th>
                            <th className="px-6 py-4">Số lượng</th>
                            <th className="px-6 py-4">Tổng</th>
                            <th className="px-6 py-4">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {expenses.map((expense) => (
                            <tr key={expense._id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-bold text-slate-700">{expense.name}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${categoryStyles[expense.category] || categoryStyles['Khác']}`}>
                                        {expense.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-medium">{expense.price.toLocaleString()} VNĐ</td>
                                <td className="px-6 py-4 text-slate-500">x{expense.quantity}</td>
                                <td className="px-6 py-4 font-bold text-primary">{(expense.price * expense.quantity).toLocaleString()} VNĐ</td>
                                <td className="px-6 py-4">
                                    <button onClick={() => deleteExpense(expense._id)} className="text-red-300 hover:text-red-500 transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {expenses.length === 0 && (
                    <div className="p-12 text-center text-slate-400">
                        Chưa có khoản chi nào được ghi lại.
                    </div>
                )}
            </div>

            {/* Visual Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card p-6 bg-gradient-to-br from-primary to-accent text-white">
                    <div className="flex items-center gap-3 mb-4 opacity-80">
                        <Users size={20} />
                        <span className="font-bold">Tổng Chi phí cho {peopleCount} người</span>
                    </div>
                    <div className="text-4xl font-bold mb-2">{totalCost.toLocaleString()} VNĐ</div>
                    <div className="text-white/80 font-medium">Trung bình {(totalCost / peopleCount).toLocaleString()} VNĐ mỗi người</div>
                </div>

                <div className="glass-card p-6 bg-white border border-slate-100">
                    <div className="flex items-center gap-3 mb-6 text-slate-500 font-bold uppercase text-xs tracking-wider">
                        <TrendingUp size={18} className="text-primary" />
                        <span>Danh mục hàng đầu</span>
                    </div>
                    <div className="space-y-4">
                        {categories.slice(0, 3).map(cat => {
                            const catTotal = expenses.filter(e => e.category === cat).reduce((a, b) => a + (b.price * b.quantity), 0);
                            const perc = totalCost > 0 ? (catTotal / totalCost) * 100 : 0;
                            return (
                                <div key={cat} className="space-y-2">
                                    <div className="flex justify-between text-sm font-bold text-slate-600">
                                        <span>{cat}</span>
                                        <span>{catTotal.toLocaleString()} VNĐ</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${perc}%` }}
                                            className="h-full bg-primary"
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

const categoryStyles = {
    'Di chuyển': 'text-blue-500 bg-blue-50 border-blue-100',
    'Chỗ ở': 'text-purple-500 bg-purple-50 border-purple-100',
    'Ăn uống': 'text-orange-500 bg-orange-50 border-orange-100',
    'Vé tham quan': 'text-emerald-500 bg-emerald-50 border-emerald-100',
    'Giải trí': 'text-pink-500 bg-pink-50 border-pink-100',
    'Khác': 'text-slate-500 bg-slate-50 border-slate-100',
    Transport: 'text-blue-500 bg-blue-50 border-blue-100',
    Accommodation: 'text-purple-500 bg-purple-50 border-purple-100',
    Food: 'text-orange-500 bg-orange-50 border-orange-100',
    Tickets: 'text-emerald-500 bg-emerald-50 border-emerald-100',
    Entertainment: 'text-pink-500 bg-pink-50 border-pink-100',
    Other: 'text-slate-500 bg-slate-50 border-slate-100',
};

export default ExpensesTracker;
