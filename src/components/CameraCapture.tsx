import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Camera, X, RotateCcw, Sparkles } from 'lucide-react';
import { Language, getTranslation } from '@/utils/languageDetector';
import { analyzeCardImage } from '@/utils/cardAnalysis';
import { LENORMAND_CARDS } from '@/data/cards';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onCardsIdentified: (cardIds: number[]) => void;
  onClose: () => void;
  language: Language;
}

export const CameraCapture = ({ onCapture, onCardsIdentified, onClose, language }: CameraCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const errorMessages = {
    'zh-CN': '无法访问摄像头。请确保已授予摄像头权限。',
    'en': 'Cannot access camera. Please ensure camera permissions are granted.',
    'ko': '카메라에 액세스할 수 없습니다. 카메라 권한이 부여되었는지 확인하세요.',
  };

  const captureButtonText = {
    'zh-CN': '拍照',
    'en': 'Capture',
    'ko': '촬영',
  };

  const retakeButtonText = {
    'zh-CN': '重拍',
    'en': 'Retake',
    'ko': '다시 찍기',
  };

  const confirmButtonText = {
    'zh-CN': '确认使用',
    'en': 'Confirm',
    'ko': '확인',
  };

  const analyzeButtonText = {
    'zh-CN': 'AI 识别卡牌',
    'en': 'AI Identify Cards',
    'ko': 'AI 카드 식별',
  };

  const analyzingText = {
    'zh-CN': '识别中...',
    'en': 'Analyzing...',
    'ko': '분석 중...',
  };

  const instructionText = {
    'zh-CN': '将卡牌放在摄像头前，确保卡牌清晰可见',
    'en': 'Place cards in front of camera, ensure cards are clearly visible',
    'ko': '카메라 앞에 카드를 놓고 카드가 선명하게 보이는지 확인하세요',
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError('');
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError(errorMessages[language]);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  };

  const retake = () => {
    setCapturedImage(null);
    startCamera();
  };

  const confirmCapture = () => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  };

  const analyzeWithAI = async () => {
    if (!capturedImage) return;
    
    setIsAnalyzing(true);
    try {
      const cardIds = await analyzeCardImage(capturedImage);
      
      const identifiedCards = cardIds
        .map(id => LENORMAND_CARDS.find(c => c.id === id))
        .filter(Boolean);
      
      if (identifiedCards.length > 0) {
        toast.success(
          language === 'zh-CN' 
            ? `识别到 ${identifiedCards.length} 张卡牌！` 
            : language === 'ko' 
            ? `${identifiedCards.length}장의 카드를 식별했습니다!` 
            : `Identified ${identifiedCards.length} cards!`
        );
        onCardsIdentified(cardIds);
      } else {
        toast.error(
          language === 'zh-CN' 
            ? '未识别到卡牌，请重新拍摄' 
            : language === 'ko' 
            ? '카드를 식별할 수 없습니다. 다시 찍어주세요' 
            : 'No cards identified, please retake photo'
        );
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error(
        language === 'zh-CN' 
          ? '识别失败，请重试' 
          : language === 'ko' 
          ? '식별 실패, 다시 시도해주세요' 
          : 'Identification failed, please try again'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="fixed inset-4 z-50 bg-background/95 backdrop-blur-sm border-2 border-accent shadow-glow flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-border">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Camera className="w-5 h-5 text-accent" />
          {getTranslation(language, 'camera')}
        </h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="hover:bg-destructive/20"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 overflow-hidden">
        {error ? (
          <div className="text-center space-y-4">
            <p className="text-destructive">{error}</p>
            <Button onClick={startCamera} variant="outline">
              {getTranslation(language, 'retry')}
            </Button>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-4 text-center">
              {instructionText[language]}
            </p>
            
            <div className="relative w-full max-w-3xl aspect-video bg-muted rounded-lg overflow-hidden">
              {capturedImage ? (
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="w-full h-full object-contain"
                />
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <canvas ref={canvasRef} className="hidden" />

            <div className="flex gap-3 mt-6">
              {capturedImage ? (
                <>
                  <Button
                    onClick={retake}
                    variant="outline"
                    className="gap-2"
                    disabled={isAnalyzing}
                  >
                    <RotateCcw className="w-4 h-4" />
                    {retakeButtonText[language]}
                  </Button>
                  <Button
                    onClick={analyzeWithAI}
                    className="gap-2 bg-primary hover:bg-primary/90"
                    disabled={isAnalyzing}
                  >
                    <Sparkles className="w-5 h-5" />
                    {isAnalyzing ? analyzingText[language] : analyzeButtonText[language]}
                  </Button>
                  <Button
                    onClick={confirmCapture}
                    variant="outline"
                    className="gap-2"
                    disabled={isAnalyzing}
                  >
                    {confirmButtonText[language]}
                  </Button>
                </>
              ) : (
                <Button
                  onClick={capturePhoto}
                  size="lg"
                  className="gap-2 bg-accent hover:bg-accent/90"
                  disabled={!stream}
                >
                  <Camera className="w-5 h-5" />
                  {captureButtonText[language]}
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </Card>
  );
};
