
import React, { useState, useCallback } from 'react';
import { HomeScreen } from './components/HomeScreen.tsx';
import { LoadingScreen } from './components/LoadingScreen.tsx';
import { ResultScreen } from './components/ResultScreen.tsx';
import { useFashionAI } from './hooks/useFashionAI.ts';
import type { FashionAnalysisResult } from './types.ts';
import { resizeImage } from './utils/image.ts';

type Screen = 'home' | 'loading' | 'result';

function App() {
    const [screen, setScreen] = useState<Screen>('home');
    const [userImage, setUserImage] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<FashionAnalysisResult | null>(null);
    const [generatedImages, setGeneratedImages] = useState<string[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { analyzeAndGenerate, isLoading } = useFashionAI();

    const handleImageUpload = useCallback(async (file: File) => {
        setError(null);
        setScreen('loading');

        try {
            const resizedFile = await resizeImage(file, 1024, 1024);
            const reader = new FileReader();
            reader.readAsDataURL(resizedFile);
            reader.onload = async () => {
                const base64Image = (reader.result as string).split(',')[1];
                setUserImage(reader.result as string);

                const result = await analyzeAndGenerate(base64Image, resizedFile.type);
                if (result) {
                    setAnalysisResult(result.analysis);
                    setGeneratedImages(result.generatedImages);
                    setScreen('result');
                } else {
                    throw new Error('AI analysis failed to return a result.');
                }
            };
            reader.onerror = () => {
                throw new Error('Failed to read the image file.');
            };
        } catch (e) {
            console.error(e);
            const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
            setError(`오류가 발생했습니다: ${errorMessage}. 다시 시도해주세요.`);
            setScreen('home');
        }
    }, [analyzeAndGenerate]);

    const handleReset = () => {
        setScreen('home');
        setUserImage(null);
        setAnalysisResult(null);
        setGeneratedImages(null);
        setError(null);
    };
    
    const handleRerun = async () => {
        if (!userImage) return;
        setScreen('loading');
        setError(null);
        try {
            const base64Image = userImage.split(',')[1];
            // This assumes the mime type is jpeg, which is a reasonable default for photos.
            const result = await analyzeAndGenerate(base64Image, 'image/jpeg');
            if (result) {
                setAnalysisResult(result.analysis);
                setGeneratedImages(result.generatedImages);
                setScreen('result');
            } else {
                throw new Error('AI analysis failed to return a result.');
            }
        } catch (e) {
            console.error(e);
            const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
            setError(`오류가 발생했습니다: ${errorMessage}. 다시 시도해주세요.`);
            setScreen('home');
        }
    };

    const renderScreen = () => {
        switch (screen) {
            case 'loading':
                return <LoadingScreen />;
            case 'result':
                if (analysisResult && generatedImages && userImage) {
                    return (
                        <ResultScreen
                            userImage={userImage}
                            analysis={analysisResult}
                            generatedImages={generatedImages}
                            onReset={handleReset}
                            onRerun={handleRerun}
                        />
                    );
                }
                // Fallback to home if result data is missing
                handleReset();
                return <HomeScreen onImageUpload={handleImageUpload} error={error} />;
            case 'home':
            default:
                return <HomeScreen onImageUpload={handleImageUpload} error={error} />;
        }
    };

    return (
        <div className="min-h-screen bg-[#FDF7F9] text-gray-800">
            <div className="container mx-auto max-w-lg p-4">
                {renderScreen()}
            </div>
        </div>
    );
}

export default App;
