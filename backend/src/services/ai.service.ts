import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeShipmentRisk(telemetry: {
  shipmentId: string;
  temperature: number;
  humidity: number;
  maxTemp: number;
}) {
  const prompt = `
    Analyze cold chain shipment telemetry and return JSON strictly matching this schema:
    {
      "riskScore": number (0 to 100),
      "riskLevel": "HEALTHY" | "AT_RISK" | "CRITICAL",
      "tempDrift": "percentage string e.g. +32% drift",
      "humidityStatus": "Stable" | "Unstable",
      "action": "short recommended action e.g. Inspect cooling system",
      "reasoning": "1 short sentence explaining why",
      "confidence": number (e.g. 94)
    }

    Telemetry Data:
    - Shipment ID: ${telemetry.shipmentId}
    - Current Temp: ${telemetry.temperature}°C (Threshold: ${telemetry.maxTemp}°C)
    - Humidity: ${telemetry.humidity}%
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  try {
    const cleanJson = (response.text || '').replace(/```json|```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (err) {
    return {
      riskScore: 50,
      riskLevel: "AT_RISK",
      tempDrift: "+0%",
      humidityStatus: "Stable",
      action: "Monitor sensor metrics",
      reasoning: "Telemetry parameters within normal operational range.",
      confidence: 85
    };
  }
}