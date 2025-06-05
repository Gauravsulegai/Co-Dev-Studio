// src/app/api/ai/route.js
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Message from "../../../../server/models/Message";

export async function POST(req) {
  const { prompt, roomId, userEmail } = await req.json();

  if (!prompt || !roomId || !userEmail) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const aiKeywordTitle = extractTitle(prompt);

  // Simulate AI response (replace with actual OpenAI call)
  const aiReply = `AI Response for: "${prompt}"`;

  await connectToDatabase();

  const newMessage = new Message({
    userId: userEmail,
    roomId,
    message: aiReply,
    isAiResponse: true,
    aiKeywordTitle,
  });

  await newMessage.save();

  return NextResponse.json({ reply: aiReply, title: aiKeywordTitle }, { status: 200 });
}

// 🧠 Simple keyword extractor
function extractTitle(prompt) {
  const promptLower = prompt.toLowerCase();

  if (promptLower.includes("error")) return "SyntaxError";
  if (promptLower.includes("optimize") || promptLower.includes("slow")) return "OptimizeCode";
  if (promptLower.includes("bug") || promptLower.includes("issue")) return "FixBug";
  if (promptLower.includes("refactor")) return "RefactorCode";
  if (promptLower.includes("explain")) return "ExplainCode";

  return "AI Response";
}
