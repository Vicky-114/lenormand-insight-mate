import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import { getTranslation, type Language } from '@/utils/languageDetector';

interface ReadingRulesProps {
  language: Language;
}

export const ReadingRules = ({ language }: ReadingRulesProps) => {
  const rules = [
    'rule_1', 'rule_2', 'rule_3', 'rule_4', 'rule_5', 'rule_6', 'rule_7'
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          size="lg"
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] hover:bg-right-bottom text-primary-foreground shadow-glow hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all duration-500 animate-pulse hover:animate-none border-2 border-primary/20 hover:scale-110"
        >
          <BookOpen className="w-5 h-5 mr-2" />
          {getTranslation(language, 'reading_rules')}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-white/2 backdrop-blur-xl border border-white/5 shadow-xl">
        <DialogHeader className="space-y-3 pb-6 border-b border-border/50">
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse">
            {getTranslation(language, 'reading_rules')}
          </DialogTitle>
          <p className="text-sm text-muted-foreground italic">
            ✨ {language === 'zh-CN' ? '遵循这些规则，获得最准确的占卜结果' : 'Follow these rules for the most accurate reading'}
          </p>
        </DialogHeader>
        
        <ol className="space-y-5 text-base mt-6">
          {rules.map((ruleKey, index) => (
            <li key={ruleKey} className="group flex gap-4 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
              <span className="font-bold text-primary shrink-0 text-xl w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                {index + 1}
              </span>
              <span className={`leading-relaxed ${index === 6 ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                {getTranslation(language, ruleKey)}
              </span>
            </li>
          ))}
        </ol>
      </DialogContent>
    </Dialog>
  );
};
