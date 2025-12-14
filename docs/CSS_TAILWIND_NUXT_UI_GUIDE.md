# CSS, Tailwind & Nuxt UI Theming Guide

## Overview

This project uses a three-layer theming system:
1. **Tailwind CSS** - Custom color scales and utilities via `@theme` directive
2. **Nuxt UI Semantic Colors** - Runtime-configurable semantic color system
3. **Custom Application Colors** - Project-specific colors for backgrounds, text, inputs, etc.

## File Structure

```
app/assets/css/
├── main.css                    # Main entry point, Tailwind theme config
├── variables/
│   └── colors.css              # Custom application colors & Nuxt UI overrides
├── base.css                    # Base styles using Tailwind utilities
├── utilities.css               # Custom utility classes
└── typography.css              # Typography styles
```

## 1. Adding Colors to Tailwind

### Full Color Scales (for Semantic Colors)

For colors that will be used as Nuxt UI semantic colors (primary, secondary, tertiary), you need to define **full color scales** (50-950) in `main.css`:

```css
/* app/assets/css/main.css */
@theme static {
  /* Primary color scale (base: #008499) */
  --color-primary-50: #e6f7fa;
  --color-primary-100: #b3e8f0;
  --color-primary-200: #80d9e6;
  --color-primary-300: #4dcadc;
  --color-primary-400: #1ab8d2;
  --color-primary-500: #008499;  /* Base color */
  --color-primary-600: #006b7a;
  --color-primary-700: #00525b;
  --color-primary-800: #00393d;
  --color-primary-900: #00201e;
  --color-primary-950: #001014;
}
```

**Important:** You must define all shades from `50` to `950` for each color scale.

### Custom Application Colors (Single Values)

For project-specific colors (backgrounds, text, inputs), define them in `variables/colors.css` and expose them via `@theme inline`:

```css
/* app/assets/css/variables/colors.css */
:root {
  /* Backgrounds */
  --color-bg-main: #FFFFFF;
  --color-bg-body: #FFFFFF;
  --color-bg-upper-nav: #FFFFFF;

  /* Text */
  --color-text-default: var(--color-secondary-500);
  --color-text-para: #596080;
  --color-text-link: #464B6F;

  /* Inputs */
  --color-input-placeholder: #898DA7;

  /* Effects */
  --color-shadow: rgba(0, 0, 0, 0.25);
}
```

Then expose them in `main.css`:

```css
/* app/assets/css/main.css */
@theme inline {
  /* Backgrounds */
  --color-bg-main: var(--color-bg-main);
  --color-bg-body: var(--color-bg-body);
  --color-bg-upper-nav: var(--color-bg-upper-nav);

  /* Text */
  --color-text-default: var(--color-text-default);
  --color-text-para: var(--color-text-para);
  --color-text-link: var(--color-text-link);

  /* Inputs */
  --color-input-placeholder: var(--color-input-placeholder);
}
```

### Naming Convention

Use **kebab-case** and group by purpose:

| ✅ Good | ❌ Bad |
|---------|--------|
| `--color-bg-main` | `--color-mainBg` |
| `--color-text-default` | `--color-textColor` |
| `--color-text-para` | `--color-para` |
| `--color-input-placeholder` | `--color-inputPlaceholder` |

**Benefits:**
- Consistent naming across the codebase
- Easy to scan and find related colors
- Scalable for future additions

## 2. Configuring Nuxt UI Semantic Colors

Nuxt UI uses **semantic colors** that map to your Tailwind color scales. Configure them in `app.config.ts`:

```typescript
// app/app.config.ts
export default defineAppConfig({
  ui: {
    colors: {
      primary: 'primary',      // Maps to --color-primary-*
      secondary: 'secondary',  // Maps to --color-secondary-*
      tertiary: 'tertiary',   // Maps to --color-tertiary-*
      success: 'green',        // Uses Tailwind's default green
      info: 'blue',           // Uses Tailwind's default blue
      warning: 'yellow',      // Uses Tailwind's default yellow
      error: 'red',           // Uses Tailwind's default red
      neutral: 'slate'        // Uses Tailwind's default slate
    }
  }
})
```

### Adding New Semantic Colors

1. **Register the color** in `nuxt.config.ts`:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ui: {
    theme: {
      colors: [
        'primary',
        'secondary',
        'tertiary',
        'accent',  // New color
        'info',
        'success',
        'warning',
        'error'
      ]
    }
  }
})
```

2. **Define the color scale** in `main.css`:

```css
/* app/assets/css/main.css */
@theme static {
  /* Accent color scale */
  --color-accent-50: #fef2f2;
  --color-accent-100: #fee2e2;
  /* ... all shades 50-950 ... */
  --color-accent-500: #ef4444;
  /* ... all shades 50-950 ... */
  --color-accent-950: #450a0a;
}
```

3. **Map it** in `app.config.ts`:

```typescript
// app/app.config.ts
export default defineAppConfig({
  ui: {
    colors: {
      // ... other colors
      accent: 'accent'
    }
  }
})
```

4. **Use it** in components:

```vue
<UButton color="accent">Click me</UButton>
```

## 3. Overriding Nuxt UI Variables

Nuxt UI provides CSS variables for customization. Override them in `variables/colors.css`:

```css
/* app/assets/css/variables/colors.css */
:root {
  /* Nuxt-UI */
  /* https://ui.nuxt.com/docs/getting-started/theme/css-variables */
  /* Here we are overriding the default colors for the Nuxt-UI components */
  
  /* Background */
  --ui-bg: var(--color-bg-main);
  
  /* Container max width */
  --ui-container: 1450px;
  
  /* You can also override other Nuxt UI variables: */
  /* --ui-text: var(--color-text-default); */
  /* --ui-border: var(--color-text-link); */
  /* --ui-radius: 0.5rem; */
}
```

### Available Nuxt UI Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--ui-bg` | `white` | Default background color |
| `--ui-container` | `80rem` | Container max width |
| `--ui-text` | `var(--ui-color-neutral-700)` | Default text color |
| `--ui-border` | `var(--ui-color-neutral-200)` | Default border color |
| `--ui-radius` | `0.25rem` | Base border radius |

See [Nuxt UI CSS Variables docs](https://ui.nuxt.com/docs/getting-started/theme/css-variables) for the complete list.

## 4. Using Colors in Your Code

### Tailwind Utilities

Once colors are defined, use them as Tailwind utilities:

```vue
<template>
  <!-- Semantic colors (from color scales) -->
  <div class="bg-primary-500 text-secondary-600">
    Content
  </div>
  
  <!-- Custom application colors -->
  <div class="bg-bg-main text-text-default">
    Main content
  </div>
  
  <p class="text-text-para">
    Paragraph text
  </p>
  
  <a href="#" class="text-text-link">
    Link
  </a>
</template>
```

### Nuxt UI Components

Use semantic colors in Nuxt UI components:

```vue
<template>
  <UButton color="primary">Primary Button</UButton>
  <UButton color="secondary">Secondary Button</UButton>
  <UButton color="tertiary">Tertiary Button</UButton>
  <UButton color="success">Success Button</UButton>
  <UButton color="error">Error Button</UButton>
</template>
```

### Direct CSS Variables

Use CSS variables directly in custom CSS:

```css
.custom-element {
  background-color: var(--color-bg-main);
  color: var(--color-text-default);
  border-color: var(--color-text-link);
}
```

## 5. Complete Example: Adding a New Color

Let's say you want to add a "brand" color:

### Step 1: Define the color scale in `main.css`

```css
/* app/assets/css/main.css */
@theme static {
  /* Brand color scale */
  --color-brand-50: #fef2f2;
  --color-brand-100: #fee2e2;
  --color-brand-200: #fecaca;
  --color-brand-300: #fca5a5;
  --color-brand-400: #f87171;
  --color-brand-500: #ef4444;
  --color-brand-600: #dc2626;
  --color-brand-700: #b91c1c;
  --color-brand-800: #991b1b;
  --color-brand-900: #7f1d1d;
  --color-brand-950: #450a0a;
}
```

### Step 2: Register it in `nuxt.config.ts`

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ui: {
    theme: {
      colors: [
        'primary',
        'secondary',
        'tertiary',
        'brand',  // Add here
        'info',
        'success',
        'warning',
        'error'
      ]
    }
  }
})
```

### Step 3: Map it in `app.config.ts`

```typescript
// app/app.config.ts
export default defineAppConfig({
  ui: {
    colors: {
      primary: 'primary',
      secondary: 'secondary',
      tertiary: 'tertiary',
      brand: 'brand',  // Add here
      success: 'green',
      info: 'blue',
      warning: 'yellow',
      error: 'red',
      neutral: 'slate'
    }
  }
})
```

### Step 4: Use it

```vue
<template>
  <!-- As Tailwind utility -->
  <div class="bg-brand-500 text-brand-50">
    Brand content
  </div>
  
  <!-- In Nuxt UI components -->
  <UButton color="brand">Brand Button</UButton>
</template>
```

## 6. Best Practices

### ✅ Do

1. **Use full color scales (50-950) for semantic colors** - Required for Nuxt UI
2. **Use kebab-case naming** - Consistent with CSS conventions
3. **Group colors by purpose** - Easier to find and maintain
4. **Define custom colors in `variables/colors.css`** - Keeps them organized
5. **Expose custom colors via `@theme inline`** - Makes them available as Tailwind utilities
6. **Use semantic colors in Nuxt UI components** - Leverages the theming system
7. **Reference color scales in custom colors** - `var(--color-secondary-500)` instead of hardcoded values

### ❌ Don't

1. **Don't use camelCase** - Use kebab-case instead
2. **Don't skip shades in color scales** - Define all 50-950 shades
3. **Don't hardcode colors** - Use CSS variables
4. **Don't mix naming patterns** - Be consistent
5. **Don't define single values for semantic colors** - Use full scales

## 7. Common Patterns

### Pattern 1: Custom Background Color

```css
/* variables/colors.css */
:root {
  --color-bg-custom: #F5F5F5;
}
```

```css
/* main.css */
@theme inline {
  --color-bg-custom: var(--color-bg-custom);
}
```

```vue
<div class="bg-bg-custom">Content</div>
```

### Pattern 2: Text Color Based on Semantic Color

```css
/* variables/colors.css */
:root {
  --color-text-default: var(--color-secondary-500);
}
```

This automatically uses your secondary color scale.

### Pattern 3: Override Nuxt UI Background

```css
/* variables/colors.css */
:root {
  --ui-bg: var(--color-bg-main);
}
```

This makes all Nuxt UI components use your custom background.

## 8. Dark Mode Support

To add dark mode support, define colors in `:root.dark`:

```css
/* variables/colors.css */
:root {
  --color-bg-main: #FFFFFF;
  --color-text-default: var(--color-secondary-500);
}

:root.dark {
  --color-bg-main: #1a1a1a;
  --color-text-default: var(--color-secondary-200);
}
```

Nuxt UI automatically handles dark mode for semantic colors based on the color scales you define.

## 9. Troubleshooting

### Colors not appearing in Tailwind

- ✅ Check that colors are defined in `@theme static` or `@theme inline`
- ✅ Ensure the variable name follows the `--color-*` pattern
- ✅ Restart your dev server after adding new colors

### Nuxt UI semantic colors not working

- ✅ Verify the color scale is defined (all 50-950 shades)
- ✅ Check `nuxt.config.ts` has the color registered
- ✅ Confirm `app.config.ts` maps the semantic name to the color
- ✅ Ensure the color name matches in all three places

### Custom colors not available as utilities

- ✅ Make sure they're exposed in `@theme inline` block
- ✅ Verify they're defined in `variables/colors.css` first
- ✅ Check the naming follows `--color-*` pattern

## 10. Reference

- [Nuxt UI Design System](https://ui.nuxt.com/docs/getting-started/theme/design-system)
- [Nuxt UI CSS Variables](https://ui.nuxt.com/docs/getting-started/theme/css-variables)
- [Tailwind CSS Theme Configuration](https://tailwindcss.com/docs/theme)

