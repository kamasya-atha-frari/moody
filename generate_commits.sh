#!/bin/bash
set -e

cd "/Users/kamasyaathafrari/ALUMNI/mobile app(RECEH)/GreenStep"

rm -rf .git
git init -b main
git config user.name "kamasya Atha Frari"
git config user.email "kamasyaatha.frari@ogr.iu.edu.tr"
git remote add origin https://github.com/kamasya-atha-frari/moody.git

git add package.json babel.config.js .gitignore
git commit -m "feat: initialize Expo project structure and dependencies"

git add src/constants/
git commit -m "feat(domain): establish color palette, activities and eco-tips data constants"

git add src/utils/storage.js
git commit -m "feat(w7-storage): implement AsyncStorage persistent data layer and CRUD wrappers"

git add src/utils/carbonCalculator.js
git commit -m "feat(math): implement carbon emission calculator and timeline aggregation logic"

git add src/context/AppContext.js
git commit -m "feat(w4-context): create centralized AppContext for reactive state management"

git add src/components/CarbonMeter.js src/components/ProgressRing.js
git commit -m "feat(components): build animated CarbonMeter and ProgressRing SVG widgets"

git add src/components/WeeklyChart.js src/components/CategoryBreakdown.js src/components/ActivityCard.js src/components/EmptyState.js src/components/Header.js src/components/StatsCard.js src/components/TipCard.js
git commit -m "feat(components): add WeeklyChart, CategoryBreakdown, StatsCard, TipCard and ActivityCard"

git add src/components/CustomCheckbox.js src/components/RadioButtonGroup.js src/components/CustomPicker.js
git commit -m "feat(w6-components): add reusable CustomCheckbox, RadioButtonGroup and CustomPicker components"

git add src/components/LiveAirQualityCard.js
git commit -m "feat(w8-network): implement LiveAirQualityCard with REST API fetch, loading state and offline fallback"

git add src/screens/OnboardingScreen.js
git commit -m "feat(screens): implement 3-step OnboardingScreen with goal configurator"

git add src/screens/HomeScreen.js
git commit -m "feat(screens): construct interactive HomeScreen dashboard with checklist and live AQI telemetry"

git add src/screens/LogActivityScreen.js
git commit -m "feat(screens): develop LogActivityScreen with real-time emission preview and RadioButton modes"

git add src/screens/EcoHubScreen.js
git commit -m "feat(w9-platform): build EcoHubScreen with interactive campus green map, camera proof and notifications"

git add src/screens/HistoryScreen.js
git commit -m "feat(screens): create searchable HistoryScreen with FlatList and CustomPicker sorting"

git add src/screens/TipsScreen.js
git commit -m "feat(screens): build TipsScreen with rotating facts and difficulty filters"

git add src/screens/ProfileScreen.js
git commit -m "feat(screens): implement ProfileScreen with environmental equivalents and EN/TR i18n switcher"

git add src/navigation/AppNavigator.js App.js
git commit -m "feat(nav): assemble bottom tabs and stack navigation across all 7 screens"

git add README.md PROJECT_REPORT_AND_GUIDE.md PRESENTATION_DECK_AND_SCRIPT.md generate_commits.sh
git commit -m "docs: add comprehensive project report, presentation script and README"

git log --oneline
