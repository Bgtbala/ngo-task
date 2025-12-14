import Link from 'next/link';
import { ArrowRight, BarChart, FileText, Upload } from 'lucide-react';

export default function Home() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-2xl w-full text-center space-y-8">
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight">NGO Impact Reporting</h1>
                <p className="text-lg text-gray-600">
                    Streamline your reporting process. Submit monthly data individually or in bulk, and track your impact.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <Link href="/submit" className="group p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 flex flex-col items-center">
                        <FileText className="w-10 h-10 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
                        <h2 className="text-xl font-semibold text-gray-800">Submit Report</h2>
                        <p className="text-gray-500 text-sm mt-2">Single entry form for monthly stats</p>
                    </Link>

                    <Link href="/upload" className="group p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 flex flex-col items-center">
                        <Upload className="w-10 h-10 text-green-500 mb-4 group-hover:scale-110 transition-transform" />
                        <h2 className="text-xl font-semibold text-gray-800">Bulk Upload</h2>
                        <p className="text-gray-500 text-sm mt-2">Upload CSV files for multiple entries</p>
                    </Link>
                </div>

                <div className="pt-8">
                    <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium">
                        <BarChart className="w-5 h-5" />
                        View Admin Dashboard <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
