# 🌿 GreenStep – Personal Carbon Footprint Tracker & Eco Lifestyle Companion

> **Mobile Application Development – Final Project**  
> Built with **React Native (0.74.5)** & **Expo SDK 51** | Aligned with [zeki-ozen/MobileAppDevelopment](https://github.com/zeki-ozen/MobileAppDevelopment) Course Curriculum (W2–W9)

---

## 📌 1. Project Overview & Problem Definition

Climate change is often discussed on an industrial or macroeconomic scale, leaving individuals unaware of how their everyday habits (commuting, diet, household energy, and shopping) drive over **60% of global greenhouse gas emissions**.

**GreenStep** bridges this gap by turning personal carbon accounting into a fast, colorful, and engaging daily habit for university students and urban commuters. Users can log daily activities in under 10 seconds, monitor a visual circular carbon budget, check live city air quality via REST API, explore campus green spots on an interactive map, verify eco-habits with photo proof, and unlock actionable sustainability tips.

---

## 🛠️ 2. Tech Stack & Course Curriculum Alignment (`zeki-ozen/MobileAppDevelopment`)

| Course Module | Topics & Components Applied in GreenStep | Implementation Files |
| :--- | :--- | :--- |
| **W2 & W3: JS & React Fundamentals** | ES6+ Modules, Arrow Functions, Array Iteration (`.map`, `.filter`, `.reduce`), JSX, Props, State, Conditional & List Rendering, Forms | All components & utilities (`carbonCalculator.js`, `activities.js`) |
| **W4: React Native State & Hooks** | `useState`, `useEffect`, `useMemo`, `useRef`, `useCallback`, `useContext` (Unidirectional Context Store) | `src/context/AppContext.js` |
| **W6: Core & Custom UI Components** | `View`, `Text`, `SafeAreaView`, `ScrollView`, `FlatList`, `TextInput`, `TouchableOpacity`, `Image`, **`CustomCheckbox`**, **`RadioButtonGroup`**, **`CustomPicker`** | `src/components/CustomCheckbox.js`, `RadioButtonGroup.js`, `CustomPicker.js`, `HistoryScreen.js` |
| **W7: Local Storage & Persistence** | `@react-native-async-storage/async-storage` key-value JSON database (`getItem`, `setItem`, `removeItem`) | `src/utils/storage.js` |
| **W8: Networking, Async/Await & States** | `fetch()` REST API (`Open-Meteo Air Quality API`), `async/await`, `ActivityIndicator` (`LoadingStates.md`), `try/catch` (`ErrorHandling.md`) with offline fallback | `src/components/LiveAirQualityCard.js` |
| **W9: Native & Platform Capabilities** | Interactive Campus Green Spots Coordinate Map (`Maps/Leaflet`), Camera Viewfinder & Photo Verification (`Camera.md`), Smart Eco-Notifications (`Notifications.md`) | `src/screens/EcoHubScreen.js` |
| **Bonus (Section 6)** | Internationalization (**i18n EN / TR** language switcher), Accessibility (`accessibilityRole`, `accessibilityState`), Animated SVG charts | `ProfileScreen.js`, `CarbonMeter.js`, `WeeklyChart.js` |

---

## 📱 3. Key Screens (7 Meaningful UI Screens)

1. **`OnboardingScreen.js`**: 3-step horizontal swipeable onboarding carousel with avatar picker, name input, and daily carbon goal selector.
2. **`HomeScreen.js` (Dashboard)**: Animated SVG `CarbonMeter`, 7-day `WeeklyChart`, sector `CategoryBreakdown`, **W6 `CustomCheckbox` Daily Eco-Habits Checklist**, and **W8 `LiveAirQualityCard`** (fetching real-time Istanbul/Ankara/Izmir AQI, PM2.5, and CO).
3. **`LogActivityScreen.js`**: 4-sector activity logger with live $\text{CO}_2$ mathematical preview, quick-quantity chips, and **W6 `RadioButtonGroup`** efficiency mode selector (`0.8x Eco`, `1.0x Standard`, `1.2x Peak`).
4. **`EcoHubScreen.js` (W9 Platform Hub)**:
   - **Interactive Campus & City Green Map**: Tappable coordinate pins (`Beyazıt Zero-Waste`, `Vezneciler Metro Hub`, `Botanical Garden`, etc.) with check-in offsets.
   - **Eco-Camera & Photo Proof**: Viewfinder modal & `Image` gallery for verifying sustainable actions.
   - **Smart Eco-Notifications**: Configurable reminder channels and instant live notification banner test.
5. **`HistoryScreen.js`**: Searchable, filterable, date-grouped timeline powered by **W6 `FlatList`** and **`CustomPicker`** sort selector (`Newest`, `Oldest`, `Highest CO₂`, `Lowest CO₂`).
6. **`TipsScreen.js`**: Auto-rotating climate facts banner, difficulty filters (`🟢 Easy`, `🟡 Medium`, `🔴 Hard`), and animated accordion `TipCard` list.
7. **`ProfileScreen.js`**: Lifetime environmental equivalents (car km, mature trees needed, beef meals), daily target adjuster, **EN / TR language toggle (i18n)**, and data reset controls.

---

## 🚀 4. Setup & Run Instructions

### Prerequisites
- **Node.js** (v18+ recommended)
- **Expo Go** app installed on your physical Android or iOS device (or Android Studio / Xcode simulator)

### Installation & Launch
```bash
# 1. Navigate into the project directory
cd GreenStep

# 2. Install all dependencies
npm install

# 3. Start the Expo development server
npx expo start
```
- Scan the QR code in the terminal using **Expo Go** (Android) or the **Camera app** (iOS), or press `a` for Android Emulator / `i` for iOS Simulator / `w` for Web.
