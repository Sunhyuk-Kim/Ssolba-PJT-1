
export interface FashionAnalysisResult {
    rating: number;
    ratingTitle: string;
    overallFeedback: string;
    improvementSuggestions: {
        item: string;
        suggestion: string;
    }[];
    alternativeOutfit: {
        description: string;
        colorPalette: {
            name: string;
            hex: string;
        }[];
    };
    imageGenerationPrompts: string[];
}
