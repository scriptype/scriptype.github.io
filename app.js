const last = array => array[array.length - 1]

const activeClass = 'masthead__video--active'

const nextBtn = document.getElementById('masthead-next-video-button')
nextBtn.addEventListener('click', e => {
  const activeVideo = document.querySelector('.masthead__video--active')
  let nextVideo = activeVideo.nextElementSibling
  if (!nextVideo) {
    nextVideo = activeVideo.parentNode.querySelector('.masthead__video')
  }
  nextVideo.classList.add(activeClass)
  activeVideo.classList.remove(activeClass)
})

const prevBtn = document.getElementById('masthead-prev-video-button')
prevBtn.addEventListener('click', e => {
  const activeVideo = document.querySelector('.masthead__video--active')
  let prevVideo = activeVideo.previousElementSibling
  if (!prevVideo) {
    prevVideo = last(activeVideo.parentNode.querySelectorAll('.masthead__video'))
  }
  prevVideo.classList.add(activeClass)
  activeVideo.classList.remove(activeClass)
})


const workButtons = document.querySelectorAll('[data-work-button]')
const workContainers = document.querySelectorAll('[data-work-container]')
workButtons.forEach(button => {
  const container = Array.from(workContainers).find(container => {
    return container.dataset.workContainer === button.dataset.workButton
  })
  button.addEventListener('click', e => {
    workButtons.forEach(btn => btn.classList.remove('work-button--active'))
    workContainers.forEach(con => con.classList.remove('work-container--active'))
    button.classList.add('work-button--active')
    container.classList.add('work-container--active')
  })
})

const changeWorkButtons = document.querySelectorAll('[data-change-work-button]')
const works = document.querySelectorAll('[data-work]')
changeWorkButtons.forEach(button => {
  button.addEventListener('click', e => {
    const activeWork = document.querySelector('.work-container__work--active')
    const prevWork = activeWork.previousElementSibling
    const nextWork = activeWork.nextElementSibling
    works.forEach(work => {
      work.classList.remove('work-container__work--active')
    })
    const isNext = button.dataset.changeWorkButton === 'next'
    if (isNext) {
      nextWork.classList.add('work-container__work--active')
    } else {
      prevWork.classList.add('work-container__work--active')
    }
  })
})
