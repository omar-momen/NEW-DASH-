import common from './en/common'
import nav from './en/nav'
import home from './en/home'
import footer from './en/footer'
import pages from './en/pages'

export default defineI18nLocale(() => {
  return {
    ...common,
    nav,
    home,
    footer,
    pages,
  }
})
