<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'

defineProps<{
  width?: string
  height?: string
}>()

defineOptions({
  name: 'AppLogo',
  inheritAttrs: false
})

const localePath = useLocalePath()
const colorMode = useColorMode()

const { width: windowWidth } = useWindowSize()

const isMobile = computed(() => windowWidth.value <= 767)
const isTablet = computed(() => windowWidth.value > 767 && windowWidth.value <= 1023)

// Dynamically build logo path based on theme and screen size
const logoSrc = computed(() => {
  const theme = colorMode.value === 'dark' ? 'light' : 'dark'
  if (isMobile.value) return `/logo/logo-mobile-${theme}.png`
  if (isTablet.value) return `/logo/logo-tablet-${theme}.png`
  return `/logo/logo-web-${theme}.png`
})

// Responsive logo dimensions
const _width = computed(() => {
  if (isMobile.value) return 100
  if (isTablet.value) return 150
  return 200
})

const _height = computed(() => {
  if (isMobile.value) return 30
  if (isTablet.value) return 45
  return 50
})
</script>

<template>
  <NuxtLink
    class="shrink-0 block"
    :to="localePath('/')"
    aria-label="Go to home page"
  >
    <img
      :src="logoSrc"
      :width="width || _width"
      :height="height || _height"
      :alt="$t('home.alt_texts.site_logo')"
      v-bind="$attrs"
    >
  </NuxtLink>
</template>

