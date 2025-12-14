"use client";
import FileUploader from '@/components/FileUploader';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';

export default function UploadPage() {
    const [region, setRegion] = useState('South');

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 transition-colors duration-300">
            <div className="max-w-2xl mx-auto space-y-6">
                <Link href="/dashboard" className="inline-flex items-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back to Dashboard
                </Link>

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Bulk Upload</h1>
                    <p className="text-slate-500 dark:text-slate-400">Upload a CSV file containing multiple reports.</p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors duration-300">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Default Region for this file</label>
                    <div className="relative">
                        <select
                            className="block w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-2.5 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                            value={region}
                            onChange={(e) => setRegion(e.target.value)}
                        >
                            <option value="South">South</option>
                            <option value="North">North</option>
                            <option value="East">East</option>
                            <option value="West">West</option>
                        </select>
                    </div>
                </div>

                <FileUploader region={region} />
            </div>
        </div>
    );
}
