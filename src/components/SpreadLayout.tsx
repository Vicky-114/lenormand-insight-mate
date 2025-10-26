import { LenormandCard } from '@/data/cards';
import { Language, getTranslation } from '@/utils/languageDetector';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SpreadLayoutProps {
  selectedCards: LenormandCard[];
  language: Language;
}

export const SpreadLayout = ({ selectedCards, language }: SpreadLayoutProps) => {
  const positions = ['past', 'present', 'future'];
  
  const getCardName = (card: LenormandCard) => {
    switch (language) {
      case 'zh-CN': return card.nameZh;
      case 'ko': return card.nameKo;
      default: return card.name;
    }
  };
  
  return (
    <div className="flex justify-center gap-4 md:gap-8">
      {selectedCards.map((card, index) => (
        <div key={card.id} className="flex flex-col items-center gap-3">
          <Card className={cn(
            "relative w-32 h-48 md:w-40 md:h-60",
            "bg-gradient-card border-2 border-accent",
            "shadow-card hover:shadow-glow transition-all duration-300",
            "flex flex-col items-center justify-center p-4"
          )}>
            <div className="text-4xl md:text-5xl text-accent mb-3">{card.id}</div>
            <div className="text-center">
              <div className="text-sm md:text-base font-semibold mb-2">
                {getCardName(card)}
              </div>
              <div className="text-xs text-muted-foreground">
                {card.keywords[language].slice(0, 2).join(', ')}
              </div>
            </div>
          </Card>
          
          <div className="text-sm font-medium text-accent">
            {getTranslation(language, positions[index])}
          </div>
        </div>
      ))}
    </div>
  );
};
