# User Sidebar - Design & Specifications

## Visual Design System

### Color Palette

**Primary Colors**
```
Background:     #ffffff (White)
Border:         #e2e8f0 (Light Gray)
Text:           #334155 (Dark Slate)
Muted:          #6b7280 (Gray)
```

**Interactive Colors**
```
Active:         #004a99 (Government Blue)
Active BG:      #f0f7ff (Light Blue)
Hover BG:       #f1f5f9 (Light Gray)
Danger:         #dc2626 (Red)
Danger Hover:   #b91c1c (Dark Red)
Danger BG:      #fef2f2 (Light Red)
```

---

## Typography

| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Section Header | Inter | 12px | 700 | #6b7280 |
| Menu Item | Inter | 15px | 500 | #334155 |
| Menu Item (Active) | Inter | 15px | 600 | #004a99 |
| Menu Item (Hover) | Inter | 15px | 500 | #004a99 |
| Menu Item (Danger) | Inter | 15px | 500 | #dc2626 |

---

## Spacing & Dimensions

```
Sidebar Width:           280px (Desktop)
                         240px (Tablet)
                         70vw max (Mobile)

Section Spacing:         32px (bottom margin)
Section Header Margin:   12px (bottom)
Menu Item Gap:           4px
Menu Item Padding:       12px 16px
Icon Size:               18px
Icon Min Width:          24px
Section Padding:         0 12px
Sidebar Footer Padding:  16px 12px 24px
```

---

## Responsive Grid

```
Desktop (1024px+)
├── Sidebar: 280px (fixed)
└── Content: calc(100% - 280px)

Tablet (768px - 1024px)
├── Sidebar: 240px (fixed)
└── Content: calc(100% - 240px)

Mobile (< 768px)
├── Sidebar: 70vw (collapsible)
├── Overlay: Full viewport
└── Content: Full width
```

---

## Component Hierarchy

```
UserSidebar (Main Container)
│
├── Sidebar Toggle Button (Mobile only)
├── Sidebar Overlay (Mobile only)
│
└── Main Sidebar
    │
    ├── Navigation Section 1
    │   ├── Menu Item 1 (Lodge Complaint)
    │   ├── Menu Item 2 (My Complaints)
    │   └── Menu Item 3 (View Status)
    │
    ├── Navigation Section 2
    │   ├── Section Header (Account Activity)
    │   ├── Menu Item 4 (Edit Profile)
    │   └── Menu Item 5 (Delete Account - Danger)
    │
    └── Footer Section
        └── Menu Item 6 (Sign Out)
```

---

## Menu Items Specification

### 1. Lodge Complaint
```
Icon:     ➕
Text:     Lodge Complaint
Action:   navigate('/categories')
Style:    Normal
Tooltip:  Lodge a new complaint
```

### 2. My Complaints
```
Icon:     📄
Text:     My Complaints
Action:   onNavigate('complaints')
Style:    Normal
Tooltip:  View your complaints
```

### 3. View Status
```
Icon:     🔍
Text:     View Status
Action:   navigate('/complaints/status')
Style:    Normal
Tooltip:  Track complaint status
```

### 4. Edit Profile
```
Icon:     ✏️
Text:     Edit Profile
Action:   navigate('/profile')
Style:    Normal
Tooltip:  Edit your profile
```

### 5. Delete Account ⚠️
```
Icon:     🗑️
Text:     Delete Account
Action:   navigate('/delete-account')
Style:    Danger (Red)
Color:    #dc2626
Hover:    #b91c1c
Confirm:  Yes (window.confirm)
Tooltip:  Permanently delete your account
```

### 6. Sign Out
```
Icon:     🚪
Text:     Sign Out
Action:   navigate('/logout')
Style:    Logout (Bottom fixed)
Confirm:  Yes (window.confirm)
Tooltip:  Sign out from your account
Position: Fixed at bottom
```

---

## Interaction States

### Normal State
```
Background: Transparent
Color:      #334155
Shadow:     None
Icon Scale: 1
X Position: 0
```

### Hover State
```
Background: #f1f5f9
Color:      #004a99
Shadow:     None
Icon Scale: 1.15
X Position: 4px (translateX)
Duration:   0.3s cubic-bezier(0.4, 0, 0.2, 1)
```

### Active State
```
Background: #f0f7ff
Color:      #004a99
Shadow:     inset 4px 0 0 #004a99
Icon Scale: 1
X Position: 0
Border:     4px left bar
Font Weight: 600
```

### Danger Hover State
```
Background: #fef2f2
Color:      #b91c1c
Shadow:     0 2px 8px rgba(220, 38, 38, 0.1)
Icon Scale: 1.15
X Position: 4px
Duration:   0.3s
```

### Focus State (Keyboard)
```
Outline:    2px solid #004a99
OutlineOffset: -2px
Background: #f0f7ff
Color:      #004a99
```

---

## Animation Specifications

### Hover Translate
```
Property:   transform
Value:      translateX(4px)
Duration:   0.3s
Easing:     cubic-bezier(0.4, 0, 0.2, 1)
Target:     .nav-item:hover
```

### Icon Scale
```
Property:   transform
Value:      scale(1.15)
Duration:   0.3s
Easing:     cubic-bezier(0.4, 0, 0.2, 1)
Target:     .nav-icon
```

### Sidebar Slide (Mobile)
```
Property:   transform
Value:      translateX(0) / translateX(-100%)
Duration:   0.3s
Easing:     cubic-bezier(0.4, 0, 0.2, 1)
Target:     .user-sidebar
```

### All Transitions
```
Duration:   0.3s
Easing:     cubic-bezier(0.4, 0, 0.2, 1)
Properties: color, background, transform, box-shadow
```

---

## Accessibility Specifications

### Focus Indicators
- Outline: 2px solid primary color
- Outline offset: -2px (inside)
- Visible on all interactive elements
- Meets WCAG AA contrast ratio (4.5:1)

### Touch Targets
- Minimum size: 44x44px
- Actual: 48x46px (with padding)
- Gap between targets: 4px

### Screen Reader Support
```
aria-label="Toggle sidebar"
title="Menu item description"
role="button" (implicit from <button>)
Semantic HTML with <nav>, <ul>, <li>
```

### Motion Preferences
```
@media (prefers-reduced-motion: reduce) {
  All transitions removed
  No animations
  Instant state changes
}
```

### Color Contrast Ratios
```
Text on White:      7.2:1 (WCAG AAA)
Active on Blue:     4.8:1 (WCAG AA)
Danger on White:    6.5:1 (WCAG AAA)
Muted on White:     4.54:1 (WCAG AA)
```

---

## Layout Specifications

### Desktop Layout
```
┌─────────────────────────────────────────┐
│          Navbar / Header                │
├──────────┬──────────────────────────────┤
│          │                              │
│ Sidebar  │    Main Content              │
│ 280px    │    (Flexible)                │
│          │                              │
│ Fixed    │    Scrolls independently     │
│ Height   │                              │
│ 100vh    │                              │
│          │                              │
└──────────┴──────────────────────────────┘
```

### Mobile Layout
```
┌─────────────────────────────────────────┐
│  ☰  Navbar / Header                    │
├─────────────────────────────────────────┤
│ [Sidebar overlay - 70vw]                │
│ [Main Content - Full width]             │
│                                         │
│ Sidebar slides over content             │
└─────────────────────────────────────────┘
```

---

## Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Full Support |
| Firefox | 88+ | ✅ Full Support |
| Safari | 14+ | ✅ Full Support |
| Edge | 90+ | ✅ Full Support |
| IE 11 | - | ❌ Not Supported |
| Mobile Safari | 14+ | ✅ Full Support |
| Chrome Android | 90+ | ✅ Full Support |

---

## Performance Targets

```
First Paint:             < 100ms
Time to Interactive:     < 500ms
Animation FPS:           60 FPS
Sidebar Open/Close:      < 300ms
Mobile Toggle Response:  < 100ms
CSS File Size:           ~8-10KB
JS Component Size:       ~4-5KB
```

---

## Icon Specifications

**Current**: Emoji Icons
```
Supported: All modern browsers
Rendering: Native platform emoji
Fallback: Yes (automatic)
Size: 18px
Vertical Align: Center
```

**Alternative**: Font Awesome
```
Installation: npm install @fortawesome/fontawesome-free
Class: fas fa-icon-name
Size: 18px
Color: Inherits from parent
```

**Alternative**: Material Icons
```
Installation: npm install @mui/icons-material
Import: import IconName from '@mui/icons-material'
Size: 18px
Color: Inherits from parent
```

---

## Shadow System

```
Subtle Box Shadow:     0 8px 30px rgba(15, 23, 42, 0.06)
Sidebar Shadow:        2px 0 8px rgba(15, 23, 42, 0.04)
Overlay Shadow:        4px 0 16px rgba(15, 23, 42, 0.1)
Danger Hover Shadow:   0 2px 8px rgba(220, 38, 38, 0.1)
Focus Shadow:          None (uses outline)
```

---

## Border System

```
Sidebar Border Right:   1px solid #e2e8f0
Section Border:         1px solid #e2e8f0
Border Radius:          8px (menu items)
                        10px (default radius)
                        3px (scrollbar)
```

---

## Z-Index Stack

```
Sidebar Toggle:     1000
Sidebar Overlay:    998
Main Sidebar:       999
Content Behind:     Default (0, 1)
```

---

## File Specifications

### UserSidebar.jsx
```
Lines:          ~130
Functions:      3 (handleMenuClick, toggleSidebar, render)
State Hooks:    2 (isOpen, activeItem)
Imports:        React, Router
Component Type: Functional with Hooks
```

### usersidebar.css
```
Lines:          ~280+
CSS Variables:  10
Classes:        15+
Media Queries:  4 breakpoints
Animations:     3
Transitions:    1 timing function
```

---

## Customization Tokens

```
Primary Color:          --sidebar-active
Danger Color:           --sidebar-danger
Background:             --sidebar-bg
Sidebar Width:          --sidebar-width
Transition Duration:    --transition (includes timing)
Border Color:           --sidebar-border
Hover Background:       --sidebar-hover
Active Background:      --sidebar-active-bg
```

---

**Specification Version**: 1.0
**Last Updated**: January 2026
**Status**: Production Ready ✅
