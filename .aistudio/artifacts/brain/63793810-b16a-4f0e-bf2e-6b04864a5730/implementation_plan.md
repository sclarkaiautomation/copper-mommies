# Implementation Plan - Copper Mommies Comprehensive Upgrade

## Overview
Upgrade the Copper Mommies platform to provide a seamless mobile and laptop experience, a right slide-out profile drawer, robust post interaction (liking, expanding all comments, direct messaging from post authors), a dedicated Barter & Trade marketplace, an external NestBright Academy feature banner alongside homeschool coordination spaces, a Mothers Academy (Skool-style adult learning hub), and a sacred Her-Story & Lineage Sanctuary.

---

## Planned Changes

### 1. Header Navigation & Top-Right Profile Slide-Out Drawer (`App.tsx`)
- **Top-Right Profile Pin**: Move Profile Avatar & Sister status to the top-right corner of the persistent header.
- **Right Slide-Out Drawer**: Clicking the profile avatar glides out a custom slide-out drawer from the right containing user stats, quick shortcuts, saved bookmarks, stay-logged-in toggle, admin switcher, and sign-out.
- **Laptop Tab Optimization**: Streamline the primary navigation bar into 5-6 core pillars (`Commons`, `Economy`, `Apothecary`, `Sanctuary Audio`, `Mothers Academy`, `Treasury`) with zero horizontal overflow/cut-offs on laptop screens. Add a `"More ▾"` dropdown for secondary views (Sponsor Ads, US Map).

### 2. Village Commons Feed & Direct Messaging (`VillageCommonsHub.tsx`)
- **Direct Post Interactions**:
  - Full comment expansion view showing all comments when clicked.
  - Clicking any post author's profile avatar/name opens their profile card and a direct **"🕊️ Send Direct Message"** button that opens a real-time chat thread.
- **Dedicated Barter & Trade Section**:
  - Highlighted tab/filter in the Commons for all barters, free giveaways, and time-credits (Nextdoor-inspired local exchange).
- **Cross-Pillar Linking**:
  - Quick action links connecting the Commons feed to the Apothecary, Mothers Academy, and Lineage Sanctuary.

### 3. Homeschool Co-op Hub & NestBright External Banner
- **NestBright External Feature Banner**: Display a prominent, elegant promotional banner for NestBright Academy (`https://nestbrightacademy.com`) offering a special community discount to external enrollment, without embedding internal curriculum or manipulatives.
- **Homeschooling Coordination Space**: Active community board for homeschooling mothers, certified teachers, private schooling advice, pod co-ops, and resource sharing.

### 4. Mothers Academy (Skool-Style Adult Learning Hub)
- Dedicated hub for adult mothers to access professional courses, financial/trust trainings, herbal masterclasses, and vocational workshops.
- Integrated with the **Wisdom Progression Tier System** (Sprouting Sister → Homestead Pillar → Elder Council).

### 5. Sacred "Her-Story & Lineage" Sanctuary
- Dedicated space for exploring true ancestry, genealogy research, indigenous lineage, matriarchal power, self-worth, and personal growth reflections with comment and discussion threads.

---

## Verification Plan
- Compile applet with `compile_applet`.
- Run `lint_applet` to ensure zero TypeScript or compilation errors.
