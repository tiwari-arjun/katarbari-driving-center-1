export interface EyeTestQuestion {
  id: string;
  type: 'numbers' | 'sequence' | 'symbols';
  difficulty: 'easy' | 'medium' | 'hard';
  prompt: {
    en: string;
    ne: string;
  };
  visualValue: string; // The text / pattern to render in high contrast
  subVisual?: string; // Optional subtitle or hint pattern
  visualType?: 'snellen_number' | 'dot_plate' | 'grid_sequence' | 'symbol_e' | 'traffic_sign';
  options: {
    id: string;
    label: string;
  }[];
  correctAnswer: string;
  explanation: {
    en: string;
    ne: string;
  };
}

export const EYE_TEST_DISCLAIMER = {
  en: "Important Notice: This interactive eye test is strictly an educational tool to help driving license applicants familiarize themselves with the visual recognition and number-reading patterns used in Nepal DoTM preliminary health screenings. It does not measure clinical visual acuity or replace an official medical examination conducted by an authorized ophthalmologist or transport office medical officer.",
  ne: "महत्त्वपूर्ण सूचना: यो आँखा परीक्षण अभ्यास केवल यातायात व्यवस्था कार्यालय (DoTM) को प्रारम्भिक स्वास्थ्य परीक्षणमा सोधिने अंक तथा चिन्ह पहिचान ढाँचासँग अभ्यस्त हुन बनाइएको शैक्षिक अभ्यास साधन मात्र हो। यसले आधिकारिक डाक्टर वा विशेषज्ञद्वारा गरिने दृष्टिक्षमता परीक्षण (Clinical Eye Exam) को विकल्पको रूपमा काम गर्दैन।"
};

export const EYE_TEST_QUESTIONS: EyeTestQuestion[] = [
  // 1. Number Identification (3-digit, 4-digit, confusing digit pairs)
  {
    id: 'eye-001',
    type: 'numbers',
    difficulty: 'easy',
    prompt: {
      en: 'Which 3-digit number is displayed in the high-contrast chart?',
      ne: 'तलको चार्टमा कुन ३-अङ्कको संख्या प्रष्ट देखिएको छ?'
    },
    visualValue: '583',
    visualType: 'snellen_number',
    options: [
      { id: 'a', label: '538' },
      { id: 'b', label: '583' },
      { id: 'c', label: '853' },
      { id: 'd', label: '358' }
    ],
    correctAnswer: 'b',
    explanation: {
      en: 'The number displayed is 583. Notice the sharp top bar on 5 and rounded curves on 8 and 3.',
      ne: 'प्रदर्शन गरिएको संख्या ५८३ (583) हो।'
    }
  },
  {
    id: 'eye-002',
    type: 'numbers',
    difficulty: 'easy',
    prompt: {
      en: 'Identify the 3-digit number shown on the vision card:',
      ne: 'भिजन कार्डमा देखाइएको ३-अङ्कको संख्या पहिचान गर्नुहोस्:'
    },
    visualValue: '724',
    visualType: 'snellen_number',
    options: [
      { id: 'a', label: '724' },
      { id: 'b', label: '124' },
      { id: 'c', label: '714' },
      { id: 'd', label: '729' }
    ],
    correctAnswer: 'a',
    explanation: {
      en: 'The number is 724. Notice the horizontal top bar of 7 and open base of 4.',
      ne: 'देखाइएको संख्या ७२४ (724) हो।'
    }
  },
  {
    id: 'eye-003',
    type: 'numbers',
    difficulty: 'medium',
    prompt: {
      en: 'Read the 4-digit sequence with similar curve patterns:',
      ne: 'समान आकार भएका ४-अङ्कको संख्या पहिचान गर्नुहोस्:'
    },
    visualValue: '8693',
    visualType: 'snellen_number',
    options: [
      { id: 'a', label: '8963' },
      { id: 'b', label: '8693' },
      { id: 'c', label: '3698' },
      { id: 'd', label: '8683' }
    ],
    correctAnswer: 'b',
    explanation: {
      en: 'The digits are 8, 6 (bottom loop), 9 (top loop), and 3 (right loops) forming 8693.',
      ne: 'संख्या ८६९३ (8693) हो। ६ को तल्लो भाग र ९ को माथिल्लो गोलाइलाई ध्यान दिएर हेर्नुहोस्।'
    }
  },
  {
    id: 'eye-004',
    type: 'numbers',
    difficulty: 'medium',
    prompt: {
      en: 'Identify the number plate simulation value:',
      ne: 'नम्बर प्लेट जस्तै देखिने संख्या पत्ता लगाउनुहोस्:'
    },
    visualValue: '4079',
    visualType: 'snellen_number',
    options: [
      { id: 'a', label: '4079' },
      { id: 'b', label: '4019' },
      { id: 'c', label: '1079' },
      { id: 'd', label: '4879' }
    ],
    correctAnswer: 'a',
    explanation: {
      en: 'The number is 4079.',
      ne: 'संख्या ४०७९ (4079) हो।'
    }
  },
  {
    id: 'eye-005',
    type: 'numbers',
    difficulty: 'hard',
    prompt: {
      en: 'High-contrast subtle distinction: Which number is displayed?',
      ne: 'कडा भिन्नता भएको संख्या: कुन संख्या लेखिएको छ?'
    },
    visualValue: '38258',
    visualType: 'snellen_number',
    options: [
      { id: 'a', label: '38358' },
      { id: 'b', label: '38258' },
      { id: 'c', label: '88258' },
      { id: 'd', label: '38268' }
    ],
    correctAnswer: 'b',
    explanation: {
      en: 'The 5-digit number is 38258. Differentiating 2 from 3 and 5 from 6 is tested in distance reading.',
      ne: 'प्रदर्शन गरिएको संख्या ३८२५८ (38258) हो।'
    }
  },
  {
    id: 'eye-006',
    type: 'numbers',
    difficulty: 'hard',
    prompt: {
      en: 'Identify the mirrored curve combination:',
      ne: 'घुमाउरो अंकहरूको संयोजन पहिचान गर्नुहोस्:'
    },
    visualValue: '6908',
    visualType: 'snellen_number',
    options: [
      { id: 'a', label: '9608' },
      { id: 'b', label: '6908' },
      { id: 'c', label: '6608' },
      { id: 'd', label: '8906' }
    ],
    correctAnswer: 'b',
    explanation: {
      en: 'The number is 6908.',
      ne: 'सही संख्या ६९०८ (6908) हो।'
    }
  },

  // 2. Number Sequence & Grid Recognition
  {
    id: 'eye-007',
    type: 'sequence',
    difficulty: 'easy',
    prompt: {
      en: 'Identify the missing number in the sequence: 12, 14, [ ? ], 18, 20',
      ne: 'क्रममा छुटेको संख्या पहिचान गर्नुहोस्: १२, १४, [ ? ], १८, २०'
    },
    visualValue: '12 — 14 — [ ? ] — 18 — 20',
    visualType: 'grid_sequence',
    options: [
      { id: 'a', label: '15' },
      { id: 'b', label: '16' },
      { id: 'c', label: '17' },
      { id: 'd', label: '19' }
    ],
    correctAnswer: 'b',
    explanation: {
      en: 'The sequence increments by 2 each step: 12, 14, 16, 18, 20. The missing number is 16.',
      ne: 'प्रत्येक चरणमा २ अंकले बढेको छ। त्यसैले खाली ठाउँमा १६ (16) हुन्छ।'
    }
  },
  {
    id: 'eye-008',
    type: 'sequence',
    difficulty: 'medium',
    prompt: {
      en: 'Find the target number [ 47 ] position inside the 3x3 matrix:',
      ne: '३x३ को कोठामा संख्या [ ४७ ] कुन दिशामा अवस्थित छ?'
    },
    visualValue: "23 | 56 | 89\n12 | 47 | 34\n91 | 78 | 65",
    visualType: 'grid_sequence',
    options: [
      { id: 'a', label: 'Top Left' },
      { id: 'b', label: 'Center (Middle)' },
      { id: 'c', label: 'Bottom Right' },
      { id: 'd', label: 'Top Right' }
    ],
    correctAnswer: 'b',
    explanation: {
      en: '47 is positioned directly in the center cell of the 3x3 grid.',
      ne: 'संख्या ४७ ग्रिडको ठीक बीच भाग (Center) मा रहेको छ।'
    }
  },
  {
    id: 'eye-009',
    type: 'sequence',
    difficulty: 'medium',
    prompt: {
      en: 'Identify the last number in this backward countdown sequence: 95, 85, 75, 65, [ ? ]',
      ne: 'घट्दो क्रमको अन्तिम संख्या पत्ता लगाउनुहोस्: ९५, ८५, ७५, ६५, [ ? ]'
    },
    visualValue: '95 » 85 » 75 » 65 » [ ? ]',
    visualType: 'grid_sequence',
    options: [
      { id: 'a', label: '50' },
      { id: 'b', label: '55' },
      { id: 'c', label: '45' },
      { id: 'd', label: '60' }
    ],
    correctAnswer: 'b',
    explanation: {
      en: 'The numbers decrease by 10 in each step. 65 - 10 = 55.',
      ne: 'संख्याहरू १०-१० को दरले घटेका छन्, त्यसैले अर्को संख्या ५५ (55) हो।'
    }
  },
  {
    id: 'eye-010',
    type: 'sequence',
    difficulty: 'hard',
    prompt: {
      en: 'Find the only ODD number among the displayed row:',
      ne: 'देखाइएको लहरमा एकमात्र बिजोर संख्या (Odd Number) पत्ता लगाउनुहोस्:'
    },
    visualValue: '48 — 62 — 79 — 84 — 96',
    visualType: 'grid_sequence',
    options: [
      { id: 'a', label: '48' },
      { id: 'b', label: '79' },
      { id: 'c', label: '62' },
      { id: 'd', label: '84' }
    ],
    correctAnswer: 'b',
    explanation: {
      en: '79 ends in 9 which makes it odd, whereas 48, 62, 84, and 96 are all even numbers.',
      ne: '७९ (79) बिजोर संख्या हो, बाँकी सबै जोर संख्या हुन्।'
    }
  },

  // 3. Visual Symbol & Orientation Practice (Tumbling E & Contrast Symbols)
  {
    id: 'eye-011',
    type: 'symbols',
    difficulty: 'easy',
    prompt: {
      en: 'Which direction are the prongs of the Tumbling "E" symbol pointing?',
      ne: 'अक्षर "E" को खुल्ला भाग कुन दिशातर्फ फर्किएको छ?'
    },
    visualValue: 'E →',
    subVisual: 'RIGHT',
    visualType: 'symbol_e',
    options: [
      { id: 'a', label: 'Up / माथितर्फ' },
      { id: 'b', label: 'Right / दायाँतर्फ' },
      { id: 'c', label: 'Left / बायाँतर्फ' },
      { id: 'd', label: 'Down / तलतर्फ' }
    ],
    correctAnswer: 'b',
    explanation: {
      en: 'The standard Tumbling E vision test has its three open arms pointing to the Right.',
      ne: 'चिन्हको खुल्ला तीनवटा धर्का दायाँ (Right) तर्फ फर्किएको छ।'
    }
  },
  {
    id: 'eye-012',
    type: 'symbols',
    difficulty: 'easy',
    prompt: {
      en: 'Which direction is the Tumbling "E" pointing in this orientation?',
      ne: 'यस चित्रमा "E" चिन्ह कुन दिशातर्फ फर्किएको छ?'
    },
    visualValue: 'Ш (UP)',
    subVisual: 'UPWARD',
    visualType: 'symbol_e',
    options: [
      { id: 'a', label: 'Pointing Up / माथितर्फ' },
      { id: 'b', label: 'Pointing Down / तलतर्फ' },
      { id: 'c', label: 'Pointing Left / बायाँतर्फ' },
      { id: 'd', label: 'Pointing Right / दायाँतर्फ' }
    ],
    correctAnswer: 'a',
    explanation: {
      en: 'The open branches of the E symbol point straight Upward.',
      ne: 'चिन्हको खुल्ला भाग सिधा माथितर्फ (Up) फर्किएको छ।'
    }
  },
  {
    id: 'eye-013',
    type: 'symbols',
    difficulty: 'medium',
    prompt: {
      en: 'Which direction is the navigation arrow pointing?',
      ne: 'तीरको चिन्ह (Arrow) कुन दिशातर्फ संकेत गरिरहेको छ?'
    },
    visualValue: '↙ SOUTH-WEST',
    visualType: 'traffic_sign',
    options: [
      { id: 'a', label: 'Bottom-Left (South-West)' },
      { id: 'b', label: 'Top-Right (North-East)' },
      { id: 'c', label: 'Bottom-Right (South-East)' },
      { id: 'd', label: 'Top-Left (North-West)' }
    ],
    correctAnswer: 'a',
    explanation: {
      en: 'The arrow points towards the bottom-left diagonal.',
      ne: 'तीरले तल्लो बायाँतर्फ (Bottom-Left) संकेत गरिरहेको छ।'
    }
  },
  {
    id: 'eye-014',
    type: 'symbols',
    difficulty: 'hard',
    prompt: {
      en: 'Traffic signal discernment: Which light is illuminated in this 3-aspect signal?',
      ne: 'ट्राफिक बत्ती पहिचान: ३ वटा बत्तीमध्ये कुन बत्ती बलिरहेको छ?'
    },
    visualValue: '● RED (TOP)',
    visualType: 'traffic_sign',
    options: [
      { id: 'a', label: 'Green / हरियो (तल्लो)' },
      { id: 'b', label: 'Yellow / पहेंलो (बीचको)' },
      { id: 'c', label: 'Red / रातो (माथिल्लो)' },
      { id: 'd', label: 'Flashing Blue / निलो' }
    ],
    correctAnswer: 'c',
    explanation: {
      en: 'The top circle represents the RED stop signal universally.',
      ne: 'माथिल्लो बत्ती सधैं रातो (Red) संकेत हुन्छ जसले सवारी रोक्न निर्देशन दिन्छ।'
    }
  }
];
