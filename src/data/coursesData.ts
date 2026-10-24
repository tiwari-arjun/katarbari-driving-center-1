export interface CourseItem {
  id: string;
  vehicleType: 'scooter' | 'motorbike' | 'car';
  name: {
    en: string;
    ne: string;
  };
  /**
   * EXACT PRICE SPECIFICATION:
   * Scooter: Rs. 6,000 (रु. ६,०००)
   * Motorbike: Rs. 8,000 (रु. ८,०००)
   * Car: Rs. 12,000 (रु. १२,०००)
   */
  price: string;
  priceEn: string;
  priceNe: string;
  priceNumeric: number;
  badge: {
    en: string;
    ne: string;
  };
  duration: {
    en: string;
    ne: string;
  };
  description: {
    en: string;
    ne: string;
  };
  features: {
    en: string[];
    ne: string[];
  };
  formCategoryValue: string;
  active: boolean;
  whatsAppText: {
    en: string;
    ne: string;
  };
}

export const COURSES_DATA: CourseItem[] = [
  {
    id: "scooter-course",
    vehicleType: "scooter",
    name: {
      en: "Scooter Training",
      ne: "स्कुटर तालिम"
    },
    price: "रु. ६,०००",
    priceEn: "Rs. 6,000",
    priceNe: "रु. ६,०००",
    priceNumeric: 6000,
    active: true,
    badge: {
      en: "Category K",
      ne: "वर्ग 'क १' (स्कुटर)"
    },
    duration: {
      en: "15 Days Package",
      ne: "१५ दिने प्याकेज"
    },
    description: {
      en: "Learn scooter riding from the basics, including balance, controls, turning, braking, and safe road practices.",
      ne: "स्कुटरको आधारभूत सीप, सन्तुलन, नियन्त्रण, मोड्ने तरिका, ब्रेक लगाउने सीप र सुरक्षित सडक प्रयोग गर्न सिक्नुहोस्।"
    },
    features: {
      en: [
        "Beginner-friendly training",
        "Practical riding sessions",
        "Road safety fundamentals"
      ],
      ne: [
        "सुरुवाती सिक्नेहरूका लागि उपयुक्त",
        "व्याहारिक सवारी अभ्यास",
        "सडक सुरक्षाको आधारभूत ज्ञान"
      ]
    },
    formCategoryValue: "Category K (Scooter)",
    whatsAppText: {
      en: "Hello Katarbari Driving Center, I would like to know more about your driving courses (Scooter Training).",
      ne: "नमस्कार, मलाई Katarbari Driving Center को ड्राइभिङ कोर्सबारे थप जानकारी चाहिएको छ।"
    }
  },
  {
    id: "motorbike-course",
    vehicleType: "motorbike",
    name: {
      en: "Motorbike Training",
      ne: "मोटरसाइकल तालिम"
    },
    price: "रु. ८,०००",
    priceEn: "Rs. 8,000",
    priceNe: "रु. ८,०००",
    priceNumeric: 8000,
    active: true,
    badge: {
      en: "Category A",
      ne: "वर्ग 'क' (मोटरसाइकल)"
    },
    duration: {
      en: "21 Days Package",
      ne: "२१ दिने प्याकेज"
    },
    description: {
      en: "Build confidence in motorcycle handling, gear shifting, clutch control, braking, turning, and road awareness.",
      ne: "मोटरसाइकल नियन्त्रण, गियर परिवर्तन, क्लचको प्रयोग, ब्रेकिङ, मोड्ने तरिका र सडक सचेतनाको अभ्यास गर्नुहोस्।"
    },
    features: {
      en: [
        "Clutch and gear control",
        "Turning and braking practice",
        "Safe riding techniques"
      ],
      ne: [
        "क्लच र गियर नियन्त्रण",
        "मोड्ने र ब्रेक लगाउने अभ्यास",
        "सुरक्षित सवारी चलाउने सीप"
      ]
    },
    formCategoryValue: "Category A (Motorcycle)",
    whatsAppText: {
      en: "Hello Katarbari Driving Center, I would like to know more about your driving courses (Motorbike Training).",
      ne: "नमस्कार, मलाई Katarbari Driving Center को ड्राइभिङ कोर्सबारे थप जानकारी चाहिएको छ।"
    }
  },
  {
    id: "car-course",
    vehicleType: "car",
    name: {
      en: "Car Driving Training",
      ne: "कार ड्राइभिङ तालिम"
    },
    price: "रु. १२,०००",
    priceEn: "Rs. 12,000",
    priceNe: "रु. १२,०००",
    priceNumeric: 12000,
    active: true,
    badge: {
      en: "Category B",
      ne: "वर्ग 'ख' (कार/जिप)"
    },
    duration: {
      en: "30 Days Comprehensive",
      ne: "३० दिने पूर्ण तालिम"
    },
    description: {
      en: "Learn essential car driving skills, steering control, acceleration, braking, parking, traffic rules, and practical road awareness.",
      ne: "कार चलाउने आधारभूत सीप, स्टेयरिङ नियन्त्रण, एक्सेलेरेटर, ब्रेक, पार्किङ, ट्राफिक नियम र सडकमा सवारी चलाउने अभ्यास गर्नुहोस्।"
    },
    features: {
      en: [
        "Beginner driving lessons",
        "Steering and parking practice",
        "Traffic rules and road awareness"
      ],
      ne: [
        "सुरुवाती ड्राइभिङ तालिम",
        "स्टेयरिङ र पार्किङ अभ्यास",
        "ट्राफिक नियम र सडक सचेतना"
      ]
    },
    formCategoryValue: "Category B (Car / Jeep)",
    whatsAppText: {
      en: "Hello Katarbari Driving Center, I would like to know more about your driving courses (Car Driving Training).",
      ne: "नमस्कार, मलाई Katarbari Driving Center को ड्राइभिङ कोर्सबारे थप जानकारी चाहिएको छ।"
    }
  }
];
