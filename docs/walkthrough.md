
# Walkthrough - Funeral Director Partner App

The project has been successfully initialized with a premium "Toss-style" aesthetic.

## 🚀 Key Features Implemented

### 1. **TDS (Toss Design System) Foundation**
- **Brand Colors**: Configured `brand-orange` (#FF7225), `brand-black` (#171819), and `brand-bg` (#F2F4F6) in Tailwind.
- **Typography**: Applied **Pretendard** font globally. Refined hierarchy with bold titles and subtle subtexts.
- **Visual Polish**: 
    - **Left Alignment**: Shifted card contents to the left for better readability.
    - **Gradients & Shadows**: Added subtle gradients to the main action card and soft shadows to buttons.
    - **Spacing**: Increased padding for a more spacious, premium feel.

### 2. **Dashboard UI**
- **Settlement Card**: Added a dedicated section to view "My Settlement Amount" with expected payment dates.
- **Event Management**: 
    - **Grid Layout**: Implemented a **3-column grid** (Reference style).
    - **Orange Card**: Spans 2 columns for emphasis.
    - **Action Cards**: Square aspect ratio, **Center Aligned** content for clean visibility.
- **Menu Grid**: Clean, icon-based menu for secondary actions.

### 3. **New: Event Management Flow**
- **Dashboard (Hub)**: Focused on high-level status (Monthly Counts, Ongoing Event shortcut). Removed clutter.
    - **Active State (Orange)**: Shows "Ongoing Event" details.
    - **Idle State (Blue)**: Shows **"Queue Status" (Rank 3)** when waiting.
    - *Toggle*: Added top-right button to switch states for demo.
- **Dispatch & Report Cycle** (Refined):
    - **Dispatch Alert**: Shows **Raw Text Info** from partners (Conditions, Requests) instead of placeholder data.
    - **Accepted State**: After accepting, dashboard shows **"Call Customer & Write Report"** card.
    - **Pre-Report Form**: Specific fields for **Crematorium**, **Ambulance**, **Parlor**, and Notes.
    - **Flow**: Idle -> Dispatch -> Accepted (Call) -> Pre-Report -> Active.
    - **Feedback**: Displays **"Report Sent to HQ"** notification upon submission.

- **Event Detail Page** (`/events/:id`):
    - **Context Card**: Deceased info, Place, Schedule.
    - **Dynamic Timeline**: Replaced static buttons with a vertical progress tracker.
        - **Done**: "Dispatch & Pre-report" (Green Check).
        - **Active**: "Consultation Report" (Orange Button).
        - **Locked**: Future steps (Gray Lock).
    - **Action**: Clicking "Write Report" on the active step leads to the form.
    - **Dev Tools**: **"Reset Progress"** button (top right) to restart the flow for testing.

- **Daily Report Page** (`/events/:id/report/daily/:day`):
    - **Tabbed Interface**: Day 1 / 2 / 3.
    - **Checklist**: Tasks grouped by category (Start, Consultation, End).
    - **Photo Grid**: Slots for proof-of-work uploads.
    - **Conditional Logic**:
        - **No-Mortuary**: Hides "Parlor Setup", "Helpers", "Flowers" items.
        - **Standard**: Shows full list.

### 4. **Detailed Settlement System (Refactored)**
- **Strict Separation**: Implemented **Tabbed Interface** for Revenue vs Cost.
- **Granular Control**: 
    - **Toggle Sections**: Vehicle, Manpower, Supplies, Flowers, Consumables.
    - **Detailed Fields**: Inputs for Company Name, Item Details, Counts, and Unit Prices.
- **Profit Logic**: Real-time calculation of `(Revenue - Cost) * ProfitRatio`.
- **Note**: Currently paused for UX re-evaluation (Complexity vs Usability).

### 4. **Components Created**
| Component | Description |
|-----------|-------------|
| `<Layout />` | Centers app on desktop, applies background color. |
| `<Top />` | Sticky header with back button support. |
| `<ListRow />` | Standard list item with arrow (Toss style). |
| `<Button />` | Primary/Secondary rounded buttons. |
| `<Badge />` | Status indicators. |

## 📸 Usage

### Run the App
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

## ⚠️ Notes
- The app uses **Lucide React** for icons, which are lightweight and match the clean aesthetic.
- **Tailwind CSS v3** is used for stability.
