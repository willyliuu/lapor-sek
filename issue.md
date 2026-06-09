# LaporSek Frontend Implementation Tasks

This document contains high-level planning tasks for setting up and building the frontend of the **LaporSek (Community Issue Reporter)** project. 

The implementation should follow the requirements detailed in [prd.md](file:///Users/willyliu/Documents/Code/Projects/lapor-sek/prd.md) and align with the **Civic Integrity** design system.

---

## Phase 1: Project Initialization & Configuration

### Task 1.1: Next.js & TypeScript Setup
- Initialize a new **Next.js** project using the App Router.
- Set up **TypeScript** with strict type-checking enabled.
- Ensure the folder structure is organized (e.g., standard `src/` directory containing `app/`, `components/`, `hooks/`, and `lib/`).

### Task 1.2: Tailwind CSS Setup & Design System Configuration
- Install and configure **Tailwind CSS**.
- Extend the Tailwind configuration (`tailwind.config.ts`) to register design tokens from the **Civic Integrity** design system:
  - **Color Palette**: 
    - Primary: `#2563eb`
    - Background: `#faf8ff`
    - Neutral/Text: `#0f172a`, `#434655`
    - Status colors: Open (`#F59E0B`), In Progress (`#3B82F6`), Resolved (`#22C55E`)
    - Category marker colors (e.g., Road damage, Flooding, Waste, Facility, etc.)
  - **Typography**: Set up default font families (using Inter from Google Fonts) and typography classes.
  - **Spacing & Roundness**: Configure border-radius tokens (e.g., `8px` for inputs/buttons, `12px` for cards) and spacing scales based on the 8px rhythm.

---

## Phase 2: Page Architecture & Navigation Routing

### Task 2.1: Next.js App Router Structure
- Set up the file-based route directories for key views:
  - Home Map page: `/`
  - Issues List page: `/issues`
  - Issue Detail page: `/issues/[id]`
  - Admin/Moderation page: `/admin/issues/[id]` (v1 status updates)

### Task 2.2: Navigation Components
- Implement global navigation controls to switch smoothly between:
  - The map view (`/`)
  - The card list view (`/issues`)
- Ensure the layout is responsive (full-screen focus on mobile, structured layout on desktop).

---

---

## Phase 3: UI Layouts & Components (Based on Stitch Design System)

### Task 3.1: Shared UI Components & Layouts
- **Global TopNavBar**:
  - Logo "LaporSek" in `font-headline-md` (bold, primary color) with a `location_on` (or equivalent) icon.
  - Desktop layout: Links for "Map View" and "List View", plus a primary CTA button "Report an Issue" (with `add_circle` icon).
  - Mobile layout: Hamburger menu icon button.
- **Base Components**:
  - **Buttons**: Primary (solid primary color, rounded-lg), Secondary (outlined primary), FAB (w-14 h-14, circular, Level 2 shadow, with `add` icon).
  - **Form Inputs**: Outline-variant borders, rounded-lg inputs/textareas, select dropdown with trailing expand arrow.
  - **Badges/Chips**: 
    - Status badges (Open, In Progress, Resolved) with a 10% opacity background of the state's status color and 100% opacity text.
    - Category chips containing a small colored circle indicator (e.g., red for Road Damage, blue for Flooding, green for Waste).
- **Global Footer**:
  - Contains LaporSek branding, copyright, and a row of links (Community Guidelines, Legal, Privacy Policy, Flag Content).

### Task 3.2: Interactive Map View (Home)
- **Leaflet Map Integration**: Centered map taking up all viewport height beneath the TopNavBar.
- **Floating Filter Bar (`TopAppBar`)**:
  - Overlaid at top-center, styled with Level 2 elevation shadow, rounded-full shape, backdrop-blur-md, and outline-variant borders.
  - Contains a "Filter Issues" header text with a `filter_list` icon, category pills, and a search icon trigger.
- **Map Marker Pin**:
  - Custom category-colored circular pin with a white border and inner icon (Material Symbols), with a down-pointing pointer triangle.
- **Map Popup Card**:
  - Styling: Rounded-xl (0.75rem), outline border, shadow-md, and Level 3 elevation overlay.
  - Features: Header image (h-24, cover), category badge, upvote count (with `thumb_up` icon), title (headline-sm, bold, line-clamp-2), user initials avatar + relative timestamp, and full-width "View details" button with a top border.

### Task 3.3: Card List View (`/issues`)
- **Control Bar**:
  - Styled as a container card (rounded-xl, border, shadow-sm).
  - Left side: Category horizontal-scrolling chip list and Status toggle badges.
  - Right side: Sort controls toggle ("Newest" / "Most Upvoted" inside a pill-like container) and a search trigger.
- **Bento Card Grid**:
  - Rendered in a responsive 3-column grid (desktop) or 1-column grid (mobile).
- **Issue Card Layout**:
  - Header image (h-48, cover) with a floating category badge (top-left) and status badge (top-right).
  - Body: Title (headline-sm, line-clamp-2, hover color change), location description row (with `location_on` icon), relative timestamp, and an interactive upvote button.
- **Pagination**: "Load More Issues" outlined rounded-full button.

### Task 3.4: Issue Detail Page (`/issues/[id]`)
- **Two-Column Grid**: 8/12 width left column, 4/12 width right column on desktop. Single column on mobile.
- **Left Column (Content Area)**:
  - Hero Image: Large cover image (h-96 on desktop, h-64 on mobile), rounded-xl, with a bottom gradient overlay.
  - Header Info: Floating tags for category, status, and relative timestamp. Title in `headline-lg` below the image.
  - Description Card: White box (rounded-xl, border) showing details in `body-md` format.
- **Right Column (Action Sidebar)**:
  - Action Panel: Styled using Glassmorphism (`backdrop-filter: blur(12px)`, translucent border, Level 2 shadow).
  - Upvote Section: Support call-to-action text and a large primary-container upvote button with `thumb_up` icon.
  - Location Details: Mini-map (h-48, static location indicator, red location pin overlay) and geocoded address card below it.
  - Secondary Actions: "Share Report" outline button (with share icon) and red text button for "Report inappropriate content".

### Task 3.5: Report/Submission Flow
- **Submission Modal Container**:
  - Centered backdrop-blur overlay, rounded-xl container, close button, and header with description.
- **Two-Column Form Fields**:
  - **Left (Details)**: "Issue Title" (text input with placeholder), "Category" (select input), "Description" (textarea, resize-none), and "Add Photo" (dashed border dropzone with `add_a_photo` icon).
  - **Right (Location)**: "Search address..." input (with search icon), interactive map placeholder with zoom controls and current location button, draggable pin, and "Drag map to adjust pin position" overlay instruction.
- **Form Actions**: Cancel button and primary "Submit Issue" button with a `send` icon.

