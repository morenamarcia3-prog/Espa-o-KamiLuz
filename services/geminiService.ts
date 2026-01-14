
import { GoogleGenAI } from "@google/genai";

export const getBeautyAdvice = async (prompt: string) => {
  // Always initialize GoogleGenAI with process.env.API_KEY directly inside the call context.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "Você é uma assistente virtual especialista em estética de unhas para o 'KamiLuz Space'. Seu tom é elegante, profissional e amigável. Você responde dúvidas sobre fibras de vidro, unhas de gel e esmaltação semipermanente. Se o usuário perguntar sobre preços ou horários, mencione que ele pode agendar diretamente no aplicativo. Responda sempre em Português do Brasil.",
      },
    });

    // Access the text property directly on the response object.
    return response.text || "Não consegui gerar uma resposta no momento.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Desculpe, tive um problema ao processar sua consulta.";
  }
};
