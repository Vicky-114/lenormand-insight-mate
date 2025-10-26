import { ReadingResult } from '@/utils/interpretationEngine';
import { Language, getTranslation } from '@/utils/languageDetector';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Download, Share2 } from 'lucide-react';
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
      <Card className="p-6 bg-gradient-card border-accent/50">
        <h3 className="text-xl font-bold mb-3 text-accent">
          {getTranslation(language, 'overview')}
        </h3>
        <p className="text-foreground leading-relaxed">
          {result.ui_text.overview}
        </p>
      </Card>
      
      {/* Card Analysis */}
      <Card className="p-6 bg-gradient-card border-border">
        <h3 className="text-xl font-bold mb-4 text-accent">
          {getTranslation(language, 'cardAnalysis')}
        </h3>
        <div className="space-y-4">
          {result.ui_text.card_analysis.map((analysis, index) => (
            <div key={index} className="pl-4 border-l-2 border-accent/50">
              <p className="text-foreground">{analysis}</p>
            </div>
          ))}
        </div>
      </Card>
      
      {/* Combinations */}
      <Card className="p-6 bg-gradient-card border-border">
        <h3 className="text-xl font-bold mb-4 text-accent">
          {getTranslation(language, 'combinations')}
        </h3>
        <ul className="space-y-2">
          {result.ui_text.combinations.map((insight, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-accent mt-1">✦</span>
              <span className="text-foreground">{insight}</span>
            </li>
          ))}
        </ul>
      </Card>
      
      {/* Advice */}
      <Card className="p-6 bg-gradient-card border-border">
        <h3 className="text-xl font-bold mb-4 text-accent">
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
      <Card className="p-4 bg-muted/50 border-muted">
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
