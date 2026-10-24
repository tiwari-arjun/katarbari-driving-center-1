export interface IshiharaPalette {
  id: string;
  nameEn: string;
  nameNe: string;
  numeralColors: string[];
  backgroundColors: string[];
  neutralDots: string[];
  cardBackground: string;
}

export interface IshiharaPlate {
  id: string;
  number: string;
  paletteId: string;
  seed: number;
  difficulty: 'easy' | 'medium' | 'hard';
  distractors: string[]; // 3 plausible distractors
  description: {
    en: string;
    ne: string;
  };
  explanation: {
    en: string;
    ne: string;
  };
}

export const ISHIHARA_PALETTES: Record<string, IshiharaPalette> = {
  // 1. Classic Orange on Slate / Grey (High-contrast calibration: Plate 12 & 16)
  orange_on_grey: {
    id: 'orange_on_grey',
    nameEn: 'Orange on Slate Grey',
    nameNe: 'खैरो पृष्ठभूमिमा सुन्तला रङ',
    numeralColors: [
      '#E65100', '#F57C00', '#FF6D00', '#EF6C00', 
      '#FF8A00', '#D84315', '#FF5722'
    ],
    backgroundColors: [
      '#455A64', '#546E7A', '#607D8B', '#78909C', 
      '#90A4AE', '#64748B', '#475569'
    ],
    neutralDots: [],
    cardBackground: '#F8F9FA'
  },

  // 2. Rose / Coral Pink on Olive Green (Plates 8, 29, 26)
  rose_on_olive: {
    id: 'rose_on_olive',
    nameEn: 'Rose Pink on Olive Green',
    nameNe: 'ओलिभ हरियोमा गुलाफी रङ',
    numeralColors: [
      '#C2185B', '#D81B60', '#E53935', '#D32F2F', 
      '#E91E63', '#AD1457', '#C62828'
    ],
    backgroundColors: [
      '#689F38', '#558B2F', '#7CB342', '#827717', 
      '#9E9D24', '#4E7D23', '#33691E'
    ],
    neutralDots: [],
    cardBackground: '#FAFAF7'
  },

  // 3. Emerald Green on Terracotta / Orange / Peach (Plates 74, 5, 3, 15)
  green_on_orange: {
    id: 'green_on_orange',
    nameEn: 'Emerald Green on Terracotta',
    nameNe: 'सुन्तला/टेराकोटामा हरियो रङ',
    numeralColors: [
      '#1B5E20', '#2E7D32', '#1E824C', '#00796B', 
      '#27AE60', '#145A32', '#28B463'
    ],
    backgroundColors: [
      '#D84315', '#E64A19', '#F4511E', '#FF5722', 
      '#FF7043', '#E05326', '#E74C3C'
    ],
    neutralDots: [],
    cardBackground: '#FAF8F5'
  },

  // 4. Magenta / Violet Pink on Dark Slate Grey (Plate 42)
  magenta_on_slate: {
    id: 'magenta_on_slate',
    nameEn: 'Magenta Pink on Dark Slate',
    nameNe: 'गाढा खैरोमा म्याजेन्टा गुलाफी',
    numeralColors: [
      '#AD1457', '#C2185B', '#D81B60', '#E91E63', 
      '#880E4F', '#9C27B0'
    ],
    backgroundColors: [
      '#37474F', '#455A64', '#546E7A', '#607D8B', 
      '#475569', '#334155'
    ],
    neutralDots: [],
    cardBackground: '#F8F8FA'
  },

  // 5. Mint / Deep Teal Green on Salmon / Soft Rose (Plate 2)
  mint_on_salmon: {
    id: 'mint_on_salmon',
    nameEn: 'Mint Green on Salmon Pink',
    nameNe: 'साल्मन गुलाफीमा मिन्ट हरियो',
    numeralColors: [
      '#004D40', '#00695C', '#00796B', '#00897B', 
      '#009688', '#117A65'
    ],
    backgroundColors: [
      '#E57373', '#EF5350', '#FF7043', '#FF8A80', 
      '#F06292', '#E74C3C'
    ],
    neutralDots: [],
    cardBackground: '#FAF7F7'
  },

  // 6. Amber Gold on Forest / Moss Green
  amber_on_forest: {
    id: 'amber_on_forest',
    nameEn: 'Amber Gold on Forest Moss',
    nameNe: 'वनस्पति हरियोमा सुनौलो एम्बर',
    numeralColors: [
      '#FF8F00', '#FFA000', '#FFB300', '#F57C00', 
      '#FF6F00', '#FB8C00'
    ],
    backgroundColors: [
      '#2E5A1C', '#33691E', '#427825', '#558B2F', 
      '#1B4310', '#225412'
    ],
    neutralDots: [],
    cardBackground: '#F9FAF7'
  },

  // 7. Terracotta Red on Khaki / Tan
  terracotta_on_khaki: {
    id: 'terracotta_on_khaki',
    nameEn: 'Terracotta on Khaki Tan',
    nameNe: 'खाकी पृष्ठभूमिमा रातो टेराकोटा',
    numeralColors: [
      '#B71C1C', '#C62828', '#D32F2F', '#BF360C', 
      '#D84315', '#E53935'
    ],
    backgroundColors: [
      '#8D6E63', '#9E8D86', '#A1887F', '#6D4C41', 
      '#795548', '#8C7B75'
    ],
    neutralDots: [],
    cardBackground: '#FAF8F7'
  },

  // 8. Teal Turquoise on Warm Peach Sand
  teal_on_peach: {
    id: 'teal_on_peach',
    nameEn: 'Teal on Peach Sand',
    nameNe: 'आरु रङको पृष्ठभूमिमा टिल हरियो',
    numeralColors: [
      '#004D40', '#00695C', '#00796B', '#00897B', 
      '#00594C', '#0B5345'
    ],
    backgroundColors: [
      '#E64A19', '#F4511E', '#FF7043', '#FF8A65', 
      '#D84315', '#FA8A60'
    ],
    neutralDots: [],
    cardBackground: '#FAF7F5'
  }
};

export const ISHIHARA_DISCLAIMER = {
  en: "Important Notice: This interactive eye test is an educational simulation inspired by pseudoisochromatic colour-dot plates. It is designed to help applicants familiarize themselves with the visual recognition format used in preliminary licensing health checks. It is NOT a clinical medical diagnosis and does NOT substitute for a formal eye examination conducted by an authorized ophthalmologist or transport office medical examiner.",
  ne: "महत्त्वपूर्ण सूचना: यो अभ्यास रङ्गीन बिन्दु (Pseudoisochromatic Dot Plate) ढाँचामा आधारित एक शैक्षिक अनुकरण मात्र हो। यो सवारी चालक अनुमतिपत्रको प्रारम्भिक स्वास्थ्य जाँच ढाँचा बुझ्न सहयोग पुर्‍याउन तयार गरिएको हो। यो कुनै आधिकारिक चिकित्सकीय दृष्टिक्षमता पहिचान वा आँखा विशेषज्ञ (Ophthalmologist) द्वारा गरिने आधिकारिक परीक्षणको विकल्प होइन।"
};

/**
 * 52 Unique Educational Ishihara-inspired Practice Plates
 * Features numbers 12, 8, 29, 5, 16, 74, 3, 26, 42, 15, 7, 2, 6, 97, 45, etc.
 * with authentic distractors and seeded dot arrangement.
 */
export const ISHIHARA_PLATES: IshiharaPlate[] = [
  // 1. Classic Introductory Plate (Number 12 - high contrast visible to almost everyone)
  {
    id: 'plate-01',
    number: '12',
    paletteId: 'orange_on_grey',
    seed: 101,
    difficulty: 'easy',
    distractors: ['17', '72', '21'],
    description: {
      en: 'Introductory calibration plate: Number 12 in orange dots on grey.',
      ne: 'प्रारम्भिक प्लेट: खैरो पृष्ठभूमिमा सुन्तला रङको नम्बर १२।'
    },
    explanation: {
      en: 'The number 12 is distinctly formed with orange dots against the slate-grey background dots.',
      ne: 'खैरो पृष्ठभूमिका साना बिन्दुहरूको बीचमा सुन्तला रङका बिन्दुहरू मिलेर १२ (12) अङ्क प्रष्ट देखिन्छ।'
    }
  },
  // 2. Number 8 (Rose on olive)
  {
    id: 'plate-02',
    number: '8',
    paletteId: 'rose_on_olive',
    seed: 102,
    difficulty: 'easy',
    distractors: ['3', '6', '9'],
    description: {
      en: 'Classic Plate: Number 8 in rose pink dots on olive green.',
      ne: 'क्लासिक प्लेट: ओलिभ हरियोमा गुलाफी रङको नम्बर ८।'
    },
    explanation: {
      en: 'Number 8 is formed with double loops of rose pink dots surrounded by olive and sage green dots. Some people with red-green deficiency may see 3.',
      ne: 'ओलिभ हरियो बिन्दुहरूका बीचमा गुलाफी बिन्दुहरूबाट बनेको ८ (8) देखिन्छ।'
    }
  },
  // 3. Number 29 (Rose on olive)
  {
    id: 'plate-03',
    number: '29',
    paletteId: 'rose_on_olive',
    seed: 103,
    difficulty: 'medium',
    distractors: ['70', '28', '20'],
    description: {
      en: 'Plate with Number 29 in pink and coral tones on olive background.',
      ne: 'ओलिभ पृष्ठभूमिका बिन्दुहरूमा २९ (29) अङ्क।'
    },
    explanation: {
      en: 'The number 29 is composed of salmon-pink dots against olive green dots. In classic tests, individuals with red-green weakness might misread this as 70.',
      ne: 'ओलिभ हरियो पृष्ठभूमिको बीचमा गुलाफी बिन्दुहरू मिलेर २९ (29) लेखिएको छ।'
    }
  },
  // 4. Number 5 (Green on orange)
  {
    id: 'plate-04',
    number: '5',
    paletteId: 'green_on_orange',
    seed: 104,
    difficulty: 'easy',
    distractors: ['2', '3', '6'],
    description: {
      en: 'Number 5 in forest green dots on terracotta peach background.',
      ne: 'सुन्तला/आरु रङको पृष्ठभूमिमा हरियो नम्बर ५।'
    },
    explanation: {
      en: 'The number 5 is formed with leafy green dots surrounded by terracotta and peach dots.',
      ne: 'सुन्तला र टेराकोटा बिन्दुहरूको बीचमा हरियो बिन्दुहरूले ५ (5) अङ्क बनाउँछन्।'
    }
  },
  // 5. Number 16 (Orange on grey)
  {
    id: 'plate-05',
    number: '16',
    paletteId: 'orange_on_grey',
    seed: 105,
    difficulty: 'easy',
    distractors: ['18', '76', '15'],
    description: {
      en: 'Number 16 in bright amber orange dots on slate grey.',
      ne: 'स्लेट खैरो पृष्ठभूमिमा सुन्तला रङको नम्बर १६।'
    },
    explanation: {
      en: 'Number 16 clearly appears in orange dots against the neutral slate grey dot field.',
      ne: 'खैरो पृष्ठभूमिको बीचमा सुन्तला बिन्दुहरूले १६ (16) अङ्क देखाउँछन्।'
    }
  },
  // 6. Number 74 (Emerald green on terracotta)
  {
    id: 'plate-06',
    number: '74',
    paletteId: 'green_on_orange',
    seed: 106,
    difficulty: 'medium',
    distractors: ['21', '71', '70'],
    description: {
      en: 'Number 74 in emerald green dots on orange and peach background.',
      ne: 'सुन्तला पृष्ठभूमिमा हरियो रङको नम्बर ७४।'
    },
    explanation: {
      en: 'The number 74 is clearly visible in green dots. Red-green deficiency may cause viewers to read 21 or only see a trace of 7.',
      ne: 'हरियो बिन्दुहरूले प्रष्ट रूपमा ७४ (74) अङ्क कोरेका छन्।'
    }
  },
  // 7. Number 3 (Green on orange)
  {
    id: 'plate-07',
    number: '3',
    paletteId: 'green_on_orange',
    seed: 107,
    difficulty: 'easy',
    distractors: ['8', '5', '9'],
    description: {
      en: 'Number 3 in emerald green on terracotta dots.',
      ne: 'सुन्तला पृष्ठभूमिको बिन्दुहरूमा हरियो नम्बर ३।'
    },
    explanation: {
      en: 'Number 3 is formed with distinct green dots inside the warm orange background.',
      ne: 'सुन्तला बिन्दुहरूको बीचमा हरियो रङका बिन्दुहरू मिलेर ३ (3) बनेको छ।'
    }
  },
  // 8. Number 26 (Green and rose combination)
  {
    id: 'plate-08',
    number: '26',
    paletteId: 'mint_on_salmon',
    seed: 108,
    difficulty: 'medium',
    distractors: ['28', '20', '76'],
    description: {
      en: 'Number 26 in deep mint green on salmon pink dots.',
      ne: 'साल्मन गुलाफीमा मिन्ट हरियो रङको नम्बर २६।'
    },
    explanation: {
      en: 'The number 26 is visible in teal-green dots across the salmon-pink background.',
      ne: 'गुलाफी पृष्ठभूमिका बीचमा हरियो बिन्दुहरूबाट २६ (26) अङ्क प्रष्ट देखिन्छ।'
    }
  },
  // 9. Number 42 (Magenta on slate grey)
  {
    id: 'plate-09',
    number: '42',
    paletteId: 'magenta_on_slate',
    seed: 109,
    difficulty: 'medium',
    distractors: ['24', '47', '12'],
    description: {
      en: 'Number 42 in magenta berry pink dots on charcoal slate.',
      ne: 'चारकोल खैरो पृष्ठभूमिमा म्याजेन्टा गुलाफी नम्बर ४२।'
    },
    explanation: {
      en: 'Number 42 is formed in vibrant magenta pink dots against a charcoal and slate grey dot field.',
      ne: 'खैरो पृष्ठभूमिको बीचमा गाढा म्याजेन्टा गुलाफी बिन्दुहरूले ४२ (42) अङ्क बनाएका छन्।'
    }
  },
  // 10. Number 15 (Green on orange peach)
  {
    id: 'plate-10',
    number: '15',
    paletteId: 'green_on_orange',
    seed: 110,
    difficulty: 'easy',
    distractors: ['13', '17', '75'],
    description: {
      en: 'Number 15 in forest green dots on orange peach background.',
      ne: 'सुन्तला पृष्ठभूमिमा हरियो रङको नम्बर १५।'
    },
    explanation: {
      en: 'Number 15 is formed in green dots against the warm orange background.',
      ne: 'सुन्तला बिन्दुहरूको बीचमा हरियो बिन्दुहरू मिलेर १५ (15) देखिन्छ।'
    }
  },
  // 11. Number 7 (Green on orange)
  {
    id: 'plate-11',
    number: '7',
    paletteId: 'green_on_orange',
    seed: 111,
    difficulty: 'easy',
    distractors: ['1', '2', '4'],
    description: {
      en: 'Single digit 7 in emerald green dots on orange terracotta.',
      ne: 'सुन्तला पृष्ठभूमिमा हरियो अङ्क ७।'
    },
    explanation: {
      en: 'The single digit 7 is rendered in leafy green dots on terracotta peach.',
      ne: 'टेराकोटा बिन्दुहरूको बीचमा हरियो बिन्दुहरूबाट ७ (7) अङ्क प्रष्ट देखिन्छ।'
    }
  },
  // 12. Number 2 (Mint on salmon)
  {
    id: 'plate-12',
    number: '2',
    paletteId: 'mint_on_salmon',
    seed: 112,
    difficulty: 'easy',
    distractors: ['7', '3', '5'],
    description: {
      en: 'Number 2 in teal mint dots on pink salmon field.',
      ne: 'गुलाफी पृष्ठभूमिमा टिल मिन्ट नम्बर २।'
    },
    explanation: {
      en: 'Number 2 is formed in mint green dots on salmon pink background dots.',
      ne: 'गुलाफी पृष्ठभूमिका बीचमा हरियो बिन्दुहरूले २ (2) अङ्क बनाएका छन्।'
    }
  },
  // 13. Number 6 (Amber on forest)
  {
    id: 'plate-13',
    number: '6',
    paletteId: 'amber_on_forest',
    seed: 113,
    difficulty: 'easy',
    distractors: ['5', '8', '0'],
    description: {
      en: 'Number 6 in golden amber dots on forest moss.',
      ne: 'हरियो वनस्पति पृष्ठभूमिमा सुनौलो एम्बर नम्बर ६।'
    },
    explanation: {
      en: 'Number 6 is rendered in bright amber gold dots on forest green dots.',
      ne: 'गाढा हरियो बिन्दुहरूको बीचमा सुनौलो एम्बर बिन्दुहरू मिलेर ६ (6) देखिन्छ।'
    }
  },
  // 14. Number 97 (Green on terracotta)
  {
    id: 'plate-14',
    number: '97',
    paletteId: 'green_on_orange',
    seed: 114,
    difficulty: 'medium',
    distractors: ['91', '67', '79'],
    description: {
      en: 'Number 97 in green dots on orange terracotta.',
      ne: 'सुन्तला पृष्ठभूमिमा हरियो रङको नम्बर ९७।'
    },
    explanation: {
      en: 'The number 97 is clearly displayed in contrasting emerald green dots.',
      ne: 'सुन्तला बिन्दुहरूको बीचमा हरियो बिन्दुहरू मिलेर ९७ (97) बनेको छ।'
    }
  },
  // 15. Number 45 (Orange on grey)
  {
    id: 'plate-15',
    number: '45',
    paletteId: 'orange_on_grey',
    seed: 115,
    difficulty: 'medium',
    distractors: ['43', '15', '48'],
    description: {
      en: 'Number 45 in rich orange on slate grey dots.',
      ne: 'खैरो पृष्ठभूमिमा सुन्तला रङको नम्बर ४५।'
    },
    explanation: {
      en: 'The digits 4 and 5 are formed in bright orange against grey dots.',
      ne: 'खैरो बिन्दुहरूको बीचमा सुन्तला रङले ४५ (45) प्रष्ट देखाउँछ।'
    }
  },
  // 16. Number 10 (Rose on olive)
  {
    id: 'plate-16',
    number: '10',
    paletteId: 'rose_on_olive',
    seed: 116,
    difficulty: 'easy',
    distractors: ['18', '70', '16'],
    description: {
      en: 'Number 10 in coral rose dots on olive green.',
      ne: 'ओलिभ हरियो पृष्ठभूमिमा गुलाफी नम्बर १०।'
    },
    explanation: {
      en: 'Number 10 is visible in rose pink dots against olive and sage dots.',
      ne: 'ओलिभ हरियो बिन्दुहरूको बीचमा गुलाफी रङले १० (10) अङ्क प्रष्ट देखिन्छ।'
    }
  },
  // 17. Number 13 (Magenta on slate)
  {
    id: 'plate-17',
    number: '13',
    paletteId: 'magenta_on_slate',
    seed: 117,
    difficulty: 'medium',
    distractors: ['18', '73', '15'],
    description: {
      en: 'Number 13 in berry magenta dots on charcoal slate.',
      ne: 'चारकोल खैरोमा म्याजेन्टा गुलाफी नम्बर १३।'
    },
    explanation: {
      en: 'Number 13 is formed in magenta pink dots on dark slate grey background.',
      ne: 'खैरो पृष्ठभूमिमा गुलाफी म्याजेन्टा बिन्दुहरू मिलेर १३ (13) अङ्क बनेको छ।'
    }
  },
  // 18. Number 14 (Terracotta on khaki)
  {
    id: 'plate-18',
    number: '14',
    paletteId: 'terracotta_on_khaki',
    seed: 118,
    difficulty: 'easy',
    distractors: ['11', '74', '19'],
    description: {
      en: 'Number 14 in terracotta red on khaki tan.',
      ne: 'खाकी पृष्ठभूमिमा टेराकोटा रातो नम्बर १४।'
    },
    explanation: {
      en: 'Number 14 appears in terracotta red dots against khaki tan dots.',
      ne: 'खाकी बिन्दुहरूको बीचमा टेराकोटा रातो बिन्दुहरू मिलेर १४ (14) देखिन्छ।'
    }
  },
  // 19. Number 18 (Orange on grey)
  {
    id: 'plate-19',
    number: '18',
    paletteId: 'orange_on_grey',
    seed: 119,
    difficulty: 'medium',
    distractors: ['13', '16', '78'],
    description: {
      en: 'Number 18 in bright amber orange dots on slate grey.',
      ne: 'खैरो पृष्ठभूमिमा सुन्तला रङको नम्बर १८।'
    },
    explanation: {
      en: 'Number 18 is composed of amber orange dots on slate grey dots.',
      ne: 'खैरो बिन्दुहरूको बीचमा सुन्तला बिन्दुहरूले १८ (18) अङ्क बनाएका छन्।'
    }
  },
  // 20. Number 21 (Teal on peach)
  {
    id: 'plate-20',
    number: '21',
    paletteId: 'teal_on_peach',
    seed: 120,
    difficulty: 'medium',
    distractors: ['71', '27', '24'],
    description: {
      en: 'Number 21 in dark teal dots on warm peach sand.',
      ne: 'आरु रङको पृष्ठभूमिमा टिल हरियो नम्बर २१।'
    },
    explanation: {
      en: 'Number 21 is formed with teal green dots on peach and terracotta dots.',
      ne: 'आरु रङका बिन्दुहरूको बीचमा टिल हरियो बिन्दुहरूले २१ (21) अङ्क देखाउँछन्।'
    }
  },
  // 21. Number 23 (Rose on olive)
  {
    id: 'plate-21',
    number: '23',
    paletteId: 'rose_on_olive',
    seed: 121,
    difficulty: 'medium',
    distractors: ['28', '73', '25'],
    description: {
      en: 'Number 23 in rose pink dots on olive green.',
      ne: 'ओलिभ हरियो पृष्ठभूमिमा गुलाफी नम्बर २३।'
    },
    explanation: {
      en: 'Number 23 is formed in coral rose dots on olive green dots.',
      ne: 'ओलिभ हरियो बिन्दुहरूको बीचमा गुलाफी रङले २३ (23) अङ्क देखाउँछ।'
    }
  },
  // 22. Number 25 (Green on orange)
  {
    id: 'plate-22',
    number: '25',
    paletteId: 'green_on_orange',
    seed: 122,
    difficulty: 'easy',
    distractors: ['26', '23', '75'],
    description: {
      en: 'Number 25 in emerald green on orange terracotta.',
      ne: 'सुन्तला पृष्ठभूमिमा हरियो नम्बर २५।'
    },
    explanation: {
      en: 'Number 25 is formed in emerald green dots against terracotta orange dots.',
      ne: 'सुन्तला बिन्दुहरूको बीचमा हरियो बिन्दुहरू मिलेर २५ (25) बनेको छ।'
    }
  },
  // 23. Number 27 (Amber on forest)
  {
    id: 'plate-23',
    number: '27',
    paletteId: 'amber_on_forest',
    seed: 123,
    difficulty: 'medium',
    distractors: ['21', '77', '29'],
    description: {
      en: 'Number 27 in amber gold on forest moss dots.',
      ne: 'हरियो वनस्पति पृष्ठभूमिमा सुनौलो एम्बर नम्बर २७।'
    },
    explanation: {
      en: 'Number 27 is clearly formed in golden amber dots against forest green dots.',
      ne: 'गाढा हरियो बिन्दुहरूको बीचमा सुनौलो एम्बरले २७ (27) अङ्क बनाएको छ।'
    }
  },
  // 24. Number 28 (Mint on salmon)
  {
    id: 'plate-24',
    number: '28',
    paletteId: 'mint_on_salmon',
    seed: 124,
    difficulty: 'medium',
    distractors: ['23', '26', '20'],
    description: {
      en: 'Number 28 in mint green on salmon pink.',
      ne: 'साल्मन गुलाफीमा मिन्ट हरियो नम्बर २८।'
    },
    explanation: {
      en: 'Number 28 is formed in mint green dots on salmon pink dots.',
      ne: 'गुलाफी पृष्ठभूमिका बीचमा हरियो बिन्दुहरूले २८ (28) अङ्क बनाएका छन्।'
    }
  },
  // 25. Number 32 (Orange on grey)
  {
    id: 'plate-25',
    number: '32',
    paletteId: 'orange_on_grey',
    seed: 125,
    difficulty: 'easy',
    distractors: ['82', '37', '23'],
    description: {
      en: 'Number 32 in bright orange dots on slate grey.',
      ne: 'खैरो पृष्ठभूमिमा सुन्तला रङको नम्बर ३२।'
    },
    explanation: {
      en: 'Number 32 is visible in orange dots against slate grey background dots.',
      ne: 'खैरो बिन्दुहरूको बीचमा सुन्तला बिन्दुहरूले ३२ (32) अङ्क देखाउँछन्।'
    }
  },
  // 26. Number 35 (Green on orange)
  {
    id: 'plate-26',
    number: '35',
    paletteId: 'green_on_orange',
    seed: 126,
    difficulty: 'easy',
    distractors: ['36', '85', '53'],
    description: {
      en: 'Number 35 in emerald green on terracotta dots.',
      ne: 'सुन्तला पृष्ठभूमिमा हरियो नम्बर ३५।'
    },
    explanation: {
      en: 'Number 35 is formed in green dots against the warm orange background.',
      ne: 'सुन्तला बिन्दुहरूको बीचमा हरियो बिन्दुहरू मिलेर ३५ (35) देखिन्छ।'
    }
  },
  // 27. Number 36 (Rose on olive)
  {
    id: 'plate-27',
    number: '36',
    paletteId: 'rose_on_olive',
    seed: 127,
    difficulty: 'medium',
    distractors: ['38', '86', '26'],
    description: {
      en: 'Number 36 in rose pink dots on olive green.',
      ne: 'ओलिभ हरियोमा गुलाफी नम्बर ३६।'
    },
    explanation: {
      en: 'Number 36 is formed with rose pink dots surrounded by olive green dots.',
      ne: 'ओलिभ हरियो बिन्दुहरूका बीचमा गुलाफी बिन्दुहरूले ३६ (36) अङ्क बनाएका छन्।'
    }
  },
  // 28. Number 47 (Magenta on slate)
  {
    id: 'plate-28',
    number: '47',
    paletteId: 'magenta_on_slate',
    seed: 128,
    difficulty: 'medium',
    distractors: ['41', '17', '74'],
    description: {
      en: 'Number 47 in berry magenta on charcoal slate dots.',
      ne: 'खैरो पृष्ठभूमिमा म्याजेन्टा गुलाफी नम्बर ४७।'
    },
    explanation: {
      en: 'Number 47 is formed in magenta pink dots on dark slate grey.',
      ne: 'खैरो पृष्ठभूमिमा म्याजेन्टा गुलाफी बिन्दुहरूले ४७ (47) देखाउँछन्।'
    }
  },
  // 29. Number 48 (Teal on peach)
  {
    id: 'plate-29',
    number: '48',
    paletteId: 'teal_on_peach',
    seed: 129,
    difficulty: 'hard',
    distractors: ['43', '18', '40'],
    description: {
      en: 'Number 48 in teal green on warm peach sand.',
      ne: 'आरु रङको पृष्ठभूमिमा टिल हरियो नम्बर ४८।'
    },
    explanation: {
      en: 'Number 48 is formed in teal green dots on peach and terracotta dots.',
      ne: 'आरु रङका बिन्दुहरूको बीचमा टिल हरियो बिन्दुहरू मिलेर ४८ (48) बनेको छ।'
    }
  },
  // 30. Number 51 (Terracotta on khaki)
  {
    id: 'plate-30',
    number: '51',
    paletteId: 'terracotta_on_khaki',
    seed: 130,
    difficulty: 'easy',
    distractors: ['57', '61', '15'],
    description: {
      en: 'Number 51 in terracotta red on khaki tan.',
      ne: 'खाकी पृष्ठभूमिमा टेराकोटा रातो नम्बर ५१।'
    },
    explanation: {
      en: 'Number 51 appears in terracotta red dots against khaki tan dots.',
      ne: 'खाकी बिन्दुहरूको बीचमा टेराकोटा रातो बिन्दुहरूले ५१ (51) देखाउँछन्।'
    }
  },
  // 31. Number 52 (Orange on grey)
  {
    id: 'plate-31',
    number: '52',
    paletteId: 'orange_on_grey',
    seed: 131,
    difficulty: 'medium',
    distractors: ['57', '62', '25'],
    description: {
      en: 'Number 52 in bright orange dots on slate grey.',
      ne: 'खैरो पृष्ठभूमिमा सुन्तला रङको नम्बर ५२।'
    },
    explanation: {
      en: 'Number 52 is composed of amber orange dots on slate grey dots.',
      ne: 'खैरो बिन्दुहरूको बीचमा सुन्तला बिन्दुहरूले ५२ (52) अङ्क बनाएका छन्।'
    }
  },
  // 32. Number 57 (Rose on olive)
  {
    id: 'plate-32',
    number: '57',
    paletteId: 'rose_on_olive',
    seed: 132,
    difficulty: 'medium',
    distractors: ['51', '67', '37'],
    description: {
      en: 'Number 57 in coral rose dots on olive green.',
      ne: 'ओलिभ हरियोमा गुलाफी नम्बर ५७।'
    },
    explanation: {
      en: 'Number 57 is visible in rose pink dots against olive and sage dots.',
      ne: 'ओलिभ हरियो बिन्दुहरूका बीचमा गुलाफी बिन्दुहरूले ५७ (57) देखाउँछन्।'
    }
  },
  // 33. Number 58 (Green on orange)
  {
    id: 'plate-33',
    number: '58',
    paletteId: 'green_on_orange',
    seed: 133,
    difficulty: 'hard',
    distractors: ['53', '68', '38'],
    description: {
      en: 'Number 58 in forest green on orange terracotta dots.',
      ne: 'सुन्तला पृष्ठभूमिमा हरियो नम्बर ५८।'
    },
    explanation: {
      en: 'Number 58 is formed with leafy green dots on terracotta and peach dots.',
      ne: 'सुन्तला बिन्दुहरूको बीचमा हरियो बिन्दुहरू मिलेर ५८ (58) देखिन्छ।'
    }
  },
  // 34. Number 62 (Mint on salmon)
  {
    id: 'plate-34',
    number: '62',
    paletteId: 'mint_on_salmon',
    seed: 134,
    difficulty: 'medium',
    distractors: ['67', '52', '82'],
    description: {
      en: 'Number 62 in mint green dots on salmon pink.',
      ne: 'साल्मन गुलाफीमा मिन्ट हरियो नम्बर ६२।'
    },
    explanation: {
      en: 'Number 62 is rendered in mint green dots against salmon pink dots.',
      ne: 'गुलाफी पृष्ठभूमिका बीचमा हरियो बिन्दुहरूले ६२ (62) अङ्क बनाएका छन्।'
    }
  },
  // 35. Number 63 (Amber on forest)
  {
    id: 'plate-35',
    number: '63',
    paletteId: 'amber_on_forest',
    seed: 135,
    difficulty: 'medium',
    distractors: ['68', '53', '83'],
    description: {
      en: 'Number 63 in golden amber on forest moss.',
      ne: 'हरियो वनस्पति पृष्ठभूमिमा सुनौलो एम्बर नम्बर ६३।'
    },
    explanation: {
      en: 'Number 63 is rendered in bright amber gold dots on forest green dots.',
      ne: 'गाढा हरियो बिन्दुहरूको बीचमा सुनौलो एम्बरले ६३ (63) अङ्क बनाएको छ।'
    }
  },
  // 36. Number 68 (Magenta on slate)
  {
    id: 'plate-36',
    number: '68',
    paletteId: 'magenta_on_slate',
    seed: 136,
    difficulty: 'hard',
    distractors: ['63', '58', '88'],
    description: {
      en: 'Number 68 in magenta berry dots on dark slate.',
      ne: 'खैरो पृष्ठभूमिमा म्याजेन्टा गुलाफी नम्बर ६८।'
    },
    explanation: {
      en: 'Number 68 is formed in magenta pink dots on dark slate grey background.',
      ne: 'खैरो पृष्ठभूमिमा म्याजेन्टा गुलाफी बिन्दुहरूले ६८ (68) देखाउँछन्।'
    }
  },
  // 37. Number 69 (Orange on grey)
  {
    id: 'plate-37',
    number: '69',
    paletteId: 'orange_on_grey',
    seed: 137,
    difficulty: 'easy',
    distractors: ['96', '89', '66'],
    description: {
      en: 'Number 69 in bright orange on slate grey dots.',
      ne: 'खैरो पृष्ठभूमिमा सुन्तला रङको नम्बर ६९।'
    },
    explanation: {
      en: 'The number 69 is formed with contrasting orange dots on slate grey dots.',
      ne: 'खैरो बिन्दुहरूको बीचमा सुन्तला बिन्दुहरूले ६९ (69) अङ्क देखाउँछन्।'
    }
  },
  // 38. Number 70 (Green on orange)
  {
    id: 'plate-38',
    number: '70',
    paletteId: 'green_on_orange',
    seed: 138,
    difficulty: 'easy',
    distractors: ['78', '20', '10'],
    description: {
      en: 'Number 70 in emerald green on terracotta dots.',
      ne: 'सुन्तला पृष्ठभूमिमा हरियो नम्बर ७०।'
    },
    explanation: {
      en: 'Number 70 is formed in green dots against the warm orange background.',
      ne: 'सुन्तला बिन्दुहरूको बीचमा हरियो बिन्दुहरू मिलेर ७० (70) देखिन्छ।'
    }
  },
  // 39. Number 71 (Rose on olive)
  {
    id: 'plate-39',
    number: '71',
    paletteId: 'rose_on_olive',
    seed: 139,
    difficulty: 'easy',
    distractors: ['77', '21', '17'],
    description: {
      en: 'Number 71 in rose pink dots on olive green.',
      ne: 'ओलिभ हरियोमा गुलाफी नम्बर ७१।'
    },
    explanation: {
      en: 'Number 71 is visible in coral rose pink dots on olive green dots.',
      ne: 'ओलिभ हरियो बिन्दुहरूका बीचमा गुलाफी बिन्दुहरूले ७१ (71) देखाउँछन्।'
    }
  },
  // 40. Number 73 (Teal on peach)
  {
    id: 'plate-40',
    number: '73',
    paletteId: 'teal_on_peach',
    seed: 140,
    difficulty: 'medium',
    distractors: ['78', '23', '13'],
    description: {
      en: 'Number 73 in teal green on warm peach sand.',
      ne: 'आरु रङको पृष्ठभूमिमा टिल हरियो नम्बर ७३।'
    },
    explanation: {
      en: 'Number 73 is visible in teal green dots across peach and terracotta dots.',
      ne: 'आरु रङका बिन्दुहरूको बीचमा टिल हरियो बिन्दुहरू मिलेर ७३ (73) बनेको छ।'
    }
  },
  // 41. Number 75 (Terracotta on khaki)
  {
    id: 'plate-41',
    number: '75',
    paletteId: 'terracotta_on_khaki',
    seed: 141,
    difficulty: 'medium',
    distractors: ['76', '25', '15'],
    description: {
      en: 'Number 75 in terracotta red on khaki tan.',
      ne: 'खाकी पृष्ठभूमिमा टेराकोटा रातो नम्बर ७५।'
    },
    explanation: {
      en: 'Number 75 appears in terracotta red dots against khaki tan dots.',
      ne: 'खाकी बिन्दुहरूको बीचमा टेराकोटा रातो बिन्दुहरूले ७५ (75) देखाउँछन्।'
    }
  },
  // 42. Number 76 (Orange on grey)
  {
    id: 'plate-42',
    number: '76',
    paletteId: 'orange_on_grey',
    seed: 142,
    difficulty: 'easy',
    distractors: ['75', '26', '16'],
    description: {
      en: 'Number 76 in bright orange on slate grey dots.',
      ne: 'खैरो पृष्ठभूमिमा सुन्तला रङको नम्बर ७६।'
    },
    explanation: {
      en: 'Number 76 is visible in orange dots against slate grey background dots.',
      ne: 'खैरो बिन्दुहरूको बीचमा सुन्तला बिन्दुहरूले ७६ (76) अङ्क देखाउँछन्।'
    }
  },
  // 43. Number 82 (Magenta on slate)
  {
    id: 'plate-43',
    number: '82',
    paletteId: 'magenta_on_slate',
    seed: 143,
    difficulty: 'hard',
    distractors: ['87', '32', '28'],
    description: {
      en: 'Number 82 in berry magenta on charcoal slate dots.',
      ne: 'खैरो पृष्ठभूमिमा म्याजेन्टा गुलाफी नम्बर ८२।'
    },
    explanation: {
      en: 'Number 82 is formed in magenta pink dots on dark slate grey.',
      ne: 'खैरो पृष्ठभूमिमा म्याजेन्टा गुलाफी बिन्दुहरूले ८२ (82) देखाउँछन्।'
    }
  },
  // 44. Number 84 (Green on orange)
  {
    id: 'plate-44',
    number: '84',
    paletteId: 'green_on_orange',
    seed: 144,
    difficulty: 'medium',
    distractors: ['34', '81', '89'],
    description: {
      en: 'Number 84 in emerald green on terracotta dots.',
      ne: 'सुन्तला पृष्ठभूमिमा हरियो नम्बर ८४।'
    },
    explanation: {
      en: 'Number 84 is formed in green dots against the warm orange background.',
      ne: 'सुन्तला बिन्दुहरूको बीचमा हरियो बिन्दुहरू मिलेर ८४ (84) देखिन्छ।'
    }
  },
  // 45. Number 85 (Rose on olive)
  {
    id: 'plate-45',
    number: '85',
    paletteId: 'rose_on_olive',
    seed: 145,
    difficulty: 'hard',
    distractors: ['35', '86', '58'],
    description: {
      en: 'Number 85 in coral rose dots on olive green.',
      ne: 'ओलिभ हरियोमा गुलाफी नम्बर ८५।'
    },
    explanation: {
      en: 'Number 85 is formed with coral rose pink dots on olive green dots.',
      ne: 'ओलिभ हरियो बिन्दुहरूका बीचमा गुलाफी बिन्दुहरूले ८५ (85) देखाउँछन्।'
    }
  },
  // 46. Number 86 (Amber on forest)
  {
    id: 'plate-46',
    number: '86',
    paletteId: 'amber_on_forest',
    seed: 146,
    difficulty: 'hard',
    distractors: ['36', '88', '68'],
    description: {
      en: 'Number 86 in golden amber on forest moss.',
      ne: 'हरियो वनस्पति पृष्ठभूमिमा सुनौलो एम्बर नम्बर ८६।'
    },
    explanation: {
      en: 'Number 86 is rendered in bright amber gold dots on forest green dots.',
      ne: 'गाढा हरियो बिन्दुहरूको बीचमा सुनौलो एम्बरले ८६ (86) अङ्क बनाएको छ।'
    }
  },
  // 47. Number 91 (Mint on salmon)
  {
    id: 'plate-47',
    number: '91',
    paletteId: 'mint_on_salmon',
    seed: 147,
    difficulty: 'easy',
    distractors: ['97', '61', '19'],
    description: {
      en: 'Number 91 in mint green dots on salmon pink.',
      ne: 'साल्मन गुलाफीमा मिन्ट हरियो नम्बर ९१।'
    },
    explanation: {
      en: 'Number 91 is rendered in mint green dots against salmon pink dots.',
      ne: 'गुलाफी पृष्ठभूमिका बीचमा हरियो बिन्दुहरूले ९१ (91) अङ्क बनाएका छन्।'
    }
  },
  // 48. Number 93 (Teal on peach)
  {
    id: 'plate-48',
    number: '93',
    paletteId: 'teal_on_peach',
    seed: 148,
    difficulty: 'medium',
    distractors: ['98', '63', '39'],
    description: {
      en: 'Number 93 in teal green on warm peach sand.',
      ne: 'आरु रङको पृष्ठभूमिमा टिल हरियो नम्बर ९३।'
    },
    explanation: {
      en: 'Number 93 is visible in teal green dots across peach and terracotta dots.',
      ne: 'आरु रङका बिन्दुहरूको बीचमा टिल हरियो बिन्दुहरू मिलेर ९३ (93) बनेको छ।'
    }
  },
  // 49. Number 95 (Orange on grey)
  {
    id: 'plate-49',
    number: '95',
    paletteId: 'orange_on_grey',
    seed: 149,
    difficulty: 'medium',
    distractors: ['96', '65', '59'],
    description: {
      en: 'Number 95 in bright orange on slate grey dots.',
      ne: 'खैरो पृष्ठभूमिमा सुन्तला रङको नम्बर ९५।'
    },
    explanation: {
      en: 'Number 95 is visible in orange dots against slate grey background dots.',
      ne: 'खैरो बिन्दुहरूको बीचमा सुन्तला बिन्दुहरूले ९५ (95) अङ्क देखाउँछन्।'
    }
  },
  // 50. Number 96 (Green on orange)
  {
    id: 'plate-50',
    number: '96',
    paletteId: 'green_on_orange',
    seed: 150,
    difficulty: 'easy',
    distractors: ['69', '95', '86'],
    description: {
      en: 'Number 96 in emerald green on terracotta dots.',
      ne: 'सुन्तला पृष्ठभूमिमा हरियो नम्बर ९६।'
    },
    explanation: {
      en: 'Number 96 is formed in green dots against the warm orange background.',
      ne: 'सुन्तला बिन्दुहरूको बीचमा हरियो बिन्दुहरू मिलेर ९६ (96) देखिन्छ।'
    }
  },
  // 51. Number 98 (Rose on olive)
  {
    id: 'plate-51',
    number: '98',
    paletteId: 'rose_on_olive',
    seed: 151,
    difficulty: 'hard',
    distractors: ['93', '68', '89'],
    description: {
      en: 'Number 98 in coral rose dots on olive green.',
      ne: 'ओलिभ हरियोमा गुलाफी नम्बर ९८।'
    },
    explanation: {
      en: 'Number 98 is formed with coral rose pink dots on olive green dots.',
      ne: 'ओलिभ हरियो बिन्दुहरूका बीचमा गुलाफी बिन्दुहरूले ९८ (98) देखाउँछन्।'
    }
  },
  // 52. Number 9 (Single digit - Terracotta on khaki)
  {
    id: 'plate-52',
    number: '9',
    paletteId: 'terracotta_on_khaki',
    seed: 152,
    difficulty: 'easy',
    distractors: ['6', '8', '0'],
    description: {
      en: 'Single digit 9 in terracotta red on khaki tan.',
      ne: 'खाकी पृष्ठभूमिमा टेराकोटा रातो अङ्क ९।'
    },
    explanation: {
      en: 'Single digit 9 appears in terracotta red dots against khaki tan dots.',
      ne: 'खाकी बिन्दुहरूको बीचमा टेराकोटा रातो बिन्दुहरूले ९ (9) देखाउँछन्।'
    }
  }
];
