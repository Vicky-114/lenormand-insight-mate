import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { getTranslation, type Language } from '@/utils/languageDetector';

interface ReadingRulesProps {
  language: Language;
}

export const ReadingRules = ({ language }: ReadingRulesProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const rules = [
    'rule_1', 'rule_2', 'rule_3', 'rule_4', 'rule_5', 'rule_6', 'rule_7'
  ];

  return (
    <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full group">
          <h3 className="text-lg font-semibold text-foreground">
            {getTranslation(language, 'reading_rules')}
          </h3>
          <ChevronDown 
            className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </CollapsibleTrigger>
        
        <CollapsibleContent className="mt-4">
          <ScrollArea className="h-[400px] pr-4">
            <ol className="space-y-3 text-sm text-muted-foreground">
              {rules.map((ruleKey, index) => (
                <li key={ruleKey} className="flex gap-2">
                  <span className="font-semibold text-primary shrink-0">{index + 1}.</span>
                  <span className={index === 6 ? 'font-medium text-foreground' : ''}>
                    {getTranslation(language, ruleKey)}
                  </span>
                </li>
              ))}
            </ol>
          </ScrollArea>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
