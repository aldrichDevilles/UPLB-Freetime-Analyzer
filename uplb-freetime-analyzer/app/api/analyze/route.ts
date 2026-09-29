import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { StudentData } from '../../../components/StudentForm';

const apiKey = process.env.GEMINI_API_KEY as string;
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const students: StudentData[] = body.students;
    
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = `
      You are an expert schedule analyzer for UPLB students. 
      I am providing schedule images for ${students.length} students. 
      The schedule is structured from 7 AM to 10 PM. 
      Half triangles indicate 30-minute intervals. 
      Vacant periods are colored light green, and occupied classes are dark green.
      
      Review these schedules and find the exact overlapping days and times where ALL these students 
      have a light green (vacant) period. 
      
      You MUST return the output as a valid JSON object matching this exact structure:
      {
        "summary": "A 1-2 sentence summary of the best times to meet.",
        "available_times": [
          { "day": "Monday", "times": ["07:00 AM - 08:30 AM", "04:00 PM - 10:00 PM"] },
          { "day": "Tuesday", "times": [] }
        ]
      }
    `;

    const imageParts = students.map((student) => {
      const match = student.imageBase64.match(/^data:(image\/(png|jpeg|jpg));base64,/);
      const mimeType = match ? match[1] : "image/jpeg"; 
      const base64Data = student.imageBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");
      
      return {
        inlineData: { data: base64Data, mimeType: mimeType }
      };
    });

    // Enforce JSON output format
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }, ...imageParts] }],
      generationConfig: { responseMimeType: "application/json" }
    });
    
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ result: JSON.parse(text) });
  } catch (error: any) {
    console.error("=== Gemini API Error ===");
    console.error(error?.message || error);
    return NextResponse.json({ error: error?.message || "Failed to analyze schedules." }, { status: 500 });
  }
}