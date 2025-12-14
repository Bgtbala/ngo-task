import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    username: string;
  };
}

export function authenticateToken(
  request: NextRequest
): { user: { username: string } } | null {
  const authHeader = request.headers.get('authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return null;
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET || '') as { username: string };
    return { user };
  } catch (err) {
    return null;
  }
}

export function withAuth(
  handler: (req: NextRequest, user: { username: string }) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    const authResult = authenticateToken(req);
    
    if (!authResult) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return handler(req, authResult.user);
  };
}

