import { LenormandCard } from '@/data/cards';
import { Language, getTranslation } from '@/utils/languageDetector';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Import card images for cards 1-36
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
import card31 from '@/assets/cards/31.png';
import card32 from '@/assets/cards/32.png';
import card33 from '@/assets/cards/33.png';
import card34 from '@/assets/cards/34.png';
import card35 from '@/assets/cards/35.png';
import card36 from '@/assets/cards/36.png';

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
  31: card31,
  32: card32,
  33: card33,
  34: card34,
  35: card35,
  36: card36,
};

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
    <div className="relative flex justify-center gap-4 md:gap-8">
      {/* Connection Lines */}
      <div className="absolute top-24 md:top-32 left-1/2 -translate-x-1/2 w-full max-w-md h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
      
      {selectedCards.map((card, index) => (
        <div key={card.id} className="flex flex-col items-center gap-3 animate-fade-in" style={{animationDelay: `${index * 0.15}s`}}>
          <Card className={cn(
            "relative w-32 h-48 md:w-40 md:h-60 group overflow-hidden",
            "bg-gradient-to-br from-card/95 via-card/90 to-background/95 backdrop-blur-sm border-2 border-accent/80",
            "shadow-[0_8px_32px_rgba(168,85,247,0.3)] hover:shadow-[0_12px_48px_rgba(168,85,247,0.5)]",
            "transition-all duration-500 hover:scale-110 hover:-translate-y-2"
          )}>
            {cardImages[card.id] ? (
              <img 
                src={cardImages[card.id]} 
                alt={getCardName(card)}
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                {/* Animated Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="flex flex-col items-center justify-center h-full p-4">
                  {/* Card Number with Glow Effect */}
                  <div className="relative text-4xl md:text-5xl font-bold bg-gradient-to-br from-accent via-accent to-primary bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
                    {card.id}
                  </div>
                  
                  <div className="relative text-center">
                    <div className="text-sm md:text-base font-semibold mb-2 text-foreground group-hover:text-accent transition-colors duration-300">
                      {getCardName(card)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {card.keywords[language].slice(0, 2).join(', ')}
                    </div>
                  </div>
                </div>
                
                {/* Corner Decorations */}
                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-accent/50 group-hover:border-accent transition-colors duration-300"></div>
                <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-accent/50 group-hover:border-accent transition-colors duration-300"></div>
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-accent/50 group-hover:border-accent transition-colors duration-300"></div>
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-accent/50 group-hover:border-accent transition-colors duration-300"></div>
              </>
            )}
          </Card>
          
          <div className="flex items-center gap-2 text-sm font-medium text-accent">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
            {getTranslation(language, positions[index])}
          </div>
        </div>
      ))}
    </div>
  );
};
