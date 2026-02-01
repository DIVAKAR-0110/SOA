# User Sidebar Documentation

## Overview
A modern, responsive left-side navigation menu created for the Online Complaint Registration System user dashboard. The sidebar features a clean government-style design with smooth animations, accessibility support, and mobile responsiveness.

---

## Features

### ✨ Design Features
- **Fixed Sidebar**: Remains visible while scrolling through content
- **Smooth Animations**: Hover and active state transitions with 300ms cubic-bezier easing
- **Icons**: Emoji icons (Font Awesome/Material Icons ready)
- **Professional Styling**: Light/neutral government portal theme
- **Subtle Shadows**: Soft box-shadows for depth without clutter
- **Rounded Corners**: 8px border-radius for modern look

### 🎯 Functional Features
- **Active Item Highlighting**: Click a menu item to highlight it
- **Section Headers**: "Account Activity" section with uppercased text
- **Danger Styling**: Delete Account button in red (#dc2626)
- **Fixed Logout**: Sign Out button fixed at bottom
- **Mobile Responsive**: Collapsible sidebar on screens < 768px
- **Keyboard Accessible**: Full keyboard navigation support
- **Overlay for Mobile**: Touch-friendly overlay when sidebar is open

---

## Menu Structure

```
🏠 Lodge Complaint          → /categories
📄 My Complaints           → Internal navigation (setPage)
🔍 View Status             → /complaints/status
---
📋 Account Activity (Header)
✏️ Edit Profile             → /profile
🗑️ Delete Account (Danger)  → /delete-account
---
🚪 Sign Out (Bottom)       → /logout
```

---

## Components

### UserSidebar.jsx
Main sidebar component with menu management and navigation logic.

**Props:**
- `onNavigate` (function): Callback for internal page navigation

**State:**
- `isOpen` (boolean): Controls sidebar visibility on mobile
- `activeItem` (string): Tracks currently selected menu item

**Methods:**
- `handleMenuClick()`: Processes menu item clicks with confirmations
- `toggleSidebar()`: Toggles mobile sidebar state

### usersidebar.css
Complete styling for the sidebar with:
- CSS Variables for easy customization
- Mobile-first responsive design
- Custom scrollbar styling
- Accessibility features (focus states, reduced motion)
- Print-friendly styles

---

## Customization Guide

### Change Colors
Edit CSS variables in `usersidebar.css`:

```css
:root {
  --sidebar-width: 280px;           /* Sidebar width */
  --sidebar-bg: #ffffff;            /* Background */
  --sidebar-text: #334155;          /* Text color */
  --sidebar-active: #004a99;        /* Active item color */
  --sidebar-active-bg: #f0f7ff;     /* Active background */
  --sidebar-danger: #dc2626;        /* Delete button color */
  --sidebar-danger-hover: #b91c1c;  /* Delete hover color */
}
```

### Adjust Sidebar Width
```css
:root {
  --sidebar-width: 300px;  /* Default: 280px */
}
```

### Modify Transitions
```css
:root {
  --transition: all 0.4s ease-in-out;  /* Default: 0.3s cubic-bezier */
}
```

### Change Menu Items
Edit the JSX in `UserSidebar.jsx` to add/remove menu items:

```jsx
<li>
  <button
    className={`nav-item ${activeItem === "key" ? "active" : ""}`}
    onClick={() => handleMenuClick("key", "action")}
    title="Tooltip text"
  >
    <span className="nav-icon">🎯</span>
    <span className="nav-text">Menu Text</span>
  </button>
</li>
```

### Add New Routes
Update the `handleMenuClick()` function to add new navigation paths:

```jsx
} else if (action === "newFeature") {
  navigate("/new-feature-route");
}
```

---

## Responsive Breakpoints

| Screen Size | Sidebar State | Width |
|-------------|---------------|-------|
| Desktop (1024px+) | Fixed Visible | 280px |
| Tablet (768px - 1024px) | Fixed Visible | 240px |
| Mobile (< 768px) | Collapsible | 70vw max |
| Small Mobile (< 480px) | Collapsible | 70vw max |

---

## Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Navigate through menu items |
| `Enter` / `Space` | Activate selected item |
| `Esc` | Close sidebar on mobile (optional) |

---

## Accessibility Features

✅ **WCAG 2.1 Compliant**
- Semantic HTML with proper button elements
- `aria-label` attributes for screen readers
- Keyboard navigation support
- Focus states with visible outlines
- Color contrast ratios > 4.5:1
- Reduced motion preferences respected
- Touch targets > 44x44px on mobile

---

## Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile Safari 14+
- ✅ Chrome Mobile

---

## Integration with UserDashboard

The sidebar is fully integrated into `UserDashboard.jsx`:

```jsx
<div className="user-dashboard-wrapper">
  <UserSidebar onNavigate={setPage} />
  <div className="dashboard-container">
    {/* Page content */}
  </div>
</div>
```

The wrapper flexbox layout:
- Sidebar takes 280px (fixed)
- Content takes remaining space
- On mobile, sidebar slides in from left with overlay

---

## Styling Examples

### Hover State
```css
.nav-item:hover {
  background: #f1f5f9;
  color: #004a99;
  transform: translateX(4px);  /* Slide right */
}
```

### Active State
```css
.nav-item.active {
  background: #f0f7ff;
  color: #004a99;
  box-shadow: inset 4px 0 0 #004a99;  /* Left border accent */
}
```

### Danger Button
```css
.nav-item.danger {
  color: #dc2626;
}
.nav-item.danger:hover {
  background: #fef2f2;
  color: #b91c1c;
}
```

---

## Performance Optimizations

- **CSS Variables**: Efficient color theming without recompilation
- **Transform-based Animations**: Hardware-accelerated (translateX, scale)
- **Passive Scrolling**: Optimized scroll performance
- **Reduced Motion**: Respects `prefers-reduced-motion` OS setting
- **Minimal Re-renders**: useState only tracks activeItem and isOpen

---

## Future Enhancements

Possible additions:
- Icons from Font Awesome or Material Design
- Sidebar collapse animation
- User profile section at top
- Notification badges
- Submenu items with expandable sections
- Keyboard shortcut hints
- Theme toggle (dark mode)
- Sidebar breadcrumb trail

---

## Troubleshooting

### Sidebar Not Showing
- Ensure `UserSidebar` component is imported
- Check that CSS file `usersidebar.css` is loaded
- Verify `user.css` has the wrapper styles

### Mobile Sidebar Not Collapsing
- Check viewport meta tag: `<meta name="viewport" content="width=device-width, initial-scale=1">`
- Verify media queries are working (use browser dev tools)

### Active Item Not Highlighting
- Check that `activeItem` state matches the button's key value
- Verify CSS class `.active` is applied

### Overflow Issues
- Check parent container padding/margins
- Ensure `position: fixed` is not conflicting with other styles

---

## Files Modified/Created

1. **UserSidebar.jsx** (NEW) - Main sidebar component
2. **usersidebar.css** (NEW) - Complete sidebar styling
3. **UserDashboard.jsx** (MODIFIED) - Integrated sidebar
4. **user.css** (MODIFIED) - Added dashboard wrapper styles

---

## Code Statistics

- **Component Lines**: ~130 (UserSidebar.jsx)
- **Stylesheet Lines**: ~280+ (usersidebar.css)
- **CSS Classes**: 15+
- **Responsive Breakpoints**: 4
- **Accessibility Features**: 6+

---

Generated: January 2026
Version: 1.0
License: MIT
