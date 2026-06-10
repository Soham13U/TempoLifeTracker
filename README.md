# Tempo

A lightweight, privacy-first manual daily life tracker built with Expo and React Native.

Track where your day goes by starting timers for activities, reviewing timelines, and reflecting on category breakdowns — all stored locally on your device.

## Stack

- Expo SDK 56 + Expo Router
- TypeScript
- Tamagui
- Expo SQLite
- Zustand
- React Hook Form + Zod
- date-fns, Expo Notifications, Reanimated, lucide-react-native

## Getting started

```bash
npm install
npx expo start
```

Then press `a` for Android emulator, `i` for iOS simulator, or scan the QR code with Expo Go.

## Android: "Incompatible SDK version" / no Play Store update

**Tempo uses Expo SDK 56.** As of early 2026, **Expo Go for SDK 56 is not on Google Play** (Play Store only has an older Expo Go). Updating the app from Play Store will not fix this — you need the SDK 56 build of Expo Go.

### Option A — Install Expo Go SDK 56 on your phone (recommended)

1. On your phone, uninstall the Play Store **Expo Go** app (optional but avoids version conflicts).
2. Open **[expo.dev/go](https://expo.dev/go)** in the phone browser.
3. Set **SDK Version** to **SDK 56**.
4. Tap **Android → Install** and allow installation from the browser / unknown sources if prompted.
5. On your PC, run `npx expo start` and scan the QR code with the **new** Expo Go.

### Option B — USB + PC installs Expo Go for you

1. Enable **Developer options** and **USB debugging** on your Android phone.
2. Connect the phone by USB; on PC run `adb devices` and confirm the device appears.
3. Run `npx expo start`, then press **`a`** in the terminal — Expo CLI can install the matching Expo Go APK via adb.

### Option C — Android emulator on your PC (no phone)

Install [Android Studio](https://developer.android.com/studio), create a virtual device, then:

```bash
npx expo start --android
```

### Option D — Development build (no Expo Go)

If you have Android Studio / SDK installed:

```bash
npx expo run:android
```

This builds and installs Tempo directly on a connected device or emulator.

### Timer notifications in Expo Go

`expo-notifications` **does not load in Expo Go on Android** (SDK 53+). Tempo skips notifications there so the app still runs; timer tracking works normally. For notifications, use `npx expo run:android` (development build).

### Web (`npx expo start --web`)

Web uses **localStorage** via `database.web.ts` (not WASM SQLite). Data persists in the browser. For the full native SQLite experience, use Android/iOS.

## Features (MVP)

- Start, pause, resume, stop, and switch activity timers
- Active timer survives app restart (timestamp-based, no background loop)
- Today view with quick-start grid and timeline
- Dashboard with date navigation, category breakdown, top activities, weekly chart
- Activity management (create, edit, archive)
- Session editing (times, notes, delete)
- Onboarding, theme (system/light/dark), notifications, JSON/CSV export

## Project structure

```
src/app/           Expo Router screens
src/components/    UI, timer, dashboard, forms
src/db/            SQLite schema, repos, seed
src/store/         Zustand stores
src/utils/         Analytics, dates, durations
src/theme/         Tamagui config
```
