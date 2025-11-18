import { useState } from 'react';
import { LenormandCard, LENORMAND_CARDS } from '@/data/cards';
import { detectLanguage, Language, getTranslation } from '@/utils/languageDetector';
import { generateReading, ReadingResult } from '@/utils/interpretationEngine';
import { CardSelector } from '@/components/CardSelector';
import { SpreadLayout } from '@/components/SpreadLayout';
import { ReadingResultDisplay } from '@/components/ReadingResult';
import { CameraCapture } from '@/components/CameraCapture';
import { StarryBackground } from '@/components/StarryBackground';
import { ReadingRules } from '@/components/ReadingRules';
import { SelectionHistory } from '@/components/SelectionHistory';
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

  const handleRestoreSelection = (cards: LenormandCard[]) => {
    setSelectedCards(cards);
    toast.success(language === 'zh-CN' ? '已恢复选择' : language === 'ko' ? '선택 복원됨' : 'Selection restored');
  };
  const handleReset = () => {
    setSelectedCards([]);
    setReading(null);
    setCapturedImage(null);
  };
  const handleCameraCapture = (imageData: string) => {
    setCapturedImage(imageData);
    setShowCamera(false);
    toast.success(language === 'zh-CN' ? '照片已拍摄！请手动选择卡牌' : language === 'ko' ? '사진이 촬영되었습니다! 수동으로 카드를 선택하세요' : 'Photo captured! Please select cards manually');
  };
  const handleCardsIdentified = (cardIds: number[]) => {
    const cards = cardIds.map(id => LENORMAND_CARDS.find(c => c.id === id)).filter(Boolean) as LenormandCard[];
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
      toast.success(language === 'zh-CN' ? 'AI深度解读完成' : language === 'ko' ? 'AI 심층 분석 완료' : 'AI deep reading complete');

      // Scroll to results
      setTimeout(() => {
        document.getElementById('reading-result')?.scrollIntoView({
          behavior: 'smooth'
        });
      }, 100);
    } catch (error) {
      console.error('Reading error:', error);
      toast.error(language === 'zh-CN' ? '解读失败，请重试' : language === 'ko' ? '분석 실패, 다시 시도하세요' : 'Reading failed, please try again');
    } finally {
      setIsReading(false);
    }
  };
  return <div className="relative min-h-screen bg-gradient-mystic">
      <StarryBackground />
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="space-y-8">
            {/* Header */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-card/95 via-card/90 to-background/95 backdrop-blur-xl border-2 border-primary/30 shadow-[0_0_60px_rgba(168,85,247,0.4)]">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 animate-pulse"></div>
              <div className="relative p-6 md:p-8 text-center space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <Sparkles className="w-8 h-8 text-accent animate-pulse" />
                  <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent tracking-tight animate-fade-in">
                    {getTranslation(language, 'appTitle')}
                  </h1>
                  <Sparkles className="w-8 h-8 text-accent animate-pulse" />
                </div>
                <p className="text-lg text-muted-foreground animate-fade-in">
                  {getTranslation(language, 'appSubtitle')}
                </p>
                <div className="flex justify-center gap-2 pt-2">
                  <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-accent/60 animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            </Card>
            
            {/* Question Input */}
            <Card className="relative overflow-hidden max-w-2xl mx-auto bg-gradient-to-br from-card/90 via-card/85 to-background/90 backdrop-blur-xl border-2 border-border/50 shadow-card hover:shadow-[0_0_40px_rgba(168,85,247,0.2)] transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"></div>
              <div className="relative p-6 space-y-3">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Sparkles className="w-4 h-4 text-accent" />
                  {language === 'zh-CN' ? '你的问题' : language === 'ko' ? '당신의 질문' : 'Your Question'}
                </label>
                <Input 
                  value={question} 
                  onChange={e => handleQuestionChange(e.target.value)} 
                  placeholder={getTranslation(language, 'questionPlaceholder')} 
                  className="text-base bg-background/50 border-border/50 focus:border-primary focus:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-300" 
                />
                {question && (
                  <p className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                    {language === 'zh-CN' ? '检测到：简体中文' : language === 'ko' ? '검출됨: 한국어' : 'Detected: English'}
                  </p>
                )}
              </div>
            </Card>
            
            {/* Selected Cards Display */}
            {selectedCards.length > 0 && <div>
                <SpreadLayout selectedCards={selectedCards} language={language} />
              </div>}
            
            {/* Captured Image Display */}
            {capturedImage && <Card className="max-w-2xl mx-auto p-4 bg-card/30 backdrop-blur-sm border-accent/50">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">
                      {language === 'zh-CN' ? '已拍摄的照片' : language === 'ko' ? '촬영된 사진' : 'Captured Photo'}
                    </p>
                    <Button variant="ghost" size="sm" onClick={() => setCapturedImage(null)}>
                      {language === 'zh-CN' ? '删除' : language === 'ko' ? '삭제' : 'Remove'}
                    </Button>
                  </div>
                  <img src={capturedImage} alt="Captured cards" className="w-full rounded-lg" />
                  <p className="text-xs text-muted-foreground text-center">
                    {language === 'zh-CN' ? '请在下方手动选择识别到的卡牌' : language === 'ko' ? '아래에서 인식된 카드를 수동으로 선택하세요' : 'Please manually select the identified cards below'}
                  </p>
                </div>
              </Card>}
            
            {/* Card Selection */}
            <Card className="relative overflow-hidden max-w-6xl mx-auto bg-gradient-to-br from-card/90 via-card/85 to-background/90 backdrop-blur-xl border-2 border-border/50 shadow-card hover:shadow-[0_0_40px_rgba(168,85,247,0.2)] transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"></div>
              <div className="relative p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                    <span className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                    {getTranslation(language, 'selectCards')}
                  </h2>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowCamera(true)} 
                      className="gap-2 border-2 border-border/50 hover:border-accent hover:bg-accent/10 hover:scale-105 transition-all duration-300"
                    >
                      <Camera className="w-4 h-4" />
                      {language === 'zh-CN' ? '使用摄像头' : language === 'ko' ? '카메라 사용' : 'Use Camera'}
                    </Button>
                    {selectedCards.length > 0 && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleReset}
                        className="gap-2 border-2 border-border/50 hover:border-destructive hover:bg-destructive/10 hover:scale-105 transition-all duration-300"
                      >
                        <RotateCcw className="w-4 h-4" />
                        {getTranslation(language, 'reset')}
                      </Button>
                    )}
                  </div>
                </div>
          
          <SelectionHistory 
            language={language}
            onRestore={handleRestoreSelection}
            onSave={() => {}}
            currentSelection={selectedCards}
          />
          
          <CardSelector selectedCards={selectedCards} onCardSelect={handleCardSelect} maxCards={maxCards} language={language} />
          
                {selectedCards.length === maxCards && (
                  <div className="mt-6 text-center">
                    <Button 
                      size="lg" 
                      onClick={handleGetReading} 
                      disabled={isReading} 
                      className="gap-2 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] hover:bg-right-bottom transition-all duration-500 shadow-glow hover:shadow-[0_0_35px_rgba(168,85,247,0.6)] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      <Sparkles className="w-5 h-5 animate-pulse" />
                      {isReading ? getTranslation(language, 'reading') : getTranslation(language, 'getReading')}
                    </Button>
                  </div>
                )}
              </div>
            </Card>
            
            {/* Reading Result */}
          {reading && <div id="reading-result" className="max-w-4xl mx-auto">
              <ReadingResultDisplay result={reading} language={language} />
            </div>}
        </div>
      </div>
      
      {/* Floating Rules Button */}
      <ReadingRules language={language} />
    </div>;
};
export default Index;