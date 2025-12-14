export default defineAppConfig({
  ui: {
    colors: {
      primary: 'primary',
      secondary: 'secondary',
      tertiary: 'tertiary',
      success: 'green',
      info: 'blue',
      warning: 'yellow',
      error: 'red',
      neutral: 'slate'
    }
  },

  app: {
    seo: {
      ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/starter-light.png',
      twitterCard: 'summary_large_image' as const
    },
    social: {
      github: 'https://github.com/nuxt-ui-templates/starter'
    }
  }
})
