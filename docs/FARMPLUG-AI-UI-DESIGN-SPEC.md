# FarmPlug AI — Production UI Design Specification

## Product

Design a modern, clean, responsive UI for **FarmPlug AI**, an AI-powered agricultural platform that helps farmers detect crop diseases, understand farm risks, discover better market prices, connect with verified buyers, and coordinate produce logistics.

**Tagline:** From Farm Intelligence to the Right Market.

**Primary journey:** Detect → Decide → Sell → Deliver

## Product context

- Target users: Farmers, agricultural students/field workers, buyers, and administrators.
- Core goal: Connect crop intelligence to profitable selling through one simple farmer-first platform.
- Brand mood: Professional, trustworthy, agricultural, modern, practical, and approachable.
- Mode: Both light and dark mode; light mode is the default.
- Primary: `#2F6B3F` agricultural green.
- Accent: `#D99A27` harvest gold.
- Background: `#F7F8F3`.
- Surface: `#FFFFFF`.
- Text: `#172019`.
- Secondary text: `#4D5A50`.
- Error: `#B42318`.
- Success: `#287A3E`.
- Body text/background pairs must meet WCAG AA 4.5:1 minimum; large text 3:1 minimum.
- Avoid generic AI styling such as purple/indigo gradients.

## Design system

### Typography

Use one clean sans-serif family, preferably **Plus Jakarta Sans**.

- H1: 32px bold
- H2: 24px semibold
- H3: 20px semibold
- Body: 16px regular
- Small text: 14px
- Caption: 12–13px
- Line height: approximately 1.5

### Layout

- Mobile-first and responsive through desktop.
- Use an 8px spacing grid.
- Use generous whitespace and clear hierarchy.
- Minimum tap target: 44×44px.
- 16px card radius with subtle shadows.
- Consistent 20–24px outline icons.
- Filled primary buttons; outline/ghost secondary actions.
- Do not overcrowd screens.

## Core screens

### 1. Landing / Home

Hero:

**From Farm Intelligence to the Right Market**

Supporting message:

**Detect crop problems early. Make smarter farm decisions. Find better markets and buyers.**

Primary CTA: **Get Started**

Secondary CTA: **Explore Farm Intelligence**

Show four core capabilities:

1. Crop Health
2. Farm Intelligence
3. Market Prices
4. Buyer & Logistics

Visually reinforce: **Detect → Decide → Sell → Deliver**.

### 2. Farmer Authentication

Provide clean mobile-first authentication with:

- Mobile number/email
- Password
- Sign in
- Create account
- Forgot password
- Show/hide password

Avoid unnecessary authentication complexity.

### 3. Farmer Dashboard

The dashboard should answer: **“What should I do next?”**

Show:

- Farmer greeting
- Farm/location
- Current crop
- Crop health status
- Latest crop scan
- Disease/pest risk
- Weather and crop-stage risk
- Market price and best nearby market
- Buyer matches and latest offers

Primary flow: **Scan Crop → Review Risk → Check Market → Find Buyer**.

### 4. Crop Health AI

Flow:

1. Select crop
2. Take/upload image
3. Analyze image
4. Show result

The current repository implements this as an **image-assisted prototype heuristic**, not a validated ML disease classifier. The UI must make that boundary explicit and must never present the heuristic as a scientific diagnosis.

Result includes:

- Crop
- Possible disease/stress pattern
- Prototype heuristic confidence percentage
- Severity
- Symptoms/signals detected
- Recommended next action

Example presentation:

**Possible early blight / leaf-spot stress**

**Prototype confidence: 91%**

**Severity: Moderate**

The percentage is an implementation-generated heuristic score, not validated model accuracy.

Clearly distinguish AI suggestions from professional diagnosis.

Actions: **Scan Again**, **View Recommendations**, **Contact Expert**.

### 5. Farm Intelligence

Show weather, temperature, humidity, rainfall, crop stage, disease/pest risk, irrigation recommendation, and actionable alerts.

Use simple visual indicators instead of information-heavy charts. Current prototype weather/risk values must be labelled as prototype values until connected to validated live sources.

### 6. Market Intelligence

Show:

- Crop
- Current market price
- Nearby markets
- Price trend
- Distance
- Expected net return
- Recommended market

Include **View Market** and **Compare Markets** actions.

### 7. Buyer Matching

Buyer cards may include:

- Buyer name
- Verification status
- Crop requirement
- Quantity required
- Offered price
- Location
- Pickup/delivery option

Actions: **View Buyer**, **Send Offer**.

Never display a buyer as verified unless the backend confirms verification. The FarmPlug buyer-requirements model now contains an `is_verified` boolean that defaults to `false`.

### 8. Produce Listing

Allow farmers to provide:

- Crop
- Variety
- Quantity
- Expected price
- Harvest date
- Location
- Quality/grade
- Images

Primary CTA: **List Produce**.

### 9. Offers & Negotiation

Show buyer, offered price, quantity, date, and status.

Statuses:

- Pending
- Accepted
- Rejected
- Negotiating
- Completed

Make the current status visually obvious. The dedicated FarmPlug screen recognizes all five statuses; live state changes must continue through authenticated APIs.

### 10. Logistics

Use the timeline:

**Order Confirmed → Pickup → In Transit → Delivered → Completed**

Show buyer, produce, quantity, pickup location, destination, pickup date, and delivery status.

### 11. Notifications

Categories:

- Crop Health
- Farm Alerts
- Market Opportunities
- Buyer Offers
- Orders
- Logistics

Prioritize actionable notifications.

### 12. AI Assistant

Provide an accessible FarmPlug AI assistant for:

- Crop questions
- Disease symptoms
- Farm decisions
- Market information
- Selling guidance

Suggested prompts should be practical and farmer-focused.

### 13. Settings

Sections:

**Account:** Profile, Farm details

**Preferences:** Language, Notifications, Theme

**Security:** Password, Sessions

**Support:** Help, Contact support

**About:** FarmPlug AI, Privacy, Terms

## Navigation

### Mobile Farmer App

Bottom navigation:

**Home | Farm | Market | Orders | Profile**

Provide a prominent but non-intrusive **Scan Crop** action.

### Desktop

Sidebar navigation:

- Dashboard
- Crop Health
- Farm Intelligence
- Markets
- Buyers
- Produce
- Orders
- Logistics
- Notifications
- Settings

## UI states

### Loading

Use skeleton loaders matching the actual card layout.

### Empty

Use a friendly illustration/icon, short explanation, and one clear CTA.

### Error

Use inline validation plus a persistent toast/banner where appropriate. Never expose raw API or database errors to farmers.

### Success

Use a concise confirmation with the next useful action.

## Accessibility

- WCAG AA contrast.
- Minimum 44×44px touch targets.
- Visible keyboard focus.
- Semantic HTML.
- Accessible labels.
- Do not communicate status through color alone.
- Screen-reader-friendly controls and icons.
- Clear error messages.
- Support responsive text scaling.
- Respect reduced-motion preferences.

## Responsive behavior

### Mobile

- Single-column layouts.
- Bottom navigation.
- Full-width primary actions.
- Compact cards.
- Large touch targets.

### Tablet

- Two-column card layouts where appropriate.

### Desktop

- Sidebar navigation.
- Multi-column dashboards.
- Wider data tables where useful.
- Expanded analytics.
- Maximum readable content width.

Never simply stretch the mobile layout onto desktop.

## Visual direction

FarmPlug AI should feel like **modern agricultural infrastructure**, not a generic AI dashboard.

Prefer:

- Agricultural green
- Harvest gold
- Natural neutral backgrounds
- Real agricultural imagery where useful
- Simple line illustrations
- Strong information hierarchy
- Practical data visualization

Avoid:

- Purple/indigo AI gradients
- Excessive glassmorphism
- Excessive animations
- Tiny text
- Low-contrast gray text
- Overcrowded dashboards
- Decorative elements competing with farmer actions

## SIH positioning

The UI must make the relationship between **SIH26131 — crop disease/pest intelligence** and **SIH26132 — market linkage and price discovery** immediately understandable.

Product journey:

**CROP SCAN → RISK DETECTION → FARM DECISION → HARVEST PLANNING → PRICE DISCOVERY → BUYER MATCHING → ORDER → LOGISTICS → SALE COMPLETED**

FarmPlug AI should present these as one connected journey rather than unrelated features.

## Production quality requirements

Every implemented screen must have:

- Clear purpose
- Consistent spacing
- Consistent typography
- Consistent icons
- Accessible contrast
- Responsive behavior
- Loading state
- Empty state
- Error state
- Success state
- Clear primary action

## Current implementation boundary

The current repository is an SIH prototype. Crop-health image analysis is deliberately transparent and heuristic until a validated agricultural ML model is integrated. Weather, market, routing and other demo outputs must retain their prototype/demo disclosure until connected to verified live data sources.

### Primary UX principle

> Make the next best action obvious to the farmer.
