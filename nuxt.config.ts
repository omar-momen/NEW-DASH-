// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxtjs/i18n',
    '@vueuse/nuxt'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  ui: {
    theme: {
      colors: [
        'primary',
        'secondary',
        'tertiary',
        'info',
        'success',
        'warning',
        'error'
      ]
    }
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: ''
    }
  },

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2025-01-15',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  i18n: {
    strategy: 'prefix_except_default',
    locales: [
      {
        code: 'ar',
        name: 'Arabic',
        file: 'ar.ts',
        dir: 'rtl',
        language: 'ar-SA'
      },
      {
        code: 'en',
        name: 'English',
        file: 'en.ts',
        dir: 'ltr',
        language: 'en-US'
      }
    ],
    defaultLocale: 'en',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_locale',
      redirectOn: 'root',
      cookieCrossOrigin: false,
      cookieDomain: null,
      cookieSecure: false
    }
  },

  icon: {
    size: '30px',
    customCollections: [{
      prefix: 'custom',
      dir: './app/assets/icons'
    }]
  }
})
