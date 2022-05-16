const query = document.querySelector.bind(document)
const queryAll = document.querySelectorAll.bind(document)

const getRandomFrom = (array) => {
  return array[Math.floor(Math.random() * array.length)]
}

const getDOMNodeFromHTML = (html) => {
  const el = document.createElement('div')
  el.innerHTML = html
  return el.firstElementChild
}

const demos = [
  'stone-wall',
  'morning',
  '3000',
  'life'
]

const demoTemplate = (demo) => {
  return `
    <iframe class="demo" src="demos/${demo}/index.html"></iframe>
  `
}

const styleTemplate = (demo) => {
  return `
    <link rel="stylesheet" id="styleCustomizer" href="demos/${demo}/style-customizer.css" />
  `
}

const showDemo = (demo) => {
  const demoNode = getDOMNodeFromHTML(demoTemplate(demo))
  demoContainer.appendChild(demoNode)

  const styleNode = getDOMNodeFromHTML(styleTemplate(demo))
  document.head.appendChild(styleNode)

  overlays.forEach(overlay => {
    overlay.classList.add('entering')
  })
  setTimeout(() => {
    overlays.forEach(overlay => {
      overlay.classList.add('entered')
      overlay.classList.remove('entering')
    })
  }, 1600)
}

const changeDemo = () => {
  const styleCustomizer = query('#styleCustomizer')
  if (styleCustomizer) {
    styleCustomizer.remove()
  }

  demoContainer.innerHTML = ''

  overlays.forEach(overlay => {
    overlay.classList.remove('entered')
  })

  const otherDemos = demos.filter(d => d !== demo)
  demo = getRandomFrom(otherDemos)

  showDemo(demo)
}

const init = () => {
  demo = getRandomFrom(demos)
  showDemo(demo)

  const changeDemoBtn = query('#changeDemoBtn')
  changeDemoBtn.addEventListener('click', changeDemo)
}

let demo
const demoContainer = query('#demoBg')
const overlays = queryAll('.overlay')

document.addEventListener('DOMContentLoaded', init)
