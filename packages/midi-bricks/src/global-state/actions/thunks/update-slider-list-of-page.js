import localforage from 'localforage'

export async function updateSliderListOfPage(obj) {
  const { lastFocusedPage, sliderList } = obj

  if (lastFocusedPage && Array.isArray(sliderList)) {
    const pages = await localforage.getItem('pages')
    const page = pages[lastFocusedPage] || {}
    page.sliderList = sliderList
    const newPages = { ...pages, page }
    await localforage.setItem('pages', newPages)
  }
}
