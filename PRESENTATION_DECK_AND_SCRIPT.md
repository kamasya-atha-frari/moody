# 🌿 GreenStep – Final Project Presentation Guide & Script
## 7–10 Minute Class Presentation & Live Demonstration Blueprint

---

### **Presentation Overview**
- **App Name**: GreenStep 🌿 (Personal Carbon Footprint Tracker)
- **Time Allocation**: 8 minutes presentation + 2 minutes Q&A (Total: 10 mins)
- **Target Audience**: Course Instructor & Class Peers
- **Format**: Slide Presentation + Live Expo Mobile Demo

---

## ⏱️ Minute-by-Minute Timing Schedule

| Segment | Time | Topic | Format |
| :---: | :---: | :--- | :--- |
| **01** | `00:00 - 01:00` | Problem Statement, Climate Motivation & App Mission | Slides 1–2 |
| **02** | `01:00 - 01:45` | Target User Group & Core Value Proposition | Slide 3 |
| **03** | `01:45 - 02:45` | Tech Stack & Component-Driven Architecture | Slides 4–5 |
| **04** | `02:45 - 05:45` | **Live Demo**: Onboarding, Dashboard, Activity Logging, Timeline, Tips | Mobile Screen Share |
| **05** | `05:45 - 06:45` | Technical Challenges & Engineering Solutions | Slide 6 |
| **06** | `06:45 - 07:30` | Future Roadmap & Improvements | Slide 7 |
| **07** | `07:30 - 08:00` | Conclusion & Summary | Slide 8 |
| **08** | `08:00 - 10:00` | Instructor Q&A Session | Live Discussion |

---

## 📊 Slide Deck Blueprint (Slide by Slide)

### **Slide 1: Title & Introduction**
* **Title**: GreenStep 🌿
* **Subtitle**: Personal Carbon Footprint Tracker & Eco Lifestyle Companion
* **Presenter**: [Your Name / Student ID]
* **Course**: Mobile Application Development – Final Project Defense

---

### **Slide 2: Problem Definition & Motivation**
* **Headline**: Why Individual Carbon Accounting Matters
* **Key Points**:
  - Over **60% of global greenhouse emissions** relate to household decisions, urban mobility, and food consumption.
  - Climate change is often discussed at international and corporate levels, creating **cognitive detachment** for ordinary citizens.
  - People want to make greener decisions, but lack **real-time quantitative feedback** on everyday actions.
* **Our Mission**: Make personal carbon emissions as visible and manageable as a daily calorie or financial budget.

---

### **Slide 3: Target Audience & User Persona**
* **Headline**: Designed for Everyday Life
* **Target Users**: University students, urban commuters, and young professionals (18–35).
* **Key Requirements**:
  - Fast logging (< 10 seconds per entry).
  - Clear visual indicators rather than complex mathematical jargon.
  - Offline-first reliability for use on public transit or without an internet connection.

---

### **Slide 4: Tech Stack & Tools Selection**
* **Framework**: React Native (v0.74.5) with Expo SDK 51.
* **Navigation**: React Navigation v6 (Bottom Tab Navigator + Native Stack Navigator).
* **State Management**: React Context API (`AppContext`) with custom hooks and memoized derivations.
* **Persistence Layer**: `@react-native-async-storage/async-storage` for reliable local database persistence.
* **Graphics & Visuals**: `react-native-svg` for circular gauge & progress rings; `expo-linear-gradient` for nature-themed UI styling.

---

### **Slide 5: Architectural Pattern & Data Flow**
* **Design Pattern**: Component-Driven Clean Architecture.
* **Data Flow**:
  1. User triggers an action (e.g. logs a 15 km car trip).
  2. Input is passed to domain calculator (`calculateCarbon`).
  3. Action dispatched to `AppContext` provider.
  4. State updates in memory and persists asynchronously to `AsyncStorage`.
  5. UI components reactively re-render with animated color transitions.

---

### **Slide 6: Live Application Demonstration (Screen Transition)**
*(Switch from slides to physical phone via Expo Go or screen mirroring)*
* **Demo Sequence**:
  1. **Onboarding**: Show 3-page carousel, select avatar icon `🌱`, set daily budget to 10 kg.
  2. **Dashboard (W6 + W8)**: Highlight circular `CarbonMeter`, check off a habit in the **Daily Eco-Habits Checklist (`CustomCheckbox`)**, and show the **Live City Air Quality Card (`fetch` + `async/await` + `CustomPicker`)** pulling live Istanbul AQI telemetry.
  3. **Activity Logger (W6 RadioButton)**: Select **Transport** → **Car Drive** → enter 15 km → select **Eco / Shared Mode (0.8x)** via `RadioButtonGroup` → tap **Log Activity**.
  4. **Campus Eco-Hub (W9 Map, Camera, Notifications)**: Tap a pin on the **Campus Green Map**, open the **Eco-Camera Viewfinder** to verify a green action (`Image`), and tap **Trigger Instant Test Notification 🔔**.
  5. **History & Search (W6 FlatList & Picker)**: Search for "Car", filter by "Transport", sort by **Highest CO₂ Impact** using `CustomPicker`, and demonstrate delete.
  6. **Eco Tips**: Browse actionable tips, filter by 🟢 Easy, and expand an accordion card.
  7. **Profile & i18n**: Show real-world equivalents (km driven, trees required), adjust daily budget, and toggle **Language (EN / TR i18n)**.

---

### **Slide 7: Technical Challenges Faced & Solutions**
1. **Challenge 1: Real-time SVG circular gauge animation without performance drops.**
   - *Solution*: Animated SVG `strokeDashoffset` using React Native's `Animated.createAnimatedComponent(Circle)` to eliminate UI thread lag.
2. **Challenge 2: Multi-sector timeline filtering and date grouping.**
   - *Solution*: Built a pure aggregation algorithm memoized via `useMemo`, grouping logs by calendar day with independent daily emission subtotals.
3. **Challenge 3: Offline persistence and data consistency.**
   - *Solution*: Encapsulated AsyncStorage operations inside a robust storage utility with default seed fallbacks, ensuring zero crashes on first run.

---

### **Slide 8: Future Roadmap & Enhancements**
* **Barcode & Receipt Scanning**: Use mobile camera to scan food product barcodes or grocery receipts to automatically extract food emissions.
* **GPS Route Tracking**: Automatically calculate commute emissions using real-time geolocation tracking.
* **Community Challenges & Leaderboards**: Compete with university peers or colleagues to achieve the longest low-carbon streak.
* **Multi-Language Support (i18n)**: English and Indonesian localization.

---

### **Slide 9: Conclusion & Summary**
* GreenStep bridges the gap between environmental concern and individual action.
* Meets all project criteria: 6 polished screens, robust navigation, state management, local database persistence, and original code.
* Thank you for your time! Now open for questions.

---

## 🎙️ Verbatim Presentation Script (Read During Class)

### **[00:00 - 01:00] Introduction & Motivation**
> "Good morning, Professor and fellow classmates. Today, I am proud to present **GreenStep**—a personal carbon footprint tracker and eco-lifestyle companion built using React Native and Expo.
>
> When we talk about climate change, the conversation usually revolves around huge corporations or international treaties. But in reality, environmental studies show that over **60% of all global greenhouse gas emissions** are directly linked to our daily choices—how we commute to campus, the food we choose to eat, and how we run appliances at home.
>
> The problem isn't that people don't care; it's that carbon emissions are invisible. You know how many calories are in a meal, or how much money is in your bank account, but nobody knows how much CO₂ their commute emitted today. **GreenStep solves this by giving users a personal, visual carbon budget.**"

### **[01:00 - 01:45] Target Audience & Stack**
> "We designed GreenStep specifically for students and urban commuters. These users need something fast, beautiful, and intuitive.
>
> For our technology stack, we chose **React Native with Expo SDK 51**. This allows high-performance native compilation across both iOS and Android. For navigation, we implemented **React Navigation v6** with both bottom tab and stack navigators. 
>
> For state management and data persistence, rather than relying on bloated libraries, we built a centralized **React Context Provider** coupled with an **AsyncStorage** local persistence layer. This ensures that the app works 100% offline and saves every user record persistently between app launches."

### **[01:45 - 05:45] Live Demonstration**
*(Pick up phone or open emulator)*
> "Let me walk you through a live demonstration of the application.
>
> When a new user opens GreenStep for the first time, they are welcomed by this 3-step interactive onboarding flow. Here, they learn about our four main emission categories: Transport, Food, Energy, and Shopping. On the final slide, they can personalize their profile—let's name ourselves 'Alex', pick our green sprout avatar, and set a daily target of 10 kilograms of CO₂.
>
> Now, we are taken to the **Main Dashboard**. At the center, you can see our custom circular SVG carbon meter. Currently, it shows our logged emissions for today. Below it, we have our key metric tiles, our 7-day emission trend bar chart, and our sector distribution rings.
>
> Let's log an activity. I'll tap the quick shortcut for **Transport**.
> This opens our **Activity Logger**. I can select between cars, buses, trains, or flights. Notice that each activity has a scientifically calibrated CO₂ factor. Let's select **Car Drive** and enter **15 kilometers**.
> 
> As I type, you can see the **live impact preview** recalculating instantly: 15 km times 0.21 kg per km gives us **3.15 kg of CO₂**. I'll add an optional note: 'Commute to campus', and hit **Log Activity**.
>
> Instantly, you see the confirmation alert. Returning to the Dashboard, the circular meter smoothly animates to reflect the new total, and our sector breakdown updates automatically.
>
> Next, let's look at the **History tab**. Here, every single activity is grouped by date, showing today's entries with their individual timestamps. I can use the search bar at the top to filter for 'campus', or tap the sector pills to isolate transport emissions. If an entry was made by mistake, tapping the trash icon prompts a confirmation dialog to delete it.
>
> Over on the **Tips tab**, GreenStep offers actionable lifestyle advice organized by difficulty. We also have a rotating eco-fact card that cycles every few seconds, and an impact counter showing that adopting these tips can save over 50 kilograms of CO₂ per month.
>
> Finally, in the **Profile tab**, users can adjust their daily targets, customize their avatar, and view real-world equivalents—translating their abstract kilograms into equivalent car kilometers driven or trees needed to absorb their footprint."

### **[05:45 - 07:00] Technical Challenges & Architecture**
> "During the development process, we tackled three primary engineering challenges:
> 
> First, creating a **smooth, animated circular progress gauge** without external heavy chart libraries. We engineered a custom solution using `react-native-svg` and native interpolation on `strokeDashoffset`, ensuring seamless 60-fps performance.
> 
> Second, **real-time performance with complex calculations**. Because the app computes 7-day rolling trends and percentage distributions on every render, we utilized React's `useMemo` hooks inside our Context provider. This prevents unnecessary recalculations when users are simply typing into inputs.
> 
> Third, **robust data persistence**. We structured our storage utility with safe serialization and seed fallbacks, so that if a user opens the app offline or on a fresh install, the app never crashes."

### **[07:00 - 08:00] Future Scope & Conclusion**
> "Looking ahead, we plan to implement camera-based receipt scanning for automated grocery footprint tracking, GPS route detection, and social community leaderboards.
> 
> In conclusion, GreenStep is a complete, original, and production-ready mobile application that fulfills every guideline for this course: 6 polished screens, robust state management, local database persistence, and clean code.
> 
> Thank you, and I would now be happy to take any questions."

---

## 🎯 Anticipated Instructor Q&A & Model Answers

### **Q1: Why did you choose React Context instead of Redux or Zustand?**
> **Answer**: "We evaluated state management options based on the actual scale of our application. For a client-side sustainability tracker with localized data persistence, Redux Toolkit introduces substantial boilerplate (slices, reducers, thunk middleware) without performance advantages. React Context, when properly structured with memoized selectors (`useMemo`) and encapsulated helper methods, provides clean unidirectional data flow with zero external runtime overhead."

### **Q2: How is data persisted when the user closes the app?**
> **Answer**: "All activity logs, user profile settings, and daily goals are stored using `@react-native-async-storage/async-storage`. Whenever an activity is logged or deleted via our `AppContext`, the changes are committed to local JSON key-value documents (`@greenstep_logs_v1`, `@greenstep_profile_v1`). On app startup, our `loadInitialData` lifecycle method asynchronously hydrates the state before rendering the main screens."

### **Q3: Where did the CO₂ calculation factors come from? Are they accurate?**
> **Answer**: "The emission factors are based on open published benchmarks from DEFRA (UK Department for Environment, Food & Rural Affairs) and Our World in Data. For example, a petrol car is estimated at 0.21 kg CO₂ per passenger kilometer, public bus travel at 0.089 kg/km, and beef meals at approximately 6.61 kg CO₂e due to methane emissions from livestock. This ensures our app provides scientifically meaningful numbers rather than random estimates."

### **Q4: How did you handle edge cases such as invalid user input or an empty history list?**
> **Answer**: "We implemented comprehensive defensive design. In the logger screen, quantities are strictly validated as positive numeric values, rejecting negative numbers, non-numeric characters, and zero. For empty states, such as when no activities have been logged today or a search query yields no results, we created a reusable `EmptyState` component that provides clear visual feedback and a direct call-to-action button."
