import type { Base64Image, ImageAnalysisResult } from "./ai.interface";
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";
import { app } from "./firebase";
import { imageAnalysisSchema } from "./ai.interface";

export const ai = getAI(app, { backend: new GoogleAIBackend() });

export const visionModel = getGenerativeModel(ai, {
  model: "gemini-2.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: imageAnalysisSchema,
  },
});

export class GeminiVisionService {
  static async analyze(image: Base64Image): Promise<ImageAnalysisResult> {
    const prompt = `
วิเคราะห์ภาพนี้และตอบเป็น JSON:
caption: 1 ประโยค
tags: keyword
objects: วัตถุในภาพ
safety: ความอ่อนไหว`;

    const imagePart = {
      inlineData: {
        data: image.base64,
        mimeType: image.mimeType
      }
    };

    const resp = await visionModel.generateContent([prompt, imagePart]);
    const text = resp.response.text() ?? "{}";
    return JSON.parse(text);
  }
}