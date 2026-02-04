
import { GoogleGenAI, Type } from "@google/genai";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

export const analyzePlateImage = async (base64Image: string) => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: "Extract the car license plate number from this image. Return only the plate number, or 'UNKNOWN' if not found." }
        ]
      }
    });
    return response.text?.trim() || 'UNKNOWN';
  } catch (error) {
    console.error("Plate analysis failed:", error);
    return 'UNKNOWN';
  }
};

export const generateSmartReport = async (sessions: any[]) => {
  const ai = getAIClient();
  const summary = sessions.map(s => ({
    entry: s.entryTime,
    exit: s.exitTime,
    fee: s.totalFee,
    plate: s.plateNumber
  }));

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze these parking sessions for SmartPark Rubavu and provide a 2-sentence executive summary including revenue trends and peak busy times: ${JSON.stringify(summary)}`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text || "Report generation failed.";
  } catch (error) {
    return "Could not generate AI insights at this time.";
  }
};
