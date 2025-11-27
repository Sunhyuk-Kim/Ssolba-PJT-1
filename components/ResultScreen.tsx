
import React, { useRef } from 'react';
import { toPng } from 'html-to-image';
import type { FashionAnalysisResult } from '../types.ts';

interface ResultScreenProps {
    userImage: string;
    analysis: FashionAnalysisResult;
    generatedImages: string[];
    onReset: () => void;
    onRerun: () => void;
}

const Card: React.FC<{ title: string; children: React.ReactNode; icon: string }> = ({ title, children, icon }) => (
    <div className="bg-white rounded-2xl shadow-md p-5 mb-4 fade-in">
        <h3 className="text-xl font-bold mb-3 flex items-center">
            <span className="mr-2">{icon}</span>
            {title}
        </h3>
        {children}
    </div>
);

export const ResultScreen: React.FC<ResultScreenProps> = ({ userImage, analysis, generatedImages, onReset, onRerun }) => {
    const resultCardRef = useRef<HTMLDivElement>(null);

    const handleSaveImage = async () => {
        if (!resultCardRef.current) return;
        try {
            const dataUrl = await toPng(resultCardRef.current, { cacheBust: true, pixelRatio: 2 });
            const link = document.createElement('a');
            link.download = 'ai-fashion-stylist-result.png';
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Failed to save image', err);
        }
    };
    
    const handleShare = async () => {
        if (!resultCardRef.current) return;
        try {
            const blob = await toPng(resultCardRef.current, { cacheBust: true, pixelRatio: 2 }).then(dataUrl => fetch(dataUrl).then(res => res.blob()));
            const file = new File([blob], 'ai-fashion-stylist-result.png', { type: 'image/png' });
            if (navigator.share && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: 'AI 패션 스타일리스트 결과',
                    text: 'AI가 제 스타일을 분석해줬어요! ✨',
                    files: [file],
                });
            } else {
                alert('이 브라우저에서는 공유 기능이 지원되지 않습니다. 이미지를 저장한 후 직접 공유해주세요.');
            }
        } catch (err) {
            console.error('Failed to share', err);
            alert('공유에 실패했습니다. 이미지를 저장한 후 직접 공유해주세요.');
        }
    };

    return (
        <div className="pb-24">
            <div ref={resultCardRef} className="bg-[#FDF7F9] p-4">
                <h2 className="text-2xl font-bold text-center mb-4 text-pink-500">✨ AI 스타일 분석 결과 ✨</h2>
                
                <div className="mb-4">
                    <img src={userImage} alt="User's outfit" className="rounded-2xl w-full shadow-lg" />
                </div>

                <div className="bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-2xl p-5 text-center shadow-lg mb-4 fade-in">
                    <p className="text-3xl font-bold">{analysis.ratingTitle}</p>
                </div>

                <Card title="종합 피드백" icon="📝">
                    <p className="text-gray-700">{analysis.overallFeedback}</p>
                </Card>

                <Card title="스타일링 제안" icon="💡">
                    <ul className="space-y-2">
                        {analysis.improvementSuggestions.map((item, index) => (
                            <li key={index} className="flex">
                                <span className="font-bold w-1/4 text-pink-500">{item.item}:</span>
                                <span className="w-3/4 text-gray-700">{item.suggestion}</span>
                            </li>
                        ))}
                    </ul>
                </Card>

                <Card title="다른 스타일 추천" icon="👗">
                    <p className="text-gray-700 mb-3">{analysis.alternativeOutfit.description}</p>
                    <div className="flex flex-wrap gap-2">
                        {analysis.alternativeOutfit.colorPalette.map((color, index) => (
                            <div key={index} className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
                                <div className="w-5 h-5 rounded-full border border-gray-300" style={{ backgroundColor: color.hex }}></div>
                                <span className="text-sm text-gray-600">{color.name}</span>
                                <span className="text-xs text-gray-400">{color.hex}</span>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card title="AI 추천 스타일 이미지" icon="🎨">
                    <div className="grid grid-cols-2 gap-4">
                        {generatedImages.map((imgSrc, index) => (
                            <img key={index} src={imgSrc} alt={`Generated style ${index + 1}`} className="rounded-lg shadow-md w-full h-auto object-cover" />
                        ))}
                    </div>
                </Card>
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm p-3 border-t border-gray-200 max-w-lg mx-auto">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                    <button onClick={onRerun} className="bg-gray-200 text-gray-700 font-semibold py-2 px-3 rounded-lg hover:bg-gray-300 transition">다시 분석</button>
                    <button onClick={handleSaveImage} className="bg-gray-200 text-gray-700 font-semibold py-2 px-3 rounded-lg hover:bg-gray-300 transition">이미지 저장</button>
                    <button onClick={handleShare} className="bg-blue-500 text-white font-semibold py-2 px-3 rounded-lg hover:bg-blue-600 transition">오늘의 스타일 공유</button>
                    <button onClick={onReset} className="bg-pink-500 text-white font-semibold py-2 px-3 rounded-lg hover:bg-pink-600 transition">새 사진 업로드</button>
                </div>
            </div>
        </div>
    );
};
