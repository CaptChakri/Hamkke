# Changelog

All notable changes to the Hamkke app are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Draft the next release's section from conventional commits with `npm run release-notes`.

## [Unreleased]

## [1.0.0] - 2026-06-16

Initial release of the Hamkke fitness app — a React Native (Expo) build from the design handoff.

### Added

- **Gym Mode** — full session UI with a responsive web layout, fluid spring-based interactions, and fade-up entrance motion.
- **Gym Mode** — pause a session to continue later, and persist the in-progress session across reloads.
- **Gym Mode** — background sticky notification with tappable set/rest controls.
- **Gym Mode** — in-app music: control Spotify playback without leaving the session.
- **Workouts** — exercise catalog with plan↔muscle coverage, workout-plan rotation, and an accurate "done today" indicator.
- **Workouts** — surface the active workout plan on the dashboard.
- **Session Log** — GitHub-style training heatmap.
- **Dashboard** — hide the resume CTA while a session is active; relaunch lands on the dashboard with the session dropped down.
- **Auth** — Google-only sign-in with real JWT auth and a persisted session.
- **i18n** — Korean language support with a system default and an in-app switcher.
- **Onboarding** — building/gym onboarding and editing, shown only on signup; capture current measurements; Apple Health scaffold.
- **Profile** — a separate Edit Profile page (fixes the save flow).
- **Branding** — Graphite/Platinum brand refresh, Endless Bond logo, and a branded app icon.
- **UI** — optional section-header (Eyebrow) icons; Sora typeface; splash screen; data loaded from the API.

### Fixed

- **nav:** bottom tabs were unclickable on web — `box-none` must go through `StyleSheet`.
- **profile:** show the real ID-verification status instead of a hardcoded "verified".
- **splash:** kill the light-mode "ghost" and keep the splash visible for a minimum ~1.8s.
- **router:** move `HamkkeApp` out of `src/app` so Expo Router finds the real routes.

### Security

- Tolerate auth-gated `/workouts` on bootstrap rather than failing the launch.

### Maintenance

- TDD foundation with jest-expo unit tests.
- EAS build config and `expo-dev-client` for on-device dev builds (on SDK 56).

[Unreleased]: https://github.com/hamkke/HamkeApp/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/hamkke/HamkeApp/releases/tag/v1.0.0
