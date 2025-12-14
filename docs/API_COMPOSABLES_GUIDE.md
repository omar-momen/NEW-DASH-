# API Composables Guide: useApi vs useClientApi

## Overview

You have two composables for making API calls:
- **`useApi`** - Uses Nuxt's `useFetch` (SSR-friendly, recommended for most cases)
- **`useClientApi`** - Custom composable using direct `$api` calls (client-only, manual state management)

## When to Use Each

### ✅ Use `useApi` (Recommended for most cases)

**Best for:**
- Initial page data loading (SSR/SSG)
- Data that needs to be available on first render
- SEO-sensitive content
- Data that should be cached and shared across components
- Automatic refetching when dependencies change

**Benefits:**
- ✅ SSR/SSG compatible - fetches on server, hydrates on client
- ✅ Automatic caching and deduplication
- ✅ Built-in reactive state (data, error, pending, status)
- ✅ Prevents double-fetching during hydration
- ✅ Supports reactive URLs and query parameters
- ✅ Works with Nuxt's data fetching lifecycle

### ✅ Use `useClientApi` (For specific cases)

**Best for:**
- Client-only actions (form submissions, mutations)
- User-triggered events (button clicks, search)
- Data that doesn't need SSR
- When you need more control over the fetch lifecycle
- One-off API calls that don't need caching

**Benefits:**
- ✅ Explicit control over when fetching happens
- ✅ Can be called conditionally or in event handlers
- ✅ No SSR overhead for client-only operations

## How to Use Each

### Using `useApi` (with top-level await)

```vue
<script setup lang="ts">
// ✅ CORRECT: Top-level await in <script setup>
// This fetches on server during SSR, then hydrates on client
const { data, error, pending, refresh } = await useApi('/api/users')

// Reactive URL - automatically refetches when route changes
const route = useRoute()
const { data: post } = await useApi(() => `/api/posts/${route.params.id}`)

// With options
const { data: products } = await useApi('/api/products', {
  method: 'GET',
  query: { page: 1, limit: 20 },
  lazy: false, // Block navigation until loaded (default)
  server: true, // Fetch on server (default)
  silent: true, // Suppress error toasts
})
</script>

<template>
  <div v-if="pending">Loading...</div>
  <div v-else-if="error">Error: {{ error.message }}</div>
  <div v-else>
    <div v-for="user in data" :key="user.id">{{ user.name }}</div>
    <button @click="refresh">Refresh</button>
  </div>
</template>
```

### Using `useClientApi` (in functions/event handlers)

```vue
<script setup lang="ts">
// ❌ WRONG: Don't use top-level await with useClientApi
// const result = await useClientApi('/api/users') // This will block SSR

// ✅ CORRECT: Use in event handlers or functions
async function loadUsers() {
  const { data, error, pending } = await useClientApi('/api/users')
  // Handle data...
}

// ✅ CORRECT: Use in onMounted for client-only data
onMounted(async () => {
  const { data } = await useClientApi('/api/user-preferences')
})

// ✅ CORRECT: Use in form submissions
async function handleSubmit() {
  const { data, error } = await useClientApi('/api/submit', {
    method: 'POST',
    body: formData,
    silent: false, // Show error toasts
  })
  
  if (error.value) {
    // Handle error
    return
  }
  
  // Handle success
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <!-- form fields -->
  </form>
</template>
```

## Key Differences

| Feature | `useApi` | `useClientApi` |
|---------|----------|----------------|
| **SSR Support** | ✅ Yes (fetches on server) | ❌ No (client-only) |
| **Top-level await** | ✅ Yes (recommended) | ❌ No (use in functions) |
| **Caching** | ✅ Automatic | ❌ Manual |
| **Reactive state** | ✅ Built-in | ✅ Manual (shallowRef/ref) |
| **Deduplication** | ✅ Automatic | ❌ No |
| **Use case** | Initial data loading | User actions, mutations |

## Examples by Scenario

### Scenario 1: Loading page data (use `useApi`)

```vue
<script setup lang="ts">
// Fetches on server, available immediately on client
const { data: posts } = await useApi('/api/posts')
</script>
```

### Scenario 2: Form submission (use `useClientApi`)

```vue
<script setup lang="ts">
const formData = ref({ name: '', email: '' })

async function submitForm() {
  const { data, error } = await useClientApi('/api/users', {
    method: 'POST',
    body: formData.value,
  })
  
  if (!error.value) {
    // Success
    navigateTo('/success')
  }
}
</script>
```

### Scenario 3: Search with reactive query (use `useApi`)

```vue
<script setup lang="ts">
const searchQuery = ref('')

const { data: results } = await useApi('/api/search', {
  query: { q: searchQuery },
  watch: [searchQuery], // Auto-refetch when query changes
})
</script>
```

### Scenario 4: Client-only user preferences (use `useClientApi`)

```vue
<script setup lang="ts">
const preferences = ref(null)

onMounted(async () => {
  const { data } = await useClientApi('/api/user/preferences')
  preferences.value = data.value
})
</script>
```

## Best Practices

1. **Default to `useApi`** - It's the Nuxt-recommended way and handles SSR automatically
2. **Use top-level await with `useApi`** - This is the correct pattern for SSR
3. **Use `useClientApi` only when needed** - For client-only actions or when you need explicit control
4. **Don't mix patterns** - If you need SSR, use `useApi`. If you need client-only, use `useClientApi`
5. **Handle loading states** - Both provide `pending` state, use it for better UX

## Migration Tips

If you have existing code using `useClientApi` with top-level await:

```typescript
// ❌ Old (blocks SSR, causes issues)
const { data } = await useClientApi('/api/users')

// ✅ New (SSR-friendly)
const { data } = await useApi('/api/users')
```

If you need client-only fetching:

```typescript
// ✅ Use in onMounted or event handlers
onMounted(async () => {
  const { data } = await useClientApi('/api/users')
})
```

