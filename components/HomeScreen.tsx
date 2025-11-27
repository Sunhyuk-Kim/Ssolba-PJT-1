
import React, { useRef } from 'react';

interface HomeScreenProps {
    onImageUpload: (file: File) => void;
    error: string | null;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onImageUpload, error }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onImageUpload(file);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center fade-in">
            <h1 className="text-4xl font-bold text-pink-500 mb-2">AI Fashion Stylist</h1>
            <p className="text-lg text-gray-600 mb-8">오늘의 OOTD, AI에게 피드백 받아보세요!</p>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                    <strong className="font-bold">오류!</strong>
                    <span className="block sm:inline ml-2">{error}</span>
                </div>
            )}

            <button
                onClick={handleButtonClick}
                className="bg-pink-500 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:bg-pink-600 transition-all duration-300 transform hover:scale-105 text-xl"
            >
                📸 의상 사진 업로드
            </button>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
            />
            <p className="text-sm text-gray-500 mt-4">카메라 또는 앨범에서 사진을 선택하세요.</p>
        </div>
    );
};
