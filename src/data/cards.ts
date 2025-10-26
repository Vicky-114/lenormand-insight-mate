export interface LenormandCard {
  id: number;
  name: string;
  nameZh: string;
  nameKo: string;
  keywords: {
    en: string[];
    'zh-CN': string[];
    ko: string[];
  };
  themes: string[];
}

export const LENORMAND_CARDS: LenormandCard[] = [
  { id: 1, name: "Rider", nameZh: "骑士", nameKo: "기수", 
    keywords: { 
      en: ["message", "arrival", "news", "speed", "movement"], 
      'zh-CN': ["消息", "到来", "新闻", "速度", "行动"], 
      ko: ["메시지", "도착", "소식", "속도", "움직임"] 
    }, 
    themes: ["communication", "movement", "news"] 
  },
  { id: 2, name: "Clover", nameZh: "三叶草", nameKo: "클로버",
    keywords: { 
      en: ["luck", "opportunity", "brief", "lightness", "chance"], 
      'zh-CN': ["运气", "机会", "短暂", "轻松", "偶然"], 
      ko: ["행운", "기회", "짧은", "가벼움", "우연"] 
    }, 
    themes: ["luck", "timing", "opportunity"] 
  },
  { id: 3, name: "Ship", nameZh: "船", nameKo: "배",
    keywords: { 
      en: ["journey", "travel", "distance", "commerce", "exploration"], 
      'zh-CN': ["旅程", "旅行", "距离", "商业", "探索"], 
      ko: ["여행", "여정", "거리", "상업", "탐험"] 
    }, 
    themes: ["travel", "business", "distance"] 
  },
  { id: 4, name: "House", nameZh: "房屋", nameKo: "집",
    keywords: { 
      en: ["home", "family", "stability", "foundation", "security"], 
      'zh-CN': ["家", "家庭", "稳定", "基础", "安全"], 
      ko: ["집", "가족", "안정", "기반", "보안"] 
    }, 
    themes: ["home", "family", "stability"] 
  },
  { id: 5, name: "Tree", nameZh: "树", nameKo: "나무",
    keywords: { 
      en: ["health", "growth", "roots", "longevity", "vitality"], 
      'zh-CN': ["健康", "成长", "根基", "长久", "活力"], 
      ko: ["건강", "성장", "뿌리", "장수", "활력"] 
    }, 
    themes: ["health", "growth", "vitality"] 
  },
  { id: 6, name: "Clouds", nameZh: "云", nameKo: "구름",
    keywords: { 
      en: ["confusion", "uncertainty", "doubt", "ambiguity", "mystery"], 
      'zh-CN': ["困惑", "不确定", "疑虑", "模糊", "神秘"], 
      ko: ["혼란", "불확실성", "의심", "모호함", "신비"] 
    }, 
    themes: ["clarity", "confusion", "uncertainty"] 
  },
  { id: 7, name: "Snake", nameZh: "蛇", nameKo: "뱀",
    keywords: { 
      en: ["complexity", "detour", "desire", "manipulation", "cunning"], 
      'zh-CN': ["复杂", "绕路", "欲望", "操控", "狡猾"], 
      ko: ["복잡성", "우회", "욕망", "조작", "교활함"] 
    }, 
    themes: ["complexity", "desire", "caution"] 
  },
  { id: 8, name: "Coffin", nameZh: "棺材", nameKo: "관",
    keywords: { 
      en: ["ending", "transformation", "closure", "release", "transition"], 
      'zh-CN': ["结束", "转变", "终结", "释放", "过渡"], 
      ko: ["끝", "변화", "종결", "해방", "전환"] 
    }, 
    themes: ["endings", "transformation", "closure"] 
  },
  { id: 9, name: "Bouquet", nameZh: "花束", nameKo: "꽃다발",
    keywords: { 
      en: ["gift", "beauty", "invitation", "happiness", "gratitude"], 
      'zh-CN': ["礼物", "美丽", "邀请", "快乐", "感激"], 
      ko: ["선물", "아름다움", "초대", "행복", "감사"] 
    }, 
    themes: ["gifts", "beauty", "happiness"] 
  },
  { id: 10, name: "Scythe", nameZh: "镰刀", nameKo: "낫",
    keywords: { 
      en: ["sudden", "cut", "decision", "harvest", "danger"], 
      'zh-CN': ["突然", "切断", "决定", "收获", "危险"], 
      ko: ["갑작스러운", "자르다", "결정", "수확", "위험"] 
    }, 
    themes: ["decisions", "suddenness", "cutting"] 
  },
  { id: 11, name: "Whip", nameZh: "鞭子", nameKo: "채찍",
    keywords: { 
      en: ["conflict", "discussion", "repetition", "argument", "passion"], 
      'zh-CN': ["冲突", "讨论", "重复", "争论", "激情"], 
      ko: ["갈등", "토론", "반복", "논쟁", "열정"] 
    }, 
    themes: ["conflict", "communication", "passion"] 
  },
  { id: 12, name: "Birds", nameZh: "鸟", nameKo: "새",
    keywords: { 
      en: ["conversation", "worry", "communication", "gossip", "nervousness"], 
      'zh-CN': ["交谈", "担忧", "沟通", "闲话", "紧张"], 
      ko: ["대화", "걱정", "소통", "소문", "긴장"] 
    }, 
    themes: ["communication", "worry", "social"] 
  },
  { id: 13, name: "Child", nameZh: "孩子", nameKo: "아이",
    keywords: { 
      en: ["new beginning", "innocence", "small", "fresh start", "youth"], 
      'zh-CN': ["新开始", "天真", "小的", "全新", "年轻"], 
      ko: ["새로운 시작", "순수함", "작은", "신선한", "젊음"] 
    }, 
    themes: ["beginnings", "innocence", "small"] 
  },
  { id: 14, name: "Fox", nameZh: "狐狸", nameKo: "여우",
    keywords: { 
      en: ["work", "strategy", "caution", "cleverness", "suspicion"], 
      'zh-CN': ["工作", "策略", "谨慎", "聪明", "怀疑"], 
      ko: ["일", "전략", "주의", "영리함", "의심"] 
    }, 
    themes: ["work", "strategy", "caution"] 
  },
  { id: 15, name: "Bear", nameZh: "熊", nameKo: "곰",
    keywords: { 
      en: ["power", "strength", "authority", "finances", "protection"], 
      'zh-CN': ["力量", "强大", "权威", "财务", "保护"], 
      ko: ["힘", "강함", "권위", "재정", "보호"] 
    }, 
    themes: ["power", "finances", "protection"] 
  },
  { id: 16, name: "Stars", nameZh: "星星", nameKo: "별",
    keywords: { 
      en: ["hope", "guidance", "inspiration", "clarity", "dreams"], 
      'zh-CN': ["希望", "指引", "灵感", "清晰", "梦想"], 
      ko: ["희망", "안내", "영감", "명확성", "꿈"] 
    }, 
    themes: ["hope", "guidance", "dreams"] 
  },
  { id: 17, name: "Stork", nameZh: "鹳", nameKo: "황새",
    keywords: { 
      en: ["change", "movement", "improvement", "relocation", "progress"], 
      'zh-CN': ["改变", "移动", "改善", "搬迁", "进步"], 
      ko: ["변화", "이동", "개선", "이주", "진보"] 
    }, 
    themes: ["change", "movement", "improvement"] 
  },
  { id: 18, name: "Dog", nameZh: "狗", nameKo: "개",
    keywords: { 
      en: ["loyalty", "friendship", "trust", "companion", "support"], 
      'zh-CN': ["忠诚", "友谊", "信任", "伙伴", "支持"], 
      ko: ["충성", "우정", "신뢰", "동반자", "지원"] 
    }, 
    themes: ["friendship", "loyalty", "trust"] 
  },
  { id: 19, name: "Tower", nameZh: "塔", nameKo: "탑",
    keywords: { 
      en: ["isolation", "authority", "official", "alone", "structure"], 
      'zh-CN': ["孤立", "权威", "官方", "独自", "结构"], 
      ko: ["고립", "권위", "공식", "혼자", "구조"] 
    }, 
    themes: ["authority", "isolation", "structure"] 
  },
  { id: 20, name: "Garden", nameZh: "花园", nameKo: "정원",
    keywords: { 
      en: ["public", "social", "gathering", "community", "networking"], 
      'zh-CN': ["公众", "社交", "聚会", "社区", "人脉"], 
      ko: ["공개", "사교", "모임", "커뮤니티", "네트워킹"] 
    }, 
    themes: ["social", "public", "community"] 
  },
  { id: 21, name: "Mountain", nameZh: "山", nameKo: "산",
    keywords: { 
      en: ["obstacle", "challenge", "blockage", "delay", "barrier"], 
      'zh-CN': ["障碍", "挑战", "阻塞", "延迟", "壁垒"], 
      ko: ["장애물", "도전", "차단", "지연", "장벽"] 
    }, 
    themes: ["obstacles", "challenges", "delays"] 
  },
  { id: 22, name: "Crossroads", nameZh: "十字路口", nameKo: "갈림길",
    keywords: { 
      en: ["choice", "decision", "options", "duality", "paths"], 
      'zh-CN': ["选择", "决定", "选项", "两难", "路径"], 
      ko: ["선택", "결정", "옵션", "이중성", "길"] 
    }, 
    themes: ["choices", "decisions", "options"] 
  },
  { id: 23, name: "Mice", nameZh: "老鼠", nameKo: "쥐",
    keywords: { 
      en: ["loss", "stress", "reduction", "worry", "deterioration"], 
      'zh-CN': ["损失", "压力", "减少", "担心", "恶化"], 
      ko: ["손실", "스트레스", "감소", "걱정", "악화"] 
    }, 
    themes: ["loss", "stress", "reduction"] 
  },
  { id: 24, name: "Heart", nameZh: "心", nameKo: "하트",
    keywords: { 
      en: ["love", "affection", "emotion", "passion", "romance"], 
      'zh-CN': ["爱", "情感", "感情", "激情", "浪漫"], 
      ko: ["사랑", "애정", "감정", "열정", "로맨스"] 
    }, 
    themes: ["love", "relationships", "emotion"] 
  },
  { id: 25, name: "Ring", nameZh: "戒指", nameKo: "반지",
    keywords: { 
      en: ["commitment", "contract", "promise", "cycle", "connection"], 
      'zh-CN': ["承诺", "合同", "约定", "循环", "连接"], 
      ko: ["약속", "계약", "맹세", "순환", "연결"] 
    }, 
    themes: ["commitment", "contracts", "relationships"] 
  },
  { id: 26, name: "Book", nameZh: "书", nameKo: "책",
    keywords: { 
      en: ["knowledge", "secrets", "study", "education", "hidden"], 
      'zh-CN': ["知识", "秘密", "学习", "教育", "隐藏"], 
      ko: ["지식", "비밀", "공부", "교육", "숨겨진"] 
    }, 
    themes: ["knowledge", "secrets", "learning"] 
  },
  { id: 27, name: "Letter", nameZh: "信", nameKo: "편지",
    keywords: { 
      en: ["message", "document", "written", "communication", "news"], 
      'zh-CN': ["消息", "文件", "书面", "沟通", "信息"], 
      ko: ["메시지", "문서", "서면", "소통", "소식"] 
    }, 
    themes: ["communication", "documents", "messages"] 
  },
  { id: 28, name: "Man", nameZh: "男人", nameKo: "남자",
    keywords: { 
      en: ["masculine", "person", "querent", "male energy", "self"], 
      'zh-CN': ["男性", "人物", "问卜者", "男性能量", "自己"], 
      ko: ["남성", "사람", "질문자", "남성 에너지", "자신"] 
    }, 
    themes: ["person", "masculine", "self"] 
  },
  { id: 29, name: "Woman", nameZh: "女人", nameKo: "여자",
    keywords: { 
      en: ["feminine", "person", "querent", "female energy", "self"], 
      'zh-CN': ["女性", "人物", "问卜者", "女性能量", "自己"], 
      ko: ["여성", "사람", "질문자", "여성 에너지", "자신"] 
    }, 
    themes: ["person", "feminine", "self"] 
  },
  { id: 30, name: "Lily", nameZh: "百合", nameKo: "백합",
    keywords: { 
      en: ["peace", "maturity", "virtue", "wisdom", "intimacy"], 
      'zh-CN': ["和平", "成熟", "美德", "智慧", "亲密"], 
      ko: ["평화", "성숙", "미덕", "지혜", "친밀함"] 
    }, 
    themes: ["peace", "maturity", "intimacy"] 
  },
  { id: 31, name: "Sun", nameZh: "太阳", nameKo: "태양",
    keywords: { 
      en: ["success", "energy", "vitality", "achievement", "happiness"], 
      'zh-CN': ["成功", "能量", "活力", "成就", "快乐"], 
      ko: ["성공", "에너지", "활력", "성취", "행복"] 
    }, 
    themes: ["success", "energy", "happiness"] 
  },
  { id: 32, name: "Moon", nameZh: "月亮", nameKo: "달",
    keywords: { 
      en: ["emotion", "intuition", "recognition", "honor", "cycles"], 
      'zh-CN': ["情绪", "直觉", "认可", "荣誉", "周期"], 
      ko: ["감정", "직관", "인정", "명예", "주기"] 
    }, 
    themes: ["emotion", "intuition", "recognition"] 
  },
  { id: 33, name: "Key", nameZh: "钥匙", nameKo: "열쇠",
    keywords: { 
      en: ["solution", "breakthrough", "certainty", "opening", "success"], 
      'zh-CN': ["解决", "突破", "确定", "开启", "成功"], 
      ko: ["해결", "돌파", "확실성", "열림", "성공"] 
    }, 
    themes: ["solutions", "breakthrough", "certainty"] 
  },
  { id: 34, name: "Fish", nameZh: "鱼", nameKo: "물고기",
    keywords: { 
      en: ["money", "business", "flow", "abundance", "trade"], 
      'zh-CN': ["金钱", "生意", "流动", "丰盛", "交易"], 
      ko: ["돈", "사업", "흐름", "풍요", "거래"] 
    }, 
    themes: ["money", "business", "abundance"] 
  },
  { id: 35, name: "Anchor", nameZh: "锚", nameKo: "닻",
    keywords: { 
      en: ["stability", "security", "grounding", "career", "long-term"], 
      'zh-CN': ["稳定", "安全", "扎根", "职业", "长期"], 
      ko: ["안정성", "보안", "정착", "경력", "장기"] 
    }, 
    themes: ["stability", "career", "security"] 
  },
  { id: 36, name: "Cross", nameZh: "十字架", nameKo: "십자가",
    keywords: { 
      en: ["burden", "fate", "destiny", "challenge", "spirituality"], 
      'zh-CN': ["负担", "命运", "宿命", "挑战", "精神性"], 
      ko: ["부담", "운명", "숙명", "도전", "영성"] 
    }, 
    themes: ["fate", "challenges", "spirituality"] 
  },
];
