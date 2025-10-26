import { LENORMAND_CARDS, LenormandCard } from '@/data/cards';
import { Language } from './languageDetector';
import { supabase } from '@/integrations/supabase/client';

export interface CardPosition {
  card: LenormandCard;
  position: 'past' | 'present' | 'future';
}

export interface ReadingResult {
  language: Language;
  question: string;
  spread: string;
  cards: Array<{
    id: number;
    name: string;
    position: string;
  }>;
  keywords_by_card: Record<string, string[]>;
  pair_insights: string[];
  themes: string[];
  advice: Record<string, string[]>;
  confidence: number;
  timestamp: string;
  ui_text: {
    overview: string;
    card_analysis: string[];
    combinations: string[];
    advice_sections: Record<string, string[]>;
  };
}

const getCardName = (card: LenormandCard, lang: Language): string => {
  switch (lang) {
    case 'zh-CN': return card.nameZh;
    case 'ko': return card.nameKo;
    default: return card.name;
  }
};

const getKeywords = (card: LenormandCard, lang: Language): string[] => {
  return card.keywords[lang] || card.keywords.en;
};

const generatePairInsights = (positions: CardPosition[], lang: Language): string[] => {
  const insights: string[] = [];
  
  if (positions.length >= 2) {
    const card1 = positions[0].card;
    const card2 = positions[1].card;
    const name1 = getCardName(card1, lang);
    const name2 = getCardName(card2, lang);
    
    const templates = {
      'zh-CN': `${name1} + ${name2} → 显示了从过去的影响到当下状态的转变`,
      'en': `${name1} + ${name2} → Shows transition from past influences to present state`,
      'ko': `${name1} + ${name2} → 과거 영향에서 현재 상태로의 전환을 보여줍니다`,
    };
    
    insights.push(templates[lang]);
  }
  
  if (positions.length >= 3) {
    const card2 = positions[1].card;
    const card3 = positions[2].card;
    const name2 = getCardName(card2, lang);
    const name3 = getCardName(card3, lang);
    
    const templates = {
      'zh-CN': `${name2} + ${name3} → 当下的能量将引导未来的发展方向`,
      'en': `${name2} + ${name3} → Current energy guides future direction`,
      'ko': `${name2} + ${name3} → 현재 에너지가 미래 방향을 안내합니다`,
    };
    
    insights.push(templates[lang]);
  }
  
  return insights;
};

const generateOverview = (positions: CardPosition[], question: string, lang: Language): string => {
  const templates = {
    'zh-CN': `关于"${question}"的解读显示：${positions.map((p, i) => 
      `${i > 0 ? '，' : ''}${p.position === 'past' ? '过去' : p.position === 'present' ? '当下' : '未来'}呈现${getCardName(p.card, lang)}`
    ).join('')}的格局。整体能量从挑战走向机遇。`,
    'en': `Reading for "${question}" shows: ${positions.map((p, i) => 
      `${i > 0 ? ', ' : ''}${p.position} reveals ${getCardName(p.card, lang)}`
    ).join('')}. Overall energy moves from challenge to opportunity.`,
    'ko': `"${question}"에 대한 리딩: ${positions.map((p, i) => 
      `${i > 0 ? ', ' : ''}${p.position === 'past' ? '과거' : p.position === 'present' ? '현재' : '미래'}에 ${getCardName(p.card, lang)}`
    ).join('')}를 보여줍니다. 전체적인 에너지가 도전에서 기회로 이동합니다.`,
  };
  
  return templates[lang];
};

const generateCardAnalysis = (positions: CardPosition[], lang: Language): string[] => {
  return positions.map(({ card, position }) => {
    const name = getCardName(card, lang);
    const keywords = getKeywords(card, lang).slice(0, 3).join(', ');
    const posLabel = {
      'zh-CN': { past: '过去', present: '当下', future: '未来' },
      'en': { past: 'Past', present: 'Present', future: 'Future' },
      'ko': { past: '과거', present: '현재', future: '미래' },
    };
    
    const templates = {
      'zh-CN': `${posLabel['zh-CN'][position]} - ${name}（${keywords}）：这张牌在${posLabel['zh-CN'][position]}位置表示相关的能量和影响正在作用。`,
      'en': `${posLabel['en'][position]} - ${name} (${keywords}): This card in ${position} position indicates related energies at work.`,
      'ko': `${posLabel['ko'][position]} - ${name} (${keywords}): 이 카드는 ${posLabel['ko'][position]} 위치에서 관련 에너지가 작용하고 있음을 나타냅니다.`,
    };
    
    return templates[lang];
  });
};

const generateAdvice = (positions: CardPosition[], question: string, lang: Language): Record<string, string[]> => {
  const themes = new Set<string>();
  positions.forEach(p => p.card.themes.forEach(t => themes.add(t)));
  
  const advice: Record<string, string[]> = {};
  
  if (themes.has('love') || themes.has('relationships')) {
    advice.love = {
      'zh-CN': ['保持开放的沟通', '在下周内表达你的真实感受', '注意情感边界的设定'],
      'en': ['Maintain open communication', 'Express your true feelings within the next week', 'Pay attention to emotional boundaries'],
      'ko': ['개방적인 소통 유지', '다음 주 안에 진심을 표현하기', '감정적 경계에 주의하기'],
    }[lang] || [];
  }
  
  if (themes.has('work') || themes.has('career') || themes.has('business')) {
    advice.career = {
      'zh-CN': ['准备两套方案以应对变化', '重点展示你的专业能力', '在月底前完成关键任务清单'],
      'en': ['Prepare two plans for changes', 'Highlight your professional capabilities', 'Complete key task list by month end'],
      'ko': ['변화에 대비한 두 가지 계획 준비', '전문 능력 강조', '월말까지 주요 작업 목록 완료'],
    }[lang] || [];
  }
  
  if (themes.has('money') || themes.has('finances') || themes.has('abundance')) {
    advice.money = {
      'zh-CN': ['审查当前的财务计划', '设置自动储蓄机制', '在两周内优化现金流'],
      'en': ['Review current financial plan', 'Set up automatic savings', 'Optimize cash flow within two weeks'],
      'ko': ['현재 재정 계획 검토', '자동 저축 설정', '2주 안에 현금 흐름 최적화'],
    }[lang] || [];
  }
  
  return advice;
};

export const generateReading = async (
  selectedCards: LenormandCard[],
  question: string,
  lang: Language,
  useAI: boolean = true
): Promise<ReadingResult> => {
  const positions: CardPosition[] = selectedCards.map((card, index) => ({
    card,
    position: index === 0 ? 'past' : index === 1 ? 'present' : 'future',
  }));
  
  const keywordsByCard: Record<string, string[]> = {};
  selectedCards.forEach(card => {
    keywordsByCard[card.name] = getKeywords(card, lang);
  });
  
  const themes = Array.from(new Set(selectedCards.flatMap(c => c.themes)));
  
  // Base reading structure
  const baseReading = {
    language: lang,
    question,
    spread: '3-card',
    cards: positions.map(p => ({
      id: p.card.id,
      name: p.card.name,
      position: p.position,
    })),
    keywords_by_card: keywordsByCard,
    pair_insights: generatePairInsights(positions, lang),
    themes,
    advice: generateAdvice(positions, question, lang),
    confidence: 0.85,
    timestamp: new Date().toISOString(),
    ui_text: {
      overview: generateOverview(positions, question, lang),
      card_analysis: generateCardAnalysis(positions, lang),
      combinations: generatePairInsights(positions, lang),
      advice_sections: generateAdvice(positions, question, lang),
    },
  };

  // If AI is enabled, enhance with deep interpretation
  if (useAI) {
    try {
      const cardsData = selectedCards.map(card => ({
        id: card.id,
        name: card.name,
        nameZh: card.nameZh,
        nameKo: card.nameKo,
        keywords: getKeywords(card, lang),
        themes: card.themes,
      }));

      const { data, error } = await supabase.functions.invoke('interpret-reading', {
        body: { 
          cards: cardsData,
          question,
          language: lang
        }
      });

      if (error) {
        console.error('AI interpretation error:', error);
        // Fall back to basic reading
        return baseReading;
      }

      if (data?.interpretation) {
        // Enhance the reading with AI-generated content
        return {
          ...baseReading,
          confidence: 0.95,
          ui_text: {
            overview: data.interpretation.overview || baseReading.ui_text.overview,
            card_analysis: data.interpretation.card_analysis || baseReading.ui_text.card_analysis,
            combinations: data.interpretation.combinations || baseReading.ui_text.combinations,
            advice_sections: data.interpretation.advice || baseReading.ui_text.advice_sections,
          },
        };
      }
    } catch (error) {
      console.error('Failed to get AI interpretation:', error);
      // Fall back to basic reading
    }
  }
  
  return baseReading;
};
