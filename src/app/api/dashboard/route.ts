import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Report from '@/lib/models/Report';
import { withAuth } from '@/lib/middleware/auth';

async function handler(request: NextRequest, user: { username: string }) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const region = searchParams.get('region');

    let query: any = {};
    if (month) query.month = month;
    if (region && region !== 'All') query.region = region;

    console.log('Dashboard Query:', query);

    // Aggregate Data
    const stats = await Report.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalNGOs: { $sum: 1 },
          totalPeopleHelped: { $sum: '$peopleHelped' },
          totalEventsConducted: { $sum: '$eventsConducted' },
          totalFundsUtilized: { $sum: '$fundsUtilized' }
        }
      }
    ]);

    console.log('Aggregation Result:', stats);

    // Unique Regions for filter
    const regions = await Report.distinct('region');

    const result = stats[0] || {
      totalNGOs: 0,
      totalPeopleHelped: 0,
      totalEventsConducted: 0,
      totalFundsUtilized: 0
    };

    return NextResponse.json({ stats: result, regions });
  } catch (error: any) {
    console.error('Dashboard Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}

export const GET = withAuth(handler);

