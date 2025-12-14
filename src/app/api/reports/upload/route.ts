import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';
import connectDB from '@/lib/db';
import Job from '@/lib/models/Job';
import { processCsv } from '@/lib/utils/worker';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const region = formData.get('region') as string | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'uploads');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = join(uploadsDir, file.name);
    await writeFile(filePath, buffer);

    // Create a Job
    const jobId = randomUUID();
    const job = new Job({ id: jobId, status: 'pending' });
    await job.save();

    // Trigger Background Processing (Fire and Forget)
    processCsv(filePath, jobId, region || undefined).catch((error) => {
      console.error('Background processing error:', error);
    });

    return NextResponse.json(
      { message: 'File processing started', jobId },
      { status: 202 }
    );
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

