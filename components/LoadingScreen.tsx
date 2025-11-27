
import React, { useState, useEffect } from 'react';

const loadingMessages = [
    "AI가 당신의 스타일을 분석하고 있어요...",
    "컬러 조합을 확인하는 중...",
    "어울리는 악세사리를 찾고 있어요...",
    "실루엣과 핏을 평가하는 중...",
    "완벽한 스타일 제안을 생성하고 있어요!",
];

export const LoadingScreen: React.FC = () => {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center bg-pink-500 rounded-2xl shadow-lg p-8 fade-in">
            <div className="spinner mb-6"></div>
            <h2 className="text-2xl font-bold text-white mb-2">잠시만 기다려주세요</h2>
            <p className="text-lg text-white transition-opacity duration-500">
                {loadingMessages[messageIndex]}
            </p>
        </div>
    );
};
