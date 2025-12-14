"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { BarChart, Users, Calendar, DollarSign, LogOut } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { ThemeToggle } from '@/components/ThemeToggle';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const STATIC_REGIONS = ['All', 'North', 'South', 'East', 'West'];

export default function Dashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        month: new Date().toISOString().slice(0, 7),
        region: 'All'
    });
    const router = useRouter();

    useEffect(() => {
        fetchStats();
    }, [filters]);

    const fetchStats = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const res = await axios.get('/api/dashboard', {
                params: filters,
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(res.data.stats);
        } catch (err: any) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                router.push('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    if (loading && !stats) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-medium">
            <div className="animate-pulse">Loading Dashboard...</div>
        </div>
    );

    const chartData = {
        labels: ['Metrics'],
        datasets: [
            {
                label: 'People Helped',
                data: [stats?.totalPeopleHelped || 0],
                backgroundColor: '#3b82f6', // blue-500
                borderRadius: 4,
            },
            {
                label: 'Events Conducted',
                data: [stats?.totalEventsConducted || 0],
                backgroundColor: '#10b981', // emerald-500
                borderRadius: 4,
            },
        ],
    };

    const fundsChartData = {
        labels: ['Funds'],
        datasets: [{
            label: 'Funds Utilized (₹)',
            data: [stats?.totalFundsUtilized || 0],
            backgroundColor: '#f59e0b', // amber-500
            borderRadius: 4,
        }]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: {
                        family: 'Inter, system-ui, sans-serif',
                        size: 12
                    },
                    color: '#64748b' // default slate-500, could verify dark mode handling for charts later or simpler to leave
                }
            },
            title: { display: false },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: '#f1f5f9', // slate-100
                    active: false // simplification
                },
                ticks: {
                    font: { family: 'Inter, system-ui, sans-serif' },
                    color: '#64748b'
                },
                border: { display: false }
            },
            x: {
                grid: { display: false },
                ticks: {
                    font: { family: 'Inter, system-ui, sans-serif' },
                    color: '#64748b'
                },
                border: { display: false }
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-8 font-sans transition-colors duration-300">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Overview</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Track NGO impact and performance metrics.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-red-600 dark:hover:text-red-400 transition-colors shadow-sm font-medium text-sm"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </header>

                {/* Filters Bar */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-wrap gap-6 items-end transition-colors duration-300">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Reporting Month</label>
                        <input
                            type="month"
                            className="w-full block rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:color-scheme-dark"
                            value={filters.month}
                            onChange={e => setFilters({ ...filters, month: e.target.value })}
                        />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Target Region</label>
                        <div className="relative">
                            <select
                                className="w-full appearance-none block rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 pr-8 text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                                value={filters.region}
                                onChange={e => setFilters({ ...filters, region: e.target.value })}
                            >
                                {STATIC_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500 dark:text-slate-400">
                                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        icon={<Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
                        label="People Helped"
                        value={stats?.totalPeopleHelped}
                        color="bg-blue-50 dark:bg-blue-900/20"
                    />
                    <StatCard
                        icon={<Calendar className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />}
                        label="Events Conducted"
                        value={stats?.totalEventsConducted}
                        color="bg-emerald-50 dark:bg-emerald-900/20"
                    />
                    <StatCard
                        icon={<DollarSign className="w-6 h-6 text-amber-600 dark:text-amber-400" />}
                        label="Funds Utilized"
                        value={`₹${stats?.totalFundsUtilized?.toLocaleString() || '0'}`}
                        color="bg-amber-50 dark:bg-amber-900/20"
                    />
                    <StatCard
                        icon={<BarChart className="w-6 h-6 text-violet-600 dark:text-violet-400" />}
                        label="Active NGOs"
                        value={stats?.totalNGOs}
                        color="bg-violet-50 dark:bg-violet-900/20"
                    />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all duration-300">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                            Impact Statistics
                            <span className="text-xs font-normal text-slate-400 border border-slate-100 dark:border-slate-700 rounded-full px-2 py-0.5">Live</span>
                        </h3>
                        <div className="h-64 flex justify-center">
                            <Bar data={chartData} options={chartOptions} />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all duration-300">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                            Financial Overview
                            <span className="text-xs font-normal text-slate-400 border border-slate-100 dark:border-slate-700 rounded-full px-2 py-0.5">YTD</span>
                        </h3>
                        <div className="h-64 flex justify-center">
                            <Bar data={fundsChartData} options={chartOptions} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, color }: any) {
    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-start space-x-4 hover:shadow-md transition-all duration-200 cursor-default group">
            <div className={`p-3 rounded-lg ${color} group-hover:scale-110 transition-transform duration-200`}>
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{label}</p>
                <h4 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{value || 0}</h4>
            </div>
        </div>
    )
}
