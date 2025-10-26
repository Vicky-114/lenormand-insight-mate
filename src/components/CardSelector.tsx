import { LENORMAND_CARDS, LenormandCard } from '@/data/cards';
import { Language, getTranslation } from '@/utils/languageDetector';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface CardSelectorProps {
  selectedCards: LenormandCard[];
  onCardSelect: (card: LenormandCard) => void;
  maxCards: number;
  language: Language;
}

export const CardSelector = ({ selectedCards, onCardSelect, maxCards, language }: CardSelectorProps) => {
  const [numberInput, setNumberInput] = useState('');
  
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
  
  const handleNumberInput = (value: string) => {
    setNumberInput(value);
    // Parse numbers: support comma, space, or comma+space separated
    const numbers = value.split(/[,\s]+/)
      .map(n => parseInt(n.trim()))
      .filter(n => !isNaN(n) && n >= 1 && n <= 36);
    
    // Clear existing selections and add new ones based on input
    if (numbers.length > 0 && numbers.length <= maxCards) {
      const newCards = numbers
        .map(id => LENORMAND_CARDS.find(c => c.id === id))
        .filter(Boolean) as LenormandCard[];
      
      // Only update if we have valid cards and they're different from current selection
      const currentIds = selectedCards.map(c => c.id).sort().join(',');
      const newIds = newCards.map(c => c.id).sort().join(',');
      
      if (currentIds !== newIds && newCards.length === numbers.length) {
        // Clear existing and select new ones
        selectedCards.forEach(card => onCardSelect(card));
        newCards.forEach(card => onCardSelect(card));
      }
    }
  };
  
  const inputPlaceholder = language === 'zh-CN' ? '输入卡牌编号 (例如: 1,24,35)' : 
                          language === 'ko' ? '카드 번호 입력 (예: 1,24,35)' : 
                          'Enter card numbers (e.g., 1,24,35)';
  
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {getTranslation(language, 'selected')}: {selectedCards.length} / {maxCards}
          </p>
        </div>
        
        <Input
          type="text"
          value={numberInput}
          onChange={(e) => handleNumberInput(e.target.value)}
          placeholder={inputPlaceholder}
          className="text-center"
        />
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
