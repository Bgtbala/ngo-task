'use client';

import dynamic from 'next/dynamic';
import { swaggerDocument } from '@/lib/swagger';

// Dynamically import SwaggerUI to avoid SSR issues
const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });
import 'swagger-ui-react/swagger-ui.css';

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">API Documentation</h1>
        <p className="text-gray-600 mb-6">
          Interactive API documentation for NGO Impact Reporting API
        </p>
        <SwaggerUI spec={swaggerDocument} />
      </div>
    </div>
  );
}

