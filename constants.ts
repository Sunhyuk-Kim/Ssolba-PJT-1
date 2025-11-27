
import { Type } from '@google/genai';

export const SYSTEM_INSTRUCTION = `You are an expert AI Fashion Stylist. Your goal is to provide helpful, encouraging, and stylish feedback on a user's outfit photo.
Analyze the provided image based on color harmony, style consistency, accessory choices, and overall silhouette.
You must respond ONLY with a valid JSON object that conforms to the provided schema. Do not include any text or markdown formatting before or after the JSON object.

Your analysis must be in Korean and have a friendly, positive, and slightly playful tone, using emojis where appropriate.

The JSON response must contain:
- A fashion rating from 0 to 100.
- A fun, catchy title for the rating (e.g., "🔥 87/100 스타일리시 자신감 레벨").
- A concise overall feedback summary.
- A list of specific, actionable improvement suggestions. Include suggestions for accessories and even a suitable perfume type (e.g., '시트러스 우디 계열').
- A proposal for an alternative outfit, including a detailed description and a color palette with color names and hex codes.
- A list of 2 detailed prompts for an image generation AI (like Imagen) to create visual examples of stylish outfits inspired by your suggestions. These prompts should be in English and describe a full-body photo of a person wearing the described outfit in a specific setting, e.g., 'Full-body fashion photograph of a person wearing a cream-colored oversized blazer, light blue straight-leg jeans, and white sneakers. They are walking down a sunlit, stylish city street in Paris. Photorealistic, sharp focus, high detail.'`;

export const FASHION_ANALYSIS_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        rating: { type: Type.INTEGER, description: "Fashion rating from 0 to 100." },
        ratingTitle: { type: Type.STRING, description: "A fun, catchy title for the rating in Korean, including an emoji." },
        overallFeedback: { type: Type.STRING, description: "A concise overall feedback summary in Korean." },
        improvementSuggestions: {
            type: Type.ARRAY,
            description: "A list of specific, actionable improvement suggestions in Korean.",
            items: {
                type: Type.OBJECT,
                properties: {
                    item: { type: Type.STRING, description: "The item to improve (e.g., '신발', '악세사리', '향수')." },
                    suggestion: { type: Type.STRING, description: "The suggestion for that item." }
                },
                required: ['item', 'suggestion']
            }
        },
        alternativeOutfit: {
            type: Type.OBJECT,
            description: "A proposal for an alternative outfit.",
            properties: {
                description: { type: Type.STRING, description: "A detailed description of the alternative outfit in Korean." },
                colorPalette: {
                    type: Type.ARRAY,
                    description: "A color palette for the alternative outfit.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING, description: "The name of the color in Korean." },
                            hex: { type: Type.STRING, description: "The hex code for the color (e.g., '#FFFFFF')." }
                        },
                        required: ['name', 'hex']
                    }
                }
            },
            required: ['description', 'colorPalette']
        },
        imageGenerationPrompts: {
            type: Type.ARRAY,
            description: "A list of 2 detailed prompts in English for an image generation AI.",
            items: { type: Type.STRING }
        }
    },
    required: ['rating', 'ratingTitle', 'overallFeedback', 'improvementSuggestions', 'alternativeOutfit', 'imageGenerationPrompts']
};
