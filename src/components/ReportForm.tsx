"use client";

import { useState } from 'react';
import axios from 'axios';

export default function ReportForm() {
    const [formData, setFormData] = useState({
        ngoId: '',
        month: '',
        peopleHelped: '',
        eventsConducted: '',
        fundsUtilized: '',
        region: 'South'
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        try {
            await axios.post('/api/report', formData);
            setStatus('success');
            setFormData({ ...formData, peopleHelped: '', eventsConducted: '', fundsUtilized: '' }); // Reset counts
        } catch (error) {
            setStatus('error');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm transition-colors duration-300">
            <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Submit Monthly Report</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">NGO ID</label>
                    <input
                        type="text"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                        value={formData.ngoId}
                        onChange={e => setFormData({ ...formData, ngoId: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Month</label>
                    <input
                        type="month"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-2 text-slate-900 dark:text-slate-100 icon-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none dark:color-scheme-dark"
                        value={formData.month}
                        onChange={e => setFormData({ ...formData, month: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">People Helped</label>
                    <input
                        type="number"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-2 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                        value={formData.peopleHelped}
                        onChange={e => setFormData({ ...formData, peopleHelped: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Events Conducted</label>
                    <input
                        type="number"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-2 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                        value={formData.eventsConducted}
                        onChange={e => setFormData({ ...formData, eventsConducted: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Funds Utilized (₹)</label>
                    <input
                        type="number"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-2 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                        value={formData.fundsUtilized}
                        onChange={e => setFormData({ ...formData, fundsUtilized: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Region</label>
                    <select
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-2 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                        value={formData.region}
                        onChange={e => setFormData({ ...formData, region: e.target.value })}
                    >
                        <option value="South">South</option>
                        <option value="North">North</option>
                        <option value="East">East</option>
                        <option value="West">West</option>
                    </select>
                </div>
            </div>

            <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-green-600 dark:bg-green-700 text-white py-2 rounded hover:bg-green-700 dark:hover:bg-green-600 disabled:opacity-50 transition-colors"
            >
                {status === 'loading' ? 'Submitting...' : 'Submit Report'}
            </button>

            {status === 'success' && <div className="text-green-600 dark:text-green-400 text-sm center">Report submitted successfully!</div>}
            {status === 'error' && <div className="text-red-600 dark:text-red-400 text-sm center">Error submitting report.</div>}
        </form>
    );
}
