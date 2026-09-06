---
name: ui-ux-pro-max
description: "UI/UX design intelligence for web, mobile, and desktop. Use when designing, building, reviewing, or fixing interfaces, including pages, components, design systems, accessibility, interaction, responsive layout, typography, color, charts, and stack-specific UI implementation."
---

# UI/UX Pro Max

This project uses the upstream UI/UX Pro Max skill from NextLevelBuilder.

For the complete skill data and search tools, install the upstream package in the project environment with:

`npx skills add https://github.com/nextlevelbuilder/ui-ux-pro-max-skill --skill ui-ux-pro-max`

Official source: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill

## FarmPlug AI usage

Apply this skill to both:
- Next.js/React/Tailwind website UI
- Flutter/Dart farmer Android app UI

Priorities:
1. Preserve existing FarmPlug business logic, authentication, Supabase integration, routes, and working functionality.
2. Use the FarmPlug agriculture-focused visual direction rather than generic SaaS styling.
3. Optimize mobile-first responsive layouts and touch targets.
4. Maintain accessibility, readable typography, clear hierarchy, and strong CTA states.
5. Avoid unnecessary rewrites or duplicate page implementations.
6. Audit existing screens before changing them.
7. Do not expose credentials, API keys, service-role keys, or other secrets.

## Current FarmPlug visual direction

- Dark forest/night canvas: #07130D
- Panels: #0E2019
- Harvest gold: #E3B341
- Leaf green: #7FD79B
- Turmeric-rust accent: #CE7C3B
- Glass surfaces with subtle translucent borders and backdrop blur
- Inter for UI/body; warm organic serif such as Fraunces for major headlines
- Sentence case; avoid unnecessary ALL CAPS labels
- Indian agriculture visual language, not generic SaaS imagery

## Required audit scope

When asked to audit/redesign FarmPlug UI, inspect:
- public landing/auth/onboarding flows
- farmer workspace
- buyer workspace
- FPO workspace
- admin workspace
- shared navigation and responsive behavior
- Flutter farmer app

Then implement improvements incrementally, preserving functionality and validating TypeScript/build checks for web changes and the existing GitHub Actions Flutter build for Android changes.
