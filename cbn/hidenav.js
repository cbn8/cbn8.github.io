const nav = document.querySelector('.super-navbar')
const { height } = nav.getBoundingClientRect()

const setRangeBetween = (min, max) => number =>
  Math.min(Math.max(number, min), max)

const limitTransformFor = setRangeBetween(0, height)

let lastScrollY = 0

const handleScroll = () => {
  let { scrollY } = window
  let navTransform = parseInt(nav.style.transform.replace(/[^0-9\.]/g, ''), 10)
  let diff = limitTransformFor(navTransform - (lastScrollY - scrollY))
  if(scrollY >= lastScrollY) {
    nav.style.transform = `translateY(-${ diff > 0 ? diff : limitTransformFor(scrollY) }px)`
  } else { 
    nav.style.transform = `translateY(-${diff}px)`
  }
  
  lastScrollY = scrollY
}

window.addEventListener('scroll', handleScroll)

