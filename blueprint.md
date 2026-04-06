# Future-Sim: AI Algorithm Ethics Simulator

## Overview
Future-Sim is an interactive web-based simulator designed to analyze the ethical impact of AI algorithms in social policy scenarios. Users can adjust weights for Efficiency, Equity, and Diversity to see real-time projections of social happiness, inequality (Gini index), and conflict risk.

## Current Features & Design
- **Interactive Controls**: Range sliders to adjust algorithm parameters.
- **Real-time Visualization**: Dynamic bar chart (Chart.js) showing benefit distribution across social classes.
- **AI Feedback (AIHP)**: Automated ethical analysis and warnings based on user-defined weights.
- **Responsive Layout**: Two-column grid layout (Control Panel & Dashboard) that adapts to mobile devices.
- **Modern Aesthetics**: Soft shadows, rounded corners, and a clean typography (Noto Sans KR & Montserrat).
- **Theme Support (New)**: Light and Dark mode toggle with persistent user preference and system preference detection.

## Completed: Add Dark/Light Mode Support
### Goal
Implement a theme toggle to allow users to switch between Light and Dark modes, ensuring accessibility and a modern user experience.

### Implementation Details
1.  **CSS Variables Refactoring**: 
    - Colors are now managed via CSS variables in `:root` and `[data-theme='dark']` blocks.
    - Added transitions for smooth theme switching.
2.  **UI Implementation**: 
    - Added a theme toggle button with SVG icons (Sun/Moon) in the header.
3.  **JavaScript Logic**: 
    - Implemented `initTheme`, `toggleTheme`, and `updateThemeIcon` functions.
    - User preference is saved in `localStorage`.
    - Automatically detects and applies system dark mode preference if no saved preference exists.
4.  **Component Adjustments**: 
    - Updated AI feedback boxes to use theme-aware colors (using variables like `--ai-bg`, `--ai-text`).
    - Chart.js grid and label colors now update dynamically when switching themes.

### Design Specifics (Dark Mode)
- **Background**: Deep slate/navy (#0f172a).
- **Surface**: Slightly lighter navy (#1e293b).
- **Text**: Off-white (#f1f5f9) and muted gray (#94a3b8).
- **Accent**: Primary blue (#2563eb) and secondary green (#10b981) maintained with appropriate contrast.
- **AI Feedback**: Semi-transparent themed backgrounds for better integration in dark mode.
