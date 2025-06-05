// src/app/api/message/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Message from '../../../../server/models/Message';

export async function POST(req) {
  await connectToDatabase();
  try {
    const body = await req.json();
    const { userId, roomId, message, isAiResponse = false, aiKeywordTitle = '' } = body;

    if (!userId || !roomId || !message) {
      return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
    }

    const newMessage = new Message({ userId, roomId, message, isAiResponse, aiKeywordTitle });
    await newMessage.save();

    return NextResponse.json({ success: true, message: newMessage }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const roomId = searchParams.get('roomId');

  if (!roomId) {
    return NextResponse.json({ success: false, error: 'Missing roomId' }, { status: 400 });
  }

  try {
    const messages = await Message.find({ roomId }).sort({ createdAt: 1 });
    return NextResponse.json({ success: true, messages });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
