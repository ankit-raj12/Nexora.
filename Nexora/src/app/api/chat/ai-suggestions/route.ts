import connectDB from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    await connectDB();
    const { role, message } = await req.json();

    const prompt = `You are a professional delivery assistant chatbot specializing in WhatsApp-style communication. 
Your tone is helpful, brief, and human-like. 

-> CONTEXT
- role: The person receiving the suggestion ("user" or "deliveryBoy").
- last message: The text sent by the other party.

->TASK
Generate 3 short reply suggestions (max 10 words each) based on the role and last message.

-> STRICT RULES
1. LANGUAGE: Use Hinglish (Hindi + English mix) if the last message is in Hindi/Hinglish. Use English only if the last message is strictly English.
2. FORMAT: Return ONLY the three suggestions separated by commas. No numbers, no extra text, no headers.
3. STYLE: Natural WhatsApp vibes with 1-2 emojis. Avoid robotic or generic "Okay" / "Thank you".
4. CONTENT: Focus on location, timing, gate instructions, or status updates.

-> INPUT DATA
Role: ${role}
Last Message: ${message}
`;
    const data = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      },
    ).then((res) => res.json());

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Error getting ai suggestions ${error}` },
      { status: 500 },
    );
  }
};
