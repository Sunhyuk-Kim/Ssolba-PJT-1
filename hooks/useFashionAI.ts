
import { useState, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { SYSTEM_INSTRUCTION, FASHION_ANALYSIS_SCHEMA } from '../constants.ts';
import type { FashionAnalysisResult } from '../types.ts';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY, vertexai: true });

export function useFashionAI() {
    const [isLoading, setIsLoading] = useState(false);

    const analyzeAndGenerate = useCallback(async (base64Image: string, mimeType: string) => {
        setIsLoading(true);
        try {
            // Step 1: Analyze the fashion
            const analysisResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: {
                    role: 'user',
                    parts: [
                        {
                            inlineData: {
                                mimeType: mimeType,
                                data: base64Image,
                            },
                        },
                    ],
                },
                config: {
                    systemInstruction: SYSTEM_INSTRUCTION,
                    responseMimeType: 'application/json',
                    responseSchema: FASHION_ANALYSIS_SCHEMA,
                },
            });

            const analysisText = analysisResponse.text.trim();
            const analysis: FashionAnalysisResult = JSON.parse(analysisText);

            // Step 2: Generate example images
            const imageGenerationPromises = analysis.imageGenerationPrompts.map(prompt =>
                ai.models.generateImages({
                    model: 'imagen-4.0-generate-001',
                    prompt: prompt,
                    config: {
                        numberOfImages: 1,
                        outputMimeType: 'image/jpeg',
                        aspectRatio: '3:4',
                    },
                })
            );

            const imageResults = await Promise.all(imageGenerationPromises);
            const generatedImages = imageResults.map(res => {
                const base64Bytes = res.generatedImages[0].image.imageBytes;
                return `data:image/jpeg;base64,${base64Bytes}`;
            });

            return { analysis, generatedImages };

        } catch (error) {
            console.error("AI analysis and generation failed:", error);
            if (error instanceof Error) {
                 throw new Error(error.message || 'An unknown AI error occurred.');
            }
            throw new Error('An unknown AI error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { analyzeAndGenerate, isLoading };
}
