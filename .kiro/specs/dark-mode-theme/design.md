# Design Document: Dark Mode Theme

## Overview

This feature establishes a consistent, deep-navy dark mode color scheme across all agent portal components and pages in the goldkach-investment-web-system. The current codebase already uses `darkMode: "class"` in Tailwind and has partial dark mode coverage via hardcoded hex values (e.g. `dark:bg-[#0a0d24]`, `dark:border-[#2B2F77]/30`). The goal is to replace all ad-hoc hardcoded dark colors with a unified set of CSS custom properties (design tokens) defined in `globals.css`, then reference those tokens via semantic Tailwind utility classes throughout every agent component and page.

The approach is purely additive to the existing CSS variable system — the existing `globals.css` `.dark {}` block already defines `--background`, `--card`, `--border`, etc. using `oklch()`. We will update those values to match the target palette and introduce a small set of agent-specific semantic tokens, then systematically replace all hardcoded dark hex classes in the agent section.

## Architecture

```mermaid
graph TD
    A[globals.css — .dark token block] --> B[Tailwind config — CSS var mappings]
    B --> C[Semantic Tailwind classes]
    C --> D[agent-shell.tsx]
    C --> E[agent-sidebar.tsx]
    C --> F[agent-profile-card.tsx]
    C --> G[client-list.tsx]
    C --> H[client-profile-view.tsx]
    C --> I[portfolio-list.tsx]
    C --> J[portfolio-performance-view.tsx]
    C --> K[period-filter.tsx]
    C --> L[agent-settings-form.tsx]
    C --> M[Pages: agent/page.tsx, clients/[clientId]/page.tsx, settings/page.tsx]
```

## Color Token Definitions

### Target Dark Palette (from screenshot)

| Role | Hex | Usage |
|---|---|---|
| Page background | `#0a0f1e` | Body, shell, sidebar background |
| Card / surface | `#131929` | Cards, table containers, section panels |
| Secondary surface | `#1a2235` | Table headers, hover states, profile card bg |
| Border / divider | `#1e2d45` | All borders, table dividers, section separators |
| Primary text | `#ffffff` | Headings, key values, active nav labels |
| Secondary text | `#8892a4` | Labels, metadata, muted descriptions |
| Accent / link | `#4d9fff` | Account numbers, active nav item, badges, highlights |
| Active badge bg | `#1a3a2a` | Status badge background (ACTIVE) |
| Active badge text | `#4ade80` | Status badge text (ACTIVE) |
| Positive gain | `#4ade80` | Gain/return values |
| Negative loss | `#f87171` | Loss values |
| Sidebar bg | `#0a0f1e` | Same as page background |

### CSS Custom Properties to Update in `globals.css`

The `.dark {}` block in `globals.css` currently uses `oklch()` approximations. Replace with values that precisely match the target palette:

```css
.dark {
  /* Core surfaces */
  --background:        oklch(0.11 0.025 255);   /* #0a0f1e — deepest navy */
  --foreground:        oklch(1 0 0);             /* #ffffff — primary text */
  --card:              oklch(0.15 0.03 258);     /* #131929 — card surface */
  --card-foreground:   oklch(1 0 0);
  --popover:           oklch(0.15 0.03 258);
  --popover-foreground: oklch(1 0 0);

  /* Interactive / brand */
  --primary:           oklch(0.65 0.18 240);     /* #4d9fff — accent blue */
  --primary-foreground: oklch(1 0 0);
  --secondary:         oklch(0.19 0.035 258);    /* #1a2235 — secondary surface */
  --secondary-foreground: oklch(0.85 0.01 240);

  /* Muted */
  --muted:             oklch(0.19 0.035 258);    /* #1a2235 */
  --muted-foreground:  oklch(0.58 0.02 240);     /* #8892a4 — secondary text */

  /* Accent */
  --accent:            oklch(0.65 0.18 240);     /* #4d9fff */
  --accent-foreground: oklch(1 0 0);

  /* Borders & inputs */
  --border:            oklch(0.22 0.04 255);     /* #1e2d45 */
  --input:             oklch(0.22 0.04 255);
  --ring:              oklch(0.65 0.18 240);

  /* Sidebar — same as page bg */
  --sidebar:           oklch(0.11 0.025 255);
  --sidebar-foreground: oklch(1 0 0);
  --sidebar-primary:   oklch(0.65 0.18 240);
  --sidebar-primary-foreground: oklch(1 0 0);
  --sidebar-accent:    oklch(0.19 0.035 258);
  --sidebar-accent-foreground: oklch(0.85 0.01 240);
  --sidebar-border:    oklch(0.22 0.04 255);
  --sidebar-ring:      oklch(0.65 0.18 240);

  /* Agent-specific semantic tokens */
  --agent-surface:     oklch(0.15 0.03 258);     /* #131929 — card/panel bg */
  --agent-surface-2:   oklch(0.19 0.035 258);    /* #1a2235 — table header, hover */
  --agent-border:      oklch(0.22 0.04 255);     /* #1e2d45 — all borders */
  --agent-accent:      oklch(0.65 0.18 240);     /* #4d9fff — links, active items */
  --agent-text-muted:  oklch(0.58 0.02 240);     /* #8892a4 — secondary text */
  --agent-badge-active-bg:   oklch(0.22 0.08 155); /* #1a3a2a */
  --agent-badge-active-text: oklch(0.78 0.18 155); /* #4ade80 */
}
```

### Tailwind Config Additions

Add agent-specific tokens to `tailwind.config.ts` so they can be used as utility classes:

```typescript
colors: {
  // ... existing tokens ...
  "agent-surface":   "var(--agent-surface)",
  "agent-surface-2": "var(--agent-surface-2)",
  "agent-border":    "var(--agent-border)",
  "agent-accent":    "var(--agent-accent)",
  "agent-text-muted":"var(--agent-text-muted)",
}
```

## Component-Level Color Mapping Strategy

### Principle: Semantic over Hardcoded

Replace all `dark:bg-[#...]`, `dark:border-[#...]`, `dark:text-[#...]` hardcoded classes with semantic Tailwind tokens. The mapping table below shows the substitution for every pattern found in the codebase.

### Substitution Table

| Current hardcoded class | Semantic replacement | Token value |
|---|---|---|
| `dark:bg-[#0a0d24]` | `dark:bg-background` | `--background` |
| `dark:bg-[#2B2F77]/10` | `dark:bg-secondary` | `--secondary` |
| `dark:bg-[#2B2F77]/15` | `dark:bg-secondary` | `--secondary` |
| `dark:bg-[#3B82F6]/15` | `dark:bg-secondary` | `--secondary` |
| `dark:bg-[#3B82F6]/20` | `dark:bg-secondary` | `--secondary` |
| `dark:border-[#2B2F77]/20` | `dark:border-border` | `--border` |
| `dark:border-[#2B2F77]/30` | `dark:border-border` | `--border` |
| `dark:border-[#3B82F6]/30` | `dark:border-primary/40` | `--primary` |
| `dark:divide-[#2B2F77]/20` | `dark:divide-border` | `--border` |
| `dark:text-[#3B82F6]` | `dark:text-primary` | `--primary` |
| `dark:hover:border-[#3B82F6]/40` | `dark:hover:border-primary/50` | `--primary` |
| `dark:hover:bg-[#2B2F77]/10` | `dark:hover:bg-secondary` | `--secondary` |
| `dark:hover:bg-[#2B2F77]/20` | `dark:hover:bg-secondary` | `--secondary` |

### Component-by-Component Plan

#### `agent-shell.tsx`
- `header`: `dark:bg-[#0a0d24]` → `dark:bg-background`
- `header`: `dark:border-[#2B2F77]/30` → `dark:border-border`

#### `agent-sidebar.tsx`
- `Sidebar` className: `dark:bg-[#0a0d24]` → `dark:bg-background`
- `[data-sidebar=sidebar]` override: `dark:bg-[#0a0d24]` → `dark:bg-background`
- `SidebarHeader` border: `dark:border-[#2B2F77]/20` → `dark:border-border`
- Logo icon bg: `dark:bg-[#3B82F6]/20` → `dark:bg-secondary`
- Logo icon border: `dark:border-[#3B82F6]/30` → `dark:border-primary/30`
- Active nav item: `dark:bg-[#3B82F6]/15` → `dark:bg-secondary`, `dark:text-[#3B82F6]` → `dark:text-primary`
- Hover nav: `dark:hover:bg-[#2B2F77]/20` → `dark:hover:bg-secondary`
- Footer border: `dark:border-[#2B2F77]/20` → `dark:border-border`

#### `agent-profile-card.tsx`
- Card bg: `dark:bg-[#2B2F77]/15` → `dark:bg-secondary`
- Card border: `dark:border-[#2B2F77]/30` → `dark:border-border`
- Avatar fallback: `dark:bg-[#3B82F6]` → `dark:bg-primary`
- Role badge: `dark:text-[#3B82F6]` → `dark:text-primary`, `dark:border-[#3B82F6]/30` → `dark:border-primary/30`

#### `client-list.tsx`
- Table container border: `dark:border-[#2B2F77]/30` → `dark:border-border`
- `thead`: `dark:bg-[#2B2F77]/10` → `dark:bg-secondary`
- `tbody` dividers: `dark:divide-[#2B2F77]/20` → `dark:divide-border`
- Row hover: `dark:hover:bg-[#2B2F77]/10` → `dark:hover:bg-secondary`
- Portfolio count badge: `dark:bg-[#3B82F6]/15` → `dark:bg-secondary`, `dark:text-[#3B82F6]` → `dark:text-primary`
- Active status badge: add `dark:bg-[--agent-badge-active-bg] dark:text-[--agent-badge-active-text]`

#### `client-profile-view.tsx`
- Section border: `dark:border-[#2B2F77]/30` → `dark:border-border`
- Section header border: `dark:border-[#2B2F77]/20` → `dark:border-border`
- Directors row bg: `dark:bg-[#2B2F77]/10` → `dark:bg-secondary`

#### `portfolio-list.tsx`
- Card border: `dark:border-[#2B2F77]/30` → `dark:border-border`
- Card bg: `dark:bg-[#0a0d24]` → `dark:bg-background`
- Card hover border: `dark:hover:border-[#3B82F6]/40` → `dark:hover:border-primary/50`
- Footer divider: `dark:border-[#2B2F77]/20` → `dark:border-border`

#### `portfolio-performance-view.tsx`
- `MetricCard` border: `dark:border-[#2B2F77]/30` → `dark:border-border`
- Accent highlight: `dark:text-[#3B82F6]` → `dark:text-primary`
- All table containers: `dark:border-[#2B2F77]/30` → `dark:border-border`
- All `thead`: `dark:bg-[#2B2F77]/10` → `dark:bg-secondary`
- All `tbody` dividers: `dark:divide-[#2B2F77]/20` → `dark:divide-border`
- All row hovers: `dark:hover:bg-[#2B2F77]/10` → `dark:hover:bg-secondary`

#### `period-filter.tsx`
- Container border: `dark:border-[#2B2F77]/30` → `dark:border-border`
- Active button: `dark:bg-[#3B82F6]` → `dark:bg-primary`
- Inactive button bg: `dark:bg-[#0a0d24]` → `dark:bg-background`
- Inactive hover: `dark:hover:bg-[#2B2F77]/20` → `dark:hover:bg-secondary`

#### `agent-settings-form.tsx`
- Avatar border: `dark:border-[#2B2F77]/30` → `dark:border-border`
- Upload dropzone border: `dark:border-[#2B2F77]/30` → `dark:border-border`
- Card components inherit from shadcn `--card` token (already correct)

#### Pages (`agent/page.tsx`, `clients/[clientId]/page.tsx`, `settings/page.tsx`)
- These pages use only semantic Tailwind classes (`dark:text-white`, `dark:text-slate-200`, `dark:text-slate-400`) — no hardcoded hex values. No changes needed beyond verifying text colors align with the new token values.

## Sequence Diagram: Theme Application Flow

```mermaid
sequenceDiagram
    participant Browser
    participant HTML as html.dark class
    participant CSS as globals.css tokens
    participant TW as Tailwind utilities
    participant Component

    Browser->>HTML: User toggles dark mode (ThemeToggle)
    HTML->>CSS: .dark { --background: ...; --border: ...; }
    CSS->>TW: bg-background resolves to var(--background)
    TW->>Component: Applies computed color to element
    Component-->>Browser: Renders with dark palette
```

## Data Models

### Token Reference Type (for documentation purposes)

```typescript
type DarkTokenMap = {
  // Core surfaces
  background: string;      // Page/shell/sidebar bg — #0a0f1e
  card: string;            // Card/panel bg — #131929
  secondary: string;       // Table headers, hover, profile card — #1a2235
  border: string;          // All borders and dividers — #1e2d45

  // Text
  foreground: string;      // Primary text — #ffffff
  "muted-foreground": string; // Secondary/label text — #8892a4

  // Brand/interactive
  primary: string;         // Accent blue — #4d9fff
  "primary-foreground": string; // Text on primary — #ffffff

  // Sidebar (mirrors background)
  sidebar: string;
  "sidebar-border": string;
  "sidebar-accent": string;
}
```

## Error Handling

No runtime error handling is required — this is a pure CSS/class change. The only risk is visual regression if a component is missed. Mitigation: the substitution table above covers every unique hardcoded dark hex pattern found in the codebase via a full audit.

## Testing Strategy

### Visual Regression Approach

Since this is a styling-only change, testing is visual:

1. Toggle dark mode via the `ThemeToggle` in the agent shell header
2. Verify each page/component against the target palette

### Checklist per Component

- [ ] Background matches `#0a0f1e` (no lighter navy bleed)
- [ ] Cards/panels match `#131929`
- [ ] Table headers match `#1a2235`
- [ ] All borders are `#1e2d45` (no blue-purple tint)
- [ ] Primary text is white
- [ ] Muted text is `#8892a4`
- [ ] Accent elements (active nav, badges, account numbers) are `#4d9fff`
- [ ] Active status badge is green (`#4ade80` on `#1a3a2a`)
- [ ] Gain values are green, loss values are red

### Property-Based Testing Approach

Not applicable for pure CSS token changes. Manual visual inspection is the appropriate strategy.

## Performance Considerations

CSS custom properties are resolved at paint time by the browser with negligible overhead. Replacing hardcoded hex values with `var()` references has no measurable performance impact. The token count added is small (8 agent-specific tokens).

## Security Considerations

No security implications — this is a purely presentational change with no data handling.

## Dependencies

- Tailwind CSS v3 (already installed, `darkMode: "class"` already configured)
- `next-themes` or equivalent (already wired via `ThemeToggle` component)
- No new packages required
