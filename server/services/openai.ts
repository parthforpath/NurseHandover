import OpenAI from "openai";
import fs from "fs";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key" 
});

export async function transcribeAudio(audioFilePath: string): Promise<{ text: string }> {
  try {
    const audioReadStream = fs.createReadStream(audioFilePath);

    const transcription = await openai.audio.transcriptions.create({
      file: audioReadStream,
      model: "whisper-1",
    });

    return {
      text: transcription.text
    };
  } catch (error) {
    console.error('Transcription error:', error);
    throw new Error(`Failed to transcribe audio: ${error.message}`);
  }
}

export async function generateISBARReport(transcription: string, patientInfo: any): Promise<any> {
  try {
    const prompt = `
    You are a healthcare AI assistant specialized in creating ISBAR (Identify, Situation, Background, Assessment, Recommendation) reports from nursing handover transcriptions.

    Patient Information:
    - Name: ${patientInfo.name}
    - ID: ${patientInfo.patientId}
    - Room: ${patientInfo.room}
    - Age: ${patientInfo.age}
    - Gender: ${patientInfo.gender}

    Transcription:
    "${transcription}"

    Please analyze this transcription and create a structured ISBAR report. Return your response in this exact JSON format:

    {
      "identify": "Clear identification of patient and relevant details",
      "situation": "Current situation and immediate concerns",
      "background": "Relevant medical history and context",
      "assessment": "Clinical assessment and observations",
      "recommendation": "Specific recommendations and action items",
      "summary": "Brief executive summary of the handover",
      "priority": "high|medium|low",
      "keyPoints": ["List", "of", "key", "points"],
      "actionItems": ["List", "of", "action", "items"]
    }

    Ensure all sections are filled based on the transcription content.
    `;

    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a healthcare AI assistant specialized in creating ISBAR reports from nursing handover transcriptions. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result;
  } catch (error) {
    console.error('ISBAR generation error:', error);
    throw new Error(`Failed to generate ISBAR report: ${error.message}`);
  }
}
