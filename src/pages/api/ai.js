// pages/api/ai.js or src/pages/api/ai.js

import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { prompt, roomId, userEmail } = req.body;

  if (!prompt || !roomId || !userEmail) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    // Call OpenAI Chat Completion
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are an assistant that summarizes questions into a short keyword title." },
        { role: "user", content: prompt },
      ],
    });

    const aiReply = completion.data.choices[0].message.content;

    // Example: Extract a short keyword title from prompt or reply
    // Here you can implement your own logic or use another AI call for summary
    // For simplicity, let's take the first sentence or first 5 words as a keyword title:
    const aiKeywordTitle = aiReply.split('\n')[0].slice(0, 40); // first line max 40 chars

    return res.status(200).json({
      success: true,
      reply: aiReply,
      aiKeywordTitle,
    });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return res.status(500).json({ success: false, message: "OpenAI request failed" });
  }
}
