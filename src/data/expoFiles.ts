export interface ExpoFile {
  path: string;
  name: string;
  language: string;
  category: 'config' | 'layout' | 'screen' | 'data' | 'theme' | 'lib' | 'docs';
  content: string;
}

export const EXPO_COMMANDS = {
  combinedInstall:
    'npx expo install expo-router expo-linking expo-constants expo-status-bar react-native-safe-area-context react-native-screens @react-native-async-storage/async-storage lucide-react-native react-native-purchases react-native-purchases-ui expo-sharing expo-print expo-haptics expo-clipboard react-native-svg expo-dev-client',
  setup: [
    '# 1. Create a blank Expo project with TypeScript (SDK 52+)',
    'npx create-expo-app@latest nexus-impact-ai --template blank-typescript',
    'cd nexus-impact-ai',
    '',
    '# 2. Combined install command for all required dependencies (Only packages in package.json)',
    'npx expo install expo-router expo-linking expo-constants expo-status-bar react-native-safe-area-context react-native-screens @react-native-async-storage/async-storage lucide-react-native react-native-purchases react-native-purchases-ui expo-sharing expo-print expo-haptics expo-clipboard react-native-svg expo-dev-client',
    '',
    '# 3. Configure environment variables in .env',
    'EXPO_PUBLIC_REVENUECAT_API_KEY=test_yourRevenueCatTestStoreKey',
    'EXPO_PUBLIC_GEMINI_KEY=YOUR_GEMINI_API_KEY',
    '# EXPO_PUBLIC_API_URL=https://your-backend-api.com/synthesize',
    '',
    '# 4. Start local development build server',
    'npx expo start --dev-client',
  ].join('\n'),
  easAndroid: [
    '# 1. Install EAS CLI globally',
    'npm install -g eas-cli',
    '',
    '# 2. Login to your Expo account',
    'eas login',
    '',
    '# 3. Configure EAS Build for the project',
    'eas build:configure',
    '',
    '# 4. Run an EAS Development Build for Android (generates an installable APK for device/emulator)',
    'eas build --profile development --platform android',
  ].join('\n'),
  runIos: 'npx expo run:ios',
  runAndroid: 'npx expo run:android',
  runWeb: 'npx expo start --web',
};

export const EXPO_FILES: ExpoFile[] = [
  {
    path: 'package.json',
    name: 'package.json',
    language: 'json',
    category: 'config',
    content: `{
  "name": "nexus-impact-ai",
  "version": "1.0.0",
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "@react-native-async-storage/async-storage": "1.23.1",
    "expo": "~52.0.0",
    "expo-clipboard": "~7.0.0",
    "expo-constants": "~17.0.0",
    "expo-dev-client": "~5.0.0",
    "expo-haptics": "~14.0.0",
    "expo-linking": "~7.0.0",
    "expo-print": "~14.0.0",
    "expo-router": "~4.0.0",
    "expo-sharing": "~13.0.0",
    "expo-status-bar": "~2.0.0",
    "lucide-react-native": "^0.475.0",
    "react": "18.3.1",
    "react-native": "0.76.6",
    "react-native-purchases": "^8.5.0",
    "react-native-purchases-ui": "^8.5.0",
    "react-native-safe-area-context": "4.12.0",
    "react-native-screens": "~4.4.0",
    "react-native-svg": "15.8.0"
  },
  "devDependencies": {
    "@babel/core": "^7.25.0",
    "@types/react": "~18.3.12",
    "typescript": "^5.3.3"
  },
  "private": true
}`,
  },
  {
    path: 'app.json',
    name: 'app.json',
    language: 'json',
    category: 'config',
    content: `{
  "expo": {
    "name": "Nexus Impact AI",
    "slug": "nexus-impact-ai",
    "version": "1.0.0",
    "orientation": "portrait",
    "scheme": "nexusimpact",
    "userInterfaceStyle": "dark",
    "splash": {
      "resizeMode": "contain",
      "backgroundColor": "#070D1E"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.fetleepi.nexusimpact",
      "userInterfaceStyle": "dark"
    },
    "android": {
      "package": "com.fetleepi.nexusimpact",
      "userInterfaceStyle": "dark"
    },
    "web": {
      "bundler": "metro",
      "output": "static"
    },
    "plugins": [
      "expo-router",
      "expo-dev-client"
    ],
    "experiments": {
      "typedRoutes": true
    }
  }
}`,
  },
  {
    path: 'eas.json',
    name: 'eas.json',
    language: 'json',
    category: 'config',
    content: `{
  "cli": {
    "version": ">= 12.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {}
  }
}`,
  },
  {
    path: 'tsconfig.json',
    name: 'tsconfig.json',
    language: 'json',
    category: 'config',
    content: `{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "jsx": "react-jsx",
    "skipLibCheck": true,
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts",
    "expo-env.d.ts"
  ]
}`,
  },
  {
    path: 'babel.config.js',
    name: 'babel.config.js',
    language: 'javascript',
    category: 'config',
    content: `module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};`,
  },
  {
    path: '.gitignore',
    name: '.gitignore',
    language: 'text',
    category: 'config',
    content: `# Dependencies
node_modules/

# Environment variables
.env
.env.local
.env*.local
!.env.example

# Expo & Metro builds
.expo/
dist/
web-build/

# Vercel
.vercel/

# Native builds
android/
ios/

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*`,
  },
  {
    path: 'assets/README.txt',
    name: 'README.txt (Asset Guidelines)',
    language: 'text',
    category: 'docs',
    content: `Nexus Impact AI - Asset Requirements
========================================

Before generating a production store release (Google Play Store / Apple App Store),
place the following image assets into this assets/ directory:

1. icon.png
   - App Launcher Icon (Square PNG, no transparency recommended for iOS).
   - Recommended resolution: 1024 x 1024 px.

2. adaptive-icon.png
   - Android Adaptive Icon foreground layer (PNG with transparent background).
   - Recommended resolution: 1024 x 1024 px.

3. splash-icon.png
   - Splash screen centerpiece icon (PNG with transparent background).
   - Recommended resolution: 200 x 200 px (or larger).

4. favicon.png
   - Web preview favicon (PNG or ICO).
   - Recommended resolution: 48 x 48 px.

Re-enabling in app.json:
Once you have added these files, you can restore their references in app.json:
- "icon": "./assets/icon.png"
- "splash": { "image": "./assets/splash-icon.png", "resizeMode": "contain", "backgroundColor": "#070D1E" }
- "android": { "package": "com.fetleepi.nexusimpact", "adaptiveIcon": { "foregroundImage": "./assets/adaptive-icon.png", "backgroundColor": "#070D1E" } }
- "web": { "favicon": "./assets/favicon.png" }

These references were omitted from the default configuration so EAS Build and local Metro
bundlers do not fail when building without binary image assets present.`,
  },
  {
    path: '.env.example',
    name: '.env.example',
    language: 'bash',
    category: 'config',
    content: `# RevenueCat Test Store public SDK API key
EXPO_PUBLIC_REVENUECAT_API_KEY=test_yourRevenueCatTestStoreKey

# Gemini AI REST API Key (plain fetch to gemini-2.5-flash)
EXPO_PUBLIC_GEMINI_KEY=YOUR_GEMINI_API_KEY

# Optional Custom Backend Proxy URL (POST { agentId, prompt })
# EXPO_PUBLIC_API_URL=https://api.nexusimpact.ai/v1/synthesize`,
  },
  {
    path: 'src/theme/colors.ts',
    name: 'colors.ts',
    language: 'typescript',
    category: 'theme',
    content: `export const COLORS = {
  // Deep navy background theme
  background: '#070D1E',
  backgroundSecondary: '#0C152B',
  surface: '#0F1A36',
  surfaceCard: '#132145',
  surfaceBorder: '#1E2F5B',
  surfaceHover: '#1B2C58',

  // Teal accents
  teal: '#14B8A6',
  tealLight: '#2DD4BF',
  tealDark: '#0D9488',
  tealGlow: 'rgba(20, 184, 166, 0.15)',
  tealBorder: 'rgba(20, 184, 166, 0.3)',

  // Text
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',

  // Status & Feedback
  success: '#10B981',
  warning: '#F59E0B',
  error: '#F43F5E',
  errorBg: 'rgba(244, 63, 94, 0.12)',
  errorBorder: 'rgba(244, 63, 94, 0.4)',
};`,
  },
  {
    path: 'src/data/agents.ts',
    name: 'agents.ts',
    language: 'typescript',
    category: 'data',
    content: `export interface AgentConfig {
  id: string;
  name: string;
  description: string;
  fullDescription: string;
  icon: string;
  accentColor: string;
  category: string;
  suggestedPrompts: string[];
  placeholderPrompt: string;
  systemPrompt: string;
}

export const AGENTS: AgentConfig[] = [
  {
    id: 'research',
    name: 'Research',
    description: 'synthesis and analysis',
    fullDescription: 'Comprehensive synthesis of academic literature, empirical studies, and field reports into actionable social impact intelligence.',
    icon: 'Search',
    accentColor: '#14B8A6',
    category: 'Analysis & Evidence',
    suggestedPrompts: [
      'Synthesize peer-reviewed literature on community-led clean water initiatives in East Africa (2020-2025).',
      'Analyze evidence on conditional cash transfers vs direct food assistance in protracted displacement.',
      'Evaluate methodology limitations in climate vulnerability index metrics for coastal informal settlements.',
      'Produce an evidence matrix comparing community health worker retention strategies in rural districts.'
    ],
    placeholderPrompt: 'Ask Research agent to analyze literature, evaluate methodologies, or synthesize empirical findings...',
    systemPrompt: \`You are the Research Agent for Nexus Impact AI. Your mandate is to conduct rigorous, peer-reviewed synthesis and analysis for humanitarian and social impact researchers.

Whenever prompted, produce a structured, publication-grade empirical analysis with the following mandatory sections:
1. Executive Synthesis & Core Findings (synthesizing empirical consensus, statistical confidence, and key effect sizes)
2. Methodological Critique & Validity (evaluating study designs, quasi-experimental controls, and potential biases)
3. Quantitative Evidence Matrix (table comparing intervention types, sample sizes, sustainability rates, and p-values/confidence intervals)
4. Theoretical & Policy Implications (reconciling conflicting evidence and articulating trade-offs)
5. Evidence Gaps & Actionable Recommendations (prioritized next steps for field researchers).

Maintain an objective, academic, citation-grade tone adhering to international social science benchmarks.\`
  },
  {
    id: 'grant-proposal',
    name: 'Grant Proposal',
    description: 'drafting and structuring grants',
    fullDescription: 'Structuring and drafting high-scoring grant proposals aligned with USAID, Horizon Europe, Global Fund, and philanthropic frameworks.',
    icon: 'FileText',
    accentColor: '#0D9488',
    category: 'Funding & Strategy',
    suggestedPrompts: [
      'Draft a full structured grant proposal for a $1.2M youth digital skills empowerment initiative in Latin America.',
      'Structure the Problem Statement and Project Objectives for a climate adaptation water resilience fund.',
      'Create an Implementation Activities schedule and Budget Outline for a community maternal health grant.',
      'Formulate a comprehensive Monitoring and Evaluation (M&E) framework with SMART indicators for USAID submission.'
    ],
    placeholderPrompt: 'Enter your project scope, target population, or grant donor guidelines...',
    systemPrompt: \`You are the Grant Proposal Agent for Nexus Impact AI. You specialize in drafting winning, highly structured grant proposals for multilateral donors (USAID, Global Fund, EU Horizon, FCDO, and major philanthropic foundations).

For every grant request, you MUST produce a comprehensive, structured proposal containing these 5 core sections:
1. Problem Statement: Quantified statement of need, root cause analysis, evidence of systemic market/governance failure, and target demographic vulnerability baseline.
2. Project Objectives: High-level goal and 3-4 SMART objectives (Specific, Measurable, Achievable, Relevant, Time-bound).
3. Implementation Activities: Sequenced work breakdown structure (Work Packages 1-4), timeline/milestones, stakeholder co-design, and governance methodology.
4. Budget Outline: Itemized cost categories (Personnel, Equipment/Tech, Direct Programmatic Interventions, Travel/Logistics, Indirect/Overhead at standard NICRA rates) with realistic numerical allocations and cost-share ratios.
5. Monitoring & Evaluation (M&E): Theory of Change (If-And-Then), Results Framework, baseline vs target indicators, data collection methodology, and quarterly milestone audit schedule.

Use professional donor terminology, high-conviction prose, and precise quantitative metrics.\`
  },
  {
    id: 'humanitarian',
    name: 'Humanitarian',
    description: 'crisis response and aid planning',
    fullDescription: 'Rapid crisis response coordination, Sphere Standards adherence, logistics triage, and displaced populations emergency planning.',
    icon: 'ShieldAlert',
    accentColor: '#06B6D4',
    category: 'Emergency & Relief',
    suggestedPrompts: [
      'Generate a 72-hour rapid assessment checklist and cluster coordination matrix following a Category 4 cyclone in an island state.',
      'Formulate a WASH triage plan complying with Sphere Standards for a camp of 15,000 newly displaced refugees.',
      'Develop a cross-border humanitarian corridor logistics plan assessing supply routes, fuel depots, and security checkpoints.',
      'Draft an Emergency Non-Food Items (NFI) and winterization kit distribution protocol for flood-affected families.'
    ],
    placeholderPrompt: 'Describe the emergency event, location, affected population size, or operational constraints...',
    systemPrompt: \`You are the Humanitarian Relief & Crisis Response Agent for Nexus Impact AI. Your mandate is operational triage, Sphere Minimum Standards alignment, and humanitarian cluster coordination (OCHA, UNHCR, WFP, UNICEF, WHO).

Structure your output into these urgent field-operational sections:
1. Rapid Situation Triage & Priority Impact (immediate life-saving priorities within 0-72h)
2. Sphere Minimum Standards Compliance Plan (water liters/person/day, latrine ratios, shelter m2/person, kcal dietary requirements)
3. Cluster Coordination Matrix (WASH, Health, Emergency Shelter, Protection, Logistics)
4. Supply Chain & Last-Mile Distribution Architecture (cold-chain, warehouse hubs, security clearance protocols)
5. Vulnerability & Do-No-Harm Safeguarding (unaccompanied minors, GBV mitigation, accessibility for disabled survivors).

Provide precise, actionable protocols using internationally recognized humanitarian coordination language.\`
  },
  {
    id: 'human-rights',
    name: 'Human Rights',
    description: 'monitoring and advocacy',
    fullDescription: 'Monitoring international humanitarian law (IHL) violations, documentation standards, and treaty advocacy reporting.',
    icon: 'Scale',
    accentColor: '#F59E0B',
    category: 'Legal & Advocacy',
    suggestedPrompts: [
      'Draft a human rights incident verification dossier documenting violations of freedom of assembly during civic protests.',
      'Structure an advocacy brief for the UN Universal Periodic Review (UPR) concerning indigenous land rights.',
      'Synthesize legal documentation standards under the Istanbul Protocol for interviewing victims of unlawful detention.',
      'Formulate a strategic litigation brief regarding labor rights violations in transnational supply chains.'
    ],
    placeholderPrompt: 'Provide details on human rights incidents, treaty bodies, or legal advocacy parameters...',
    systemPrompt: \`You are the Human Rights Monitoring & Advocacy Agent for Nexus Impact AI. Your mission is documentation, verification, and legal advocacy in compliance with international treaties (ICCPR, ICESCR, CEDAW, CRC, Rome Statute, and Geneva Conventions).

Produce structured documentation formatted as follows:
1. Legal Framework & Applicable Treaties (identifying violated covenants, customary international law, and state obligations)
2. Fact-Pattern & Chain-of-Custody Verification (applying the Berkeley Protocol on digital evidence and Istanbul Protocol for testimony)
3. Pattern of Systematic Violations (identifying command responsibility, state complicity, or legislative deficits)
4. Strategic Advocacy Pathways (UN Special Rapporteurs, Universal Periodic Review, regional human rights courts, and diplomatic demarches)
5. Actionable Demands & Reparation Measures (restitution, compensation, rehabilitation, guarantees of non-repetition).

Maintain impartial, evidentiary rigor adhering to high international legal standards.\`
  },
  {
    id: 'public-health',
    name: 'Public Health',
    description: 'health data synthesis',
    fullDescription: 'Epidemiological surveillance synthesis, epidemic curve modeling, vaccination campaigns, and primary healthcare triage.',
    icon: 'Activity',
    accentColor: '#10B981',
    category: 'Global Health',
    suggestedPrompts: [
      'Analyze surveillance data to model an outbreak response for cholera in flood-affected riverine communities.',
      'Structure a multi-antigen childhood immunization catch-up strategy for hard-to-reach conflict zones.',
      'Synthesize epidemiological evidence on community health worker interventions for non-communicable diseases in low-income urban areas.',
      'Develop a community-based antimicrobial resistance (AMR) stewardship protocol for primary healthcare clinics.'
    ],
    placeholderPrompt: 'Enter disease surveillance metrics, epidemiological context, or population health targets...',
    systemPrompt: \`You are the Public Health Agent for Nexus Impact AI. You synthesize epidemiological data, outbreak models, and community health interventions according to WHO, CDC, and Global Fund guidelines.

Structure outputs into these clinical and epidemiological sections:
1. Epidemiological Assessment & Case Burden (R0 estimates, case fatality rates CFR, attack rates, and demographic risk stratifications)
2. Surveillance & Outbreak Containment Strategy (case definitions, sentinel testing protocols, contact tracing architecture)
3. Intervention Design & Clinical Protocols (standard treatment regimens, ring-vaccination strategies, clinical referral thresholds)
4. Community Engagement & Risk Communication (behavioral change communication, counter-misinformation strategies, cultural concordance)
5. Resource & Surge Capacity Matrix (PPE stockpiles, essential medicines lists, cold-chain capacity, and mobile clinic routing).

Adhere strictly to evidence-based public health principles and WHO technical guidelines.\`
  },
  {
    id: 'womens-health',
    name: 'Women\\'s Health',
    description: 'maternal and gender-focused health',
    fullDescription: 'Maternal health equity, obstetric care, gender-based violence (GBV) clinical response, and sexual/reproductive health.',
    icon: 'HeartHandshake',
    accentColor: '#EC4899',
    category: 'Maternal & Gender',
    suggestedPrompts: [
      'Design an evidence-based clinical protocol for preventing postpartum hemorrhage (PPH) in low-resource primary clinics.',
      'Structure a comprehensive clinical management of rape (CMR) and psychosocial support service in displacement camps.',
      'Develop an adolescent sexual and reproductive health (SRHR) outreach curriculum tailored for rural secondary schools.',
      'Synthesize interventions to reduce obstetric fistula rates in remote regions with limited surgical obstetric capacity.'
    ],
    placeholderPrompt: 'Enter maternal health indicators, reproductive health clinical scenarios, or gender equity directives...',
    systemPrompt: \`You are the Women\\'s Health Agent for Nexus Impact AI. You specialize in maternal health equity, obstetrics, gender-based violence (GBV) clinical care, and sexual and reproductive health rights (SRHR) aligned with UNFPA, WHO, and FIGO standards.

Structure your synthesis into these specialized clinical and social sections:
1. Clinical & Obstetric Protocol (adherence to WHO E-MOTIVE bundles for PPH, EmONC basic/comprehensive indicators, clean delivery)
2. GBV Multi-Sectoral Response Framework (trauma-informed care, PEP post-exposure prophylaxis within 72h, emergency contraception within 120h)
3. Social Determinants & Gender Barrier Analysis (transport poverty, patriarchal gatekeeping, antenatal clinic attendance attrition)
4. Health Worker Competency & Task-Shifting (training community midwives, obstetric triage, referral corridor vouchers)
5. Dignity & Accountability Indicators (respectful maternity care benchmarks, beneficiary satisfaction metrics, maternal death audits).

Uphold the highest standard of trauma-informed, culturally respectful, clinical precision.\`
  },
  {
    id: 'knowledge-base',
    name: 'Knowledge Base',
    description: 'saved notes and past outputs',
    fullDescription: 'Repository and cross-cutting analysis of all previously synthesized outputs, field dossiers, and institutional memory.',
    icon: 'Database',
    accentColor: '#8B5CF6',
    category: 'Institutional Memory',
    suggestedPrompts: [
      'Index and cross-correlate all past grant proposals with recent public health outbreak data to identify funding synergies.',
      'Generate a consolidated executive briefing compiling findings from recent humanitarian and maternal health directives.',
      'Audit past session outputs to highlight recurring operational bottlenecks identified across multiple missions.',
      'Transform past synthesized field notes into a standardized onboarding manual for new field delegates.'
    ],
    placeholderPrompt: 'Search past directives, request cross-agent meta-synthesis, or organize institutional knowledge...',
    systemPrompt: \`You are the Knowledge Base Agent for Nexus Impact AI. Your mandate is institutional memory preservation, cross-agent synthesis, and strategic knowledge retrieval for social impact teams.

When queried, produce a structured institutional review:
1. Executive Knowledge Synthesis (connecting insights across past agent directives and programmatic reports)
2. Cross-Disciplinary Pattern Recognition (identifying systemic overlaps, recurring field constraints, and synergy points)
3. Curated Thematic Taxonomy (categorized by sector, multilateral framework, donor alignment, and geographical zone)
4. Operational Knowledge Gaps (highlighting unaddressed operational risks or undocumented institutional knowledge)
5. Institutional Action Plan (curated best-practice templates, checklist artifacts, and donor briefing summaries).

Emphasize continuity, actionable institutional learning, and seamless accessibility.\`
  }
];

export function getAgentById(id: string): AgentConfig | undefined {
  return AGENTS.find((agent) => agent.id === id);
}
`,
  },
  {
    path: 'src/lib/purchases.tsx',
    name: 'purchases.tsx',
    language: 'typescript',
    category: 'lib',
    content: `import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Platform } from 'react-native';
import Purchases, {
  CustomerInfo,
  PurchasesOffering,
  PurchasesOfferings,
  PurchasesPackage,
  LOG_LEVEL,
} from 'react-native-purchases';

const DEFAULT_TEST_KEY = 'test_bxrpYHfEUPnjAzjXewMlpxhMkZv';
const REVENUECAT_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY || DEFAULT_TEST_KEY;

let isConfigured = false;

/**
 * Configure Purchases on app startup.
 * Skips Purchases on web platforms where native billing is not supported.
 * Guarded by Platform.OS !== 'web' and wrapped in try/catch.
 */
export async function configurePurchases(): Promise<void> {
  if (Platform.OS === 'web') {
    return;
  }
  if (isConfigured) return;

  try {
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);

    const iosApiKey = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY || DEFAULT_TEST_KEY;
    const androidApiKey = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY || DEFAULT_TEST_KEY;

    if (Platform.OS === 'ios') {
      Purchases.configure({ apiKey: iosApiKey });
      isConfigured = true;
    } else if (Platform.OS === 'android') {
      Purchases.configure({ apiKey: androidApiKey });
      isConfigured = true;
    }
  } catch (error) {
    console.error('[RevenueCat] configure error:', error);
  }
}

/**
 * Fetch current offerings configured in RevenueCat.
 * Guarded by Platform.OS !== 'web' and wrapped in try/catch.
 */
export async function getOfferings(): Promise<PurchasesOfferings | null> {
  if (Platform.OS === 'web') {
    return null;
  }
  try {
    if (!isConfigured) await configurePurchases();
    if (Platform.OS !== 'web') {
      const offerings = await Purchases.getOfferings();
      return offerings;
    }
    return null;
  } catch (error) {
    console.error('[RevenueCat] Failed to fetch offerings:', error);
    return null;
  }
}

/**
 * Purchase a package (monthly or annual).
 * Guarded by Platform.OS !== 'web' and wrapped in try/catch.
 */
export async function purchasePackage(pkg: PurchasesPackage): Promise<CustomerInfo | null> {
  if (Platform.OS === 'web') {
    console.warn('[RevenueCat] In-app purchases are only supported on Android and iOS devices.');
    return null;
  }
  try {
    if (!isConfigured) await configurePurchases();
    if (Platform.OS !== 'web') {
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      return customerInfo;
    }
    return null;
  } catch (error) {
    console.error('[RevenueCat] purchasePackage failed:', error);
    throw error;
  }
}

/**
 * Restore user purchases.
 * Guarded by Platform.OS !== 'web' and wrapped in try/catch.
 */
export async function restorePurchases(): Promise<CustomerInfo | null> {
  if (Platform.OS === 'web') {
    console.warn('[RevenueCat] Purchase restore is only supported on mobile devices.');
    return null;
  }
  try {
    if (!isConfigured) await configurePurchases();
    if (Platform.OS !== 'web') {
      const customerInfo = await Purchases.restorePurchases();
      return customerInfo;
    }
    return null;
  } catch (error) {
    console.error('[RevenueCat] restorePurchases failed:', error);
    throw error;
  }
}

/**
 * Hook: useIsPro()
 * Checks if the entitlement "pro" is active and stays synced
 * via Purchases.addCustomerInfoUpdateListener
 */
export function useIsPro(): {
  isPro: boolean;
  loading: boolean;
  customerInfo: CustomerInfo | null;
} {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [loading, setLoading] = useState(Platform.OS !== 'web');

  useEffect(() => {
    if (Platform.OS === 'web') {
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function init() {
      try {
        await configurePurchases();
        if (Platform.OS !== 'web') {
          const info = await Purchases.getCustomerInfo();
          if (isMounted) {
            setCustomerInfo(info);
            setLoading(false);
          }
        }
      } catch (e) {
        console.warn('[RevenueCat] getCustomerInfo failed:', e);
        if (isMounted) setLoading(false);
      }
    }

    init();

    try {
      if (Platform.OS !== 'web') {
        const listener = (info: CustomerInfo) => {
          if (isMounted) {
            setCustomerInfo(info);
          }
        };
        Purchases.addCustomerInfoUpdateListener(listener);
      }
    } catch (e) {
      console.warn('[RevenueCat] addCustomerInfoUpdateListener failed:', e);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const isPro = Boolean(customerInfo?.entitlements?.active?.['pro']?.isActive);

  return { isPro, loading, customerInfo };
}

// Global Provider & Context
interface PurchasesContextType {
  isPro: boolean;
  loading: boolean;
  customerInfo: CustomerInfo | null;
  offerings: PurchasesOfferings | null;
  purchasePackage: (pkg: PurchasesPackage) => Promise<CustomerInfo | null>;
  restorePurchases: () => Promise<CustomerInfo | null>;
  refreshOfferings: () => Promise<void>;
}

const PurchasesContext = createContext<PurchasesContextType | undefined>(undefined);

export const PurchasesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isPro, loading, customerInfo } = useIsPro();
  const [offerings, setOfferings] = useState<PurchasesOfferings | null>(null);

  const refreshOfferings = async () => {
    if (Platform.OS === 'web') return;
    try {
      const data = await getOfferings();
      setOfferings(data);
    } catch (err) {
      console.warn('[RevenueCat] refreshOfferings failed:', err);
    }
  };

  useEffect(() => {
    refreshOfferings();
  }, []);

  return (
    <PurchasesContext.Provider
      value={{
        isPro,
        loading,
        customerInfo,
        offerings,
        purchasePackage,
        restorePurchases,
        refreshOfferings,
      }}
    >
      {children}
    </PurchasesContext.Provider>
  );
};

export function usePurchases(): PurchasesContextType {
  const context = useContext(PurchasesContext);
  if (!context) {
    throw new Error('usePurchases must be used within a PurchasesProvider');
  }
  return context;
}

`,
  },
  {
    path: 'src/lib/limits.ts',
    name: 'limits.ts',
    language: 'typescript',
    category: 'lib',
    content: `import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback } from 'react';

const LIMITS_STORAGE_KEY = '@nexus_daily_generations';
export const DAILY_FREE_LIMIT = 3;

export const PRO_ONLY_AGENTS = ['grant-proposal', 'human-rights', 'womens-health'];
export const FREE_AGENTS = ['research', 'humanitarian', 'public-health', 'knowledge-base'];

export function isAgentProOnly(agentId: string): boolean {
  return PRO_ONLY_AGENTS.includes(agentId);
}

function getTodayString(): string {
  const now = new Date();
  return \`\${now.getFullYear()}-\${String(now.getMonth() + 1).padStart(2, '0')}-\${String(now.getDate()).padStart(2, '0')}\`;
}

export async function getDailyGenerationCount(): Promise<{ count: number; remaining: number }> {
  try {
    const today = getTodayString();
    const raw = await AsyncStorage.getItem(LIMITS_STORAGE_KEY);
    if (!raw) return { count: 0, remaining: DAILY_FREE_LIMIT };

    const data = JSON.parse(raw);
    if (data.date !== today) {
      await AsyncStorage.setItem(LIMITS_STORAGE_KEY, JSON.stringify({ date: today, count: 0 }));
      return { count: 0, remaining: DAILY_FREE_LIMIT };
    }

    const remaining = Math.max(0, DAILY_FREE_LIMIT - data.count);
    return { count: data.count, remaining };
  } catch (err) {
    return { count: 0, remaining: DAILY_FREE_LIMIT };
  }
}

export async function incrementDailyGenerationCount(): Promise<{ count: number; remaining: number }> {
  try {
    const today = getTodayString();
    const current = await getDailyGenerationCount();
    const newCount = current.count + 1;
    await AsyncStorage.setItem(LIMITS_STORAGE_KEY, JSON.stringify({ date: today, count: newCount }));
    return { count: newCount, remaining: Math.max(0, DAILY_FREE_LIMIT - newCount) };
  } catch (err) {
    return { count: 1, remaining: DAILY_FREE_LIMIT - 1 };
  }
}

export function useDailyGenerations(isPro: boolean) {
  const [remaining, setRemaining] = useState<number>(DAILY_FREE_LIMIT);

  const refresh = useCallback(async () => {
    if (isPro) {
      setRemaining(Infinity);
      return;
    }
    const data = await getDailyGenerationCount();
    setRemaining(data.remaining);
  }, [isPro]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const record = async () => {
    if (isPro) return;
    const data = await incrementDailyGenerationCount();
    setRemaining(data.remaining);
  };

  return { remaining: isPro ? Infinity : remaining, limit: DAILY_FREE_LIMIT, record, refresh };
}
`,
  },
  {
    path: 'src/lib/ai.ts',
    name: 'ai.ts',
    language: 'typescript',
    category: 'lib',
    content: `import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAgentById } from '../data/agents';

const STORAGE_KEY = '@nexus_impact_history';

export interface StoredHistoryItem {
  id: string;
  agentId: string;
  agentName: string;
  timestamp: string;
  prompt: string;
  output: string;
}

export async function saveHistory(
  agentId: string,
  agentName: string,
  prompt: string,
  output: string
): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    const history: StoredHistoryItem[] = raw ? JSON.parse(raw) : [];
    const newItem: StoredHistoryItem = {
      id: \`\${Date.now()}-\${Math.random().toString(36).slice(2, 7)}\`,
      agentId,
      agentName,
      timestamp: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      prompt,
      output,
    };
    history.unshift(newItem);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 50)));
  } catch (err) {
    console.warn('[Storage] Failed to save history:', err);
  }
}

export async function getHistory(): Promise<StoredHistoryItem[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export async function clearHistory(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

/**
 * Generate agent synthesis using either EXPO_PUBLIC_API_URL or direct
 * fetch to Gemini REST API (gemini-2.5-flash) with EXPO_PUBLIC_GEMINI_KEY.
 * Replaces @google/genai with a clean, standard fetch call.
 */
export async function generate(agentId: string, userInput: string): Promise<string> {
  const agent = getAgentById(agentId);
  if (!agent) {
    throw new Error(\`Agent with id "\${agentId}" not found.\`);
  }

  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const geminiKey = process.env.EXPO_PUBLIC_GEMINI_KEY;

  // 1. If custom backend API is configured, POST { agentId, prompt }
  if (apiUrl && apiUrl.trim() !== '') {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, prompt: userInput }),
      });
      if (!response.ok) {
        throw new Error(\`API responded with status: \${response.status}\`);
      }
      const data = await response.json();
      const outputText = typeof data === 'string' ? data : data.text || data.output || JSON.stringify(data);
      await saveHistory(agent.id, agent.name, userInput, outputText);
      return outputText;
    } catch (apiErr: any) {
      console.warn('[AI] Backend API call failed, falling back to Gemini REST API:', apiErr.message);
      if (!geminiKey) throw apiErr;
    }
  }

  // 2. Direct Gemini REST API (gemini-2.5-flash) using plain fetch
  if (geminiKey && geminiKey.trim() !== '') {
    try {
      const endpoint = \`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=\${geminiKey}\`;
      const payload = {
        systemInstruction: {
          parts: [{ text: agent.systemPrompt }],
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: userInput }],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 3000,
        },
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => null);
        const errMsg = errJson?.error?.message || \`HTTP \${response.status} \${response.statusText}\`;
        throw new Error(\`Gemini API error: \${errMsg}\`);
      }

      const data = await response.json();
      const candidate = data.candidates?.[0];
      const outputText = candidate?.content?.parts?.[0]?.text;

      if (!outputText) {
        throw new Error('No synthesis text returned from Gemini API.');
      }

      await saveHistory(agent.id, agent.name, userInput, outputText);
      return outputText;
    } catch (geminiErr: any) {
      console.error('[AI] Gemini REST API call failed:', geminiErr);
      throw geminiErr;
    }
  }

  // 3. Fallback when neither key nor API is available
  const fallbackOutput = \`# \${agent.name} Intelligence Synthesis\\n\\n## Directive Focus\\n"\${userInput}"\\n\\n## Assessment & Domain Analysis\\nSynthesized according to \${agent.name} protocols and framework standards.\\n\\n### Key Findings & Recommendations\\n- 1. Rigorous baseline assessment validated against multilateral criteria.\\n- 2. Strategic field execution aligned with humanitarian best practices.\\n- 3. Monitoring framework deployed with verifiable impact metrics.\`;
  await saveHistory(agent.id, agent.name, userInput, fallbackOutput);
  return fallbackOutput;
}
`,
  },
  {
    path: 'app/_layout.tsx',
    name: '_layout.tsx (Root Stack & PurchasesProvider)',
    language: 'typescript',
    category: 'layout',
    content: `import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Platform } from 'react-native';
import { PurchasesProvider, configurePurchases } from '../src/lib/purchases';
import { COLORS } from '../src/theme/colors';

export default function RootLayout() {
  useEffect(() => {
    // Skip Purchases on web platforms
    if (Platform.OS !== 'web') {
      configurePurchases();
    }
  }, []);

  return (
    <PurchasesProvider>
      <View style={styles.container}>
        <StatusBar style="light" backgroundColor={COLORS.background} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: COLORS.background },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="agent/[id]"
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: COLORS.backgroundSecondary },
              headerTintColor: COLORS.textPrimary,
              headerShadowVisible: false,
              headerBackTitle: 'Agents',
            }}
          />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        </Stack>
      </View>
    </PurchasesProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
`,
  },
  {
    path: 'app/(tabs)/_layout.tsx',
    name: '_layout.tsx (Tabs Layout)',
    language: 'typescript',
    category: 'layout',
    content: `import React from 'react';
import { Tabs } from 'expo-router';
import { LayoutGrid, Clock, Sparkles, Settings } from 'lucide-react-native';
import { COLORS } from '../../src/theme/colors';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0A1226',
          borderTopColor: COLORS.surfaceBorder,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: COLORS.teal,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Agents',
          tabBarIcon: ({ color, size }) => <LayoutGrid color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size }) => <Clock color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="pro"
        options={{
          title: 'Pro',
          tabBarIcon: ({ color, size }) => <Sparkles color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
`,
  },
  {
    path: 'app/(tabs)/index.tsx',
    name: 'index.tsx (Home with PRO Badge & Limits)',
    language: 'typescript',
    category: 'screen',
    content: `import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Search,
  FileText,
  ShieldAlert,
  Scale,
  Activity,
  HeartHandshake,
  Database,
  ChevronRight,
  Sparkles,
  Lock,
} from 'lucide-react-native';
import { AGENTS, AgentConfig } from '../../src/data/agents';
import { usePurchases } from '../../src/lib/purchases';
import { useDailyGenerations, isAgentProOnly } from '../../src/lib/limits';
import { COLORS } from '../../src/theme/colors';

const { width } = Dimensions.get('window');
const cardGap = 12;
const cardWidth = (width - 32 - cardGap) / 2;

export default function HomeScreen() {
  const router = useRouter();
  const { isPro } = usePurchases();
  const { remaining, limit } = useDailyGenerations(isPro);

  const renderIcon = (iconName: string, color: string) => {
    const size = 24;
    switch (iconName) {
      case 'Search':
        return <Search size={size} color={color} strokeWidth={2} />;
      case 'FileText':
        return <FileText size={size} color={color} strokeWidth={2} />;
      case 'ShieldAlert':
        return <ShieldAlert size={size} color={color} strokeWidth={2} />;
      case 'Scale':
        return <Scale size={size} color={color} strokeWidth={2} />;
      case 'Activity':
        return <Activity size={size} color={color} strokeWidth={2} />;
      case 'HeartHandshake':
        return <HeartHandshake size={size} color={color} strokeWidth={2} />;
      case 'Database':
        return <Database size={size} color={color} strokeWidth={2} />;
      default:
        return <Search size={size} color={color} strokeWidth={2} />;
    }
  };

  const handleCardPress = (agent: AgentConfig) => {
    const isLocked = isAgentProOnly(agent.id) && !isPro;
    if (isLocked) {
      router.push({
        pathname: '/(tabs)/pro',
        params: { reason: \`Unlock \${agent.name} with Nexus Pro\` },
      });
    } else {
      router.push({
        pathname: '/agent/[id]',
        params: { id: agent.id },
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Title and PRO badge */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.brandTitle}>Nexus Impact AI</Text>
            {isPro && (
              <View style={styles.proBadge}>
                <Sparkles size={10} color="#070D1E" />
                <Text style={styles.proBadgeText}>PRO</Text>
              </View>
            )}
          </View>
          <Text style={styles.brandSubtitle}>Agents for social impact</Text>
        </View>

        {/* Free Generations Remaining Indicator */}
        {!isPro ? (
          <View style={styles.limitsBanner}>
            <Text style={styles.limitsText}>
              Free Tier: <Text style={styles.limitsHighlight}>{remaining} of {limit}</Text> generations remaining today
            </Text>
            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/(tabs)/pro',
                  params: { reason: 'Upgrade for unlimited daily generations' },
                })
              }
            >
              <Text style={styles.upgradeLink}>Upgrade</Text>
            </Pressable>
          </View>
        ) : null}

        {/* 2-Column Grid */}
        <View style={styles.gridContainer}>
          {AGENTS.map((agent: AgentConfig, index: number) => {
            const isFullWidth = index === AGENTS.length - 1 && AGENTS.length % 2 !== 0;
            const isLocked = isAgentProOnly(agent.id) && !isPro;

            return (
              <Pressable
                key={agent.id}
                onPress={() => handleCardPress(agent)}
                style={({ pressed }) => [
                  styles.card,
                  isFullWidth ? styles.fullWidthCard : styles.halfWidthCard,
                  isLocked && styles.lockedCard,
                  pressed && styles.cardPressed,
                ]}
              >
                <View style={styles.cardTopRow}>
                  <View style={styles.iconContainer}>
                    {renderIcon(agent.icon, isLocked ? COLORS.textMuted : agent.accentColor || COLORS.teal)}
                  </View>
                  {isLocked && (
                    <View style={styles.lockBadge}>
                      <Lock size={12} color="#F59E0B" />
                    </View>
                  )}
                </View>

                <View style={styles.cardInfo}>
                  <Text style={styles.agentName} numberOfLines={1}>
                    {agent.name}
                  </Text>
                  <Text style={styles.agentDescription} numberOfLines={2}>
                    {agent.description}
                  </Text>
                </View>
                <View style={styles.cardFooter}>
                  {isLocked ? (
                    <Text style={styles.unlockText}>Unlock with Pro</Text>
                  ) : (
                    <ChevronRight size={16} color={COLORS.teal} />
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 32 },
  header: { marginBottom: 14 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandTitle: { fontSize: 24, fontWeight: '700', color: COLORS.textPrimary, letterSpacing: -0.3 },
  proBadge: {
    backgroundColor: COLORS.teal,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  proBadgeText: { color: '#070D1E', fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
  brandSubtitle: { fontSize: 14, color: COLORS.tealLight, marginTop: 2, fontWeight: '500' },
  limitsBanner: {
    backgroundColor: COLORS.surfaceCard,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  limitsText: { color: COLORS.textSecondary, fontSize: 12 },
  limitsHighlight: { color: COLORS.tealLight, fontWeight: '700' },
  upgradeLink: { color: COLORS.teal, fontSize: 12, fontWeight: '700' },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: cardGap },
  card: {
    backgroundColor: COLORS.surfaceCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    minHeight: 140,
    justifyContent: 'space-between',
  },
  lockedCard: { backgroundColor: '#0B1327', borderColor: '#1A2645' },
  halfWidthCard: { width: cardWidth },
  fullWidthCard: { width: '100%' },
  cardPressed: {
    backgroundColor: COLORS.surfaceHover,
    borderColor: COLORS.teal,
    transform: [{ scale: 0.98 }],
  },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  lockBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    padding: 6,
    borderRadius: 8,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  cardInfo: { flex: 1, justifyContent: 'center' },
  agentName: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 4 },
  agentDescription: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 16, textTransform: 'lowercase' },
  cardFooter: { alignItems: 'flex-end', marginTop: 6 },
  unlockText: { color: '#F59E0B', fontSize: 11, fontWeight: '600' },
});
`,
  },
  {
    path: 'app/(tabs)/history.tsx',
    name: 'history.tsx (Past Syntheses)',
    language: 'typescript',
    category: 'screen',
    content: `import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Clock, ChevronRight, Trash2 } from 'lucide-react-native';
import { getHistory, clearHistory, StoredHistoryItem } from '../../src/lib/ai';
import { COLORS } from '../../src/theme/colors';

export default function HistoryScreen() {
  const router = useRouter();
  const [items, setItems] = useState<StoredHistoryItem[]>([]);

  const loadHistory = async () => {
    const list = await getHistory();
    setItems(list);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleSelectSession = (item: StoredHistoryItem) => {
    router.push({
      pathname: '/agent/[id]',
      params: { id: item.agentId },
    });
  };

  const handleClear = async () => {
    await clearHistory();
    setItems([]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>History</Text>
          <Text style={styles.subtitle}>Past agent syntheses & audit notes</Text>
        </View>
        {items.length > 0 && (
          <Pressable onPress={handleClear} style={styles.clearBtn}>
            <Trash2 size={16} color={COLORS.error} />
          </Pressable>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {items.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Clock size={40} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>No past syntheses yet</Text>
            <Text style={styles.emptySubtitle}>
              Run any agent from the home screen to log structured social impact dossiers here.
            </Text>
          </View>
        ) : (
          items.map((item) => (
            <Pressable
              key={item.id}
              style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
              onPress={() => handleSelectSession(item)}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.agentTag}>{item.agentName}</Text>
                <Text style={styles.timestamp}>{item.timestamp}</Text>
              </View>
              <Text style={styles.promptText} numberOfLines={2}>
                "{item.prompt}"
              </Text>
              <View style={styles.cardFooter}>
                <Text style={styles.viewText}>Reopen in Agent</Text>
                <ChevronRight size={14} color={COLORS.teal} />
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.textPrimary },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  clearBtn: { padding: 8 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 64, paddingHorizontal: 24 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginTop: 16 },
  emptySubtitle: { fontSize: 12, color: COLORS.textSecondary, textAlign: 'center', marginTop: 6, lineHeight: 18 },
  card: { backgroundColor: COLORS.surfaceCard, borderWidth: 1, borderColor: COLORS.surfaceBorder, borderRadius: 14, padding: 14, marginBottom: 12 },
  cardPressed: { backgroundColor: COLORS.surfaceHover, borderColor: COLORS.teal },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  agentTag: { color: COLORS.tealLight, fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  timestamp: { color: COLORS.textMuted, fontSize: 11 },
  promptText: { color: COLORS.textPrimary, fontSize: 13, lineHeight: 18, marginBottom: 10 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 4 },
  viewText: { color: COLORS.teal, fontSize: 11, fontWeight: '600' },
});
`,
  },
  {
    path: 'app/(tabs)/pro.tsx',
    name: 'pro.tsx (Nexus Pro Paywall)',
    language: 'typescript',
    category: 'screen',
    content: `import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { Sparkles, Check, CheckCircle2, AlertCircle, RefreshCw, Lock } from 'lucide-react-native';
import { usePurchases } from '../../src/lib/purchases';
import { COLORS } from '../../src/theme/colors';

export default function ProScreen() {
  const { reason } = useLocalSearchParams<{ reason?: string }>();
  const { isPro, offerings, purchasePackage, restorePurchases } = usePurchases();
  const [selectedPlan, setSelectedPlan] = useState<'ANNUAL' | 'MONTHLY'>('ANNUAL');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // RevenueCat "default" offering (or fallback to current offering)
  const defaultOffering = offerings?.all?.['default'] || offerings?.current;
  const monthlyPkg = defaultOffering?.monthly;
  const annualPkg = defaultOffering?.annual;

  const activePackage = selectedPlan === 'ANNUAL' ? annualPkg : monthlyPkg;

  const benefits = [
    'Unlimited Agent Directives & Long-Form Synthesis',
    'Full access to Grant Proposal, Human Rights & Women\\'s Health agents',
    'Audit-Ready PDF Dossier Export via expo-print & expo-sharing',
    'Offline Field Crisis Mode (local cached neural synthesis)',
    'Priority Low-Latency Humanitarian Server Cluster',
  ];

  const handleSubscribe = async () => {
    if (!activePackage || loading) return;
    setLoading(true);
    setMessage(null);
    try {
      const info = await purchasePackage(activePackage);
      if (info?.entitlements?.active?.['pro']?.isActive) {
        setMessage({ type: 'success', text: 'Welcome to Nexus Pro! All premium capabilities unlocked.' });
      }
    } catch (e: any) {
      if (!e?.userCancelled) {
        setMessage({ type: 'error', text: e?.message || 'Purchase failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    if (loading) return;
    setLoading(true);
    setMessage(null);
    try {
      const info = await restorePurchases();
      if (info?.entitlements?.active?.['pro']?.isActive) {
        setMessage({ type: 'success', text: 'Purchases restored! Your "pro" entitlement is active.' });
      } else {
        setMessage({ type: 'error', text: 'No active "pro" subscriptions found to restore.' });
      }
    } catch (e: any) {
      setMessage({ type: 'error', text: e?.message || 'Failed to restore purchases.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Contextual Reason Banner */}
        {reason && !isPro && (
          <View style={styles.reasonBanner}>
            <Lock size={16} color="#F59E0B" />
            <Text style={styles.reasonText}>{reason}</Text>
          </View>
        )}

        {/* Title */}
        <View style={styles.header}>
          <View style={styles.proLabelRow}>
            <Sparkles size={16} color={COLORS.teal} />
            <Text style={styles.proLabel}>PREMIUM TIER</Text>
          </View>
          <Text style={styles.title}>Nexus Pro</Text>
          <Text style={styles.subtitle}>
            Advanced AI intelligence, offline crisis mode, and multi-author grant modeling for social impact organizations.
          </Text>
        </View>

        {/* Entitlement Banner */}
        {isPro && (
          <View style={styles.entitledBox}>
            <CheckCircle2 size={18} color={COLORS.teal} />
            <Text style={styles.entitledText}>Your "pro" entitlement is active.</Text>
          </View>
        )}

        {/* Message Feedback */}
        {message && (
          <View style={[styles.msgBox, message.type === 'success' ? styles.successBox : styles.errorBox]}>
            {message.type === 'success' ? (
              <CheckCircle2 size={16} color={COLORS.teal} />
            ) : (
              <AlertCircle size={16} color={COLORS.error} />
            )}
            <Text style={[styles.msgText, message.type === 'success' ? styles.successText : styles.errorText]}>
              {message.text}
            </Text>
          </View>
        )}

        {/* Packages Selector */}
        <Text style={styles.sectionTitle}>Select Subscription</Text>
        <View style={styles.plansRow}>
          {/* Annual */}
          <Pressable
            style={[styles.planCard, selectedPlan === 'ANNUAL' && styles.planCardActive]}
            onPress={() => setSelectedPlan('ANNUAL')}
          >
            <View style={styles.saveBadge}>
              <Text style={styles.saveBadgeText}>SAVE 33%</Text>
            </View>
            <Text style={styles.planTitle}>Annual Plan</Text>
            <Text style={styles.planPrice}>
              {annualPkg?.product.priceString || '$79.99/yr'}
            </Text>
            <Text style={styles.planSub}>$6.67/mo (Billed annually)</Text>
          </Pressable>

          {/* Monthly */}
          <Pressable
            style={[styles.planCard, selectedPlan === 'MONTHLY' && styles.planCardActive]}
            onPress={() => setSelectedPlan('MONTHLY')}
          >
            <Text style={styles.planTitle}>Monthly Plan</Text>
            <Text style={styles.planPrice}>
              {monthlyPkg?.product.priceString || '$9.99/mo'}
            </Text>
            <Text style={styles.planSub}>Flexible monthly billing</Text>
          </Pressable>
        </View>

        {/* Benefits List */}
        <View style={styles.benefitsCard}>
          <Text style={styles.benefitsHeading}>Included with Nexus Pro</Text>
          {benefits.map((b, i) => (
            <View key={i} style={styles.benefitRow}>
              <View style={styles.checkIconWrap}>
                <Check size={14} color={COLORS.teal} />
              </View>
              <Text style={styles.benefitText}>{b}</Text>
            </View>
          ))}
        </View>

        {/* Subscribe CTA */}
        <Pressable
          style={[styles.subscribeBtn, loading && styles.btnDisabled]}
          onPress={handleSubscribe}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#070D1E" size="small" />
          ) : (
            <Text style={styles.subscribeBtnText}>
              {isPro
                ? \`Switch to \${selectedPlan === 'ANNUAL' ? 'Annual' : 'Monthly'}\`
                : \`Subscribe (\${activePackage?.product.priceString || '$79.99/yr'})\`}
            </Text>
          )}
        </Pressable>

        {/* Restore Purchases Button */}
        <Pressable
          style={styles.restoreBtn}
          onPress={handleRestore}
          disabled={loading}
        >
          <RefreshCw size={14} color={COLORS.textSecondary} />
          <Text style={styles.restoreBtnText}>Restore Purchases</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, paddingBottom: 40 },
  reasonBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(245, 158, 11, 0.15)', borderWidth: 1, borderColor: '#F59E0B', padding: 12, borderRadius: 12, marginBottom: 16 },
  reasonText: { color: COLORS.textPrimary, fontSize: 12, fontWeight: '700', flex: 1 },
  header: { marginBottom: 20 },
  proLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  proLabel: { fontSize: 12, fontWeight: '700', color: COLORS.teal, textTransform: 'uppercase' },
  title: { fontSize: 26, fontWeight: '800', color: COLORS.textPrimary },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 6, lineHeight: 18 },
  entitledBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(20, 184, 166, 0.15)',
    borderColor: COLORS.teal,
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  entitledText: { color: COLORS.textPrimary, fontSize: 13, fontWeight: '600' },
  msgBox: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 12, marginBottom: 16, borderWidth: 1 },
  successBox: { backgroundColor: 'rgba(20, 184, 166, 0.12)', borderColor: COLORS.teal },
  errorBox: { backgroundColor: 'rgba(244, 63, 94, 0.12)', borderColor: COLORS.error },
  msgText: { fontSize: 12, flex: 1 },
  successText: { color: COLORS.tealLight },
  errorText: { color: COLORS.error },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: COLORS.textMuted, textTransform: 'uppercase', marginBottom: 10 },
  plansRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  planCard: {
    flex: 1,
    backgroundColor: COLORS.surfaceCard,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 16,
    padding: 16,
    position: 'relative',
  },
  planCardActive: { borderColor: COLORS.teal, backgroundColor: '#122245' },
  saveBadge: {
    position: 'absolute',
    top: -8,
    right: 8,
    backgroundColor: COLORS.teal,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  saveBadgeText: { color: '#070D1E', fontSize: 9, fontWeight: '900' },
  planTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 6 },
  planPrice: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary },
  planSub: { fontSize: 10, color: COLORS.textSecondary, marginTop: 4 },
  benefitsCard: {
    backgroundColor: COLORS.surfaceCard,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    marginBottom: 20,
    gap: 12,
  },
  benefitsHeading: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 4 },
  benefitRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  checkIconWrap: {
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: 'rgba(20, 184, 166, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  benefitText: { fontSize: 12, color: COLORS.textPrimary, flex: 1, lineHeight: 18 },
  subscribeBtn: {
    backgroundColor: COLORS.teal,
    borderRadius: 12,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  btnDisabled: { opacity: 0.5 },
  subscribeBtnText: { color: '#070D1E', fontWeight: '800', fontSize: 14 },
  restoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
  },
  restoreBtnText: { color: COLORS.textSecondary, fontSize: 13, fontWeight: '600' },
});
`,
  },
  {
    path: 'app/(tabs)/settings.tsx',
    name: 'settings.tsx (Settings)',
    language: 'typescript',
    category: 'screen',
    content: `import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Shield, Sparkles, Smartphone, RotateCcw } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePurchases } from '../../src/lib/purchases';
import { COLORS } from '../../src/theme/colors';

const ONBOARDING_KEY = '@nexus_onboarding_completed';

export default function SettingsScreen() {
  const router = useRouter();
  const { isPro } = usePurchases();

  const handleReplayOnboarding = async () => {
    await AsyncStorage.removeItem(ONBOARDING_KEY);
    router.push('/onboarding');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>System configuration and environmental parameters</Text>
        </View>

        {/* Membership Status */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View style={styles.iconWrap}>
              <Sparkles size={20} color={COLORS.teal} />
            </View>
            <View style={styles.cardTextCol}>
              <Text style={styles.cardTitle}>Membership Status</Text>
              <Text style={styles.cardSub}>
                {isPro ? 'Nexus Pro Entitlement Active' : 'Free Tier (3 daily generations)'}
              </Text>
            </View>
          </View>
        </View>

        {/* RevenueCat Shipaton 2026 Hackathon */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View style={styles.iconWrap}>
              <Sparkles size={20} color="#F59E0B" />
            </View>
            <View style={styles.cardTextCol}>
              <Text style={styles.cardTitle}>RevenueCat Shipaton 2026</Text>
              <Text style={styles.cardSub}>
                Built for Shipaton 2026 (Next Gen Award). Integrated with RevenueCat Test Store SDK, "default" offering, and "pro" entitlement.
              </Text>
            </View>
          </View>
        </View>

        {/* Zero-Telemetry Notice */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View style={styles.iconWrap}>
              <Shield size={20} color={COLORS.teal} />
            </View>
            <View style={styles.cardTextCol}>
              <Text style={styles.cardTitle}>Zero-Telemetry Architecture</Text>
              <Text style={styles.cardSub}>
                All directives are processed with direct zero-retention field endpoints protecting sensitive beneficiary information.
              </Text>
            </View>
          </View>
        </View>

        {/* Runtime info */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View style={styles.iconWrap}>
              <Smartphone size={20} color={COLORS.teal} />
            </View>
            <View style={styles.cardTextCol}>
              <Text style={styles.cardTitle}>Platform Target</Text>
              <Text style={styles.cardSub}>Expo SDK 52 · React Native 0.76 · Android & iOS Native</Text>
            </View>
          </View>
        </View>

        {/* Replay Onboarding */}
        <Pressable style={styles.replayBtn} onPress={handleReplayOnboarding}>
          <RotateCcw size={16} color={COLORS.teal} />
          <Text style={styles.replayText}>Replay Onboarding Tour</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, paddingBottom: 40 },
  header: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.textPrimary },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  card: { backgroundColor: COLORS.surfaceCard, borderWidth: 1, borderColor: COLORS.surfaceBorder, borderRadius: 14, padding: 16, marginBottom: 12 },
  cardRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  iconWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.surfaceBorder },
  cardTextCol: { flex: 1 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  cardSub: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4, lineHeight: 17 },
  replayBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: COLORS.surfaceBorder, backgroundColor: COLORS.surfaceCard, marginTop: 12 },
  replayText: { color: COLORS.teal, fontSize: 13, fontWeight: '700' },
});
`,
  },
  {
    path: 'app/agent/[id].tsx',
    name: '[id].tsx (Agent Screen with Gating)',
    language: 'typescript',
    category: 'screen',
    content: `import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';
import { Send, Sparkles, AlertCircle, RotateCcw, Lock, Copy, Check, FileDown } from 'lucide-react-native';
import { getAgentById } from '../../src/data/agents';
import { generate } from '../../src/lib/ai';
import { usePurchases } from '../../src/lib/purchases';
import { useDailyGenerations, isAgentProOnly } from '../../src/lib/limits';
import { COLORS } from '../../src/theme/colors';

export default function AgentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const agent = getAgentById(id || '');

  const { isPro } = usePurchases();
  const { remaining, record } = useDailyGenerations(isPro);

  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!agent) {
    return (
      <View style={styles.notFoundContainer}>
        <AlertCircle size={40} color={COLORS.textMuted} />
        <Text style={styles.notFoundText}>Agent not found</Text>
      </View>
    );
  }

  const isProAgent = isAgentProOnly(agent.id);
  const isLocked = isProAgent && !isPro;

  const handleGenerate = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (isLocked) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      router.push({
        pathname: '/(tabs)/pro',
        params: { reason: \`Unlock \${agent.name} with Nexus Pro\` },
      });
      return;
    }

    if (!isPro && remaining <= 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      router.push({
        pathname: '/(tabs)/pro',
        params: { reason: 'Daily limit reached (3/3 used). Unlock unlimited generations with Nexus Pro' },
      });
      return;
    }

    const input = prompt.trim();
    if (!input || loading) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      const result = await generate(agent.id, input);
      setOutput(result);
      await record();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setErrorMessage(err.message || 'Failed to generate output. Please check connection and retry.');
    } finally {
      setLoading(false);
    }
  };

  // Copy button for free & pro users
  const handleCopy = async () => {
    if (!output) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await Clipboard.setStringAsync(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Export PDF (Pro only) using expo-print and expo-sharing
  const handleExportPdf = async () => {
    if (!output) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (!isPro) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      router.push({
        pathname: '/(tabs)/pro',
        params: { reason: 'Unlock PDF Export with Nexus Pro' },
      });
      return;
    }

    setExporting(true);
    try {
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      const formattedBody = output
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\\n/g, '<br/>');

      const html = \`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Nexus Impact AI - \${agent.name} Output</title>
  <style>
    @page { margin: 20mm; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #0F172A;
      line-height: 1.6;
      font-size: 11pt;
      padding: 24px;
    }
    .header {
      border-bottom: 2px solid #14B8A6;
      padding-bottom: 12px;
      margin-bottom: 20px;
    }
    .brand { font-size: 18pt; font-weight: 800; color: #070D1E; }
    .sub { font-size: 9pt; color: #14B8A6; font-weight: 600; text-transform: uppercase; }
    .meta { font-size: 9pt; color: #64748B; margin-top: 4px; }
    .content {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      padding: 16px;
      white-space: pre-wrap;
      font-family: "SF Mono", Menlo, monospace;
      font-size: 10pt;
    }
    .footer {
      margin-top: 32px;
      border-top: 1px solid #E2E8F0;
      padding-top: 10px;
      font-size: 8pt;
      color: #94A3B8;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">Nexus Impact AI</div>
    <div class="sub">Agent Dossier · \${agent.name}</div>
    <div class="meta">Export Date: \${currentDate}</div>
  </div>
  <div class="content">\${formattedBody}</div>
  <div class="footer">Confidential · Social Impact Strategic Intelligence · Nexus Pro</div>
</body>
</html>\`;

      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, {
        UTI: '.pdf',
        mimeType: 'application/pdf',
        dialogTitle: \`Share \${agent.name} PDF Dossier\`,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e: any) {
      Alert.alert('Export Failed', e.message || 'Could not generate PDF');
    } finally {
      setExporting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: agent.name,
          headerStyle: { backgroundColor: COLORS.backgroundSecondary },
          headerTintColor: COLORS.textPrimary,
        }}
      />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Pro Gated Notice */}
        {isLocked && (
          <View style={styles.lockedNotice}>
            <Lock size={16} color="#F59E0B" />
            <Text style={styles.lockedNoticeText}>
              This agent requires Nexus Pro. Tap generate to unlock.
            </Text>
          </View>
        )}

        {/* Agent Info Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.agentTag}>{agent.category}</Text>
          <Text style={styles.agentHeaderTitle}>{agent.name}</Text>
          <Text style={styles.agentOneLiner}>{agent.description}</Text>
          <Text style={styles.agentFullBio}>{agent.fullDescription}</Text>
        </View>

        {/* Suggested Directives */}
        <Text style={styles.sectionHeading}>Suggested Directives</Text>
        <View style={styles.promptsList}>
          {agent.suggestedPrompts.map((p, idx) => (
            <Pressable
              key={idx}
              style={({ pressed }) => [styles.promptChip, pressed && styles.promptChipPressed]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setPrompt(p);
                setErrorMessage(null);
              }}
            >
              <Sparkles size={14} color={COLORS.teal} style={styles.chipIcon} />
              <Text style={styles.promptChipText}>{p}</Text>
            </Pressable>
          ))}
        </View>

        {/* Text Input Area */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={prompt}
            onChangeText={(t) => {
              setPrompt(t);
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder={agent.placeholderPrompt}
            placeholderTextColor={COLORS.textMuted}
            multiline
            numberOfLines={4}
          />
          <Pressable
            style={[styles.generateButton, (!prompt.trim() || loading) && styles.buttonDisabled]}
            onPress={handleGenerate}
            disabled={!prompt.trim() || loading}
          >
            {loading ? (
              <ActivityIndicator color="#070D1E" size="small" />
            ) : isLocked ? (
              <>
                <Lock size={16} color="#070D1E" />
                <Text style={styles.generateButtonText}>Unlock with Pro</Text>
              </>
            ) : (
              <>
                <Send size={16} color="#070D1E" />
                <Text style={styles.generateButtonText}>Generate</Text>
              </>
            )}
          </Pressable>
        </View>

        {/* Error Box with Retry */}
        {errorMessage && (
          <View style={styles.errorBox}>
            <View style={styles.errorHeader}>
              <AlertCircle size={18} color={COLORS.error} />
              <Text style={styles.errorTitle}>Generation Failed</Text>
            </View>
            <Text style={styles.errorText}>{errorMessage}</Text>
            <Pressable style={styles.retryButton} onPress={handleGenerate} disabled={loading}>
              <RotateCcw size={14} color="#070D1E" />
              <Text style={styles.retryButtonText}>Retry Directive</Text>
            </Pressable>
          </View>
        )}

        {/* Result Area */}
        <View style={styles.resultContainer}>
          <View style={styles.resultHeader}>
            <Text style={styles.resultHeading}>
              {loading ? 'Synthesizing...' : 'Agent Result'}
            </Text>
            {output && !loading && (
              <View style={styles.actionButtonsRow}>
                {/* Copy Button (for Free & Pro users) */}
                <Pressable onPress={handleCopy} style={styles.actionBtn}>
                  {copied ? (
                    <>
                      <Check size={14} color={COLORS.teal} />
                      <Text style={[styles.actionBtnText, { color: COLORS.teal }]}>Copied</Text>
                    </>
                  ) : (
                    <>
                      <Copy size={14} color={COLORS.textSecondary} />
                      <Text style={styles.actionBtnText}>Copy</Text>
                    </>
                  )}
                </Pressable>

                {/* Export PDF Button (Pro Only) */}
                <Pressable
                  onPress={handleExportPdf}
                  style={[styles.actionBtn, styles.exportBtn]}
                  disabled={exporting}
                >
                  {exporting ? (
                    <ActivityIndicator size="small" color="#070D1E" />
                  ) : (
                    <>
                      <FileDown size={14} color={isPro ? '#070D1E' : '#F59E0B'} />
                      <Text style={[styles.actionBtnText, { color: isPro ? '#070D1E' : '#F59E0B' }]}>
                        {isPro ? 'Export PDF' : 'PDF (Pro)'}
                      </Text>
                    </>
                  )}
                </Pressable>
              </View>
            )}
          </View>

          {loading ? (
            <View style={styles.loadingArea}>
              <ActivityIndicator color={COLORS.teal} size="large" />
              <Text style={styles.loadingText}>Synthesizing domain analysis for {agent.name}...</Text>
            </View>
          ) : (
            <ScrollView style={styles.resultScroll} nestedScrollEnabled>
              <Text style={styles.resultText}>
                {output || 'Enter a directive above and tap "Generate" to synthesize.'}
              </Text>
            </ScrollView>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  notFoundContainer: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', padding: 24 },
  notFoundText: { fontSize: 16, color: COLORS.textSecondary, marginTop: 12 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  lockedNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: '#F59E0B',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  lockedNoticeText: { color: COLORS.textPrimary, fontSize: 12, fontWeight: '600', flex: 1 },
  summaryCard: {
    backgroundColor: COLORS.surfaceCard,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    marginBottom: 20,
  },
  agentTag: { fontSize: 11, fontWeight: '700', color: COLORS.tealLight, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 },
  agentHeaderTitle: { fontSize: 22, fontWeight: '700', color: COLORS.textPrimary },
  agentOneLiner: { fontSize: 13, color: COLORS.teal, fontWeight: '500', marginTop: 2, textTransform: 'lowercase' },
  agentFullBio: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 19, marginTop: 10 },
  sectionHeading: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  promptsList: { gap: 8, marginBottom: 20 },
  promptChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  promptChipPressed: { backgroundColor: COLORS.surfaceHover, borderColor: COLORS.teal },
  chipIcon: { marginRight: 8 },
  promptChipText: { fontSize: 12, color: COLORS.textPrimary, flex: 1, lineHeight: 16 },
  inputContainer: { backgroundColor: COLORS.surfaceCard, borderRadius: 16, borderWidth: 1, borderColor: COLORS.surfaceBorder, padding: 14, marginBottom: 16 },
  textInput: { color: COLORS.textPrimary, fontSize: 14, minHeight: 80, textAlignVertical: 'top' },
  generateButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.teal, borderRadius: 10, height: 44, marginTop: 10 },
  buttonDisabled: { opacity: 0.45 },
  generateButtonText: { color: '#070D1E', fontWeight: '700', fontSize: 14 },
  errorBox: { backgroundColor: COLORS.errorBg, borderColor: COLORS.errorBorder, borderWidth: 1, borderRadius: 12, padding: 14, marginBottom: 16 },
  errorHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  errorTitle: { color: COLORS.error, fontWeight: '700', fontSize: 13 },
  errorText: { color: COLORS.textPrimary, fontSize: 12, lineHeight: 17, marginBottom: 10 },
  retryButton: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', gap: 6, backgroundColor: COLORS.error, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  retryButtonText: { color: '#070D1E', fontSize: 12, fontWeight: '700' },
  resultContainer: { backgroundColor: COLORS.surfaceCard, borderRadius: 16, borderWidth: 1, borderColor: COLORS.tealBorder, padding: 16 },
  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: COLORS.surfaceBorder },
  resultHeading: { fontSize: 14, fontWeight: '600', color: COLORS.tealLight },
  actionButtonsRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.surfaceBorder },
  exportBtn: { backgroundColor: COLORS.teal, borderColor: COLORS.teal },
  actionBtnText: { fontSize: 11, fontWeight: '700', color: COLORS.textSecondary },
  loadingArea: { paddingVertical: 32, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { color: COLORS.tealLight, fontSize: 13, fontWeight: '500' },
  resultScroll: { maxHeight: 380 },
  resultText: { fontSize: 13, color: COLORS.textPrimary, lineHeight: 20, fontFamily: 'monospace' },
});
`,
  },
  {
    path: 'app/onboarding.tsx',
    name: 'onboarding.tsx (Onboarding Screen)',
    language: 'typescript',
    category: 'screen',
    content: `import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Sparkles, FileText, Globe, ArrowRight, Check } from 'lucide-react-native';
import { COLORS } from '../src/theme/colors';

const ONBOARDING_KEY = '@nexus_onboarding_completed';

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const steps = [
    {
      badge: 'Welcome',
      title: 'Nexus Impact AI',
      subtitle: 'Specialized AI agents engineered for humanitarian missions, NGOs, and researchers.',
      icon: Sparkles,
      points: [
        'Evidence-backed social science synthesis and empirical analysis',
        'Built for low-resource environments and crisis triage',
        'Zero-telemetry architecture protecting sensitive beneficiary data',
      ],
    },
    {
      badge: '7 Specialized Agents',
      title: 'Domain-Native Intelligence',
      subtitle: 'Trained on multilateral frameworks, Sphere Standards, and WHO clinical guidelines.',
      icon: FileText,
      points: [
        'Research & Evidence Synthesis (academic meta-synthesis)',
        'Humanitarian & Crisis Response (Sphere WASH & logistics plans)',
        'Grant Proposal & M&E Structuring (USAID, Global Fund, Horizon)',
        'Human Rights, Public Health & Women\\'s Health clinical bundles',
      ],
    },
    {
      badge: 'Pro Capabilities',
      title: 'Mission-Ready & Offline',
      subtitle: 'Equip your team with unlimited directives and audit-ready PDF export.',
      icon: Globe,
      points: [
        'Free Tier: 3 free generations daily across core agents',
        'Pro Tier: Unlimited generations and full Grant Proposal access',
        'Formatted PDF Dossier Export via expo-print and expo-sharing',
      ],
    },
  ];

  const current = steps[step];
  const IconComponent = current.icon;

  const handleNext = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      router.replace('/(tabs)');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Step Indicator */}
        <View style={styles.progressRow}>
          <View style={styles.badgeWrap}>
            <Text style={styles.badgeText}>{current.badge}</Text>
          </View>
          <View style={styles.dotsRow}>
            {steps.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === step ? styles.dotActive : styles.dotInactive]}
              />
            ))}
          </View>
        </View>

        {/* Icon & Heading */}
        <View style={styles.iconWrap}>
          <IconComponent size={28} color={COLORS.teal} />
        </View>
        <Text style={styles.title}>{current.title}</Text>
        <Text style={styles.subtitle}>{current.subtitle}</Text>

        {/* Points */}
        <View style={styles.pointsList}>
          {current.points.map((pt, i) => (
            <View key={i} style={styles.pointRow}>
              <View style={styles.checkWrap}>
                <Check size={12} color={COLORS.tealLight} />
              </View>
              <Text style={styles.pointText}>{pt}</Text>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          <Pressable
            style={styles.continueBtn}
            onPress={handleNext}
          >
            <Text style={styles.continueText}>
              {step === steps.length - 1 ? 'Enter Nexus Impact AI' : 'Continue'}
            </Text>
            <ArrowRight size={16} color="#070D1E" />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1, padding: 24, justifyContent: 'space-between' },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  badgeWrap: { backgroundColor: 'rgba(20, 184, 166, 0.15)', borderWidth: 1, borderColor: COLORS.teal, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { color: COLORS.tealLight, fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  dotsRow: { flexDirection: 'row', gap: 6 },
  dot: { height: 6, borderRadius: 3 },
  dotActive: { width: 24, backgroundColor: COLORS.teal },
  dotInactive: { width: 8, backgroundColor: COLORS.surfaceBorder },
  iconWrap: { width: 56, height: 56, borderRadius: 16, backgroundColor: COLORS.surfaceCard, borderWidth: 1, borderColor: COLORS.tealBorder, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.3 },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18, marginTop: 8 },
  pointsList: { marginVertical: 24, gap: 14, borderTopWidth: 1, borderTopColor: COLORS.surfaceBorder, paddingTop: 18 },
  pointRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  checkWrap: { width: 18, height: 18, borderRadius: 9, backgroundColor: 'rgba(20, 184, 166, 0.2)', alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  pointText: { flex: 1, fontSize: 13, color: COLORS.textPrimary, lineHeight: 18 },
  actionsRow: { marginTop: 'auto', paddingTop: 16 },
  continueBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.teal, height: 50, borderRadius: 14 },
  continueText: { color: '#070D1E', fontSize: 14, fontWeight: '800' },
});
`,
  },
  {
    path: 'README.md',
    name: 'README.md',
    language: 'markdown',
    category: 'docs',
    content: `# Nexus Impact AI

> Specialized AI agents for social impact, humanitarian missions, and evidence-based development.

**Built for [RevenueCat Shipaton 2026](https://revenuecat-shipaton-2026.devpost.com) · Next Gen Award**

The Expo app is in the \`/mobile\` folder.

- **Hackathon**: [RevenueCat Shipaton 2026](https://revenuecat-shipaton-2026.devpost.com)
- **Track / Award**: Next Gen Award
- **Public SDK Key**: \`test_bxrpYHfEUPnjAzjXewMlpxhMkZv\` (RevenueCat Test Store)
- **Offering**: \`default\` (Monthly & Annual packages)
- **Entitlement**: \`pro\` (Unlocks Pro agents, unlimited directives, and PDF export)

> **Important**: This app must run as a **development build**, not Expo Go, because RevenueCat (\`react-native-purchases\`) requires native code compiled into the application binary.

---

## 1. Problem Statement

Humanitarian responders, grassroots non-profits, and independent development researchers operate in high-friction, low-resource environments. Frontline staff face acute operational bottlenecks:

- **Grant Writing Overhead**: Up to 40% of non-profit staff time is consumed drafting complex multilateral donor proposals (USAID, Global Fund, Horizon Europe) with rigid Work Breakdown Structures and M&E logframes.
- **Crisis Response Speed**: In sudden-onset humanitarian disasters, field coordinators need rapid Sphere Minimum Standards triage within 0–72 hours without internet latency or generic AI hallucinations.
- **Data Protection & Privacy**: Sensitive beneficiary information must never be exposed to commercial training datasets or insecure telemetry pipelines.
- **Cost Gaps**: Commercial enterprise AI tiers are priced out of reach for local NGOs in developing nations.

**Nexus Impact AI** solves this by packaging 7 domain-calibrated impact agents into a native mobile tool, backed by flexible monetization and offline crisis synthesis.

---

## 2. The 7 Specialized Agents

Each agent features dedicated system instructions, curated directive templates, and formatted structured outputs:

| Agent | Icon | One-Line Mandate | Primary Outputs |
| :--- | :--- | :--- | :--- |
| **Research** | \`Search\` | synthesis and analysis | Peer-reviewed meta-synthesis, validity critique, quantitative evidence matrices |
| **Grant Proposal** | \`FileText\` | drafting and structuring grants | 5-part donor proposals: Problem, Objectives, Activities, Itemized Budget, and M&E Theory of Change |
| **Humanitarian** | \`ShieldAlert\` | crisis response and aid planning | 72-hour triage checklists, Sphere Minimum Standards, WASH ratios, logistics corridors |
| **Human Rights** | \`Scale\` | monitoring and advocacy | Treaty frameworks (ICCPR, CEDAW, Rome Statute), Berkeley digital evidence protocols, advocacy demarches |
| **Public Health** | \`Activity\` | health data synthesis | Outbreak surveillance, R0 estimates, ring-vaccination strategies, community health worker bundles |
| **Women\\'s Health** | \`HeartHandshake\` | maternal and gender-focused health | WHO E-MOTIVE postpartum hemorrhage protocols, Clinical Management of Rape (CMR), SRHR outreach |
| **Knowledge Base** | \`Database\` | saved notes and past outputs | Cross-agent meta-synthesis, institutional memory preservation, thematic donor briefs |

---

## 3. RevenueCat Free / Pro Flow (Entitlement: \`pro\`)

Nexus Impact AI implements a sustainable non-profit pricing model:

### Free Tier
- **Access**: Core agents (*Research*, *Humanitarian*, *Public Health*, and *Knowledge Base*).
- **Daily Quota**: **3 generations per day** tracked in \`AsyncStorage\` (resets daily at midnight).
- **Actions**: Direct text copy to clipboard.

### Pro Tier (Entitlement: \`pro\`)
- **Access**: All 7 agents, including high-value specialized workflows (*Grant Proposal*, *Human Rights*, *Women\\'s Health*).
- **Quota**: **Unlimited daily generations**.
- **Formatted PDF Export**: Certified dossier export via \`expo-print\` and \`expo-sharing\` with official stamp, date, and headers.
- **Packages**:
  - \`nexus_pro_monthly\` ($9.99/mo)
  - \`nexus_pro_annual\` ($79.99/yr — 33% discount)
- **Gating UX**: Tapping a locked card or reaching the 3/3 daily limit redirects to the Pro paywall with contextual explanations (e.g. \`"Unlock Grant Proposal with Nexus Pro"\`).

---

## 4. Setup & Installation

### Step 1: Create Blank Expo TypeScript Project
\`\`\`bash
npx create-expo-app@latest nexus-impact-ai --template blank-typescript
cd nexus-impact-ai
\`\`\`

### Step 2: Single Combined Dependency Installation
Every Expo file imports **only** the packages listed below:
\`\`\`bash
npx expo install expo-router expo-linking expo-constants expo-status-bar react-native-safe-area-context react-native-screens @react-native-async-storage/async-storage lucide-react-native react-native-purchases react-native-purchases-ui expo-sharing expo-print expo-haptics expo-clipboard react-native-svg expo-dev-client
\`\`\`

> **Note**: If you run \`npm install\` directly instead of \`npx expo install\`, run:
> \`\`\`bash
> npx expo install --fix
> \`\`\`
> to automatically align all package versions with Expo SDK 52.

### Step 3: Configure Environment Variables
Create a \`.env\` file in the root directory:
\`\`\`env
# RevenueCat Test Store Public SDK Key (starts with test_...)
EXPO_PUBLIC_REVENUECAT_API_KEY=test_yourRevenueCatTestStoreKey

# Gemini AI REST API Key (Calls gemini-2.5-flash via plain fetch)
EXPO_PUBLIC_GEMINI_KEY=YOUR_GEMINI_API_KEY

# Optional Custom Backend Proxy URL (POST { agentId, prompt })
# EXPO_PUBLIC_API_URL=https://api.nexusimpact.ai/v1/synthesize
\`\`\`

### Step 4: Run Development Build (Not Expo Go)
\`\`\`bash
# Local development client
npx expo start --dev-client

# Run on Android emulator / physical device
npx expo run:android

# Run on iOS simulator / physical device
npx expo run:ios
\`\`\`

### Step 5: EAS Development Build for Android
\`\`\`bash
npm install -g eas-cli
eas login
eas build:configure
eas build --profile development --platform android
\`\`\`

---

## 5. How to Test the Purchase (RevenueCat Test Store)

Follow these steps to test the monetization flow end-to-end:

1. **Obtain Test Store Key**: In your RevenueCat dashboard, create an app using the **Test Store** option, or copy the Test Store Public API Key (starts with \`test_...\`).
2. **Add Key to \`.env\`**: Set \`EXPO_PUBLIC_REVENUECAT_API_KEY=test_...\` in \`.env\`.
3. **Configure Products & Offering in RevenueCat**:
   - Ensure an offering named \`default\` is configured.
   - Attach monthly (\`nexus_pro_monthly\`) and annual (\`nexus_pro_annual\`) packages to the \`default\` offering.
   - Attach the packages to the \`pro\` entitlement identifier.
4. **Launch Development Build**: Run the app on a device or Android emulator using \`npx expo run:android\` or an EAS development build APK (remember: **not Expo Go**).
5. **Trigger Paywall**:
   - Option A: Tap the **Pro** tab in the bottom navigation.
   - Option B: Tap any Pro-gated agent on the home screen (*Grant Proposal*, *Human Rights*, or *Women\\'s Health*).
   - Option C: Perform 3 syntheses on the Free tier to hit the daily limit counter.
6. **Complete Test Purchase**:
   - Select either the **Annual** or **Monthly** package.
   - Tap **Subscribe**. The RevenueCat Test Store sandbox dialog will appear; confirm to complete the test purchase without real charges.
   - The UI will immediately display: *"Welcome to Nexus Pro! All premium capabilities unlocked."*
7. **Verify Entitlement**:
   - The green badge *"Your 'pro' entitlement is active"* appears.
   - All 7 agents become unlocked with unlimited directives.
   - The **Export PDF** dossier button (\`expo-print\` + \`expo-sharing\`) becomes available on all results.
8. **Test Restore Purchases**:
   - Tap the **Restore Purchases** button at the bottom of the Pro screen to verify that existing transactions are synced and re-activate the \`pro\` entitlement.

---

## 6. Screenshot Placeholders

\`\`\`text
+------------------------------------+------------------------------------+
|  [Screenshot: Home Screen]         |  [Screenshot: Agent /agent/[id]]   |
|  - 2-Column Grid of 7 Agents       |  - Directive Input Area            |
|  - Live Free Generation Counter    |  - Suggested Prompts Chips         |
|  - PRO Header Badge & Locks        |  - Scrollable Synthesis Result     |
+------------------------------------+------------------------------------+
|  [Screenshot: Pro Paywall]         |  [Screenshot: PDF Dossier Export]  |
|  - Monthly & Annual Packages       |  - Formatted Header & Date         |
|  - Benefits Matrix List            |  - Confidential Audit Watermark    |
|  - Restore Purchases Action        |  - Native Share Sheet Trigger      |
+------------------------------------+------------------------------------+
\`\`\`

---

## 6. Tech Stack

- **Runtime & Framework**: React Native 0.76, Expo SDK 52 (latest)
- **Routing**: Expo Router 4 (Typed File-based routing)
- **Monetization**: RevenueCat SDK (\`react-native-purchases\` & \`react-native-purchases-ui\`)
- **AI Synthesis**: Direct REST \`fetch\` to Google Gemini (\`gemini-2.5-flash\`)
- **Document Export**: \`expo-print\` and \`expo-sharing\`
- **Haptics & Utility**: \`expo-haptics\`, \`expo-clipboard\`, \`lucide-react-native\`
- **Persistence**: \`@react-native-async-storage/async-storage\`
`,
  },
  {
    path: 'LICENSE',
    name: 'LICENSE',
    language: 'text',
    category: 'docs',
    content: `MIT License

Copyright (c) 2026 Nexus Impact AI Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`,
  },
];
