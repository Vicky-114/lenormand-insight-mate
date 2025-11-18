import { ReadingResult } from '@/utils/interpretationEngine';
import { Language, getTranslation } from '@/utils/languageDetector';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Download, Share2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface ReadingResultProps {
  result: ReadingResult;
  language: Language;
}

export const ReadingResultDisplay = ({ result, language }: ReadingResultProps) => {
  const handleCopyText = () => {
    const text = `
${getTranslation(language, 'overview')}
${result.ui_text.overview}

${getTranslation(language, 'cardAnalysis')}
${result.ui_text.card_analysis.join('\n\n')}

${getTranslation(language, 'combinations')}
${result.ui_text.combinations.join('\n')}

${getTranslation(language, 'advice')}
${Object.entries(result.ui_text.advice_sections).map(([theme, items]) => 
  `${getTranslation(language, theme)}:\n${items.map(i => `• ${i}`).join('\n')}`
).join('\n\n')}

${getTranslation(language, 'disclaimer')}
    `.trim();
    
    navigator.clipboard.writeText(text);
    toast.success(language === 'zh-CN' ? '已复制到剪贴板' : language === 'ko' ? '클립보드에 복사됨' : 'Copied to clipboard');
  };
  
  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lenormand-reading-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(language === 'zh-CN' ? 'JSON 已导出' : language === 'ko' ? 'JSON 내보내기 완료' : 'JSON exported');
  };
  
  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex gap-2 justify-center">
        <Button variant="secondary" size="sm" onClick={handleCopyText}>
          <Copy className="w-4 h-4 mr-2" />
          {getTranslation(language, 'copyText')}
        </Button>
        <Button variant="secondary" size="sm" onClick={handleExportJSON}>
          <Download className="w-4 h-4 mr-2" />
          {getTranslation(language, 'exportJSON')}
        </Button>
      </div>
      
      {/* Overview */}
      <Card className="relative overflow-hidden p-6 bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl animate-fade-in">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl"></div>
        <h3 className="relative flex items-center gap-2 text-xl font-bold mb-3 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          <Sparkles className="w-5 h-5 text-accent" />
          {getTranslation(language, 'overview')}
        </h3>
        <p className="relative text-foreground leading-relaxed">
          {result.ui_text.overview}
        </p>
      </Card>
      
      {/* Card Analysis */}
      <Card className="p-6 bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 animate-fade-in" style={{animationDelay: '0.1s'}}>
        <h3 className="flex items-center gap-2 text-xl font-bold mb-4 text-accent">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
          {getTranslation(language, 'cardAnalysis')}
        </h3>
        <div className="space-y-4">
          {result.ui_text.card_analysis.map((analysis, index) => (
            <div key={index} className="relative pl-4 border-l-2 border-accent/50 hover:border-accent transition-colors duration-300 group">
              <div className="absolute left-0 top-0 w-2 h-2 bg-accent/50 group-hover:bg-accent rounded-full -translate-x-[5px] transition-colors duration-300"></div>
              <p className="text-foreground leading-relaxed">{analysis}</p>
            </div>
          ))}
        </div>
      </Card>
      
      {/* Combinations */}
      <Card className="p-6 bg-gradient-to-br from-card/35 via-card/30 to-background/35 backdrop-blur-sm border-border shadow-card hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-all duration-500 animate-fade-in" style={{animationDelay: '0.2s'}}>
        <h3 className="flex items-center gap-2 text-xl font-bold mb-4 text-accent">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
          {getTranslation(language, 'combinations')}
        </h3>
        <ul className="space-y-2">
          {result.ui_text.combinations.map((insight, index) => (
            <li key={index} className="flex items-start gap-2 group hover:translate-x-1 transition-transform duration-300">
              <span className="text-accent mt-1 group-hover:scale-125 transition-transform duration-300">✦</span>
              <span className="text-foreground">{insight}</span>
            </li>
          ))}
        </ul>
      </Card>
      
      {/* Advice */}
      <Card className="p-6 bg-gradient-to-br from-card/35 via-card/30 to-background/35 backdrop-blur-sm border-border shadow-card hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-all duration-500 animate-fade-in" style={{animationDelay: '0.3s'}}>
        <h3 className="flex items-center gap-2 text-xl font-bold mb-4 text-accent">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
          {getTranslation(language, 'advice')}
        </h3>
        <div className="space-y-4">
          {Object.entries(result.ui_text.advice_sections).map(([theme, items]) => (
            <div key={theme}>
              <h4 className="font-semibold text-accent mb-2 capitalize">
                {getTranslation(language, theme)}
              </h4>
              <ul className="space-y-1 ml-4">
                {items.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span className="text-foreground text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>
      
      {/* Disclaimer */}
      <Card className="p-4 bg-muted/30 backdrop-blur-sm border-muted">
        <p className="text-xs text-muted-foreground text-center">
          {getTranslation(language, 'disclaimer')}
        </p>
        <p className="text-xs text-muted-foreground text-center mt-1">
          {getTranslation(language, 'confidence')}: {(result.confidence * 100).toFixed(0)}%
        </p>
      </Card>
    </div>
  );
};
