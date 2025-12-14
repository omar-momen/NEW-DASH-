import common from './ar/common'
import nav from './ar/nav'
import home from './ar/home'
import footer from './ar/footer'
import pages from './ar/pages'

export default defineI18nLocale(() => {
  return {
    ...common,
    nav,
    home,
    footer,
    pages,
  }
})
