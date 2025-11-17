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
          variant="outline" 
          size="lg"
          className="fixed bottom-6 right-6 z-50 shadow-lg bg-card/90 backdrop-blur-sm border-border/50 hover:bg-card"
        >
          <BookOpen className="w-5 h-5 mr-2" />
          {getTranslation(language, 'reading_rules')}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-card/95 backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            {getTranslation(language, 'reading_rules')}
          </DialogTitle>
        </DialogHeader>
        
        <ol className="space-y-4 text-base text-muted-foreground mt-4">
          {rules.map((ruleKey, index) => (
            <li key={ruleKey} className="flex gap-3">
              <span className="font-semibold text-primary shrink-0 text-lg">{index + 1}.</span>
              <span className={index === 6 ? 'font-medium text-foreground' : ''}>
                {getTranslation(language, ruleKey)}
              </span>
            </li>
          ))}
        </ol>
      </DialogContent>
    </Dialog>
  );
};
