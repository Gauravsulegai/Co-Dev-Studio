import { getSession } from 'next-auth/react';
import dbConnect from '@/lib/mongodb';
import UserTheme from '../../../../server/models/UserTheme';

export async function GET(req) {
  const session = await getSession({ req });
  if (!session) return new Response(JSON.stringify({ theme: 'light' }), { status: 200 });

  await dbConnect();
  const userTheme = await UserTheme.findOne({ userEmail: session.user.email });
  return new Response(JSON.stringify({ theme: userTheme?.theme || 'light' }), { status: 200 });
}

export async function POST(req) {
  const session = await getSession({ req });
  if (!session) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  const { theme } = await req.json();
  if (!['light', 'dark'].includes(theme)) {
    return new Response(JSON.stringify({ error: 'Invalid theme' }), { status: 400 });
  }

  await dbConnect();
  await UserTheme.findOneAndUpdate(
    { userEmail: session.user.email },
    { theme },
    { upsert: true }
  );

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
