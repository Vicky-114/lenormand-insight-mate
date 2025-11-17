import { useState } from 'react';
import { LenormandCard, LENORMAND_CARDS } from '@/data/cards';
import { detectLanguage, Language, getTranslation } from '@/utils/languageDetector';
import { generateReading, ReadingResult } from '@/utils/interpretationEngine';
import { CardSelector } from '@/components/CardSelector';
import { SpreadLayout } from '@/components/SpreadLayout';
import { ReadingResultDisplay } from '@/components/ReadingResult';
import { CameraCapture } from '@/components/CameraCapture';
import { StarryBackground } from '@/components/StarryBackground';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Sparkles, RotateCcw, Camera } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const [question, setQuestion] = useState('');
  const [language, setLanguage] = useState<Language>('en');
  const [selectedCards, setSelectedCards] = useState<LenormandCard[]>([]);
  const [reading, setReading] = useState<ReadingResult | null>(null);
  const [isReading, setIsReading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  const maxCards = 3;
  
  const handleQuestionChange = (value: string) => {
    setQuestion(value);
    if (value.length > 0) {
      const detectedLang = detectLanguage(value);
      setLanguage(detectedLang);
    }
  };
  
  const handleCardSelect = (card: LenormandCard) => {
    setSelectedCards(prev => {
      const exists = prev.find(c => c.id === card.id);
      if (exists) {
        return prev.filter(c => c.id !== card.id);
      }
      if (prev.length < maxCards) {
        return [...prev, card];
      }
      return prev;
    });
  };
  
  const handleReset = () => {
    setSelectedCards([]);
    setReading(null);
    setCapturedImage(null);
  };
  
  const handleCameraCapture = (imageData: string) => {
    setCapturedImage(imageData);
    setShowCamera(false);
    toast.success(
      language === 'zh-CN' ? '照片已拍摄！请手动选择卡牌' : 
      language === 'ko' ? '사진이 촬영되었습니다! 수동으로 카드를 선택하세요' : 
      'Photo captured! Please select cards manually'
    );
  };
  
  const handleCardsIdentified = (cardIds: number[]) => {
    const cards = cardIds
      .map(id => LENORMAND_CARDS.find(c => c.id === id))
      .filter(Boolean) as LenormandCard[];
    
    setSelectedCards(cards);
    setShowCamera(false);
    setCapturedImage(null);
  };
  
  const handleGetReading = async () => {
    if (!question.trim()) {
      toast.error(language === 'zh-CN' ? '请输入问题' : language === 'ko' ? '질문을 입력하세요' : 'Please enter a question');
      return;
    }
    
    if (selectedCards.length !== maxCards) {
      toast.error(language === 'zh-CN' ? `请选择${maxCards}张卡牌` : language === 'ko' ? `${maxCards}장의 카드를 선택하세요` : `Please select ${maxCards} cards`);
      return;
    }
    
    setIsReading(true);
    
    try {
      // Generate deep AI-powered reading
      const result = await generateReading(selectedCards, question, language, true);
      setReading(result);
      
      toast.success(
        language === 'zh-CN' ? 'AI深度解读完成' : 
        language === 'ko' ? 'AI 심층 분석 완료' : 
        'AI deep reading complete'
      );
      
      // Scroll to results
      setTimeout(() => {
        document.getElementById('reading-result')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error('Reading error:', error);
      toast.error(
        language === 'zh-CN' ? '解读失败，请重试' : 
        language === 'ko' ? '분석 실패, 다시 시도하세요' : 
        'Reading failed, please try again'
      );
    } finally {
      setIsReading(false);
    }
  };
  
  return (
    <>
      <StarryBackground />
      <div className="min-h-screen bg-gradient-mystic">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Sparkles className="w-8 h-8 text-accent animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              {getTranslation(language, 'appTitle')}
            </h1>
            <Sparkles className="w-8 h-8 text-accent animate-pulse" />
          </div>
          <p className="text-lg text-muted-foreground">
            {getTranslation(language, 'appSubtitle')}
          </p>
        </div>
        
        {/* Question Input */}
        <Card className="max-w-2xl mx-auto p-6 mb-8 bg-gradient-card border-accent/50 shadow-card">
          <div className="space-y-4">
            <label className="text-sm font-medium text-foreground">
              {language === 'zh-CN' ? '你的问题' : language === 'ko' ? '당신의 질문' : 'Your Question'}
            </label>
            <Input
              value={question}
              onChange={(e) => handleQuestionChange(e.target.value)}
              placeholder={getTranslation(language, 'questionPlaceholder')}
              className="bg-background/50 border-border text-lg"
            />
            {question && (
              <p className="text-xs text-muted-foreground">
                {language === 'zh-CN' ? '检测到：简体中文' : 
                 language === 'ko' ? '검출됨: 한국어' : 
                 'Detected: English'}
              </p>
            )}
          </div>
        </Card>
        
        {/* Selected Cards Display */}
        {selectedCards.length > 0 && (
          <div className="mb-8">
            <SpreadLayout selectedCards={selectedCards} language={language} />
          </div>
        )}
        
        {/* Captured Image Display */}
        {capturedImage && (
          <Card className="max-w-2xl mx-auto p-4 mb-8 bg-gradient-card border-accent/50">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">
                  {language === 'zh-CN' ? '已拍摄的照片' : 
                   language === 'ko' ? '촬영된 사진' : 
                   'Captured Photo'}
                </p>
                <Button variant="ghost" size="sm" onClick={() => setCapturedImage(null)}>
                  {language === 'zh-CN' ? '删除' : language === 'ko' ? '삭제' : 'Remove'}
                </Button>
              </div>
              <img src={capturedImage} alt="Captured cards" className="w-full rounded-lg" />
              <p className="text-xs text-muted-foreground text-center">
                {language === 'zh-CN' ? '请在下方手动选择识别到的卡牌' : 
                 language === 'ko' ? '아래에서 인식된 카드를 수동으로 선택하세요' : 
                 'Please manually select the identified cards below'}
              </p>
            </div>
          </Card>
        )}
        
        {/* Card Selection */}
        <Card className="max-w-6xl mx-auto p-6 mb-8 bg-gradient-card border-border shadow-card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-accent">
              {getTranslation(language, 'selectCards')}
            </h2>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowCamera(true)}
                className="gap-2"
              >
                <Camera className="w-4 h-4" />
                {language === 'zh-CN' ? '使用摄像头' : 
                 language === 'ko' ? '카메라 사용' : 
                 'Use Camera'}
              </Button>
              {selectedCards.length > 0 && (
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {getTranslation(language, 'reset')}
                </Button>
              )}
            </div>
          </div>
          
          <CardSelector
            selectedCards={selectedCards}
            onCardSelect={handleCardSelect}
            maxCards={maxCards}
            language={language}
          />
          
          {selectedCards.length === maxCards && (
            <div className="mt-6 text-center">
              <Button
                size="lg"
                onClick={handleGetReading}
                disabled={isReading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                {isReading ? getTranslation(language, 'reading') : getTranslation(language, 'getReading')}
              </Button>
            </div>
          )}
        </Card>
        
        {/* Reading Result */}
        {reading && (
          <div id="reading-result" className="max-w-4xl mx-auto">
            <ReadingResultDisplay result={reading} language={language} />
          </div>
        )}
        
        {/* Camera Modal */}
        {showCamera && (
          <CameraCapture
            onCapture={handleCameraCapture}
            onCardsIdentified={handleCardsIdentified}
            onClose={() => setShowCamera(false)}
            language={language}
          />
        )}
      </div>
    </div>
    </>
  );
};

export default Index;
