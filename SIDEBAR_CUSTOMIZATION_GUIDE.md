# User Sidebar - Implementation Examples & Customization

## Quick Start

The sidebar is ready to use! Just import it in your dashboard:

```jsx
import UserSidebar from "./UserSidebar";

// In your component:
<div className="user-dashboard-wrapper">
  <UserSidebar onNavigate={setPage} />
  <div className="dashboard-container">
    {/* Your content */}
  </div>
</div>
```

---

## Customization Examples

### 1. Add a New Menu Item

**In UserSidebar.jsx**, add a new button in the nav menu:

```jsx
<li>
  <button
    className={`nav-item ${activeItem === "notifications" ? "active" : ""}`}
    onClick={() => handleMenuClick("notifications", "notifications")}
    title="View your notifications"
  >
    <span className="nav-icon">🔔</span>
    <span className="nav-text">Notifications</span>
  </button>
</li>
```

**In handleMenuClick()**, add the navigation handler:

```jsx
} else if (action === "notifications") {
  navigate("/notifications");
}
```

---

### 2. Add a New Section

Create a new section in the sidebar:

```jsx
{/* Help & Support Section */}
<div className="sidebar-section">
  <h3 className="section-header">Help & Support</h3>
  <ul className="nav-menu">
    <li>
      <button
        className={`nav-item ${activeItem === "faq" ? "active" : ""}`}
        onClick={() => handleMenuClick("faq", "faq")}
      >
        <span className="nav-icon">❓</span>
        <span className="nav-text">FAQ</span>
      </button>
    </li>
    <li>
      <button
        className={`nav-item ${activeItem === "support" ? "active" : ""}`}
        onClick={() => handleMenuClick("support", "support")}
      >
        <span className="nav-icon">💬</span>
        <span className="nav-text">Contact Support</span>
      </button>
    </li>
  </ul>
</div>
```

---

### 3. Change Color Scheme

**For Dark Theme**, update `usersidebar.css`:

```css
:root {
  --sidebar-bg: #1e293b;           /* Dark background */
  --sidebar-border: #334155;       /* Darker border */
  --sidebar-text: #e2e8f0;         /* Light text */
  --sidebar-hover: #334155;        /* Dark hover */
  --sidebar-active: #60a5fa;       /* Light blue active */
  --sidebar-active-bg: #0f172a;    /* Very dark active bg */
}
```

**For Green Accent Theme**:

```css
:root {
  --sidebar-active: #059669;       /* Green instead of blue */
  --sidebar-active-bg: #ecfdf5;    /* Light green background */
  --sidebar-danger: #dc2626;       /* Keep red for danger */
}
```

---

### 4. Customize Sidebar Width

In `usersidebar.css`:

```css
:root {
  --sidebar-width: 320px;  /* Wider sidebar */
}

/* Or make it narrower on tablets */
@media (max-width: 1024px) {
  :root {
    --sidebar-width: 200px;
  }
}
```

---

### 5. Add User Profile Section

Insert at the top of `.sidebar-nav`:

```jsx
{/* User Profile Section */}
<div className="sidebar-section user-profile">
  <div className="profile-card">
    <div className="profile-avatar">👤</div>
    <div className="profile-info">
      <h4 className="profile-name">John Doe</h4>
      <p className="profile-email">john@example.com</p>
    </div>
  </div>
</div>
```

Add to `usersidebar.css`:

```css
.user-profile {
  padding: 0 12px 24px;
  border-bottom: 1px solid var(--sidebar-border);
}

.profile-card {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: var(--sidebar-hover);
  border-radius: 8px;
}

.profile-avatar {
  font-size: 32px;
  min-width: 40px;
  display: flex;
  align-items: center;
}

.profile-info {
  flex: 1;
  overflow: hidden;
}

.profile-name {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--sidebar-text);
}

.profile-email {
  margin: 2px 0 0;
  font-size: 12px;
  color: var(--muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

---

### 6. Add Notification Badges

Add badge styling to `usersidebar.css`:

```css
.nav-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: #dc2626;
  color: white;
  font-size: 11px;
  font-weight: 700;
  border-radius: 10px;
  margin-left: auto;
}
```

Use in menu item:

```jsx
<li>
  <button className={`nav-item ${activeItem === "notifications" ? "active" : ""}`}>
    <span className="nav-icon">🔔</span>
    <span className="nav-text">Notifications</span>
    <span className="nav-badge">5</span>
  </button>
</li>
```

---

### 7. Add Keyboard Shortcuts Info

Show on hover in desktop:

```css
.nav-item[data-shortcut]::after {
  content: attr(data-shortcut);
  display: none;
  position: absolute;
  right: 8px;
  font-size: 11px;
  color: var(--muted);
  font-weight: 500;
}

.nav-item[data-shortcut]:hover::after {
  display: block;
}

@media (max-width: 768px) {
  .nav-item[data-shortcut]::after {
    display: none !important;
  }
}
```

Use:

```jsx
<button 
  className="nav-item"
  data-shortcut="⌘L"
>
  <span className="nav-icon">➕</span>
  <span className="nav-text">Lodge Complaint</span>
</button>
```

---

### 8. Implement Collapsible Submenus

Add submenu state and styling:

```jsx
// In UserSidebar component
const [expandedMenu, setExpandedMenu] = useState(null);

const toggleSubmenu = (name) => {
  setExpandedMenu(expandedMenu === name ? null : name);
};
```

Add to `usersidebar.css`:

```css
.submenu {
  display: none;
  list-style: none;
  padding: 4px 0;
  margin: 4px 0;
  border-left: 2px solid var(--sidebar-border);
  margin-left: 8px;
  padding-left: 0;
}

.submenu.expanded {
  display: block;
}

.submenu .nav-item {
  padding-left: 24px;
  font-size: 14px;
  margin: 2px 0;
}

.nav-item.has-submenu::after {
  content: "▼";
  font-size: 10px;
  margin-left: auto;
  transition: transform 0.3s ease;
}

.nav-item.has-submenu.expanded::after {
  transform: rotate(-180deg);
}
```

---

### 9. Add Dark Mode Toggle

In `usersidebar.css`:

```css
/* Light Mode (default) */
body {
  --sidebar-bg: #ffffff;
  --sidebar-text: #334155;
}

/* Dark Mode */
body.dark-mode {
  --sidebar-bg: #1e293b;
  --sidebar-text: #e2e8f0;
  --sidebar-border: #334155;
  --sidebar-hover: #334155;
  --sidebar-active-bg: #0f172a;
}
```

---

### 10. Add Sidebar Analytics

Track menu clicks:

```jsx
const handleMenuClick = (itemKey, action) => {
  // Send analytics
  if (window.gtag) {
    gtag('event', 'sidebar_click', {
      menu_item: itemKey,
      action: action
    });
  }
  
  setActiveItem(itemKey);
  // ... rest of handler
};
```

---

## CSS Class Reference

| Class | Purpose |
|-------|---------|
| `.user-sidebar` | Main container |
| `.sidebar-nav` | Navigation wrapper |
| `.sidebar-section` | Menu section group |
| `.section-header` | Section title |
| `.nav-menu` | Menu list |
| `.nav-item` | Menu button |
| `.nav-item.active` | Currently selected item |
| `.nav-item.danger` | Danger-styled item (red) |
| `.nav-item.logout` | Logout button |
| `.nav-icon` | Icon element |
| `.nav-text` | Menu text label |
| `.sidebar-footer` | Bottom section |
| `.sidebar-toggle` | Mobile toggle button |
| `.sidebar-overlay` | Mobile background overlay |

---

## CSS Variable Reference

```css
--sidebar-width: 280px;
--sidebar-bg: #ffffff;
--sidebar-border: #e2e8f0;
--sidebar-text: #334155;
--sidebar-hover: #f1f5f9;
--sidebar-active: #004a99;
--sidebar-active-bg: #f0f7ff;
--sidebar-danger: #dc2626;
--sidebar-danger-hover: #b91c1c;
--sidebar-danger-bg: #fef2f2;
--transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

---

## Animation Examples

### Slide + Scale Icon
```css
.nav-item:hover {
  transform: translateX(4px);
}

.nav-item:hover .nav-icon {
  transform: scale(1.2) rotate(-5deg);
}
```

### Bounce on Hover
```css
.nav-item:hover .nav-icon {
  animation: bounce 0.6s ease;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
```

### Gradient Background
```css
.nav-item.active {
  background: linear-gradient(90deg, #f0f7ff, #e0f2fe);
}
```

---

## Testing Checklist

- [ ] Click all menu items and verify active state
- [ ] Test hover states on desktop
- [ ] Test mobile collapse/expand
- [ ] Verify Delete Account confirmation dialog
- [ ] Verify Sign Out confirmation dialog
- [ ] Test keyboard navigation (Tab, Enter)
- [ ] Test with screen reader (NVDA, JAWS)
- [ ] Test on mobile (iOS Safari, Chrome Mobile)
- [ ] Test on tablet (iPad, Android)
- [ ] Test with dark mode browser setting
- [ ] Test with reduced motion setting
- [ ] Verify scroll behavior

---

## Performance Tips

1. **Use CSS transforms** for animations (GPU accelerated)
2. **Minimize JavaScript** in event handlers
3. **Use debounce** for resize events if needed
4. **Lazy load** menu icons if using Font Awesome
5. **Consider virtualization** if adding many menu items

---

## Common Issues & Solutions

### Issue: Sidebar Content Overlapped by Main Content
**Solution**: Ensure `.dashboard-container` has `margin-left: var(--sidebar-width)`

### Issue: Mobile Sidebar Not Appearing
**Solution**: Check z-index (should be 999+) and that overlay is working

### Issue: Active State Not Showing
**Solution**: Verify `activeItem` state is updating and CSS class `.active` is being applied

### Issue: Animations Lag
**Solution**: Use `transform` and `opacity` instead of `width`/`height`

---

## Deployment Notes

1. Ensure Font Awesome or Material Icons are installed if replacing emoji
2. Test across all target browsers before deployment
3. Monitor performance metrics for animations
4. Consider A/B testing the sidebar design
5. Gather user feedback on usability

---

**Last Updated**: January 2026
**Version**: 1.0
**Status**: Production Ready ✅
