# Workspace Customizations & Save Point

This file details the active project state and acts as a memory save point for Filmybowl.

## Save Point Status (Verified Build Compilation Succeeded)
- **Project Name**: Filmybowl (Telugu Entertainment & News Portal)
- **Server Port**: `3000` (strictPort: true)
- **Active Dependencies**: React Router DOM, Swiper, Framer Motion, React Icons, Tailwind CSS v4, @tailwindcss/postcss
- **Theme Settings**: Dark / Light theme persisted in localStorage.

## Guidelines & Implementation History
- **Branding**: The logo brand text is **FILMYBOWL** (deep neutral/red theme). Avoid reverting branding back to "Telugu360 News".
- **Stories/Status Bar**: Celebrities Status Bar (`src/components/StatusBar.jsx`) is configured with circular scrolling elements. Clicking an avatar opens an interactive story lightbox using the standard mobile aspect ratio overlay.
- **Popup Ad**: The timed popup ad overlay (`src/components/PopUpAd.jsx`) triggers on the home page after 3 seconds with a session cache filter and close lock timers.
- **Responsiveness**: Responsive grids adapt to desktop 3-column displays, tablet 2-column displays, and mobile vertical flows.
