import fs from 'fs';
import csv from 'csv-parser';
import Report from '../models/Report';
import Job from '../models/Job';
import connectDB from '../db';

export async function processCsv(filePath: string, jobId: string, defaultRegion?: string) {
  try {
    await connectDB();
    
    const results: any[] = [];
    
    return new Promise<void>((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          try {
            const totalRows = results.length;
            await Job.findOneAndUpdate({ id: jobId }, { status: 'processing', totalRows });

            let processed = 0;
            let failed = 0;
            const errors: any[] = [];

            for (let i = 0; i < totalRows; i++) {
              const row = results[i];

              try {
                // Basic Validation
                if (!row.ngoId || !row.month) {
                  throw new Error('Missing ngoId or month');
                }

                // Upsert Report
                await Report.findOneAndUpdate(
                  { ngoId: row.ngoId, month: row.month },
                  {
                    peopleHelped: parseInt(row.peopleHelped || '0'),
                    eventsConducted: parseInt(row.eventsConducted || '0'),
                    fundsUtilized: parseFloat(row.fundsUtilized || '0'),
                    region: row.region || defaultRegion || 'South',
                    jobId: jobId
                  },
                  { upsert: true, new: true }
                );

                processed++;
              } catch (err: any) {
                failed++;
                errors.push({
                  row: i + 1,
                  message: err.message,
                  data: row
                });
              }

              // Update Job Progress periodically
              if (i % 10 === 0 || i === totalRows - 1) {
                await Job.findOneAndUpdate({ id: jobId }, {
                  processedRows: processed,
                  failedRows: failed,
                  errors: errors
                });
              }
            }

            // Final Update
            await Job.findOneAndUpdate({ id: jobId }, {
              status: 'completed',
              processedRows: processed,
              failedRows: failed,
              errors: errors
            });

            // Clean up file
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }

            resolve();
          } catch (error) {
            reject(error);
          }
        })
        .on('error', reject);
    });
  } catch (error) {
    console.error('Job failed:', error);
    await connectDB();
    await Job.findOneAndUpdate({ id: jobId }, {
      status: 'failed',
      errors: [{ message: error instanceof Error ? error.message : 'Unknown error' }]
    });
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw error;
  }
}

