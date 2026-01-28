
# Implementation Plan - Funeral Director Partner App

Rebuilding the Partner App from scratch with a premium "Toss-style" aesthetic, focusing on clean UI, responsiveness, and specific branding guidelines.

## User Review Required
> [!IMPORTANT]
> - **Font**: Using `Pretendard` via CDN for web compatibility.
> - **Colors**: Strictly adhering to provided brand colors (Orange #FF7225, Black #171819).
> - **New Feature**: Added "Settlement Amount" display to the dashboard as requested.

## Proposed Changes

### Project Structure
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS (Custom Config for Brand Colors)
- **Icons**: Lucide React

### Design System (Tailwind Config)
- **Colors**:
    - `brand-orange`: `#FF7225`
    - `brand-black`: `#171819`
    - `brand-warm-grey`: `#D1CAC9`
    - `brand-bg`: `#F2F4F6` (Toss-like background)
- **Fonts**: `Pretendard` standard.

### UI Polish (Toss Style Refinements)
- **Alignment Strategy**:
    - Shift card contents to **Left Alignment** (Icon Top-Left, Text Bottom-Left) for a more structured, premium look.
    - Improve spacing (Padding) inside cards to prevent "cramped" feel.
- **Visuals**:
    - **Orange Card**: Add subtle gradient, improve "Ongoing" badge style (translucent white instead of solid bubble).
    - **Action Cards**: 
        - Increase Icon size (24px -> 28px/32px).
        - Add soft background to icons (e.g., light gray circle) to ground them? *Decision: Keep it clean, just larger icons or top-left alignment.*
        - Consistent font sizes (14px/15px semi-bold).
- **Typography**: Fix hierarchy. Title (17px Bold), Subtext (13px Regular).

### Dashboard Refactor (UX Pivot)
- **Goal**: Convert Dashboard to a "Status Board". Move specific actions to Event Detail.
- **Changes**:
    - **Remove**: Quick Action Grid (Calendar, Camera, etc.) from Main Dashboard.
    - **Add**: "This Month's Event Count" card (Visual statistic).
    - **Layout**: Keep "Settlement" and "Ongoing Event" (Orange Card) as primary entry points.
    - **[NEW] Idle State**: When no event is active, show **"Queue Status Card"** (Blue Gradient).
        - Displays: Current Rank, Region.
    - **[NEW] Toggle**: Add a dev-only toggle to switch between Active/Idle states for testing.

### [NEW] Feature: Event Management Flow
#### [NEW] [Event List Page](file:///src/pages/EventList.jsx)
- Lists all events (Ongoing, Scheduled, Completed).
- Filter tabs (All/Ongoing/Completed).
- Entry point to details.

#### [NEW] [Event Detail Page](file:///src/pages/EventDetail.jsx)
- **The new home for Action Buttons**.
- Grid of actions: [Consultation Report], [Photo], [Checklist], [Final Report].
- **Context**: Shows Deceased Name, Funeral Home, and Schedule at the top.
- **[NEW] Dynamic Timeline**: Replaces static grid.
    - Visualize flow: Dispatch -> Consultation -> Day 1 -> Day 2 -> Final.
    - **States**: Done (Green), Active (Orange/Button), Locked (Gray).
    - **Labels**: "Day 1 Report", "Day 2 Report" (Generic to cover No-Mortuary).
    - **Logic**: All funeral types see daily reports.
    - **[NEW] Re-entry**: Allow clicking completed steps to view/edit.
    - **[NEW] Timestamps**: Show completion time (e.g. "01.28 14:00") for all reports.
- **Info Section**: Detailed info like Hearse and Altar Flowers.
- **[NEW] Settlement Entry**: "Settlement Status" card to view/edit expenses anytime.
- **[NEW] Dev Tools**: "Reset Event" button to clear progress and basic info for re-testing.

### [NEW] Feature: Daily Report (Day 1, 2, 3)
- **Goal**: Standardize quality control and proof of work.
- **Route**: `/events/:id/report/daily/:day` (Dynamic Day 1/2/3).
- **Conditional Logic**:
    - **Standard**: Full checklist (Parlor setup, Helpers) & Photos (Altar, Food).
    - **No-Mortuary**: Simplified checklist (No parlor items) & Photos (Coffin, Docs only).
- **Components**:
    1.  **Checklist (Tabbed)**:
        - **Day 1**: First Call, Venue Change, Consultation, Setup, Leave.
        - **Day 2/3**: Upcoming tasks.
        - *UI: Grouped List with Checkboxes.*
    2.  **Photo Grid**:
        - Specific slots: "Funeral Home View", "Schedule", "Flags", "Flowers", "Helpers".
        - *UI: 3-column grid with camera icons.*

### [NEW] Feature: Dispatch & Preliminary Report Cycle
- **Goal**: Facilitate the real-world flow from "Call" to "Meet Customer".
- **Flow**:
    1.  **Dispatch Alert**: Bottom Sheet with Customer Info (Name, Age, Contact).
    2.  **Accept**: Confirms receipt. Buttons to [Call Customer] or [Accept].
    3.  **Preliminary Report (Seonhaeng Bogo)**: Modal to enter ETA & Notes.
    4.  **Transition**: Upon submission, Dashboard switches to **Active Event** mode.

### Components (TDS Style)
In `src/components/tds`:
- **Top**: Navigation header (Back button, Title, Right actions).
- **Button**: Standard rounded buttons (Primary Orange, Secondary Grey).
- **BottomCTA**: Fixed position bottom button area.
- **ListRow**: Standard list item with Title, Subtitle, and Right Arrow/Value.
- **ListHeader**: Section divider with title.
- **Badge**: Small rounded status indicators.

#### [NEW] [Layout](file:///src/components/layout/Layout.jsx)
- Wrapper to center content on desktop (max-width: 480px, centered) to mimic mobile app behavior, as seen in many Toss web services. background-color: #F2F4F6.

#### [NEW] [Dashboard](file:///src/pages/Dashboard.jsx)
- **Header**: Uses `<Top />`.
- **Settlement**: Custom card component showing amount.
- **Body**: 
    - Uses `<ListHeader />` for sections.
    - Custom Grid for "Event Management".
    - `<ListRow />` for menu items if linear, or custom grid if icons. *Based on mockup, it is a grid, so likely custom 'MenuGrid' component interacting with 'ListRow' style logic.*

## Verification Plan

### Automated Tests
- Build verification: `npm run build`

### Manual Verification
- Check responsive behavior on window resize.
- Compare font weights and colors against the provided brand guide.
- Verify "Toss-style" feel (shadows, spacing, rounded corners).
