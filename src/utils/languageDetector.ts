export type Language = 'zh-CN' | 'en' | 'ko';

export const detectLanguage = (text: string): Language => {
  // Check for Chinese characters
  if (/[\u4e00-\u9fa5]/.test(text)) {
    return 'zh-CN';
  }
  
  // Check for Korean characters
  if (/[\uac00-\ud7af]|[\u1100-\u11ff]|[\u3130-\u318f]|[\ua960-\ua97f]|[\ud7b0-\ud7ff]/.test(text)) {
    return 'ko';
  }
  
  // Default to English
  return 'en';
};

export const getTranslation = (lang: Language, key: string): string => {
  const translations: Record<Language, Record<string, string>> = {
    'zh-CN': {
      appTitle: '雷诺曼读牌助手',
      appSubtitle: '让卡牌为你揭示未来的路径',
      questionPlaceholder: '输入你的问题...',
      startReading: '开始解读',
      selectCards: '选择卡牌',
      selected: '已选',
      reset: '重置',
      getReading: '获取解读',
      reading: '解读中...',
      overview: '概述',
      cardAnalysis: '逐卡解析',
      combinations: '组合洞见',
      advice: '可执行建议',
      love: '爱情',
      career: '职业',
      money: '金钱',
      family: '家庭',
      health: '健康',
      disclaimer: '注意：此解读仅供参考，不能替代专业建议。',
      exportJSON: '导出 JSON',
      copyText: '复制文本',
      shareReading: '分享解读',
      past: '过去',
      present: '当下',
      future: '未来',
      confidence: '置信度',
      manualSelect: '手动选择卡牌',
      cameraCapture: '使用相机识别',
    },
    'en': {
      appTitle: 'Lenormand Reading Assistant',
      appSubtitle: 'Let the cards reveal your path forward',
      questionPlaceholder: 'Enter your question...',
      startReading: 'Start Reading',
      selectCards: 'Select Cards',
      selected: 'Selected',
      reset: 'Reset',
      getReading: 'Get Reading',
      reading: 'Reading...',
      overview: 'Overview',
      cardAnalysis: 'Card Analysis',
      combinations: 'Combination Insights',
      advice: 'Actionable Advice',
      love: 'Love',
      career: 'Career',
      money: 'Money',
      family: 'Family',
      health: 'Health',
      disclaimer: 'Note: This reading is for reference only and does not replace professional advice.',
      exportJSON: 'Export JSON',
      copyText: 'Copy Text',
      shareReading: 'Share Reading',
      past: 'Past',
      present: 'Present',
      future: 'Future',
      confidence: 'Confidence',
      manualSelect: 'Manual Card Selection',
      cameraCapture: 'Use Camera Recognition',
    },
    'ko': {
      appTitle: '르노망 카드 리딩 도우미',
      appSubtitle: '카드가 당신의 앞길을 밝혀줍니다',
      questionPlaceholder: '질문을 입력하세요...',
      startReading: '리딩 시작',
      selectCards: '카드 선택',
      selected: '선택됨',
      reset: '재설정',
      getReading: '리딩 받기',
      reading: '리딩 중...',
      overview: '개요',
      cardAnalysis: '카드 분석',
      combinations: '조합 통찰',
      advice: '실행 가능한 조언',
      love: '사랑',
      career: '경력',
      money: '금전',
      family: '가족',
      health: '건강',
      disclaimer: '참고: 이 리딩은 참고용이며 전문적인 조언을 대체하지 않습니다.',
      exportJSON: 'JSON 내보내기',
      copyText: '텍스트 복사',
      shareReading: '리딩 공유',
      past: '과거',
      present: '현재',
      future: '미래',
      confidence: '신뢰도',
      manualSelect: '수동 카드 선택',
      cameraCapture: '카메라 인식 사용',
    },
  };
  
  return translations[lang][key] || key;
};
