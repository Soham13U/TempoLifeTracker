# Daily Life Tracker Mobile App — Cursor Build Brief

## Project Summary

Build a lightweight, privacy-first mobile app for manually tracking daily life activities.

The app works like a manual version of Rize or Screen Time for real life. The user starts a timer when beginning an activity, stops or switches activities when they move to something else, and then reviews their day through a clean dashboard.

The product should feel minimal, modern, fast, and satisfying. Avoid over-engineering. No AI features in the MVP.

---

## Product Name Placeholder

Use one of these as a temporary name:

- **Dayprint**
- **Tempo**
- **Dayform**
- **Pulse**
- **LifeLog**

For now, use:

```txt
Tempo
```

---

## Core Product Philosophy

The app should answer one question:

> “Where did my day actually go?”

The app should not feel like a strict productivity app. It should feel like a calm daily awareness tool.

Important principles:

1. Manual-first tracking.
2. Local-first data.
3. Lightweight background behavior.
4. Beautiful timeline-based dashboard.
5. No social features.
6. No AI in the MVP.
7. No complicated habit system in the MVP.
8. No automatic phone/app tracking in the MVP.

---

## Tech Stack

Use:

```txt
React Native
Expo
TypeScript
Expo Router
Tamagui
Expo SQLite
Zustand
React Hook Form
Zod
React Native Reanimated
Expo Notifications
date-fns
```

### Why this stack?

- **Expo**: fast React Native development and easy testing.
- **TypeScript**: safer data models and cleaner app structure.
- **Expo Router**: file-based routing.
- **Tamagui**: clean, modern UI system for React Native.
- **Expo SQLite**: local persistent database.
- **Zustand**: simple global state for active timer and UI state.
- **React Hook Form + Zod**: form validation for activities and manual session edits.
- **Reanimated**: smooth UI interactions.
- **Expo Notifications**: active timer reminders/notifications.

---

## Important Performance Rule

Do **not** run a constant background loop for the timer.

When the user starts a timer, save the `startTime`.

When showing elapsed time, calculate it like this:

```ts
const elapsedMs = Date.now() - activeSession.startTime;
```

If the app closes or is killed, the active session should still be recoverable because the `startTime` is stored locally.

Use notifications only to remind the user that a timer is active. Do not use heavy background work.

---

## MVP Scope

The MVP includes:

1. Create, edit, archive activities.
2. Start an activity timer.
3. Pause/resume timer.
4. Stop timer.
5. Switch from one activity to another.
6. Store all activity sessions locally.
7. Show today's timeline.
8. Show today's category totals.
9. Show daily dashboard.
10. Edit/delete sessions.
11. Add optional notes to sessions.
12. Basic weekly dashboard.
13. Active timer notification.
14. Clean onboarding.

The MVP does **not** include:

1. AI summaries.
2. Smart recommendations.
3. Automatic tracking.
4. Location tracking.
5. Calendar integration.
6. Wearables.
7. Social sharing.
8. Cloud sync.
9. User accounts.
10. Complex streaks.
11. Habit coaching.
12. Week 4 smart features.

---

## App Structure

Use this folder structure:

```txt
/src
  /app
    _layout.tsx
    index.tsx
    /(tabs)
      _layout.tsx
      today.tsx
      dashboard.tsx
      activities.tsx
      settings.tsx
    /activity
      new.tsx
      [id].tsx
    /session
      [id].tsx

  /components
    /ui
      AppButton.tsx
      AppCard.tsx
      AppText.tsx
      Screen.tsx
      SectionHeader.tsx
      EmptyState.tsx
    /timer
      ActiveTimerCard.tsx
      ActivityGrid.tsx
      QuickActivityButton.tsx
    /dashboard
      DaySummaryCard.tsx
      CategoryBreakdown.tsx
      Timeline.tsx
      TimelineItem.tsx
      WeeklySummary.tsx
    /forms
      ActivityForm.tsx
      SessionForm.tsx

  /db
    database.ts
    schema.ts
    migrations.ts
    activityRepo.ts
    sessionRepo.ts

  /store
    timerStore.ts
    activityStore.ts

  /types
    activity.ts
    session.ts
    dashboard.ts

  /utils
    date.ts
    duration.ts
    colors.ts
    categories.ts
    analytics.ts

  /theme
    tamagui.config.ts
    tokens.ts
```

---

## Data Models

### Activity

```ts
export type ActivityCategory =
  | "focus"
  | "learning"
  | "health"
  | "life"
  | "leisure"
  | "rest"
  | "other";

export type Activity = {
  id: string;
  name: string;
  category: ActivityCategory;
  icon?: string;
  color?: string;
  isArchived: boolean;
  createdAt: number;
  updatedAt: number;
};
```

### Activity Session

```ts
export type ActivitySession = {
  id: string;
  activityId: string;
  startTime: number;
  endTime: number | null;
  pausedDurationMs: number;
  note?: string;
  createdAt: number;
  updatedAt: number;
};
```

### Active Timer State

```ts
export type ActiveTimerState = {
  activeSessionId: string | null;
  activityId: string | null;
  startTime: number | null;
  pausedAt: number | null;
  pausedDurationMs: number;
  isPaused: boolean;
};
```

---

## SQLite Tables

Create these tables.

### activities

```sql
CREATE TABLE IF NOT EXISTS activities (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  is_archived INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
```

### activity_sessions

```sql
CREATE TABLE IF NOT EXISTS activity_sessions (
  id TEXT PRIMARY KEY NOT NULL,
  activity_id TEXT NOT NULL,
  start_time INTEGER NOT NULL,
  end_time INTEGER,
  paused_duration_ms INTEGER NOT NULL DEFAULT 0,
  note TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (activity_id) REFERENCES activities(id)
);
```

### app_settings

```sql
CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL
);
```

---

## Default Activities

Seed the app with default activities on first launch:

```ts
const DEFAULT_ACTIVITIES = [
  { name: "Coding", category: "focus", icon: "code" },
  { name: "Deep Work", category: "focus", icon: "target" },
  { name: "Japanese", category: "learning", icon: "book-open" },
  { name: "Reading", category: "learning", icon: "book" },
  { name: "Piano", category: "learning", icon: "music" },
  { name: "Workout", category: "health", icon: "dumbbell" },
  { name: "Walk", category: "health", icon: "footprints" },
  { name: "Cooking", category: "life", icon: "utensils" },
  { name: "Cleaning", category: "life", icon: "sparkles" },
  { name: "Gaming", category: "leisure", icon: "gamepad-2" },
  { name: "Social", category: "leisure", icon: "users" },
  { name: "Rest", category: "rest", icon: "moon" },
  { name: "Other", category: "other", icon: "circle" }
];
```

Use icons from a lightweight icon library such as `lucide-react-native`.

---

## Main Screens

## 1. Today Screen

Purpose:

The main screen where the user starts, pauses, stops, and switches activities.

Sections:

1. Active timer card.
2. Quick activity grid.
3. Today's mini summary.
4. Today's timeline.

Layout idea:

```txt
Good evening, Soham

[ Active Timer Card ]
Coding
01:24:36
[ Pause ] [ Stop ]

Quick Start
[ Coding ] [ Japanese ] [ Workout ]
[ Piano  ] [ Reading  ] [ Gaming  ]

Today
Tracked: 5h 40m
Focus: 3h 10m
Health: 55m
Leisure: 1h 35m

Timeline
09:30 - 10:45 Coding
11:10 - 12:00 Japanese
18:30 - 19:20 Workout
```

Important behavior:

- If no timer is active, show a calm empty active timer card.
- Tapping an activity starts a session.
- If another session is active, tapping a new activity should switch sessions:
  1. End current active session.
  2. Create new session.
  3. Update active timer state.

---

## 2. Dashboard Screen

Purpose:

Show the shape of the selected day.

Sections:

1. Date selector.
2. Total tracked time.
3. Category breakdown.
4. Top activities.
5. Full timeline.

Layout idea:

```txt
Today, 2 June

Total Tracked
6h 20m

Category Breakdown
Focus       3h 10m
Learning    1h 00m
Health      0h 55m
Leisure     1h 15m

Top Activities
Coding      2h 40m
Workout     55m
Japanese    45m

Timeline
[Full timeline]
```

Use clean cards, soft shadows, rounded corners, generous spacing.

---

## 3. Activities Screen

Purpose:

Manage activities.

Features:

1. List active activities.
2. Add new activity.
3. Edit activity.
4. Archive activity.
5. Show category label.

Layout idea:

```txt
Activities

Focus
Coding
Deep Work

Learning
Japanese
Reading
Piano

Health
Workout
Walk

[ + New Activity ]
```

Do not permanently delete activities by default. Archive them.

---

## 4. Settings Screen

Purpose:

Simple app preferences.

MVP settings:

1. Theme: system/light/dark.
2. Active timer notification on/off.
3. Export data as JSON.
4. Export data as CSV.
5. Reset demo data.
6. About app.

No login. No account. No cloud sync.

---

## UI Direction

Use Tamagui to create a clean, modern, satisfying look.

Visual style:

- Calm background.
- Soft cards.
- Rounded corners.
- Large readable typography.
- Subtle animations.
- Minimal color noise.
- Category colors should be muted, not harsh.
- The timer should feel satisfying and central.

Possible color direction:

```txt
Background: warm off-white / near black in dark mode
Cards: slightly elevated surface
Primary: muted blue, teal, or violet
Focus: blue
Learning: purple
Health: green
Life: amber
Leisure: pink
Rest: indigo
Other: gray
```

Use dark mode support from the beginning.

---

## Component Requirements

### AppButton

Reusable button with variants:

```ts
type AppButtonVariant = "primary" | "secondary" | "ghost" | "danger";
```

### AppCard

Reusable card component.

Props:

```ts
type AppCardProps = {
  children: React.ReactNode;
  padded?: boolean;
  pressable?: boolean;
  onPress?: () => void;
};
```

### ActiveTimerCard

Shows:

- Current activity name.
- Elapsed duration.
- Pause/resume button.
- Stop button.
- Optional note button.

Behavior:

- Updates visible elapsed time every second only while mounted.
- Does not rely on background interval for actual tracking.
- Always calculates from persisted timestamps.

### ActivityGrid

Shows quick-start activity buttons.

Behavior:

- Tapping activity starts or switches session.

### Timeline

Shows chronological activity sessions for a day.

Each TimelineItem shows:

- Activity name.
- Category indicator.
- Start time.
- End time.
- Duration.
- Optional note marker.

---

## Timer Logic

Implement timer actions in a single service or Zustand store.

Required actions:

```ts
startActivity(activityId: string): Promise<void>
pauseTimer(): Promise<void>
resumeTimer(): Promise<void>
stopTimer(): Promise<void>
switchActivity(activityId: string): Promise<void>
loadActiveSession(): Promise<void>
```

### startActivity

If no active session exists:

1. Create new session with `startTime = Date.now()`.
2. Save session in SQLite.
3. Store active session state.

If active session exists:

1. Call `switchActivity(activityId)`.

### switchActivity

1. Stop current session.
2. Create new session.
3. Update active timer state.

### pauseTimer

1. Set `pausedAt = Date.now()`.
2. Set `isPaused = true`.
3. Persist state in app settings.

### resumeTimer

1. Calculate pause duration:
   ```ts
   Date.now() - pausedAt
   ```
2. Add it to `pausedDurationMs`.
3. Set `pausedAt = null`.
4. Set `isPaused = false`.
5. Persist state.

### stopTimer

1. If paused, account for paused duration.
2. Set current session `endTime = Date.now()`.
3. Save final `pausedDurationMs`.
4. Clear active timer state.

### elapsed calculation

```ts
function getElapsedMs(session: ActivitySession, activeState?: ActiveTimerState) {
  const now = Date.now();
  const rawEnd = session.endTime ?? now;
  const pausedExtra =
    activeState?.isPaused && activeState.pausedAt
      ? now - activeState.pausedAt
      : 0;

  return rawEnd - session.startTime - session.pausedDurationMs - pausedExtra;
}
```

---

## Dashboard Calculations

Create utility functions in:

```txt
/src/utils/analytics.ts
```

Required functions:

```ts
getSessionsForDay(date: Date): Promise<ActivitySession[]>

getTotalTrackedMs(sessions: ActivitySession[]): number

getCategoryTotals(
  sessions: ActivitySession[],
  activities: Activity[]
): Record<ActivityCategory, number>

getActivityTotals(
  sessions: ActivitySession[]
): Record<string, number>

getTimelineItems(
  sessions: ActivitySession[],
  activities: Activity[]
): TimelineItem[]
```

For day boundaries, use local timezone.

---

## Notifications

MVP requirement:

When timer is active, show a notification:

```txt
Tracking: Coding
Timer is running.
```

Actions are optional for MVP. Do not overcomplicate.

Notification behavior:

1. Show notification when activity starts.
2. Update/cancel notification when activity stops.
3. If notification updates are difficult in Expo, keep it simple:
   - send a reminder notification after a set time, such as 60 minutes.
   - allow user to disable this in settings.

---

## Onboarding

Simple 3-screen onboarding:

### Screen 1

```txt
Track your day manually

Start a timer when you begin an activity.
Switch when your day changes.
```

### Screen 2

```txt
See the shape of your day

Review your focus, learning, health, leisure, and rest.
```

### Screen 3

```txt
Private by default

Your data stays on your device in the MVP.
```

Then seed default activities and open Today screen.

---

## MVP Roadmap

## Week 1 — Core Tracker

Goal:

Build the basic app where users can start, stop, pause, resume, and switch activity timers.

Tasks:

1. Set up Expo + TypeScript.
2. Set up Expo Router.
3. Set up Tamagui.
4. Set up SQLite database.
5. Create database tables.
6. Seed default activities.
7. Build Today screen.
8. Build ActiveTimerCard.
9. Build ActivityGrid.
10. Implement start timer.
11. Implement stop timer.
12. Implement switch activity.
13. Implement pause/resume.
14. Persist active timer state.
15. Recover active timer after app restart.

Acceptance criteria:

- User can open app and see default activities.
- User can start an activity timer.
- User can stop an activity timer.
- User can switch from one activity to another.
- Timer still shows correct elapsed time after closing and reopening the app.
- Data is stored locally.

---

## Week 2 — Daily Dashboard

Goal:

Make the app useful for daily reflection.

Tasks:

1. Build Dashboard screen.
2. Build date selector.
3. Show total tracked time for selected day.
4. Show category breakdown.
5. Show top activities.
6. Build Timeline component.
7. Add session detail screen.
8. Allow editing session start/end time.
9. Allow adding/editing session note.
10. Allow deleting a session.
11. Handle empty states.

Acceptance criteria:

- User can see what they tracked today.
- User can view a timeline of the day.
- User can edit incorrect sessions.
- User can delete accidental sessions.
- User can see time grouped by category.

---

## Week 3 — Polish, Notifications, and Export

Goal:

Make the MVP feel complete and satisfying.

Tasks:

1. Add onboarding.
2. Add dark mode support.
3. Add activity creation form.
4. Add activity edit form.
5. Add archive activity behavior.
6. Add active timer notification/reminder.
7. Add basic weekly dashboard.
8. Add CSV export.
9. Add JSON export.
10. Add micro-interactions using Reanimated.
11. Polish spacing, typography, cards, and dashboard visuals.
12. Add loading states.
13. Add error handling.
14. Test app restart behavior.
15. Test timer accuracy.

Acceptance criteria:

- App feels clean and smooth.
- User can customize activities.
- User can export their data.
- User can see basic weekly totals.
- Timer behavior remains accurate.
- App does not feel heavy.

---

## Suggested Implementation Order for Cursor

Build in this order:

1. Create Expo project with TypeScript.
2. Add Expo Router.
3. Add Tamagui.
4. Create base theme.
5. Create reusable UI components.
6. Set up SQLite.
7. Create schema and migrations.
8. Seed default activities.
9. Create activity repository.
10. Create session repository.
11. Create timer store.
12. Build Today screen.
13. Build timer interactions.
14. Build Dashboard screen.
15. Build Timeline.
16. Build Activities screen.
17. Build edit forms.
18. Add notifications.
19. Add export.
20. Polish.

---

## Cursor Instructions

When generating code, follow these rules:

1. Use TypeScript everywhere.
2. Keep components small and reusable.
3. Avoid unnecessary dependencies.
4. Prefer local-first architecture.
5. Do not add authentication.
6. Do not add cloud sync.
7. Do not add AI features.
8. Do not add automatic screen/app tracking.
9. Use SQLite for persistent local data.
10. Use Zustand only for active runtime state.
11. Use repository files for database operations.
12. Keep dashboard calculations in utility files.
13. Keep UI clean and minimal.
14. Make the timer accurate using timestamps, not background loops.
15. Make the app work even after being closed and reopened.
16. Use Tamagui components where appropriate.
17. Use Expo-compatible libraries only unless absolutely necessary.
18. Ask before introducing native modules outside the Expo ecosystem.

---

## First Cursor Prompt

Use this prompt to start the project:

```txt
Build a React Native Expo TypeScript mobile app called Tempo.

Tempo is a lightweight manual daily life tracker. Users manually start a timer for activities like Coding, Japanese, Workout, Piano, Reading, Gaming, Rest, etc. The app stores activity sessions locally using SQLite and shows a daily dashboard with total tracked time, category breakdown, top activities, and a timeline.

Use Expo Router, Tamagui, Expo SQLite, Zustand, React Hook Form, Zod, date-fns, Expo Notifications, and React Native Reanimated.

Do not add AI, authentication, cloud sync, automatic tracking, location tracking, calendar integration, or social features.

Build the foundation first:
1. Set up the app structure.
2. Configure Tamagui.
3. Create SQLite schema and migration setup.
4. Seed default activities.
5. Build reusable UI components.
6. Build Today screen with ActiveTimerCard and ActivityGrid.
7. Implement timer logic using stored timestamps, not a continuous background loop.
8. Persist and recover the active timer after app restart.

Follow the project brief exactly. Keep the UI clean, modern, calm, and satisfying.
```

---

## Second Cursor Prompt

After the first version works, use this:

```txt
Now build the Dashboard screen for Tempo.

Requirements:
1. Show selected date.
2. Show total tracked time for that day.
3. Show category breakdown.
4. Show top activities.
5. Show chronological timeline.
6. Create reusable components: DaySummaryCard, CategoryBreakdown, Timeline, TimelineItem.
7. Add empty states when no sessions exist.
8. Use local timezone day boundaries.
9. Keep all analytics calculations in src/utils/analytics.ts.
10. Keep UI consistent with Tamagui theme.
```

---

## Third Cursor Prompt

After dashboard works, use this:

```txt
Now build activity and session management for Tempo.

Requirements:
1. Activities screen grouped by category.
2. Create new activity.
3. Edit activity name, category, icon, and color.
4. Archive activity instead of deleting it.
5. Session detail screen.
6. Edit session start time and end time.
7. Add or edit session note.
8. Delete accidental session.
9. Use React Hook Form and Zod for forms.
10. Keep database operations in repository files.
```

---

## Fourth Cursor Prompt

For polish:

```txt
Now polish the Tempo MVP.

Requirements:
1. Add onboarding screens.
2. Add dark mode support.
3. Add active timer notification or reminder.
4. Add weekly dashboard summary.
5. Add CSV export.
6. Add JSON export.
7. Add subtle Reanimated micro-interactions.
8. Improve empty states.
9. Improve error handling.
10. Test timer recovery after app restart.
11. Keep the app lightweight and local-first.
```

---

## Definition of Done

The MVP is done when:

1. A user can create and manage activities.
2. A user can start, pause, resume, stop, and switch timers.
3. Sessions are saved locally.
4. Active timer survives app restart.
5. The Today screen is useful.
6. The Dashboard screen clearly shows the day.
7. The Timeline is editable.
8. Weekly summary exists.
9. CSV/JSON export exists.
10. App has clean modern UI.
11. App has no AI, no auth, no cloud sync, and no automatic tracking.
12. App feels lightweight.
