import { LenormandCard } from '@/data/cards';
import { Language, getTranslation } from '@/utils/languageDetector';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { History, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectionHistoryItem {
  id: string;
  cards: LenormandCard[];
  timestamp: number;
}

interface SelectionHistoryProps {
  language: Language;
  onRestore: (cards: LenormandCard[]) => void;
  onSave: (cards: LenormandCard[]) => void;
  currentSelection: LenormandCard[];
}

const STORAGE_KEY = 'lenormand_selection_history';
const MAX_HISTORY = 5;

export const SelectionHistory = ({ language, onRestore, onSave, currentSelection }: SelectionHistoryProps) => {
  const loadHistory = (): SelectionHistoryItem[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const saveToHistory = (cards: LenormandCard[]) => {
    if (cards.length === 0) return;
    
    const history = loadHistory();
    const newItem: SelectionHistoryItem = {
      id: Date.now().toString(),
      cards,
      timestamp: Date.now(),
    };
    
    // Check if this selection already exists
    const isDuplicate = history.some(item => 
      item.cards.length === cards.length &&
      item.cards.every((card, index) => card.id === cards[index].id)
    );
    
    if (!isDuplicate) {
      const updatedHistory = [newItem, ...history].slice(0, MAX_HISTORY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    }
  };

  const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event('storage'));
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return language === 'zh-CN' ? '刚刚' : language === 'ko' ? '방금' : 'Just now';
    if (diffMins < 60) return language === 'zh-CN' ? `${diffMins}分钟前` : language === 'ko' ? `${diffMins}분 전` : `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return language === 'zh-CN' ? `${diffHours}小时前` : language === 'ko' ? `${diffHours}시간 전` : `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return language === 'zh-CN' ? `${diffDays}天前` : language === 'ko' ? `${diffDays}일 전` : `${diffDays}d ago`;
  };

  // Save current selection when it's complete
  if (currentSelection.length === 3) {
    saveToHistory(currentSelection);
  }

  const history = loadHistory();

  if (history.length === 0) return null;

  const titleText = language === 'zh-CN' ? '选择历史' : language === 'ko' ? '선택 기록' : 'Selection History';
  const clearText = language === 'zh-CN' ? '清空历史' : language === 'ko' ? '기록 지우기' : 'Clear';

  return (
    <Card className="p-4 bg-card/15 backdrop-blur-md border border-accent/15">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-semibold text-foreground">{titleText}</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearHistory}
          className="h-8 px-2 text-muted-foreground hover:text-foreground"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
      
      <div className="space-y-2">
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onRestore(item.cards)}
            className={cn(
              "w-full flex items-center gap-3 p-2 rounded-lg",
              "bg-background/50 hover:bg-background/80",
              "border border-border/50 hover:border-accent/50",
              "transition-all duration-200 group"
            )}
          >
            <div className="flex gap-1">
              {item.cards.map((card) => (
                <div
                  key={card.id}
                  className="w-6 h-9 rounded bg-gradient-to-br from-primary/20 to-accent/20 border border-accent/30 flex items-center justify-center"
                >
                  <span className="text-[10px] font-bold text-accent">{card.id}</span>
                </div>
              ))}
            </div>
            <div className="flex-1 text-left">
              <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                {formatTimestamp(item.timestamp)}
              </p>
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
};
