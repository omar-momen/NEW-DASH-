<script setup lang="ts">
import * as locales from '@nuxt/ui/locale'

const { locale, setLocale } = useI18n()

// Handle locale change with proper persistence
const handleLocaleChange = async (newLocale: 'ar' | 'en') => {
  await setLocale(newLocale)
}

// Get the Nuxt UI locale object based on current i18n locale
const nuxtUILocale = computed(() => {
  const localeKey = locale.value as keyof typeof locales
  return locales[localeKey] || locales.en
})

// Dynamic language and direction based on locale
const lang = computed(() => nuxtUILocale.value?.code || 'en')
const dir = computed(() => nuxtUILocale.value?.dir || 'ltr')

const { t } = useI18n()
const appConfig = useAppConfig()

const appTitle = computed(() => t('app.title') || 'Final Dash')
const appDescription = computed(() => t('app.desc') || 'A production-ready starter template')

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    // Standard favicon
    { rel: 'icon', href: '/favicon.ico' }

    // PNG icons
    // { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
    // { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
    // { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-96x96.png' },
    // { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/android-chrome-192x192.png' },
    // { rel: 'icon', type: 'image/png', sizes: '512x512', href: '/android-chrome-512x512.png' },

    // Apple Touch Icon
    // { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },

    // Safari pinned tab
    // { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#5bbad5' },
  ],
  htmlAttrs: {
    lang,
    dir
  }
})

useSeoMeta({
  title: appTitle,
  description: appDescription,
  ogTitle: appTitle,
  ogDescription: appDescription,
  ogImage: appConfig.app.seo.ogImage,
  twitterImage: appConfig.app.seo.ogImage,
  twitterCard: appConfig.app.seo.twitterCard
})
</script>

<template>
  <UApp :locale="nuxtUILocale">
    <UHeader>
      <template #left>
        <NuxtLink to="/">
          <ClientOnly>
            <AppLogo />
          </ClientOnly>
        </NuxtLink>
      </template>

      <template #right>
        <UColorModeSwitch />
        <ULocaleSelect
          :model-value="locale"
          :locales="[locales.ar, locales.en]"
          class="w-48"
          @update:model-value="handleLocaleChange($event as 'ar' | 'en')"
        />
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <USeparator icon="i-simple-icons-nuxtdotjs" />

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          {{ t('footer.copyright.made_by') }} {{ appTitle }} • © {{ new Date().getFullYear() }}
        </p>
      </template>

      <template #right>
        <UButton
          :to="appConfig.app.social.github"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
          color="neutral"
          variant="ghost"
        />
      </template>
    </UFooter>
  </UApp>
</template>
