import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Report from '@/lib/models/Report';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { ngoId, month, peopleHelped, eventsConducted, fundsUtilized, region } = await request.json();

    // Validation
    if (!ngoId || !month) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Upsert to handle idempotency
    const report = await Report.findOneAndUpdate(
      { ngoId, month },
      {
        peopleHelped,
        eventsConducted,
        fundsUtilized,
        region,
        updatedAt: new Date()
      },
      { new: true, upsert: true }
    );

    return NextResponse.json(
      { message: 'Report submitted successfully', report },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting report:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

