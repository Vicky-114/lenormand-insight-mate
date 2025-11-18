import { LenormandCard } from '@/data/cards';
import { Language, getTranslation } from '@/utils/languageDetector';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Import card images for cards 1-10
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
