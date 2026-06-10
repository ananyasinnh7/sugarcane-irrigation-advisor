// data.js - Crop advisory databases and multi-lingual dictionary

export const TRANSLATIONS = {
  en: {
    appTitle: "Sugarcane Smart Advisory Portal",
    subtitle: "Inspired by ICAR-IISR Crop & Irrigation Models",
    languageSelect: "Language",
    dashboard: "Dashboard",
    calculator: "Irrigation Scheduler",
    tracker: "Growth Activity Tracker",
    diagnostics: "Pest & Disease Suite",
    millPlanner: "Mill Delivery Planner",
    audioAdvisor: "Voice Advisor",
    todayAdvisory: "Today's Advisory",
    irrigationStatus: "Irrigation Status",
    currentStage: "Current Stage",
    weatherSim: "Weather Forecast",
    readAdvisory: "Listen to Advisory",
    stopAudio: "Stop Voice",
    soilMoistureTitle: "Soil Moisture Analysis",
    
    // Calculator Form
    calcTitle: "Ikshu-Kedar Irrigation Calculator",
    plantingDate: "Planting Date",
    lastIrrDate: "Last Irrigation Date",
    soilType: "Soil Type",
    irrMethod: "Irrigation Method",
    season: "Crop Season",
    calculate: "Calculate Next Irrigation",
    sandy: "Sandy (Fast draining)",
    loamy: "Loamy (Medium retention)",
    clayey: "Clayey (High retention)",
    flooding: "Flooding (Traditional)",
    furrow: "Furrow Irrigation",
    drip: "Drip Irrigation (Recommended)",
    sprinkler: "Sprinkler System",
    spring: "Spring Planting",
    autumn: "Autumn Planting",
    adsali: "Adsali (18 Months)",
    
    // Calculator Results
    calcResults: "Scheduler Recommendation",
    daysRemaining: "Days until next irrigation",
    nextDate: "Recommended Next Date",
    soilMoistureEst: "Estimated Soil Moisture",
    waterDepth: "Recommended Water Depth",
    advisoryTip: "Water-Saving Advisory Tip",
    irrSuccess: "Irrigation is on track! Keep monitoring soil dryness manually.",
    irrWarning: "Urgent: Soil is approaching critical depletion point. Plan irrigation soon.",
    irrDanger: "Critical: Soil moisture is depleted. Irrigate immediately to prevent cane wilting.",
    
    // Growth Tracker
    trackerTitle: "Cane Development Lifecycle",
    cropAge: "Crop Age",
    stageTimeline: "Growth Stage Progress",
    tasksTitle: "Recommended Crop Management Actions",
    completeTask: "Mark completed",
    germination: "Germination (0 - 60 days)",
    tillering: "Tillering (60 - 130 days)",
    grandGrowth: "Grand Growth (130 - 270 days)",
    maturity: "Maturity & Harvesting (270 - 365+ days)",

    // Diagnostics
    diagTitle: "Pest & Disease Reference",
    searchPlaceholder: "Search pests, diseases, or symptoms...",
    all: "All",
    pests: "Pests",
    diseases: "Diseases",
    symptoms: "Symptoms",
    remedies: "Control & Management Protocols",
    bioControl: "Biological Control",
    chemControl: "Chemical Control",
    culturalControl: "Cultural Practice",
    
    // Mill Planner
    millTitle: "Harvest & Mill Delivery Scheduler",
    brixCalculator: "Juice Brix Maturity Meter",
    enterBrix: "Enter Hand Refractometer Brix Value (%)",
    brixResult: "Maturity Prediction Status",
    addSlip: "Log Mill Transport Slip (Parcha)",
    slipNumber: "Indent Slip / Parcha No.",
    indentQty: "Cane Quantity (Tons)",
    vehicleType: "Transport Vehicle",
    harvestDate: "Harvest Date & Time",
    deliveryLog: "Log Schedule",
    activeSlips: "Active Delivery Tickets",
    harvestToCrush: "Harvest-to-Crush Clock",
    sucroseStatus: "Sucrose Quality Status",
    excellent: "Excellent (Less than 12h elapsed)",
    moderate: "Moderate (12h - 24h elapsed, slight sucrose loss)",
    critical: "Critical (Over 24h elapsed, high sucrose inversion!)",
    trolley: "Tractor Trolley",
    truck: "Truck",
    bullockCart: "Bullock Cart",
    
    // Voice Alerts
    alertIrrTitle: "Attention Farmer, your sugarcane crop is due for watering in standard hours.",
    alertBrixHigh: "Brix value is above 18%. Your sugarcane has reached optimal maturity. Prepare for harvesting.",
    alertBrixLow: "Brix value is below 16%. Crop is still accumulating sugar. Delay harvesting for better recovery.",
    audioAdvisoryText: "Welcome to the Sugarcane Advisory Portal. Today's forecast indicates warm weather. Ensure to irrigate your crop according to the schedule. For clayey soil, keep the interval to 12 days, and for sandy soil, irrigate every 6 days. Inspect leaves for Red Rot symptoms like red midribs."
  },
  hi: {
    appTitle: "गन्ना स्मार्ट सलाहकार पोर्टल",
    subtitle: "भाकृअनुप-भारतीय गन्ना अनुसंधान संस्थान (IISR) मॉडल्स पर आधारित",
    languageSelect: "भाषा चुनें",
    dashboard: "डैशबोर्ड",
    calculator: "सिंचाई शेड्यूलर",
    tracker: "फसल विकास ट्रैकर",
    diagnostics: "कीट एवं रोग निर्देशिका",
    millPlanner: "मिल आपूर्ति नियोजक",
    audioAdvisor: "आवाज सहायक",
    todayAdvisory: "आज की सलाह",
    irrigationStatus: "सिंचाई की स्थिति",
    currentStage: "वर्तमान चरण",
    weatherSim: "मौसम पूर्वानुमान",
    readAdvisory: "सलाह सुनें",
    stopAudio: "आवाज बंद करें",
    soilMoistureTitle: "मिट्टी नमी विश्लेषण",
    
    // Calculator Form
    calcTitle: "इक्षु-केदार सिंचाई कैलकुलेटर",
    plantingDate: "बुवाई की तारीख",
    lastIrrDate: "पिछली सिंचाई की तारीख",
    soilType: "मिट्टी का प्रकार",
    irrMethod: "सिंचाई की विधि",
    season: "फसल का मौसम",
    calculate: "अगली सिंचाई की गणना करें",
    sandy: "बलुई मिट्टी (तेज जल निकासी)",
    loamy: "दोमट मिट्टी (मध्यम धारण क्षमता)",
    clayey: "मटियारी/चिकनी मिट्टी (उच्च धारण क्षमता)",
    flooding: "बाढ़ सिंचाई (पारंपरिक)",
    furrow: "नाली सिंचाई (कूड़ विधि)",
    drip: "टपक सिंचाई / ड्रिप (अनुशंसित)",
    sprinkler: "बौछारी सिंचाई (स्प्रिंकलर)",
    spring: "शरदकालीन बुवाई",
    autumn: "बसंतकालीन बुवाई",
    adsali: "अदसाली बुवाई (18 महीने)",
    
    // Calculator Results
    calcResults: "शेड्यूलर अनुशंसा",
    daysRemaining: "अगली सिंचाई तक शेष दिन",
    nextDate: "अनुशंसित अगली तिथि",
    soilMoistureEst: "अनुमानित मिट्टी नमी",
    waterDepth: "अनुशंसित पानी की गहराई",
    advisoryTip: "जल-बचत सलाहकार टिप",
    irrSuccess: "सिंचाई सही समय पर है! मिट्टी के सूखेपन की निगरानी करते रहें।",
    irrWarning: "सचेत: मिट्टी में नमी कम हो रही है। जल्द ही सिंचाई की योजना बनाएं।",
    irrDanger: "गंभीर स्थिति: मिट्टी की नमी समाप्त हो चुकी है। गन्ने को सूखने से बचाने के लिए तुरंत सिंचाई करें।",
    
    // Growth Tracker
    trackerTitle: "गन्ना विकास जीवन चक्र",
    cropAge: "फसल की आयु",
    stageTimeline: "विकास चरण प्रगति",
    tasksTitle: "अनुशंसित फसल प्रबंधन कार्य",
    completeTask: "पूर्ण चिह्नित करें",
    germination: "अंकुरण चरण (0 - 60 दिन)",
    tillering: "कल्ले निकलना / कलोत्पत्ति (60 - 130 दिन)",
    grandGrowth: "तीव्र वृद्धि चरण (130 - 270 दिन)",
    maturity: "परिपक्वता और कटाई (270 - 365+ दिन)",

    // Diagnostics
    diagTitle: "कीट एवं रोग संदर्भ",
    searchPlaceholder: "कीट, रोग या लक्षणों की खोज करें...",
    all: "सभी",
    pests: "कीट",
    diseases: "रोग",
    symptoms: "लक्षण",
    remedies: "नियंत्रण और प्रबंधन उपाय",
    bioControl: "जैविक नियंत्रण",
    chemControl: "रासायनिक नियंत्रण",
    culturalControl: "कृषि क्रियाएं (सांस्कृतिक नियंत्रण)",
    
    // Mill Planner
    millTitle: "कटाई एवं मिल डिलीवरी शेड्यूलर",
    brixCalculator: "जूस ब्रिक्स परिपक्वता मीटर",
    enterBrix: "हैंड रिफ्रेक्टोमीटर ब्रिक्स मान (%) दर्ज करें",
    brixResult: "परिपक्वता पूर्वानुमान स्थिति",
    addSlip: "मिल परिवहन पर्ची (पर्चा) दर्ज करें",
    slipNumber: "इंडेंट पर्ची / पर्चा संख्या",
    indentQty: "गन्ने की मात्रा (टन)",
    vehicleType: "परिवहन वाहन",
    harvestDate: "कटाई की तिथि और समय",
    deliveryLog: "पर्चा लॉग करें",
    activeSlips: "सक्रिय डिलीवरी टिकट",
    harvestToCrush: "कटाई-से-पेराई समय",
    sucroseStatus: "सुक्रोज गुणवत्ता स्थिति",
    excellent: "उत्कृष्ट (12 घंटे से कम समय बीता)",
    moderate: "मध्यम (12 - 24 घंटे बीते, हल्की चीनी की क्षति)",
    critical: "चिंताजनक (24 घंटे से अधिक समय, भारी मात्रा में सुक्रोज का नुकसान!)",
    trolley: "ट्रैक्टर ट्रॉली",
    truck: "ट्रक",
    bullockCart: "बैलगाड़ी",
    
    // Voice Alerts
    alertIrrTitle: "किसान भाई ध्यान दें, आपकी गन्ने की फसल में सिंचाई का समय हो गया है।",
    alertBrixHigh: "ब्रिक्स मान 18% से अधिक है। आपका गन्ना पूरी तरह पक चुका है। कटाई की तैयारी करें।",
    alertBrixLow: "ब्रिक्स मान 16% से कम है। गन्ने में मिठास अभी और बढ़ेगी। अधिक पैदावार के लिए कटाई में देरी करें।",
    audioAdvisoryText: "गन्ना सलाहकार पोर्टल में आपका स्वागत है। आज धूप खिली रहेगी। अपनी गन्ने की फसल में सिंचाई चक्र के अनुसार पानी दें। मटियारी मिट्टी में 12 दिन और बलुई मिट्टी में 6 दिन के अंतराल पर सिंचाई करें। गन्ने में लाल सड़न रोग की जांच करें।"
  }
};

export const CROP_STAGES = [
  {
    id: 0,
    nameKey: "germination",
    minDays: 0,
    maxDays: 60,
    tasks: {
      en: [
        "Ensure field moisture is maintained for setts germination.",
        "Perform first blind hoeing 15-20 days after planting to loosen soil and remove weeds.",
        "Apply recommended dose of nitrogen fertilizer at planting.",
        "Inspect and control early weeds."
      ],
      hi: [
        "गन्ने के टुकड़ों (setts) के अंकुरण के लिए खेत में नमी बनाए रखें।",
        "मिट्टी को ढीला करने और खरपतवार निकालने के लिए रोपाई के 15-20 दिन बाद पहली अंधी गुड़ाई करें।",
        "बुवाई के समय नाइट्रोजन उर्वरक की अनुशंसित खुराक डालें।",
        "शुरुआती खरपतवारों का निरीक्षण और नियंत्रण करें।"
      ]
    }
  },
  {
    id: 1,
    nameKey: "tillering",
    minDays: 60,
    maxDays: 130,
    tasks: {
      en: [
        "Apply the second dose of Nitrogen fertilizer.",
        "Perform regular weeding and hoeing to stimulate tiller growth.",
        "Irrigate crop at intervals of 8-10 days in sandy soils, 12-15 days in clayey soils.",
        "Begin light earthing up (mounding soil around cane bases) to prevent lodging."
      ],
      hi: [
        "नाइट्रोजन उर्वरक की दूसरी खुराक डालें।",
        "कल्लों के विकास को बढ़ावा देने के लिए नियमित निराई और गुड़ाई करें।",
        "बलुई मिट्टी में 8-10 दिन और चिकनी मिट्टी में 12-15 दिन के अंतराल पर सिंचाई करें।",
        "गन्ने को गिरने से बचाने के लिए हल्की मिट्टी चढ़ाना (हल्का अर्थिंग-अप) शुरू करें।"
      ]
    }
  },
  {
    id: 2,
    nameKey: "grandGrowth",
    minDays: 130,
    maxDays: 270,
    tasks: {
      en: [
        "Perform heavy earthing up in July-August to secure the root system.",
        "Tie/wrap the sugarcane stalks together (propping) to prevent plants from falling under heavy monsoon winds.",
        "Ensure proper drainage during heavy rain periods to prevent waterlogging.",
        "Apply third and final dose of Nitrogen fertilizer."
      ],
      hi: [
        "गन्ने की जड़ों को मजबूती देने के लिए जुलाई-अगस्त में भारी मिट्टी चढ़ाएं (भारी अर्थिंग-अप)।",
        "मानसून की तेज हवाओं में पौधों को गिरने से बचाने के लिए गन्ने के डंठलों को आपस में बांधें (प्रॉपिंग/बंधाई)।",
        "जलभराव से बचने के लिए भारी बारिश के दौरान जल निकासी की उचित व्यवस्था सुनिश्चित करें।",
        "नाइट्रोजन उर्वरक की तीसरी और अंतिम खुराक डालें।"
      ]
    }
  },
  {
    id: 3,
    nameKey: "maturity",
    minDays: 270,
    maxDays: 365,
    tasks: {
      en: [
        "Stop irrigation 15 days prior to harvest to concentrate sucrose in stalks.",
        "Test maturity levels using a hand refractometer (target Brix > 18%).",
        "Harvest early-maturing varieties first.",
        "Coordinate with the sugar mill to sync harvest with transport slips (Parchas) to minimize transit delay."
      ],
      hi: [
        "डंठल में सुक्रोज को केंद्रित करने के लिए कटाई से 15 दिन पहले सिंचाई बंद कर दें।",
        "हैंड रिफ्रेक्टोमीटर का उपयोग करके परिपक्वता स्तर का परीक्षण करें (लक्ष्य ब्रिक्स > 18%)।",
        "जल्दी पकने वाली गन्ने की किस्मों की कटाई पहले करें।",
        "परिवहन देरी को कम करने के लिए चीनी मिल के साथ संपर्क करके पर्ची (पर्चा) के अनुसार ही कटाई करें।"
      ]
    }
  }
];

export const PEST_DISEASE_LIBRARY = [
  {
    id: "red_rot",
    type: "disease",
    name: {
      en: "Red Rot",
      hi: "लाल सड़न रोग (कैन कैंसर)"
    },
    scientificName: "Colletotrichum falcatum",
    symptoms: {
      en: "Third or fourth leaf shows yellowing and withering. Red coloration on the midrib of leaves. Split sugarcane stalks show longitudinal red tissues with white crossbands and a sour, acidic alcoholic smell.",
      hi: "तीसरी या चौथी पत्ती में पीलापन और मुरझाना शुरू होता है। पत्तियों की मुख्य नस पर लाल रंग के धब्बे दिखते हैं। गन्ने को चीरने पर अंदरूनी भाग में सफेद आड़ी पट्टियों के साथ लाल ऊतक दिखते हैं और खट्टी अम्लीय गंध आती है।"
    },
    controls: {
      bio: {
        en: "Treat setts with Trichoderma viride formulations before planting.",
        hi: "बुवाई से पहले गन्ने के टुकड़ों को ट्राइकोडरमा विरिडी से उपचारित करें।"
      },
      chem: {
        en: "Dip setts in Carbendazim 0.1% solution for 15 minutes before sowing.",
        hi: "बुवाई से पहले गन्ने के टुकड़ों को कार्बेंडाजिम 0.1% के घोल में 15 मिनट के लिए भिगोएं।"
      },
      cultural: {
        en: "Use healthy seed canes from certified nurseries. Uproot and burn infected clumps immediately. Practice crop rotation with paddy or green manures.",
        hi: "प्रमाणित नर्सरी से स्वस्थ बीज गन्ने का उपयोग करें। संक्रमित पौधों को तुरंत उखाड़कर जला दें। धान या हरी खाद के साथ फसल चक्र अपनाएं।"
      }
    },
    image: "assets/red_rot.png"
  },
  {
    id: "smut",
    type: "disease",
    name: {
      en: "Sugarcane Smut",
      hi: "कंडुआ रोग"
    },
    scientificName: "Sporisorium scitamineum",
    symptoms: {
      en: "Production of a long, whip-like black dusty shoot from the growing tip of the cane. Stunting of the clump, thin stalks, and excessive tillering leading to a grassy appearance.",
      hi: "गन्ने के ऊपरी बढ़ते सिरे से एक लंबा, कोड़े जैसा काला धूल भरा चाबुक निकलता है। पौधों का विकास रुक जाता है, तने पतले हो जाते हैं, और अत्यधिक कल्ले निकलने से यह घास जैसा दिखने लगता है।"
    },
    controls: {
      bio: {
        en: "Application of Pseudomonas fluorescens on soil beds helps suppress spore development.",
        hi: "मिट्टी में स्यूडोमोनास फ्लोरेसेंस के प्रयोग से बीजाणुओं के विकास को रोकने में मदद मिलती है।"
      },
      chem: {
        en: "Dip setts in Triadimefon 0.1% or Propiconazole 0.1% for disease protection.",
        hi: "रोग से बचाव के लिए टुकड़ों को ट्रायडिमफ़ोन 0.1% या प्रोपिकोनाज़ोल 0.1% के घोल में डुबोएं।"
      },
      cultural: {
        en: "Carefully cut off the whip in a cloth bag to prevent spore spread and destroy it. Avoid ratoon crop of infected fields. Grow resistant varieties like Co 0238 or CoS 767.",
        hi: "बीजाणुओं को फैलने से रोकने के लिए कोड़े जैसे काले सिरे को कपड़े के थैले में लपेटकर काटें और नष्ट करें। ग्रसित खेतों में पेड़ी फसल न लें। प्रतिरोधी किस्में उगाएं।"
      }
    },
    image: "assets/smut.png"
  },
  {
    id: "grassy_shoot",
    type: "disease",
    name: {
      en: "Grassy Shoot Disease",
      hi: "घास जैसी बढ़वार (ग्रैसी शूट)"
    },
    scientificName: "Phytoplasma",
    symptoms: {
      en: "Proliferation of numerous thin, papery white or yellow tillers from the base of the plant, giving it a dense grassy tuft-like appearance. Stunting and complete failure to produce millable canes.",
      hi: "पौधे के आधार से कई पतले, कागज जैसे सफेद या पीले रंग के कल्ले निकलते हैं, जिससे यह घनी घास के गुच्छे जैसा दिखने लगता है। गन्ने का विकास रुक जाता है और मिल योग्य गन्ना नहीं बन पाता।"
    },
    controls: {
      bio: {
        en: "No directly effective biocontrol agent. Integrated pest management against vector aphids is essential.",
        hi: "कोई सीधा जैविक नियंत्रण उपलब्ध नहीं है। वाहक एफिड्स के खिलाफ एकीकृत कीट प्रबंधन आवश्यक है।"
      },
      chem: {
        en: "Spray Dimethoate 0.05% or Malathion 0.1% to control the vector aphids which transmit the phytoplasma.",
        hi: "फाइटोप्लाज्मा फैलाने वाले एफिड्स (माहू) को नियंत्रित करने के लिए डाइमेथोएट 0.05% या मैलाथियान 0.1% का छिड़काव करें।"
      },
      cultural: {
        en: "Use Moist Hot Air Treatment (MHAT) at 54°C for 2-3 hours for seed canes. Rogue out infected clumps immediately.",
        hi: "बीज गन्ने के लिए 54 डिग्री सेल्सियस पर 2-3 घंटे के लिए नम गर्म हवा उपचार (MHAT) का उपयोग करें। संक्रमित पौधों को तुरंत उखाड़ फेंके।"
      }
    },
    image: "assets/grassy_shoot.png"
  },
  {
    id: "early_shoot_borer",
    type: "pest",
    name: {
      en: "Early Shoot Borer",
      hi: "चोटी / अग्रह तना छेदक"
    },
    scientificName: "Chilo infuscatellus",
    symptoms: {
      en: "Attacks young sugarcane crops (1-3 months old). Causes 'dead heart' (drying of central leaf whorl) which emits an offensive odor when pulled out. Circular bore holes at the base of the shoot.",
      hi: "युवा गन्ने की फसल (1-3 महीने पुरानी) पर हमला करता है। इससे 'डेड हार्ट' (केंद्रीय पत्ती का सूखना) हो जाता है, जिसे खींचने पर दुर्गंध आती है। पौधे के निचले हिस्से में गोलाकार छिद्र दिखाई देते हैं।"
    },
    controls: {
      bio: {
        en: "Release granulosis virus (GV) or release egg parasite Trichogramma chilonis at 2.5 lakh/ha starting from 4th week of planting.",
        hi: "बुवाई के चौथे सप्ताह से 2.5 लाख प्रति हेक्टेयर की दर से अंड परजीवी ट्राइकोग्रैमा चिलोनीस छोड़ें।"
      },
      chem: {
        en: "Apply Chlorantraniliprole 18.5 SC (Coragen) at 375 ml/ha dissolved in water at the base of shoots.",
        hi: "गन्ने के थान के पास पानी में घुला हुआ क्लोरेंट्रानिलिप्रोल 18.5 SC (कोराजन) 375 मिली प्रति हेक्टेयर की दर से डालें।"
      },
      cultural: {
        en: "Practice early planting (October-November) to bypass infestation. Trash mulching in interspaces between rows immediately after planting. Pull out dead hearts and destroy them.",
        hi: "प्रकोप से बचने के लिए अगेती बुवाई (अक्टूबर-नवंबर) करें। बुवाई के तुरंत बाद कतारों के बीच सूखी पत्ती बिछाएं (ट्रैश मल्चिंग)। डेड हार्ट को उखाड़कर नष्ट करें।"
      }
    },
    image: "assets/early_shoot_borer.png"
  },
  {
    id: "top_borer",
    type: "pest",
    name: {
      en: "Top Borer",
      hi: "शीर्ष / चोटी छेदक कीट"
    },
    scientificName: "Scirpophaga excerptalis",
    symptoms: {
      en: "Parallel rows of 'shot holes' on the opening leaves. Midrib showing reddish-brown boring tunnels. Bunched top appearance (known as 'bunchy top') due to growth of side buds after the main shoot tip is killed.",
      hi: "पत्तियों के खुलने पर उन पर छोटे छिद्रों की समानांतर पंक्तियाँ दिखाई देती हैं। पत्ती की मुख्य नस पर लाल-भूरे रंग के सुरंगनुमा छेद दिखते हैं। मुख्य शीर्ष मरने के कारण बगल की कलियाँ उग आती हैं, जिससे गुच्छेदार रूप ('बंची टॉप') बन जाता है।"
    },
    controls: {
      bio: {
        en: "Release larval parasite Isotima javensis for effective suppression of borer larvae.",
        hi: "बोरर लार्वा को प्रभावी ढंग से दबाने के लिए लार्वा परजीवी आइसोटिमा जावेन्सिस छोड़ें।"
      },
      chem: {
        en: "Apply Fipronil 0.3 G at 25 kg/ha or Cartap Hydrochloride 4G at 25 kg/ha in soil, followed by light irrigation.",
        hi: "खेत में फ़िप्रोनिल 0.3 G (25 किग्रा/हेक्टेयर) या कार्टाप हाइड्रोक्लोराइड 4G (25 किग्रा/हेक्टेयर) डालें, फिर हल्की सिंचाई करें।"
      },
      cultural: {
        en: "Collect and destroy egg masses deposited on lower leaf surfaces. Cut and destroy infected shoots at ground level before first brood emergence.",
        hi: "पत्तियों की निचली सतहों पर जमा अंडों को इकट्ठा करके नष्ट करें। पहले प्रजनन उभरने से पहले जमीनी स्तर पर संक्रमित अंकुरों को काटकर नष्ट करें।"
      }
    },
    image: "assets/top_borer.png"
  }
];
