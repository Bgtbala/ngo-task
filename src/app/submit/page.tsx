import ReportForm from '@/components/ReportForm';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function SubmitPage() {
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-2xl mx-auto space-y-6">
                <Link href="/" className="inline-flex items-center text-gray-500 hover:text-gray-900">
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back to Home
                </Link>

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-gray-900">Submit Report</h1>
                    <p className="text-gray-500">Manual entry for a single NGO monthly report.</p>
                </div>

                <ReportForm />
            </div>
        </div>
    );
}
