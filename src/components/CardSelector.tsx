import { LENORMAND_CARDS, LenormandCard } from '@/data/cards';
import { Language, getTranslation } from '@/utils/languageDetector';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useState } from 'react';

// Import card images for cards 1-30
import card1 from '@/assets/cards/1.png';
import card2 from '@/assets/cards/2.png';
import card3 from '@/assets/cards/3.png';
import card4 from '@/assets/cards/4.png';
import card5 from '@/assets/cards/5.png';
import card6 from '@/assets/cards/6.png';
import card7 from '@/assets/cards/7.png';
import card8 from '@/assets/cards/8.png';
import card9 from '@/assets/cards/9.png';
import card10 from '@/assets/cards/10.png';
import card11 from '@/assets/cards/11.png';
import card12 from '@/assets/cards/12.png';
import card13 from '@/assets/cards/13.png';
import card14 from '@/assets/cards/14.png';
import card15 from '@/assets/cards/15.png';
import card16 from '@/assets/cards/16.png';
import card17 from '@/assets/cards/17.png';
import card18 from '@/assets/cards/18.png';
import card19 from '@/assets/cards/19.png';
import card20 from '@/assets/cards/20.png';
import card21 from '@/assets/cards/21.png';
import card22 from '@/assets/cards/22.png';
import card23 from '@/assets/cards/23.png';
import card24 from '@/assets/cards/24.png';
import card25 from '@/assets/cards/25.png';
import card26 from '@/assets/cards/26.png';
import card27 from '@/assets/cards/27.png';
import card28 from '@/assets/cards/28.png';
import card29 from '@/assets/cards/29.png';
import card30 from '@/assets/cards/30.png';

const cardImages: Record<number, string> = {
  1: card1,
  2: card2,
  3: card3,
  4: card4,
  5: card5,
  6: card6,
  7: card7,
  8: card8,
  9: card9,
  10: card10,
  11: card11,
  12: card12,
  13: card13,
  14: card14,
  15: card15,
  16: card16,
  17: card17,
  18: card18,
  19: card19,
  20: card20,
  21: card21,
  22: card22,
  23: card23,
  24: card24,
  25: card25,
  26: card26,
  27: card27,
  28: card28,
  29: card29,
  30: card30,
};

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
                "relative aspect-[2/3] cursor-pointer transition-all duration-300 group overflow-hidden",
                "bg-gradient-card border-border hover:border-primary hover:scale-110 hover:z-10",
                "hover:shadow-[0_0_25px_rgba(168,85,247,0.4)]",
                selected && "border-accent border-2 shadow-glow scale-105",
                !selected && !canSelect && "opacity-50 cursor-not-allowed hover:scale-100"
              )}
              onClick={() => {
                if (selected) {
                  onCardSelect(card);
                } else if (canSelect) {
                  onCardSelect(card);
                }
              }}
            >
              {cardImages[card.id] ? (
                <img 
                  src={cardImages[card.id]} 
                  alt={getCardName(card)}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                  <div className="flex flex-col items-center justify-center h-full p-2">
                    <div className="relative text-2xl mb-1 font-bold text-foreground group-hover:text-accent transition-colors duration-300">{card.id}</div>
                    <div className="relative text-xs text-center font-medium leading-tight text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      {getCardName(card)}
                    </div>
                  </div>
                </>
              )}
              {selected && (
                <div className="absolute top-1 right-1 w-5 h-5 bg-gradient-to-br from-accent to-accent/80 rounded-full flex items-center justify-center shadow-lg animate-scale-in z-10">
                  <span className="text-xs text-accent-foreground font-bold">✓</span>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
