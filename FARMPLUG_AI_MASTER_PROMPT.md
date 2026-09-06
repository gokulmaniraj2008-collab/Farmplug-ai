# FarmPlug AI — Complete Master Development, UI, Authentication, Architecture, Security & QA Prompt

You are the lead full-stack engineer responsible for completing and production-hardening the existing FarmPlug AI project.

REPOSITORY:
https://github.com/gokulmaniraj2008-collab/Farmplug-ai.git

PROJECT:
FarmPlug AI

TAGLINE:
“From Farm Intelligence to the Right Market.”

TARGET:
Smart India Hackathon 2026
Problem Statement: 26033
Category: Software

==================================================
0. PRIMARY OBJECTIVE
==================================================

Extend the EXISTING FarmPlug AI product.

DO NOT rebuild the project from scratch.
DO NOT replace the existing architecture unnecessarily.
DO NOT remove working functionality.
DO NOT create duplicate versions of existing pages.

First inspect the complete repository and understand:

- Existing routes
- Existing components
- Existing authentication
- Supabase integration
- Database schema
- APIs
- Middleware
- Protected routes
- Role system
- Existing navigation
- Demo Mode
- Android/WebView implementation
- Existing deployment configuration

Then create a short implementation plan before making changes.

The final product must provide one consistent FarmPlug AI ecosystem:

                FARMPLUG AI
                     |
        +------------+------------+
        |                         |
   Android App              Web Platform
        |                         |
        +------------+------------+
                     |
                  Supabase
                     |
       Auth / Database / Storage
       RLS / Realtime / APIs
                     |
              AI / Market /
          Matching / Logistics

The Android app and website must use the same backend and shared production data model.

==================================================
1. NON-NEGOTIABLE RULES
==================================================

1. Preserve all existing working functionality.
2. Preserve existing Supabase authentication.
3. Preserve email/password authentication.
4. Add Google Login as an additional authentication method.
5. Never replace real authentication with Demo Mode.
6. Never allow Demo Mode to access real user data.
7. Never expose Supabase service-role keys in frontend code.
8. Never expose Google OAuth secrets in frontend code.
9. Never invent real market data.
10. Never invent real buyers.
11. Never invent real orders.
12. Never invent real payments.
13. Never claim live GPS unless actually connected.
14. Never claim real-time routing unless actually connected.
15. Never claim real AI accuracy unless actually measured.
16. Clearly label simulated/demo/estimated information.
17. Use existing database/API contracts wherever possible.
18. Use RLS for authorization, not frontend checks alone.
19. Do not create duplicate navigation systems.
20. Do not create duplicate implementations of the same screen.
21. Do not break existing URLs unnecessarily.
22. Do not claim a feature is complete if it has not been verified.
23. Run typecheck/build/tests after major changes.
24. Fix confirmed bugs rather than hiding them.
25. Keep the application production-oriented and SIH-demo-ready.

==================================================
2. AUTHENTICATION
==================================================

Existing authentication MUST continue working.

Support:

- Email/password sign in
- Email/password sign up
- Forgot password
- Password reset
- Logout
- Session persistence
- Protected routes
- Unauthorized route handling
- Role-based access
- Admin authentication

ADD:

# Google Login

Use:

“Continue with Google”

Google authentication must use:

Supabase Auth + Google OAuth.

Do not build a fake Google login.
Do not create a fake Google account system.

Google OAuth flow:

Sign In / Sign Up
        ↓
Continue with Google
        ↓
Google OAuth
        ↓
Supabase Auth
        ↓
OAuth Callback
        ↓
Authenticated Session
        ↓
Retrieve/Create Profile
        ↓
Check Role
        ↓
Profile Completion if required
        ↓
Correct Workspace

Google authentication must support:

- Existing Google users
- New Google users
- Session persistence
- OAuth loading state
- OAuth success state
- OAuth failure state
- OAuth cancellation
- Retry
- Profile creation
- Role selection for new users
- Profile completion
- Correct workspace redirect
- Logout
- Expired session handling

Google Login button:

Continue with Google

Use an appropriate official Google-style icon treatment.

Do not collect phone number or OTP unless an existing production flow requires it.

==================================================
3. GOOGLE OAUTH CALLBACK
==================================================

Implement or preserve:

/auth/callback

The callback must:

1. Process the Supabase OAuth session.
2. Confirm authentication.
3. Retrieve the authenticated user.
4. Retrieve the user's profile.
5. Create a profile if required.
6. Check the user's role.
7. Detect incomplete profile information.
8. Redirect new users to role selection when necessary.
9. Redirect incomplete users to profile completion.
10. Redirect existing users to the correct workspace.
11. Handle OAuth errors.
12. Handle cancelled OAuth.
13. Provide retry.
14. Provide return-to-login.
15. Never display access tokens.
16. Never expose secrets.
17. Never put sensitive credentials in URLs.

Role options:

- Farmer
- Buyer
- FPO/Aggregator
- Admin

Admin must NOT be selectable by ordinary users during public signup.

Admin access must remain controlled by server-side authorization.

==================================================
4. AUTHENTICATION STATES
==================================================

Support and visually handle:

- Signed out
- Sign in
- Sign up
- Email validation error
- Wrong password
- Forgot password
- Password reset
- Google loading
- Google success
- Google error
- Google cancelled
- New Google user
- Role selection
- Profile completion
- Session loading
- Session expired
- Unauthorized
- Forbidden
- Logout
- Logout confirmation

==================================================
5. PUBLIC WEBSITE PAGES
==================================================

Implement/preserve:

1. Home / Landing
2. Platform Overview
3. AI Intelligence
4. Marketplace
5. For Farmers/FPOs
6. For Buyers
7. About
8. Sign In
9. Sign Up
10. Forgot Password
11. OAuth Callback
12. Try a Demo
13. Download App
14. Privacy Policy
15. Terms & Conditions
16. Contact / Support
17. 404 Not Found
18. Error Page

Public navigation:

Home
Platform
AI Intelligence
Marketplace
For Farmers/FPOs
For Buyers
About
Sign In
Try a Demo
Download App

Authentication actions:

- Sign In
- Create Account
- Continue with Google
- Try a Demo

Clearly distinguish:

REAL ACCOUNT
GOOGLE LOGIN
DEMO MODE

Demo Mode is NOT authentication.

==================================================
6. HOME / LANDING PAGE
==================================================

Include:

- FarmPlug AI logo
- Tagline
- Hero section
- Platform explanation
- Explore Platform
- Sign In
- Create Account
- Continue with Google
- Try a Demo
- Farm-to-market workflow
- Problem section
- Solution section
- AI capabilities
- Marketplace preview
- Farmer benefits
- FPO benefits
- Buyer benefits
- Aggregation
- Logistics
- Pilot KPIs
- Download App
- Footer

Workflow:

Farm Data
→ Market Intelligence
→ Selling Window
→ Buyer Matching
→ Aggregation
→ Quote
→ Order
→ Logistics

Do not add an unnecessary floating chatbot.

==================================================
7. PLATFORM OVERVIEW
==================================================

Show:

Farm
→ Intelligence
→ Market
→ Quote
→ Order
→ Logistics

Explain:

- Market Intelligence
- Demand Forecasting
- Production Decision Support
- Selling Window
- Buyer Matching
- Supply Aggregation
- Route Planning
- Order Tracking

==================================================
8. AI INTELLIGENCE PAGE
==================================================

Show:

- Market Intelligence
- Price Trend Analysis
- Demand Forecasting
- Selling Window Recommendation
- Production Decision Support
- Freshness/Shelf-Life Support
- Buyer Matching
- Route Planning

Every AI recommendation must display:

- Recommendation
- Reason
- Confidence
- Data status
- Source/status
- User confirmation

If using demo/rule-based logic:

Label:

SIMULATED FORECAST
DEMO DATA
ESTIMATED
CALCULATED

Never pretend simulated output is real AI prediction.

==================================================
9. PUBLIC MARKETPLACE
==================================================

Show only appropriate public/demo information.

Fields:

- Crop
- Quantity
- Quality
- Location
- Availability
- Buyer type
- Demo status

Filters:

- Crop
- Quantity
- Quality
- Location
- Availability date
- Buyer type

Never expose private farmer information.

Use:

DEMO DATA

for seeded records.

==================================================
10. FARMER / FPO WEBSITE
==================================================

Provide:

- Farm profile
- Crop management
- Produce listing
- Market intelligence
- Buyer matching
- Aggregation
- Quotes
- Orders
- Logistics
- Analytics
- Notifications
- Settings

==================================================
11. FARMER WEBSITE ROUTES
==================================================

Support:

/farmer
/farmer/farm
/farmer/crops
/farmer/crops/[id]
/farmer/crop-health
/farmer/intelligence
/farmer/decision-center
/farmer/marketplace
/farmer/listings
/farmer/listings/[id]
/farmer/offers
/farmer/offers/[id]
/farmer/orders
/farmer/orders/[id]
/farmer/notifications
/farmer/settings

Preserve compatible existing routes:

/app-v2
/crop-health
/farm-intelligence
/offers
/notifications
/settings
/decision-center
/orders
/portals
/demo

Do not duplicate page logic.

Use canonical routes and redirects where appropriate.

==================================================
12. FARMER DASHBOARD
==================================================

Show:

- Welcome
- Active listings
- Buyer matches
- Pending offers
- Open orders
- Recent activity
- AI insight
- Notifications
- Farm summary
- Quick actions

Quick actions:

- Add Produce
- Ask FarmPlug Intelligence
- View Market
- View Orders

==================================================
13. MY FARM
==================================================

Show:

- Farm profile
- Farm location
- Farm area
- Crops
- Expected harvest
- Storage availability
- Crop calendar
- Add Crop
- Profile completeness

==================================================
14. CROP MANAGEMENT
==================================================

Screens:

- Crops
- Crop Details
- Crop Health

Crop Health can include:

- Health status
- Notes
- Observations
- Images if supported
- Recommended action
- Data status

Do not claim disease diagnosis unless a real model is connected.

==================================================
15. ADD PRODUCE
==================================================

Fields:

- Crop
- Quantity
- Quality grade
- Harvest date
- Availability date
- Location
- Storage condition
- Expected price
- Optional image

Actions:

- Save Draft
- Publish Listing

Support:

- Validation
- Loading
- Success
- Error
- Retry
- Demo Data label

==================================================
16. FARM INTELLIGENCE
==================================================

Show:

- Market data
- Historical trends
- Market comparison
- Demand indicator
- Estimated net realization
- Selling window
- Forecast confidence
- Data source

Clearly label simulated information.

==================================================
17. DECISION CENTER
==================================================

Show:

- Recommended actions
- Selling window
- Buyer opportunities
- Crop decisions
- Risk alerts
- Reason
- Confidence
- Data status

Actions:

- Confirm
- Dismiss
- Review details

==================================================
18. FARMPLUG INTELLIGENCE
==================================================

Suggested questions:

“What crops do I currently have listed?”

“Show my open orders.”

“Which available market has the better opportunity?”

“What buyers match my tomato quantity?”

AI must only access authorized workspace data.

If data is unavailable:

“This information is not available in the current workspace.”

Never invent information.

==================================================
19. BUYER MATCHING
==================================================

Show:

- Buyer type
- Crop
- Required quantity
- Quality
- Location
- Delivery date
- Match score
- Match explanation
- Trust status
- Estimated logistics cost
- Data status

Match explanations must be understandable.

==================================================
20. OFFERS
==================================================

Lifecycle:

Draft
→ Sent
→ Viewed
→ Counter-offered
→ Accepted
→ Rejected
→ Expired

Show:

- Crop
- Quantity
- Price
- Quality
- Delivery terms
- Expiry
- Buyer
- Status

Actions:

- Accept
- Reject
- Counter-offer

One accepted quote must create only one order.

==================================================
21. ORDERS
==================================================

Use one consistent order lifecycle everywhere:

Quote Pending
→ Accepted
→ Order Confirmed
→ Collecting
→ Ready for Pickup
→ Picked Up
→ In Transit
→ Delivered
→ Completed

Possible terminal states:

- Cancelled
- Disputed

Use one shared TypeScript definition and matching database statuses.

Do not use inconsistent values such as:

confirmed

if the database expects:

order_confirmed

Show:

- Status timeline
- Timestamps
- Buyer
- Crop
- Quantity
- Delivery details
- Payment status
- Logistics status

==================================================
22. BUYER WEBSITE
==================================================

Routes:

/buyer
/buyer/requirements
/buyer/requirements/new
/buyer/matches
/buyer/offers
/buyer/orders
/buyer/orders/[id]
/buyer/logistics
/buyer/notifications
/buyer/settings

Navigation:

Overview
Create Requirement
Recommended Supply
Aggregated Lots
Offers
Orders
Logistics
Notifications
Profile
Settings

Buyer requirement fields:

- Crop
- Quantity
- Quality
- Delivery location
- Delivery date
- Packaging
- Target price
- Storage requirements

Buyer actions:

- Compare supply
- View aggregated lots
- Request quote
- Reserve supply
- Track fulfilment
- View logistics
- Manage orders

==================================================
23. FPO DASHBOARD
==================================================

Routes:

/fpo
/fpo/farmers
/fpo/supply
/fpo/aggregation
/fpo/aggregation/[id]
/fpo/collection-centers
/fpo/logistics
/fpo/orders
/fpo/notifications
/fpo/settings

Features:

- Member farmers
- Member supply
- Aggregated lots
- Buyer requirements
- Procurement
- Offers
- Orders
- Sales performance
- Member contribution
- Lot traceability
- Notifications
- Settings

==================================================
24. ADMIN CONSOLE
==================================================

Routes:

/admin
/admin/users
/admin/farmers
/admin/fpos
/admin/buyers
/admin/listings
/admin/requirements
/admin/matches
/admin/offers
/admin/orders
/admin/payments
/admin/logistics
/admin/ai
/admin/reports
/admin/disputes
/admin/audit
/admin/settings

Admin features:

- Review users
- Manage roles
- Review listings
- Monitor requirements
- Monitor matches
- Monitor offers
- Monitor orders
- Review demo activity
- Review AI outputs
- View audit logs
- Manage demo data

Admin authorization MUST be server-side.

Do not rely only on hidden frontend links.

==================================================
25. ANDROID FARMER APP
==================================================

The Android application must expose the complete farmer workflow.

Required screens:

1. Splash
2. Welcome
3. Onboarding
4. Farm Setup
5. Sign In
6. Sign Up
7. Continue with Google
8. Google OAuth completion
9. Role/Profile completion
10. Home
11. My Farm
12. Crops
13. Crop Details
14. Crop Health
15. Farm Intelligence
16. AI Decision Center
17. Market
18. Buyer Marketplace
19. Buyer Details
20. Add Produce
21. My Listings
22. Listing Details
23. Buyer Matches
24. Offers
25. Offer Details
26. Accept Offer
27. Orders
28. Order Details
29. Order Tracking
30. Aggregation
31. Aggregation Details
32. Collection Center
33. Logistics
34. Delivery Details
35. Notifications
36. Profile
37. Settings
38. Language
39. Security
40. Help
41. Logout Confirmation
42. Error
43. Offline
44. Empty States

Bottom navigation:

Home
Market
AI
Orders
Profile

Use additional screens through appropriate navigation without creating duplicate navigation systems.

==================================================
26. ANDROID WEBVIEW
==================================================

The existing Android application uses a WebView architecture.

Preserve this architecture unless there is a verified technical reason to replace it.

The Android app must:

- Load the canonical Farmer App
- Use HTTPS
- Support navigation history
- Support Android back
- Restore WebView state
- Handle authentication sessions
- Show loading state
- Show network errors
- Provide retry
- Handle offline state
- Handle external links safely
- Disable unnecessary file access
- Prevent cleartext traffic
- Clean up WebView lifecycle
- Support deep links where configured

Do not point the APK to an obsolete duplicate application.

==================================================
27. DEMO MODE
==================================================

Demo Mode must remain completely separate from authentication.

Entry:

Try a Demo

Flow:

Try a Demo
→ Select Role
→ Enter Workspace
→ View Seeded Data
→ Reset Demo / Exit

Demo roles:

1. Farmer / FPO
2. Buyer / Processor / Exporter
3. Admin / Operations

Demo Mode:

- No password
- No OTP
- No mobile number
- No real account
- No real authentication
- No real production data
- Seeded data only
- Isolated state
- Persistent DEMO MODE badge
- Reset Demo
- Switch Role
- Exit Demo
- Read-only or sandboxed operations

Labels:

DEMO DATA
SIMULATED FORECAST
ESTIMATED LOGISTICS COST
PAYMENT SIMULATION
DEMO BUYER
DEMO FARMER
DEMO ORDER

==================================================
28. SIH CORE DEMO FLOW
==================================================

Build and verify this complete workflow:

1. Demo Farmer lists 1,200 kg Grade A tomato.
2. Demo Farmer 2 lists 1,800 kg Grade A tomato.
3. Demo Farmer 3 lists 2,000 kg Grade A tomato.
4. Demo Buyer creates requirement:
   5,000 kg Grade A tomato.
5. FarmPlug matches the available supply.
6. FarmPlug aggregates:
   1,200 + 1,800 + 2,000 = 5,000 kg.
7. Show explainable match.
8. Buyer sends digital quote.
9. Farmer/FPO accepts quote.
10. One order is created.
11. Order moves through collection.
12. Order moves to pickup.
13. Order moves to transit.
14. Order moves to delivery.
15. Order moves to completed.
16. Logistics displays estimated route/cost.
17. Payment displays Payment Simulation.
18. Admin sees the complete activity timeline.

This must work consistently across the relevant website dashboards and app screens.

==================================================
29. SUPABASE DATABASE
==================================================

Use the existing schema where possible.

Core entities should support:

- profiles
- farms
- crops
- produce listings
- buyers
- buyer requirements
- buyer matches
- quote requests
- aggregation groups
- aggregation members
- collection centers
- orders
- order items
- logistics routes
- delivery events
- payments
- notifications
- disputes
- audit logs
- market prices
- market demand
- AI insights
- ML datasets/models/runs where applicable

Use appropriate foreign keys.
Use timestamps.
Use ownership fields.
Use status constraints.
Use indexes for frequently queried fields.

==================================================
30. ROW LEVEL SECURITY
==================================================

Implement and verify RLS.

Farmers:

- Can access their own private farm data.
- Can manage their own listings.
- Can view authorized buyer requirements/matches.
- Can view their own offers/orders.

Buyers:

- Can manage their own requirements.
- Can view authorized supply/matches.
- Can manage authorized offers/orders.

FPOs:

- Can access authorized member/aggregation data.

Admins:

- Can access administrative data according to role.

Never use frontend-only authorization.

Test for IDOR and unauthorized record access.

==================================================
31. API SECURITY
==================================================

Server APIs must:

1. Authenticate the request.
2. Derive identity from the authenticated session.
3. Validate input.
4. Check authorization.
5. Perform the operation.
6. Return safe errors.

Never trust:

- user_id from request body
- role from request body
- farmer_id from client
- buyer_id from client

when identity can be derived from authentication.

Use server-side authorization.

==================================================
32. SENSITIVE OPERATIONS
==================================================

Use secure server-side functions/API routes for:

- AI generation
- Buyer matching
- Aggregation
- Logistics calculation
- Notifications
- Order transitions
- Payment simulation
- Admin operations

Never expose privileged service credentials.

==================================================
33. REALTIME
==================================================

Where supported, use Supabase Realtime for:

- Order updates
- Offer updates
- Notifications
- Aggregation updates
- Delivery events

Ensure only authorized users receive private realtime data.

==================================================
34. PAYMENT
==================================================

Unless a real payment gateway is connected:

Use:

PAYMENT SIMULATION

Do not claim real payment processing.

Architecture should be ready for future payment integration.

==================================================
35. LOGISTICS
==================================================

Unless live maps/routing are connected:

Use:

ESTIMATED LOGISTICS

Do not claim:

- Live GPS
- Live vehicle tracking
- Live route optimization

Show:

- Collection center
- Destination
- Estimated distance
- Estimated cost
- Delivery status

Clearly label estimates.

==================================================
36. DATA HONESTY
==================================================

Apply globally.

Never invent:

- Market prices
- Buyers
- Farmer data
- Orders
- Payments
- Forecasts
- Demand
- GPS
- Delivery events
- AI confidence

Use:

DEMO DATA
SIMULATED FORECAST
ESTIMATED
CALCULATED
PAYMENT SIMULATION

Show data source/status where relevant.

If information is unavailable:

“This information is not available in the current workspace.”

==================================================
37. UI STATES
==================================================

Every important screen must support:

LOADING:

- Skeleton
- Spinner where appropriate

EMPTY:

- Explanation
- Icon/illustration
- Clear CTA

ERROR:

- Error message
- Retry
- Validation feedback

SUCCESS:

- Confirmation
- Summary
- Next action

OFFLINE:

- Connection indicator
- Retry
- Preserve safe drafts

AUTH:

- Signed out
- Session loading
- Session expired
- Unauthorized
- Forbidden

DEMO:

- DEMO MODE badge
- Reset Demo
- Exit Demo

==================================================
38. RESPONSIVE DESIGN
==================================================

Desktop:

- Max width 1280px
- Sidebar/top navigation
- Multi-column layouts

Tablet:

- Collapsible navigation
- Responsive cards
- Reduced columns

Mobile:

- Bottom navigation
- One-column cards
- Sticky primary CTA
- Minimum 44px tap targets
- Tables become cards
- Filters use sheets/drawers
- No unnecessary horizontal scrolling

Both:

WEBSITE + ANDROID WEB APP

must be responsive.

==================================================
39. DESIGN SYSTEM
==================================================

Use a modern agricultural technology visual identity.

Typography:

- Inter
- Manrope
- Plus Jakarta Sans

Colors:

Deep forest green:
#0F2A1E

Primary green:
#1B4332

Agricultural gold:
#C9A227

Cream:
#F7F8F2

White:
#FFFFFF

Primary text:
#17211B

Secondary text:
#5F6B63

Success:
#2E7D32

Warning:
#B7791F

Error:
#B42318

Info:
#2563EB

Accessibility:

- WCAG AA contrast
- Semantic HTML
- Keyboard support
- Visible focus states
- Accessible labels
- Descriptive validation errors
- Do not rely only on color

Avoid:

- Generic AI purple
- Excessive gradients
- Low contrast
- Overcrowded dashboards
- Inconsistent icons
- Duplicate navigation
- Excessive animation

==================================================
40. SHARED NAVIGATION
==================================================

Create one role-aware navigation system.

Farmer:

Home
Market
AI
Orders
Profile

Buyer:

Overview
Requirements
Matches
Offers
Orders
Logistics
Profile

FPO:

Overview
Farmers
Aggregation
Logistics
Orders
Profile

Admin:

Overview
Users
Marketplace
Orders
Logistics
AI
Reports
Audit
Settings

Public:

Home
Platform
AI
Marketplace
Farmers/FPOs
Buyers
About
Sign In
Try a Demo
Download App

Do not create competing navigation hierarchies.

==================================================
41. CANONICAL ROUTES
==================================================

The existing /app-v2 must not become a second implementation of:

- Crop Health
- Farm Intelligence
- Offers
- Notifications
- Settings

Use standalone canonical routes where they already exist.

Update /app-v2 to:

- Deep-link to canonical routes
- Reuse shared components
- Reuse shared navigation
- Avoid duplicated logic
- Preserve bookmarks
- Preserve existing links

==================================================
42. ONBOARDING
==================================================

Onboarding should support:

Step 1:
“What do you want FarmPlug AI to help you achieve?”

Options:

- Get better prices
- Find buyers
- Know when to sell
- Manage my FPO

Step 2:

Farm & Crop:

- Location
- Crop
- Variety
- Farm area
- Expected quantity
- Harvest date

Step 3:

Market priorities:

- Better price
- Nearby buyer
- Fast payment
- Reliable delivery

Step 4:

First AI insight.

Step 5:

Workspace ready.

If onboarding data is intended to be production data, persist it in Supabase.

Do not hardcode fake user information as real account data.

==================================================
43. NOTIFICATIONS
==================================================

Support:

- Buyer match
- New offer
- Offer accepted
- Order update
- Pickup reminder
- Delivery update
- Payment update
- Selling window alert

Features:

- Read/unread
- Mark as read
- Clear
- Notification settings
- Empty state

==================================================
44. SETTINGS
==================================================

Settings must include where applicable:

- Profile
- Farm details
- Language
- Notifications
- Privacy
- Security
- Google account connection
- Change password
- Sign out
- Help
- Demo reset
- Return to website

==================================================
45. SECURITY AUDIT
==================================================

Search the entire repository for:

- Service-role keys
- API keys
- OAuth secrets
- Passwords
- Tokens
- Private credentials
- Unsafe localStorage authentication
- Unsafe redirects
- Missing authorization
- IDOR
- Insecure database queries
- Unrestricted storage
- Client-side admin authorization

Fix confirmed security issues.

Never expose:

SUPABASE_SERVICE_ROLE_KEY

or equivalent privileged credentials.

==================================================
46. STORAGE
==================================================

If existing storage is used, secure:

- Profile images
- Farm images
- Crop images
- Produce images
- Documents

Use appropriate Storage RLS policies.

Private files must not be publicly exposed.

==================================================
47. PERFORMANCE
==================================================

Optimize:

- Images
- Client bundles
- Database queries
- API calls
- Realtime subscriptions
- Dashboard loading
- Mobile WebView loading

Avoid unnecessary polling.

Use loading skeletons.

Avoid rendering huge datasets unnecessarily.

==================================================
48. ACCESSIBILITY
==================================================

Verify:

- Keyboard navigation
- Focus states
- Screen-reader labels
- Form labels
- Error announcements
- Color contrast
- Touch targets
- Semantic headings
- Accessible dialogs
- Accessible navigation
- Accessible forms

==================================================
49. ERROR HANDLING
==================================================

Handle:

- Network failure
- Supabase failure
- OAuth failure
- Session expiration
- Database error
- Validation error
- Unauthorized
- Forbidden
- Empty dataset
- Timeout
- Offline

Never show raw technical errors to ordinary users.

Provide useful retry actions.

==================================================
50. TESTING
==================================================

Before completion run the existing project checks.

At minimum:

npm install

npm run typecheck

npm run build

Run lint if available.
Run tests if available.

Also manually verify:

AUTH:

- Email login
- Email signup
- Forgot password
- Google login
- Google callback
- New Google user
- Existing Google user
- Role selection
- Profile completion
- Session persistence
- Logout
- Protected route
- Unauthorized route

FARMER:

- Dashboard
- Farm
- Crop
- Crop Health
- AI
- Market
- Listing
- Match
- Offer
- Order
- Notifications
- Settings

BUYER:

- Dashboard
- Requirement
- Supply
- Match
- Quote
- Order
- Logistics

FPO:

- Farmers
- Aggregation
- Collection
- Logistics
- Orders

ADMIN:

- Users
- Listings
- Requirements
- Matches
- Offers
- Orders
- Logistics
- AI
- Reports
- Audit

DEMO:

- Enter
- Switch role
- Seed data
- Complete SIH flow
- Reset
- Exit

==================================================
51. ROUTE AUDIT
==================================================

Verify every route.

Check:

- No dead routes
- No broken links
- No dead buttons
- No duplicate pages
- No accidental redirects
- No inaccessible pages
- No unauthorized pages
- No missing loading states
- No missing error states
- No missing empty states

Every primary button must either:

- Perform its intended action
- Navigate to a real page
- Open a real modal
- Submit a real request

Never leave fake buttons that appear functional.

==================================================
52. WEBSITE + ANDROID SHARED DATA TEST
==================================================

Verify cross-platform consistency.

Test:

Android Farmer creates listing
        ↓
Supabase
        ↓
Website Marketplace
        ↓
Buyer sees supply

Buyer creates requirement
        ↓
Supabase
        ↓
Farmer sees match

Buyer sends offer
        ↓
Farmer sees offer

Farmer accepts
        ↓
Supabase
        ↓
One order created

Order status changes
        ↓
Farmer
Buyer
FPO
Admin

see the authorized updated status.

==================================================
53. PRODUCTION CONFIGURATION
==================================================

Use environment variables.

Required public configuration may include:

NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

Server secrets must remain server-side.

Document:

- Supabase URL
- Supabase publishable key
- Server-side secret
- Google OAuth Client ID
- Google OAuth Client Secret
- Production site URL
- Vercel URL
- OAuth callback URL
- Local development callback URL

Do not commit secrets.

==================================================
54. GOOGLE SUPABASE CONFIGURATION
==================================================

Document the exact manual configuration required in Supabase:

Authentication
→ Providers
→ Google

Configure:

- Google Client ID
- Google Client Secret
- Redirect URL
- Site URL

Also configure the corresponding Google Cloud OAuth settings.

Do not claim Google Login is production-ready until:

Google button
→ Google
→ Supabase
→ Callback
→ Session
→ Profile
→ Role
→ Dashboard

has been verified.

==================================================
55. DEPLOYMENT
==================================================

Verify:

- Production environment variables
- Supabase URL
- Supabase publishable key
- OAuth configuration
- Production redirect URLs
- Vercel deployment
- Build
- Routes
- Authentication
- HTTPS
- Android WebView URL

Do not claim deployment succeeded unless the deployment status is actually verified.

==================================================
56. DATABASE MIGRATIONS
==================================================

Review all existing migrations.

Verify:

- They apply correctly.
- No conflicting migrations.
- No invalid enum/status assumptions.
- RLS is enabled.
- Policies are correct.
- Foreign keys are correct.
- Indexes exist where needed.

If a migration depends on an existing table, verify that dependency is actually available in the intended deployment path.

==================================================
57. FINAL QA MATRIX
==================================================

Produce:

| Feature | Website | Android | Supabase | Status |
|---------|---------|---------|----------|--------|

Include:

- Email Authentication
- Google Login
- Signup
- Logout
- Sessions
- Roles
- Farmer
- Buyer
- FPO
- Admin
- Farm
- Crops
- Crop Health
- Market
- AI
- Decision Center
- Marketplace
- Listings
- Matching
- Offers
- Aggregation
- Orders
- Logistics
- Notifications
- Payments
- Demo Mode
- Responsive UI
- Security
- Realtime
- Error Handling

Allowed status:

PASS
PARTIAL
FAIL
NOT VERIFIABLE

Do not mark something PASS unless actually verified.

==================================================
58. FINAL IMPLEMENTATION REPORT
==================================================

At the end provide:

1. Repository audit summary.
2. Implementation plan completed.
3. Files changed.
4. Files added.
5. Routes added.
6. Routes modified.
7. Routes redirected.
8. Components added.
9. Authentication changes.
10. Google OAuth changes.
11. Supabase changes.
12. Database changes.
13. RLS changes.
14. API changes.
15. Demo Mode changes.
16. Android changes.
17. Security fixes.
18. Performance fixes.
19. Accessibility fixes.
20. Tests performed.
21. Typecheck result.
22. Build result.
23. Lint result.
24. Deployment result.
25. Git commits.
26. Pull request.
27. Remaining configuration.
28. Remaining limitations.

Separate clearly:

IMPLEMENTED
CONFIGURATION REQUIRED
NOT VERIFIABLE
REMAINING WORK

==================================================
59. FINAL GOOGLE LOGIN ACCEPTANCE TEST
==================================================

Google Login is considered COMPLETE only if this flow works:

User opens /signin
        ↓
Clicks “Continue with Google”
        ↓
Google OAuth opens
        ↓
User authenticates
        ↓
Supabase creates/returns session
        ↓
OAuth callback executes
        ↓
Profile is retrieved/created
        ↓
Role is checked
        ↓
Profile completion if required
        ↓
Correct workspace
        ↓
Session persists after refresh
        ↓
Protected routes work
        ↓
Logout works

Also test:

New Google User
Existing Google User
OAuth Cancellation
OAuth Error
Expired Session
Unauthorized Access

==================================================
60. FINAL SIH DEMO ACCEPTANCE TEST
==================================================

The final product must be able to demonstrate:

FARMER
→ Add Farm
→ Add Crop
→ Add Produce
→ View AI Intelligence
→ View Buyer Match
→ Receive Offer
→ Accept Offer
→ Track Order

BUYER
→ Create Requirement
→ Discover Supply
→ Aggregate Lots
→ Send Quote
→ Track Order
→ View Logistics

FPO
→ View Farmers
→ Aggregate Supply
→ Manage Collection
→ Manage Logistics
→ Track Orders

ADMIN
→ Monitor Users
→ Monitor Marketplace
→ Monitor Matches
→ Monitor Offers
→ Monitor Orders
→ Monitor Logistics
→ View AI Activity
→ View Audit Logs

Complete business flow:

Farm
→ Crop
→ Produce
→ Market Intelligence
→ Demand
→ Selling Window
→ Buyer Match
→ Aggregation
→ Quote
→ Order
→ Collection
→ Logistics
→ Delivery
→ Payment Simulation
→ Completion

==================================================
61. CRITICAL FINAL RULE
==================================================

Do not merely make the UI look complete.

The goal is a coherent working product.

Every important workflow must connect:

UI
→ Authentication
→ Authorization
→ API
→ Database
→ Realtime where applicable
→ UI update

Do not create fake functionality just to satisfy a checklist.

If a feature cannot be connected to a real backend/service:

1. Implement the correct architecture where possible.
2. Clearly label the feature as prototype/simulated.
3. Do not present it as production functionality.
4. Document what configuration or integration remains.

Do not remove existing working functionality.
Do not rebuild unnecessarily.
Do not duplicate existing pages.
Do not expose secrets.
Do not bypass authentication.
Do not bypass RLS.
Do not claim unverified functionality is complete.

FIRST:
Audit the repository.

SECOND:
Create the implementation plan.

THIRD:
Implement the changes incrementally.

FOURTH:
Run typecheck/build/tests.

FIFTH:
Perform the complete website + Android + authentication + Google OAuth + Supabase + SIH workflow audit.

FINALLY:
Provide the complete implementation report and QA matrix.
