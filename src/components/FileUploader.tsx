"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, CheckCircle, AlertCircle, X, FileText } from 'lucide-react';

export default function FileUploader({ region }: { region: string }) {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [jobId, setJobId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError(null);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.type === "text/csv" || droppedFile.name.endsWith('.csv')) {
                setFile(droppedFile);
                setError(null);
            } else {
                setError("Please upload a valid CSV file.");
            }
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError(null);
        const formData = new FormData();
        formData.append('file', file);
        if (region) formData.append('region', region);

        try {
            const res = await axios.post('/api/reports/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setJobId(res.data.jobId);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="p-6 border rounded-xl shadow-sm bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 transition-colors duration-300">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Bulk Upload Reports
            </h3>

            {!jobId ? (
                <div className="space-y-4">
                    <div
                        className={`flex items-center justify-center w-full transition-colors duration-200 ${dragActive ? 'scale-[1.01]' : ''}`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <label className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-colors
                            ${dragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className={`w-10 h-10 mb-3 ${dragActive ? 'text-blue-500' : 'text-slate-400 dark:text-slate-500'}`} />
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                                    <span className="font-semibold text-slate-800 dark:text-slate-200">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-slate-400 dark:text-slate-500">CSV files only</p>
                            </div>
                            <input type="file" className="hidden" accept=".csv" onChange={handleFileChange} />
                        </label>
                    </div>

                    {file && (
                        <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg text-blue-700 dark:text-blue-300">
                            <div className="flex items-center gap-2 overflow-hidden">
                                <div className="bg-blue-100 dark:bg-blue-800 p-1.5 rounded">
                                    <FileText className="w-4 h-4 text-blue-600 dark:text-blue-300" />
                                </div>
                                <span className="text-sm font-medium truncate">{file.name}</span>
                                <span className="text-xs text-blue-400 dark:text-blue-300">({(file.size / 1024).toFixed(1)} KB)</span>
                            </div>
                            <button onClick={() => setFile(null)} className="text-blue-400 dark:text-blue-300 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1 hover:bg-white dark:hover:bg-slate-800 rounded-full">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {error && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900 rounded-lg text-red-600 dark:text-red-400 text-sm flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        onClick={handleUpload}
                        disabled={!file || uploading}
                        className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                        {uploading ? 'Start Uploading...' : 'Upload File'}
                    </button>
                </div>
            ) : (
                <JobStatus jobId={jobId} onReset={() => { setJobId(null); setFile(null); }} />
            )}
        </div>
    );
}

function JobStatus({ jobId, onReset }: { jobId: string, onReset: () => void }) {
    const [status, setStatus] = useState<any>(null);
    const [reports, setReports] = useState<any[]>([]);

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const res = await axios.get(`/api/job-status/${jobId}`);
                setStatus(res.data);

                if (res.data.status === 'completed') {
                    clearInterval(interval);
                    fetchReports();
                } else if (res.data.status === 'failed') {
                    clearInterval(interval);
                }
            } catch (e) { console.error(e); }
        }, 1000);
        return () => clearInterval(interval);
    }, [jobId]);

    const fetchReports = async () => {
        try {
            const res = await axios.get(`/api/jobs/${jobId}/reports`);
            setReports(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    if (!status) return (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400 animate-pulse">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3"></div>
            <p className="text-sm font-medium">Initializing job...</p>
        </div>
    );

    const percentage = status.totalRows > 0 ? Math.round((status.processedRows / status.totalRows) * 100) : 0;
    const isCompleted = status.status === 'completed';
    const isFailed = status.status === 'failed';

    return (
        <div className="space-y-6">
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Upload Progress</span>
                    <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full
                        ${isCompleted ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                            isFailed ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                        {status.status}
                    </span>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 mb-2 overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-green-500' : isFailed ? 'bg-red-500' : 'bg-blue-600'}`}
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>

                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 font-medium">
                    <span>{percentage}% Processed</span>
                    <span>{status.processedRows} / {status.totalRows} Rows</span>
                </div>
            </div>

            {status.failedRows > 0 && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900 rounded-lg text-red-700 dark:text-red-400 text-sm max-h-48 overflow-y-auto">
                    <div className="flex items-center gap-2 mb-2 font-bold text-red-800 dark:text-red-300">
                        <AlertCircle className="w-4 h-4" />
                        Errors Found ({status.failedRows})
                    </div>
                    <ul className="list-disc pl-5 space-y-1 text-xs">
                        {status.errors?.map((err: any, idx: number) => (
                            <li key={idx}>
                                <span className="font-semibold">Row {err.row}:</span> {err.message}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {isCompleted && reports.length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                        Processed Data Preview
                    </h4>
                    <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-sm">
                            <thead className="bg-slate-50 dark:bg-slate-900">
                                <tr>
                                    <th className="px-3 py-2 text-left font-medium text-slate-500 dark:text-slate-400 w-24">NGO ID</th>
                                    <th className="px-3 py-2 text-left font-medium text-slate-500 dark:text-slate-400 w-24">Month</th>
                                    <th className="px-3 py-2 text-left font-medium text-slate-500 dark:text-slate-400">Region</th>
                                    <th className="px-3 py-2 text-right font-medium text-slate-500 dark:text-slate-400">People</th>
                                    <th className="px-3 py-2 text-right font-medium text-slate-500 dark:text-slate-400">Funds</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-slate-950 divide-y divide-slate-100 dark:divide-slate-800">
                                {reports.map((report) => (
                                    <tr key={report._id} className="hover:bg-slate-50 dark:hover:bg-slate-900">
                                        <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{report.ngoId}</td>
                                        <td className="px-3 py-2 text-slate-600 dark:text-slate-400">{report.month}</td>
                                        <td className="px-3 py-2 text-slate-600 dark:text-slate-400">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-300">
                                                {report.region}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2 text-right text-slate-700 dark:text-slate-300">{report.peopleHelped}</td>
                                        <td className="px-3 py-2 text-right text-slate-700 dark:text-slate-300">₹{report.fundsUtilized}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 text-center">Showing last {reports.length} records</p>
                </div>
            )}

            {(isCompleted || isFailed) && (
                <button
                    onClick={onReset}
                    className="w-full mt-2 border border-slate-300 dark:border-slate-700 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors shadow-sm"
                >
                    Upload Another File
                </button>
            )}
        </div>
    );
}
