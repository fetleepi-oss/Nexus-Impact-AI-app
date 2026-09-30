# Nexus Impact AI (Mobile)

> Specialized AI agents for social impact, humanitarian relief, and evidence-based development.

**Built for RevenueCat Shipaton 2026 (Next Gen Award)**

> **Important**: This app must run as a **development build**, not Expo Go, because RevenueCat (`react-native-purchases`) requires native code compiled into the application binary.

---

## Quick Start

### 1. Install Dependencies
Install all required packages declared in `package.json` with a single combined command:
```bash
npx expo install expo-router expo-linking expo-constants expo-status-bar react-native-safe-area-context react-native-screens @react-native-async-storage/async-storage lucide-react-native react-native-purchases react-native-purchases-ui expo-sharing expo-print expo-haptics expo-clipboard react-native-svg expo-dev-client
```

> **Note**: If you run `npm install` directly instead of `npx expo install`, run:
> ```bash
> npx expo install --fix
> ```
> to automatically align all package versions with Expo SDK 52.

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and supply your test keys:
```bash
cp .env.example .env
```

```env
# RevenueCat Test Store public SDK API key (starts with test_...)
EXPO_PUBLIC_REVENUECAT_API_KEY=test_yourRevenueCatTestStoreKey

# Gemini AI REST API Key (Calls gemini-2.5-flash via plain fetch)
EXPO_PUBLIC_GEMINI_KEY=YOUR_GEMINI_API_KEY

# Optional Custom Backend Proxy URL (POST { agentId, prompt })
# EXPO_PUBLIC_API_URL=https://api.nexusimpact.ai/v1/synthesize
```

### 3. Run Development Build (Not Expo Go)
RevenueCat requires native code, so run with the Expo development client:
```bash
# For local Android emulator or connected device:
npx expo run:android

# Or start the dev client server:
npx expo start --dev-client
```

### 4. Build for Android with EAS (Development Build)
```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --profile development --platform android
```

---

## How to Test the Purchase (RevenueCat Test Store)

Follow these steps to test the monetization flow end-to-end:

1. **Obtain Test Store Key**: In your RevenueCat dashboard, create an app using the **Test Store** option, or copy the Test Store Public API Key (starts with `test_...`).
2. **Add Key to `.env`**: Set `EXPO_PUBLIC_REVENUECAT_API_KEY=test_...` in `.env`.
3. **Configure Products & Offering in RevenueCat**:
   - Ensure an offering named `default` is configured.
   - Attach monthly (`nexus_pro_monthly`) and annual (`nexus_pro_annual`) packages to the `default` offering.
   - Attach the packages to the `pro` entitlement identifier.
4. **Launch Development Build**: Run the app on a device or Android emulator using `npx expo run:android` or an EAS development build APK (remember: **not Expo Go**).
5. **Trigger Paywall**:
   - Option A: Tap the **Pro** tab in the bottom navigation.
   - Option B: Tap any Pro-gated agent on the home screen (*Grant Proposal*, *Human Rights*, or *Women's Health*).
   - Option C: Perform 3 syntheses on the Free tier to hit the daily limit counter.
6. **Complete Test Purchase**:
   - Select either the **Annual** or **Monthly** package.
   - Tap **Subscribe**. The RevenueCat Test Store sandbox dialog will appear; confirm to complete the test purchase without real charges.
   - The UI will immediately display: *"Welcome to Nexus Pro! All premium capabilities unlocked."*
7. **Verify Entitlement**:
   - The green badge *"Your 'pro' entitlement is active"* appears.
   - All 7 agents become unlocked with unlimited directives.
   - The **Export PDF** dossier button (`expo-print` + `expo-sharing`) becomes available on all results.
8. **Test Restore Purchases**:
   - Tap the **Restore Purchases** button at the bottom of the Pro screen to verify that existing transactions are synced and re-activate the `pro` entitlement.

---

## 7 Specialized Impact Agents

| Agent | Icon | One-Line Mandate | Primary Outputs |
| :--- | :--- | :--- | :--- |
| **Research** | `Search` | synthesis and analysis | Peer-reviewed meta-synthesis, validity critique, quantitative evidence matrices |
| **Grant Proposal** | `FileText` | drafting and structuring grants | 5-part donor proposals: Problem, Objectives, Activities, Budget Outline, and M&E |
| **Humanitarian** | `ShieldAlert` | crisis response and aid planning | 72-hour triage checklists, Sphere Minimum Standards, WASH ratios, logistics corridors |
| **Human Rights** | `Scale` | monitoring and advocacy | Treaty frameworks (ICCPR, CEDAW, Rome Statute), Berkeley digital evidence protocols |
| **Public Health** | `Activity` | health data synthesis | Outbreak surveillance, R0 estimates, ring-vaccination strategies, clinical protocols |
| **Women's Health** | `HeartHandshake` | maternal and gender-focused health | WHO E-MOTIVE postpartum hemorrhage protocols, CMR rape management, SRHR outreach |
| **Knowledge Base** | `Database` | saved notes and past outputs | Cross-agent meta-synthesis, institutional memory preservation, thematic donor briefs |

---

## RevenueCat Free / Pro Flow (Entitlement: "pro")

- **Free Tier**: Access to core agents (*Research*, *Humanitarian*, *Public Health*, *Knowledge Base*), capped at **3 generations per day** tracked in `AsyncStorage` (resets daily at midnight), plus Copy button.
- **Pro Tier**: Entitlement identifier `"pro"`, monthly (`nexus_pro_monthly`, $9.99/mo) and annual (`nexus_pro_annual`, $79.99/yr) packages from `"default"` offering. Unlocks *Grant Proposal*, *Human Rights*, *Women's Health*, unlimited generations, and formatted PDF export (`expo-print` + `expo-sharing`).
- **Gating UX**: Tapping locked agent cards or reaching the 3/3 daily limit redirects to the Pro paywall with contextual explanations (e.g. `"Unlock Grant Proposal with Nexus Pro"`).

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
