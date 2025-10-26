import { LENORMAND_CARDS, LenormandCard } from '@/data/cards';
import { Language, getTranslation } from '@/utils/languageDetector';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CardSelectorProps {
  selectedCards: LenormandCard[];
  onCardSelect: (card: LenormandCard) => void;
  maxCards: number;
  language: Language;
}

export const CardSelector = ({ selectedCards, onCardSelect, maxCards, language }: CardSelectorProps) => {
  const isSelected = (card: LenormandCard) => 
    selectedCards.some(c => c.id === card.id);
  
  const canSelect = selectedCards.length < maxCards;
  
  const getCardName = (card: LenormandCard) => {
    switch (language) {
      case 'zh-CN': return card.nameZh;
      case 'ko': return card.nameKo;
      default: return card.name;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {getTranslation(language, 'selected')}: {selectedCards.length} / {maxCards}
        </p>
      </div>
      
      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-2">
        {LENORMAND_CARDS.map((card) => {
          const selected = isSelected(card);
          
          return (
            <Card
              key={card.id}
              className={cn(
                "relative aspect-[2/3] cursor-pointer transition-all duration-300",
                "bg-gradient-card border-border hover:border-primary",
                "flex flex-col items-center justify-center p-2",
                selected && "border-accent border-2 shadow-glow",
                !selected && !canSelect && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => {
                if (selected) {
                  // Allow deselection
                  onCardSelect(card);
                } else if (canSelect) {
                  onCardSelect(card);
                }
              }}
            >
              <div className="text-2xl mb-1">{card.id}</div>
              <div className="text-xs text-center font-medium leading-tight">
                {getCardName(card)}
              </div>
              {selected && (
                <div className="absolute top-1 right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-xs text-accent-foreground">✓</span>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
