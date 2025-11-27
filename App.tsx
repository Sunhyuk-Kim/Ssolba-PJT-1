import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Upload, Sparkles, Shirt, Loader2 } from 'lucide-react';

// API 키 설정 (Vercel 환경변수에서 가져옴)
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export default function App() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const analyzeFashion = async () => {
    if (!image) return alert('사진을 먼저 올려주세요!');
    if (!API_KEY) return alert('API 키가 설정되지 않았습니다. 배포 환경을 확인하세요.');

    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      // 이미지 처리 (base64)
      const base64Data = image.split(',')[1];
      const imagePart = {
        inlineData: { data: base64Data, mimeType: "image/jpeg" },
      };

      const prompt = "이 사진 속 인물의 패션을 분석해줘. 스타일의 특징, 색상 조합, 그리고 이 옷에 어울릴만한 액세서리나 신발을 추천해줘. 친구가 말해주는 것처럼 친근하게 한국어로 대답해줘.";
      
      const result = await model.generateContent([prompt, imagePart]);
      setResult(result.response.text());
    } catch (error) {
      console.error(error);
      setResult("죄송해요, 분석 중에 오류가 발생했어요. 다시 시도해 주세요.");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <Shirt color="#6366f1" /> AI 패션 스타일리스트
        </h1>
        <p style={{ color: '#666' }}>오늘의 코디를 분석하고 조언을 받아보세요!</p>
      </header>

      <div style={{ border: '2px dashed #ccc', borderRadius: '12px', padding: '40px', textAlign: 'center', marginBottom: '20px', cursor: 'pointer', position: 'relative' }}>
        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ opacity: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer' }} />
        {image ? (
          <img src={image} alt="Upload" style={{ maxHeight: '300px', maxWidth: '100%', borderRadius: '8px' }} />
        ) : (
          <div style={{ color: '#888' }}>
            <Upload size={48} style={{ marginBottom: '10px' }} />
            <p>사진을 여기로 드래그하거나 클릭해서 업로드하세요</p>
          </div>
        )}
      </div>

      <button 
        onClick={analyzeFashion} 
        disabled={loading || !image}
        style={{ width: '100%', padding: '15px', backgroundColor: loading ? '#ccc' : '#6366f1', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
      >
        {loading ? <><Loader2 className="spin" /> 분석 중...</> : <><Sparkles /> 스타일 분석하기</>}
      </button>

      {result && (
        <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f5f7ff', borderRadius: '12px', lineHeight: '1.6' }}>
          <h3 style={{ marginTop: 0 }}>✨ 분석 결과</h3>
          <div style={{ whiteSpace: 'pre-wrap' }}>{result}</div>
        </div>
      )}
      
      <style>{` .spin { animation: spin 1s linear infinite; } @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } } `}</style>
    </div>
  );
}
