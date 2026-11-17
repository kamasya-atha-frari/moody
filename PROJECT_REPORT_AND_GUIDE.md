# MOBILE APPLICATION DEVELOPMENT – FINAL PROJECT REPORT
## GreenStep: Personal Carbon Footprint Tracker & Eco Lifestyle Companion

---

### **Executive Summary**
| **Field** | **Details** |
| :--- | :--- |
| **Project Name** | **GreenStep 🌿** |
| **Course** | Mobile Application Development |
| **Deliverable Type** | Final Project Report & Source Code Documentation |
| **Tech Stack** | React Native (0.74.5), Expo SDK 51, JavaScript (ES6+), React Navigation v6, React Context API, AsyncStorage, React Native SVG, Expo Linear Gradient |
| **Primary Target Group** | Eco-conscious individuals, university students, and urban commuters seeking to monitor and decrease their daily personal carbon footprint |
| **Architecture** | Component-Driven Architecture with Unidirectional Context State, REST API Telemetry & Offline Persistence |
| **Course Alignment** | [zeki-ozen/MobileAppDevelopment](https://github.com/zeki-ozen/MobileAppDevelopment) (Weeks 2–9 Modules & Components) |
| **Commit Count** | 18 Structured Semantic Commits |

---

## 1. Problem Definition & Motivation

### 1.1 The Real-World Problem
Climate change is the defining crisis of our era. However, public communication surrounding greenhouse gas (GHG) emissions frequently focuses on macroscopic industrial, corporate, or international scales. This produces a **cognitive detachment**: individuals often feel powerless or unaware of how their mundane daily routines contribute to atmospheric carbon levels.

According to global environmental research:
- Over **60% of worldwide greenhouse gas emissions** are directly or indirectly driven by individual consumption choices, urban commuting patterns, household energy usage, and dietary habits.
- A single return flight or daily high-meat consumption pattern can eclipse the emissions of entire weeks of low-carbon living.
- Most individuals want to live more sustainably, but **lack concrete, real-time quantification** of their daily impact.

### 1.2 The Solution: GreenStep
**GreenStep** is a mobile application developed to make carbon accounting intuitive, educational, and habit-forming. Instead of presenting complex enterprise carbon calculations, GreenStep translates everyday actions (e.g., driving 15 km, having a beef burger, running an air conditioner for 3 hours) into immediate, tangible kilograms of $\text{CO}_2$ equivalent ($\text{kg CO}_2\text{e}$). 

By introducing **daily carbon budgets**, **visual threshold meters**, **trend analytics**, and **concrete environmental equivalents** (e.g., how many trees are needed to offset your emissions), GreenStep transforms abstract environmental science into a compelling daily personal habit.

---

## 2. Target User Group & User Personas

| Attribute | User Persona: "The University Commuter & Eco-Conscious Youth" |
| :--- | :--- |
| **Demographics** | University students, young professionals, urban residents (Ages 18–35) |
| **Primary Needs** | Fast logging (< 10 seconds), zero complex configuration, clear visual feedback on whether daily habits are within healthy limits |
| **Pain Points** | Existing carbon calculators are desktop-bound, require 50-question annual surveys, or produce confusing scientific charts without actionable tips |
| **GreenStep Value** | Fast mobile shortcuts, clear daily circular budget, localized offline storage, and practical habits that save both carbon and money |

---

## 3. System Architecture & Technical Specifications

### 3.1 Architecture Overview
The application follows a **Modular Component-Driven Architecture** combined with a **Unidirectional Data Flow** pattern powered by the React Context API.

```
┌────────────────────────────────────────────────────────┐
│                      UI Layer                          │
│  OnboardingScreen | HomeScreen | LogActivityScreen     │
│  HistoryScreen    | TipsScreen | ProfileScreen         │
└───────────────────────────▲────────────────────────────┘
                            │ (Actions / Dispatches)
┌───────────────────────────┴────────────────────────────┐
│                    AppContext Store                    │
│  • logs[]             • profile{}      • goal (kg)     │
│  • todayLogs[]        • weeklyData[]   • streak        │
│  • categoryBreakdown  • lifetimeTotal  • isLoading     │
└───────────────▲───────────────────────────▲────────────┘
                │                           │
┌───────────────┴───────────┐   ┌───────────┴────────────┐
│   Storage Utility (Async) │   │ Carbon Math Calculator │
│   • saveLog / deleteLog   │   │ • calculateCarbon()    │
│   • getProfile/saveProfile│   │ • getStreakDays()      │
│   • AsyncStorage Key/Val  │   │ • getLifetimeEquivs()  │
└───────────────────────────┘   └────────────────────────┘
```

### 3.2 State Management Decision
Rather than introducing heavy external dependencies such as Redux Toolkit or MobX—which would add artificial complexity for a client-side utility—GreenStep utilizes a custom **React Context provider (`AppContext`)**. 
- **Predictable State Transitions**: All state mutations (`addLog`, `deleteLog`, `clearLogs`, `updateProfile`, `updateGoal`) are encapsulated inside the provider.
- **Computed Derived State**: High-cost analytical metrics (e.g., 7-day weekly trends, sector percentage breakdowns, active streaks) are memoized using `useMemo` to ensure zero stutter during user interactions.

### 3.3 Data Management & Persistence Model (AsyncStorage)
GreenStep adopts an **offline-first local database approach** using `@react-native-async-storage/async-storage`. This fulfills the project criteria by delivering a robust data persistence model:
- **`@greenstep_logs_v1`**: Serialized JSON array of all logged activity records.
- **`@greenstep_profile_v1`**: User preference document including name, avatar emoji, joined timestamp, and onboarding completion status.
- **`@greenstep_goal_v1`**: The user’s custom daily emission budget ceiling.

#### Data Model Schema:
```typescript
interface ActivityLog {
  id: string;              // Unique identifier: log-${timestamp}-${random}
  activityId: string;      // Foreign key matching ACTIVITIES registry (e.g., 'car')
  activityName: string;    // Human-readable title (e.g., 'Car Drive')
  category: 'transport' | 'food' | 'energy' | 'shopping';
  emoji: string;           // Visual activity icon (e.g., '🚗')
  quantity: number;        // Logged amount (e.g., 15)
  unit: string;            // Unit of measure (e.g., 'km', 'meal', 'hours')
  kgCO2: number;           // Computed emission in kilograms of CO2
  note?: string;           // Optional contextual annotation
  timestamp: string;       // ISO 8601 recording time
}

interface UserProfile {
  name: string;
  avatarEmoji: string;
  dailyGoal: number;       // Daily budget in kg CO2 (default: 10.0)
  joinedDate: string;
  onboarded: boolean;
}
```

---

## 4. Screen-by-Screen Walkthrough & UI/UX Design

GreenStep features **6 dedicated, highly styled screens**, exceeding the minimum requirement of 3 screens.

### 4.1 Screen 1: Onboarding Carousel (`OnboardingScreen.js`)
* **Purpose**: Welcomes first-time users, explains the core mission, and collects initial profile preferences.
* **Layout**:
  - **Slide 1**: Hero animated Earth illustration, mission statement, and key value propositions.
  - **Slide 2**: Interactive 4-sector category overview with color-coded tiles.
  - **Slide 3**: Profile builder with 8 selectable avatar icons, text input for user name, and 4 daily carbon budget presets (5 kg, 10 kg, 15 kg, 20 kg).
* **UI/UX Highlights**: Full-screen gradient backdrop (`expo-linear-gradient`), pagination indicator dots, keyboard-avoiding input ergonomics, and smooth transitions.

```
+------------------------------------------+
|  🌿 GreenStep                      Skip  |
|                                          |
|                 ( 🌍 )                   |
|       Track Your Carbon Footprint        |
|  Every meal, commute, and purchase       |
|  impacts our planet.                     |
|                                          |
|  [✨ Science-backed CO2 calculation    ] |
|  [📊 Actionable category breakdowns    ] |
|  [🎯 Daily targets & eco streaks       ] |
|                                          |
|         ● ○ ○       [ Continue → ]       |
+------------------------------------------+
```

---

### 4.2 Screen 2: Main Dashboard (`HomeScreen.js`)
* **Purpose**: Serves as the central command center for real-time carbon budget monitoring and daily analytics.
* **Key Components**:
  1. **Dynamic Header Banner**: Time-sensitive greeting ("Good morning / afternoon / evening"), current date, active streak badge (`🔥 3d`), and clickable user avatar.
  2. **Circular Carbon Budget Meter (`CarbonMeter`)**: Custom SVG circle visualizing current day's emissions against the user's daily budget. Dynamically shifts colors:
     - 🟢 Green: `< 50%` of goal
     - 🟡 Amber: `50% - 80%` of goal
     - 🔴 Red: `> 80%` of goal
  3. **KPI Tiles (`StatsCard`)**: "This Week Total" (7-day cumulative) and "Active Green Streak" (consecutive days within budget).
  4. **Quick Log Shortcuts**: 4 one-touch category buttons (Transport, Food, Energy, Shopping) that navigate to the log form with preselected context.
  5. **7-Day Trend Chart (`WeeklyChart`)**: Bar chart tracking emissions from Monday to Sunday with color-coded safety tiers and daily average indicators.
  6. **Sector Breakdown Carousel (`CategoryBreakdown`)**: Individual mini progress rings displaying proportion of emissions coming from each sector.
  7. **Today’s Activities List**: Real-time list of today's logged items with quick swipe/delete capabilities.

```
+------------------------------------------+
| Good morning, Alex Green! 🌱   🔥 4d  (👤)
| Monday, 17 Nov 2026                      |
| Goal: 10 kg/day  •  Logged: 3.8 kg       |
+------------------------------------------+
|  +------------------------------------+  |
|  |     Today's Carbon Budget          |  |
|  |             /=======\              |  |
|  |            | 3.8 kg  |             |  |
|  |             \=======/              |  |
|  |      Daily Goal: 10.0 kg           |  |
|  |   [✨ Outstanding! Well below goal] |  |
|  +------------------------------------+  |
|                                          |
|  [ This Week: 18.4 kg ] [ Streak: 4 days]|
|                                          |
|  ⚡ Quick Log: [🚗] [🍽️] [⚡] [🛍️]     |
|                                          |
|  📈 7-Day Trend:  || | || |              |
|  🥧 Sector Breakdown: Transport 45%...  |
|  📝 Today's Activities (3 entries)       |
+------------------------------------------+
|  🏠 Dash   📋 History   ➕ Log   💡 Tips |
+------------------------------------------+
```

---

### 4.3 Screen 3: Activity Logger (`LogActivityScreen.js`)
* **Purpose**: Interactive input form allowing users to select an activity, input the quantity, preview the calculated carbon in real time, and log the entry.
* **User Flow**:
  1. **Sector Pill Selector**: Easily toggle between Transport, Food, Energy, Shopping.
  2. **Activity Grid**: Visual cards for 22+ activities displaying icon, name, and emission coefficient (e.g., `Car: 0.21 kg/km`).
  3. **Dynamic Amount Input**: Numeric keypad entry with unit suffix badge (`km`, `meal`, `hours`, `items`).
  4. **Quick-Add Chips**: One-tap increment buttons (`+5 km`, `+10 km`, `+25 km`).
  5. **Live Real-Time Impact Calculator**: Computes formula: $\text{Quantity} \times \text{Factor} = \text{kg CO}_2$ dynamically as the user types.
  6. **Optional Context Note**: Input field for adding tags (e.g., "Commute to campus").
  7. **Validation & Confirmation**: Form validation guarantees non-zero positive numbers with animated confirmation alerts.

```
+------------------------------------------+
|          Log Carbon Activity ➕          |
+------------------------------------------+
| 1. SELECT SECTOR:                        |
| [🚗 Transport] [🍽️ Food] [⚡ Energy]... |
|                                          |
| 2. CHOOSE ACTIVITY:                      |
| +------------------+ +-----------------+ |
| | 🚗 Car Drive  ✓  | | 🚌 City Bus     | |
| | 0.21 kg / km     | | 0.089 kg / km   | |
| +------------------+ +-----------------+ |
|                                          |
| 3. AMOUNT & NOTE:                        |
| How much did you travel?                 |
| [ 15              ] [ km ]               |
| Quick: [+5 km] [+10 km] [+25 km]         |
|                                          |
| +--------------------------------------+ |
| | Impact Estimate:                     | |
| | 15 km x 0.21 kg CO2  =  3.15 kg CO2  | |
| +--------------------------------------+ |
|                                          |
| Note: [ Commute to university          ] |
|                                          |
| [========= Log Activity (3.15 kg) 🌿 ===]|
+------------------------------------------+
```

---

### 4.4 Screen 4: Activity History & Audit (`HistoryScreen.js`)
* **Purpose**: Full chronological audit trail of all recorded carbon events.
* **Key Features**:
  1. **Instant Search**: Real-time search across activity titles and user notes.
  2. **Sector Filter Tabs**: Filter by All, Transport, Food, Energy, Shopping.
  3. **Summary KPI Header**: Displays total matching records and filtered sum in $\text{kg CO}_2$.
  4. **Date Grouping**: Groups logs logically into "Today", "Yesterday", and specific calendar dates with daily subtotals.
  5. **Deletion Guardian**: Tap trash icon to safely delete accidental or duplicate entries with an Alert confirmation.
  6. **Zero-State Fallback**: Friendly empty illustration if search yields zero results.

---

### 4.5 Screen 5: Eco Tips & Insights (`TipsScreen.js`)
* **Purpose**: Educational library featuring 15 actionable, high-impact lifestyle modifications.
* **Key Features**:
  1. **Rotating "Did You Know?" Fact Card**: Automatically cycles every 6 seconds through science-backed environmental facts.
  2. **Difficulty Filter**: Filter tips by 🟢 Easy, 🟡 Medium, 🔴 Hard.
  3. **Monthly Impact Calculator**: Aggregates total potential savings for active tips (e.g., "Potential Savings: ~54.8 kg CO₂/month").
  4. **Expandable Accordion Cards (`TipCard`)**: Animated expansion revealing practical instructions, alternative solutions, and CO₂ reduction metrics.
  5. **Social Awareness Share**: Prompts users to share environmental habits with friends.

---

### 4.6 Screen 6: Profile, i18n & Environmental Equivalents (`ProfileScreen.js`)
* **Purpose**: Manage personal preferences, configure carbon targets, switch language (**EN / TR i18n**), and contextualize abstract emissions through real-world equivalents.
* **Key Features**:
  1. **Customizable Profile**: Tap avatar to open a 10-emoji picker modal; tap name for inline editing.
  2. **Lifetime Achievement Tiles**: All-time $\text{kg CO}_2$ logged, total activity count, streak record, and current target.
  3. **Daily Target Adjuster**: Change daily budget limit between 5, 7.5, 10, 15, and 20 kg with instant recalculation.
  4. **Internationalization (i18n EN / TR Switcher)**: Uses `RadioButtonGroup` (W6) to dynamically switch between English (`🇬🇧 EN`) and Turkish (`🇹🇷 TR`).
  5. **Real-World Equivalents**:
     - 🚗 Gasoline car distance equivalent ($\text{Total} / 0.21$).
     - 🌲 Mature trees needed for 1-year absorption ($\text{Total} / 21.0$).
     - 🍔 Steaks offset equivalent ($\text{Total} / 6.61$).
  6. **System Management**: "About GreenStep" project specifications modal and "Reset All Logs" database purge option.

---

### 4.7 Screen 7: Campus & City Eco-Hub (`EcoHubScreen.js` — Course W9 Platform Features)
* **Purpose**: Combines geospatial sustainability awareness, photo verification, and smart reminders aligned with Week 9 of the course curriculum (`W9/components/`).
* **Key Features**:
  1. **Interactive Campus & City Green Spots Map (`W9 Maps / Leaflet`)**: Displays an interactive SVG coordinate map of Istanbul University & city sustainability stations (*Beyazıt Zero-Waste Station*, *Vezneciler Metro Hub*, *Alfred Heilbronn Botanical Garden*, *Campus Solar Refill*, *Eminönü Bike Dock*) with tappable pins, latitude/longitude coordinates, and one-tap check-ins.
  2. **Eco-Camera & Photo Verification (`W9 Camera` & `W6 Image`)**: Includes a camera viewfinder modal and verified photo proof gallery (`Image` cards) to document green actions.
  3. **Smart Eco-Notifications (`W9 Notifications` & `W6 Checkbox / RadioButton`)**: Allows toggling daily carbon alerts and triggering an instant in-app notification banner during the live demo.

---

### 4.8 Alignment with Course Repository (`zeki-ozen/MobileAppDevelopment`)

| Course Week & Folder | Repository Topics Used | Implementation in GreenStep |
| :--- | :--- | :--- |
| **W2 & W3: JS & React** | `01-components`, `03-props`, `04-state`, `05-lifecycle-and-effects`, `07-conditional-rendering`, `08-list-rendering`, `09-hooks`, `10-data-sharing`, `13-forms`, `14-routing` | Functional components, props, hooks (`useState`, `useEffect`, `useMemo`, `useContext`), React Navigation v6 (`AppNavigator.js`) |
| **W4: React Native Core** | `3-react-native-variable-const.md`, `4-react-native-props.md`, `5-react-native-state.md`, `6-react-native-hooks.md` | Modular constants (`colors.js`, `activities.js`, `tips.js`), reactive context state (`AppContext.js`) |
| **W6: Core UI Components** | `View`, `Text`, `SafeAreaView`, `ScrollView`, `FlatList`, `TextInput`, `TouchableOpacity`, `Image`, `Checkbox.md`, `RadioButton.md`, `Picker.md` | Dedicated reusable `CustomCheckbox.js`, `RadioButtonGroup.js`, `CustomPicker.js`, plus `FlatList` in `HistoryScreen.js` and `Image` in `EcoHubScreen.js` |
| **W7: Local Storage** | `W7/AsyncStorage.md` | Offline-first CRUD persistence (`getLogs`, `saveLog`, `deleteLog`, `getProfile`, `saveGoal`) in `src/utils/storage.js` |
| **W8: Networking & Async** | `W8/FetchAPI.md`, `W8/AsyncAwait.md`, `W8/LoadingStates.md`, `W8/ErrorHandling.md` | `LiveAirQualityCard.js` querying real-time Open-Meteo Air Quality REST API (`fetch` + `async/await` + `ActivityIndicator` + `try/catch` offline fallback) |
| **W9: Platform Features** | `W9/components/ReactNativeMaps.md`, `ReactNativeLeaflet.md`, `Camera.md`, `Notifications.md` | `EcoHubScreen.js` featuring interactive coordinate map pins, camera viewfinder verification, and instant notification reminders |

---

## 5. Scientific Carbon Factor Reference Table

The calculations embedded in GreenStep are derived from reputable open environmental databases (IPCC, UK DEFRA, Our World in Data):

| Category | Activity Identifier | Unit | $\text{kg CO}_2$ per Unit | Real-World Context |
| :--- | :--- | :--- | :--- | :--- |
| **Transport** | `car` | km | `0.210` | Average petrol passenger car |
| **Transport** | `motorcycle` | km | `0.110` | Mid-sized motorcycle / scooter |
| **Transport** | `bus` | km | `0.089` | Standard municipal transit bus per passenger |
| **Transport** | `train` | km | `0.041` | Electric passenger rail per passenger |
| **Transport** | `flight` | km | `0.255` | Economy domestic flight with radiative forcing |
| **Transport** | `cycling` | km | `0.000` | Zero direct emissions |
| **Food** | `beef_meal` | meal | `6.610` | High ruminant livestock emission intensity |
| **Food** | `chicken_meal` | meal | `1.570` | Poultry / low-emission meat |
| **Food** | `vegetables_meal` | meal | `0.460` | Plant-based seasonal ingredients |
| **Food** | `fish_meal` | meal | `2.440` | Average seafood catch / aquaculture |
| **Food** | `dairy_meal` | meal | `3.200` | Cheese / high-fat dairy portion |
| **Energy** | `air_conditioner` | hours | `0.680` | 1.5 kW AC unit on standard electric grid |
| **Energy** | `heater` | hours | `0.420` | Electric space heating unit |
| **Energy** | `long_shower` | shower | `0.140` | Energy used to heat water (>10 mins) |
| **Energy** | `dryer` | cycle | `1.800` | Electric tumbler clothes dryer |
| **Shopping** | `new_clothes` | item | `10.000` | Fast-fashion cotton/polyester garment |
| **Shopping** | `electronics` | item | `100.000`| Smartphone / gadget manufacturing footprint |

---

## 6. Git Version Control & Commit Strategy

In compliance with section 5.2 of the evaluation criteria, the project rejects the practice of a single final commit. The commit timeline demonstrates an iterative, professional software engineering process:

```
* feat(w9-platform): add EcoHubScreen with interactive green map, camera proof, notifications and EN/TR i18n
* feat(w8-network): integrate LiveAirQualityCard REST API fetch with loading and offline fallback
* feat(w6-components): add reusable CustomCheckbox, RadioButtonGroup and CustomPicker components
* docs: add comprehensive project README and architecture specifications
* feat(nav): assemble bottom tabs and stack navigation with splash loader
* feat(screens): implement ProfileScreen with environmental equivalents and settings
* feat(screens): build TipsScreen with rotating facts and difficulty filters
* feat(screens): create searchable HistoryScreen and date-grouped timeline
* feat(screens): develop LogActivityScreen with real-time emission preview
* feat(screens): construct interactive HomeScreen dashboard with quick shortcuts
* feat(screens): implement 3-step OnboardingScreen with goal configurator
* feat(components): add WeeklyChart, CategoryBreakdown and ActivityCard components
* feat(components): build animated CarbonMeter and ProgressRing SVG widgets
* feat(context): create centralized AppContext for reactive state management
* feat(math): implement carbon emission calculator and timeline aggregation logic
* feat(storage): implement AsyncStorage persistent data layer and CRUD wrappers
* feat(domain): establish color palette, activities and eco-tips data constants
* feat: initialize Expo project structure and dependencies
```

---

## 7. Setup & Execution Guide

### Prerequisites
- Install **Node.js** (v18.x or v20.x recommended) from [nodejs.org](https://nodejs.org).
- Install **Expo Go** on your physical phone (iOS App Store or Google Play Store).

### Step-by-Step Instructions
1. **Open Terminal / Command Prompt** in the project directory:
   ```bash
   cd "GreenStep"
   ```
2. **Install Project Dependencies**:
   ```bash
   npm install
   ```
3. **Launch Development Server**:
   ```bash
   npx expo start
   ```
4. **Run the Application**:
   - **On Phone**: Scan the terminal QR code using **Expo Go** (Android) or the **Camera app** (iOS).
   - **On Android Emulator**: Press `a` in the terminal.
   - **On iOS Simulator**: Press `i` in the terminal.
   - **On Web Browser**: Press `w` in the terminal.

---

## 8. Academic Integrity & Originality Declaration

I hereby declare and affirm that:
1. **Originality**: The code in this repository has been designed, authored, and assembled specifically for this Mobile Application Development final project.
2. **No Plagiarism**: The code is not a clone, fork, or minor edit of any third-party repository or prior student's submission.
3. **No Outsourcing**: No paid or unpaid external agency, freelancer, or third-party developer was commissioned to produce this application.
4. **Architectural Mastery**: I possess a complete technical understanding of the codebase, its components, state flow, and data persistence, and am fully prepared to explain and defend all implementation choices during the oral presentation and defense.
