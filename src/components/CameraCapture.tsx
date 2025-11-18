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
  const autoDetectIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAutoDetecting, setIsAutoDetecting] = useState(false);
  const [detectedCards, setDetectedCards] = useState<number[]>([]);

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
      if (autoDetectIntervalRef.current) {
        clearInterval(autoDetectIntervalRef.current);
      }
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
        // Limit max dimensions to reduce file size
        const maxWidth = 1280;
        const maxHeight = 960;
        let width = video.videoWidth;
        let height = video.videoHeight;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);
        
        // Use lower quality to reduce size
        const imageData = canvas.toDataURL('image/jpeg', 0.7);
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

  const captureFrameForAnalysis = (): string | null => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas) return null;
    
    const context = canvas.getContext('2d');
    if (!context) return null;

    const maxWidth = 1280;
    const maxHeight = 960;
    let width = video.videoWidth;
    let height = video.videoHeight;

    if (width > maxWidth) {
      height = (height * maxWidth) / width;
      width = maxWidth;
    }
    if (height > maxHeight) {
      width = (width * maxHeight) / height;
      height = maxHeight;
    }

    canvas.width = width;
    canvas.height = height;
    context.drawImage(video, 0, 0, width, height);
    
    return canvas.toDataURL('image/jpeg', 0.7);
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

  const startAutoDetect = () => {
    setIsAutoDetecting(true);
    setDetectedCards([]);
    
    toast.info(
      language === 'zh-CN' ? '实时识别已启动...' : 
      language === 'ko' ? '실시간 인식이 시작되었습니다...' : 
      'Auto-detection started...'
    );

    const detectCards = async () => {
      const imageData = captureFrameForAnalysis();
      if (!imageData) return;

      try {
        const cardIds = await analyzeCardImage(imageData);
        
        if (cardIds && cardIds.length > 0) {
          setDetectedCards(cardIds);
          console.log('Detected cards:', cardIds);
          toast.success(
            language === 'zh-CN' ? `✓ 识别到 ${cardIds.length} 张卡牌！` : 
            language === 'ko' ? `✓ ${cardIds.length}장의 카드 감지!` : 
            `✓ Detected ${cardIds.length} cards!`
          );
        }
      } catch (error) {
        console.error('Auto-detection error:', error);
      }
    };

    autoDetectIntervalRef.current = setInterval(detectCards, 5000);
  };

  const stopAutoDetect = () => {
    setIsAutoDetecting(false);
    if (autoDetectIntervalRef.current) {
      clearInterval(autoDetectIntervalRef.current);
      autoDetectIntervalRef.current = null;
    }
  };

  const confirmAutoDetected = () => {
    if (detectedCards.length > 0) {
      onCardsIdentified(detectedCards);
      stopAutoDetect();
      toast.success(
        language === 'zh-CN' ? `已选择 ${detectedCards.length} 张卡牌` : 
        language === 'ko' ? `${detectedCards.length}장의 카드를 선택했습니다` : 
        `Selected ${detectedCards.length} cards`
      );
    }
  };

  return (
    <Card className="fixed inset-4 z-50 bg-background/80 backdrop-blur-lg border border-accent shadow-glow flex flex-col">
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
            
            <div className="relative w-full max-w-3xl aspect-video bg-muted/20 backdrop-blur-md rounded-lg overflow-hidden">
              {capturedImage ? (
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="w-full h-full object-contain"
                />
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {isAutoDetecting && (
                    <div className="absolute top-4 left-4 right-4 bg-black/70 text-white p-4 rounded-lg backdrop-blur-md">
                      {detectedCards.length > 0 ? (
                        <>
                          <p className="text-sm font-semibold mb-2 text-green-400">
                            ✓ {language === 'zh-CN' ? `已识别 ${detectedCards.length} 张卡牌` : 
                               language === 'ko' ? `${detectedCards.length}장의 카드 감지됨` : 
                               `Detected ${detectedCards.length} cards`}
                          </p>
                          <p className="text-xs opacity-90">
                            {detectedCards.map(id => {
                              const card = LENORMAND_CARDS.find(c => c.id === id);
                              return card ? (language === 'zh-CN' ? card.nameZh : language === 'ko' ? card.nameKo : card.name) : id;
                            }).join(' • ')}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm font-semibold animate-pulse">
                          {language === 'zh-CN' ? '正在扫描...' : 
                           language === 'ko' ? '스캔 중...' : 
                           'Scanning...'}
                        </p>
                      )}
                    </div>
                  )}
                </>
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
              ) : isAutoDetecting ? (
                <>
                  <Button
                    onClick={stopAutoDetect}
                    variant="outline"
                    size="lg"
                    className="gap-2"
                  >
                    <X className="w-5 h-5" />
                    {language === 'zh-CN' ? '停止识别' : language === 'ko' ? '중지' : 'Stop'}
                  </Button>
                  <Button
                    onClick={confirmAutoDetected}
                    size="lg"
                    className="gap-2 bg-primary hover:bg-primary/90"
                    disabled={detectedCards.length === 0}
                  >
                    <Sparkles className="w-5 h-5" />
                    {language === 'zh-CN' ? '确认选择' : language === 'ko' ? '선택 확인' : 'Confirm Selection'}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={capturePhoto}
                    size="lg"
                    variant="outline"
                    className="gap-2"
                    disabled={!stream}
                  >
                    <Camera className="w-5 h-5" />
                    {captureButtonText[language]}
                  </Button>
                  <Button
                    onClick={startAutoDetect}
                    size="lg"
                    className="gap-2 bg-accent hover:bg-accent/90"
                    disabled={!stream}
                  >
                    <Sparkles className="w-5 h-5" />
                    {language === 'zh-CN' ? '实时识别' : language === 'ko' ? '실시간 인식' : 'Auto Detect'}
                  </Button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </Card>
  );
};
