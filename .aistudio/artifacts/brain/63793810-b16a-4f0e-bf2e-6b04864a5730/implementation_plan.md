# Unified Copper Mommies Marketplace, Ecosystem Hashtags & Direct Navigation

A cohesive, elevated listing, trade, and learning ecosystem for Copper Mommies. Sisters can browse courses, trades, gigs, and circles with instant direct navigation via `#hashtags`, rich course hashtag suggestions in the Mothers Academy, and a dedicated Sitewide Ecosystem Search.

---

## Completed Implementations

### 1. Direct Hashtag Navigation
- **Instant Routing without Modals**: Clicking any posted hashtag (e.g., `#SeedPreservation`, `#FamilyWealth`, `#Apothecary101`, `#CurriculumSwap`, `#ChildcareSwap`, `#ThreeSistersGuild`) takes the member directly to that exact course, barter listing, or sanctuary section rather than opening a search modal.
- When `#SeedPreservation` or `#FamilyWealth` is clicked, the app automatically navigates to `Mothers Academy` and immediately opens the masterclass in the classroom player via the `copper_open_academy_course` event.

### 2. Hashtag Autocomplete & Search Bar in Reply Box
- **Built-in Search Input at the Top**: Prominently placed inside the hashtag popup with auto-focus, magnifying glass icon, and one-click clear button.
- **Ecosystem Mentions Check**: Real-time filtering matching `#tags`, titles, descriptions, and linked resource badges (`🎓 Course`, `🤝 Barter/Trade`, `🌿 Care Pillar`, `🏛️ Regional Hub`).
- **No Overflow or Collisions**: Stacked card layout with `overflow-x-hidden` prevents horizontal scrollbars and text collisions.
- **Custom Tag Fallback**: If no exact tag matches, a clean `➕ Insert as custom #{tag}` button allows sisters to add their own.

### 3. Mothers Academy Course Discovery Hashtags
- **Automated Suggestions by Category**: Courses in Wealth, Herbal Apothecary, Homestead, Business, and Wellness tracks provide one-click suggested tags (`#FamilyWealth`, `#Apothecary101`, `#SeedPreservation`, etc.).
- **Creator Studio & Course Studio Manager**: Creators and admins can add, change, or remove hashtags both when creating a course and when editing existing courses.
- **Classroom Card Badges**: Course hashtags are displayed directly on Classroom course cards with one-click direct routing.

### 4. Prominent Sitewide Ecosystem Search
- **Top Navigation Bar**: Dedicated "🔎 Search" button in the header utility controls.
- **Left Navigation Drawer**: Highlighted "🔎 Sitewide Ecosystem Search" card for exploring all courses, trades, circles, and hashtags across the entire platform.
